"use client";

import { useEffect, useState } from "react";
import BusinessForm from "@/features/form/insert-data";
import { useBusinessMutations } from "@/hooks/use-business-mutation";
import { BusinessLocation, BusinessFormValues } from "@/types/business";
import BusinessTable from "@/features/table/business-table";
import { X, Plus, RefreshCcw, Info, InfoIcon, Import } from "lucide-react";
import BusinessDrawer from "@/features/components/drawer/business-drawer";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { LogoutButton } from "@/features/auth/logout-btn";
import { BulkSyncModal } from "@/features/components/modal/sync-confirm-modal";
import { addDoc, collection, doc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where, writeBatch } from "firebase/firestore";
import toast from "react-hot-toast";
import { MappedLocation } from "@/types/location";
import ImportStagingTable from "@/features/import/components/ImportStagingTable";
import { getCoordinates } from "@/lib/geocoding";

export default function LocationsPage() {
  const router = useRouter();

  // State for drawer visibility and tracking the selected record
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessLocation | null>(null);

  // State for Sync popup modal
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // State for Importing data from GHL
  const [stagingData, setStagingData] = useState<MappedLocation[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // State to check if GHL data is exist in the dashboard table
  const [locations, setLocations] = useState<MappedLocation[]>([]);

  // State for counting the draft location
  const [draftCount, setDraftCount] = useState(0);

  // Mutation Hook
  const { createBusiness, updateBusiness, isCreating, isUpdating } = useBusinessMutations();

  // Login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If not logged in, kick them back to the login page
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);


  // Count the draft locations before syncing to live
  useEffect(() => {
    const q = query(collection(db, "locations"), where("isSynced", "==", false));

    // onSnapshot is better than getDocs here because it updates the button 
    // immediately if you add a new location in another tab
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDraftCount(snapshot.size);
    });

    return () => unsubscribe();
  }, []);



  // Check the existing GHL IDs to prevent duplicate import
  useEffect(() => {
    const q = query(collection(db, "locations"));

    // This function runs every time Firestore data changes
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const locData = querySnapshot.docs.map(doc => ({
        ghlId: doc.id,
        ...doc.data()
      })) as MappedLocation[];

      setLocations(locData);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);



  // Open drawer for creation
  const handleAddNew = () => {
    setSelectedBusiness(null);
    setIsDrawerOpen(true);
  };


  const handleBulkSync = async () => {
    setIsSyncing(true);

    try {
      const q = query(collection(db, "locations"), where("isSynced", "==", false));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Use a plain toast or info toast instead of error
        toast('No new changes to sync.', { icon: <Info size={18} /> });
        setIsSyncModalOpen(false);
        setIsSyncing(false);
        return;
      }

      const batch = writeBatch(db);
      let syncCount = 0;

      snapshot.forEach((doc) => {

        const data = doc.data();
        const invalidLocations = data.businessName || "Unnamed Location";

        // 1. Check for string-based empty values
        const hasAddress = data.address && data.address.trim() !== "";

        // 2. Check for numeric existence AND ensure they aren't exactly 0
        const hasValidCoords =
          data.latitude !== undefined && data.latitude !== null && data.latitude !== 0 && data.latitude !== "" &&
          data.longitude !== undefined && data.longitude !== null && data.longitude !== 0 && data.longitude !== "";


        if (hasAddress && hasValidCoords) {
          batch.update(doc.ref, {
            isSynced: true,
          });
          syncCount++;
        } else {
          toast.error(`${invalidLocations}: Missing address or valid coordinates.`, { duration: 5000, });
        }
      });

      if (syncCount > 0) {
        // This commit triggers the onSnapshot listener automatically
        await batch.commit();
        toast.success(`Published ${syncCount} locations!`);
      }

    } catch (error) {
      console.error("Sync Error:", error);
      toast.error("Sync failed.");
    } finally {
      setIsSyncing(false);
      setIsSyncModalOpen(false);
    }
  };

  // Set selected record and open drawer for editing
  const handleEditClick = (business: BusinessLocation) => {
    setSelectedBusiness(business);
    setIsDrawerOpen(true);
  };


  const handleFormSubmit = async (data: BusinessFormValues) => {
    try {
      if (selectedBusiness?.id) {
        // FIX: Wrap the fields in the 'data' property as required by your mutation hook
        await updateBusiness({
          id: selectedBusiness.id,
          data: data
        });
      } else {
        await createBusiness(data);
      }
      setIsDrawerOpen(false);
      setSelectedBusiness(null);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  // Drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedBusiness(null);
  };

  // Check the GhlIds if existing in the database
  const existingGhlIds = locations.map(loc => loc.ghlId);

  // Fetch the GHL data
  const handleImportClick = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch('/api/ghl/import', { method: 'POST' });
      if (!res.ok) throw new Error();

      // Type the response data
      const data: MappedLocation[] = await res.json();
      setStagingData(data);
      toast.success("Data loaded from GHL");
    } catch (err) {
      toast.error("Failed to fetch GHL accounts");
    } finally {
      setLoading(false);
    }
  };

  // Import the GHL data to database
  const confirmBulkImport = async (selectedItems: MappedLocation[]): Promise<void> => {
    setIsSaving(true);
    try {
      // 1. Process each item individually to get unique coordinates
      const importPromises = selectedItems.map(async (item) => {
        const coords = await getCoordinates(item.address);

        // 2. Use setDoc with a unique ID (ghlId or locationId) instead of addDoc
        // This prevents duplicates if the same item is imported twice.
        const docId = item.ghlId || item.ghlId; // Use the GHL unique identifier
        const docRef = doc(db, "locations", docId);

        return setDoc(docRef, {
          ...item,
          latitude: coords?.latitude || 0,
          longitude: coords?.longitude || 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      });

      await Promise.all(importPromises);

      toast.success(`Imported ${selectedItems.length} locations`);
      setStagingData(null);

    } catch (err) {
      toast.error("Database save failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <main className="relative min-h-screen bg-slate-50 py-10 md:py-10">
        <header>
          <div className="max-w-7xl mx-auto pb-4 sm:pb-4 lg:px-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between items-center">

              {/* Column 1: Logo */}
              <div className="shrink-0 md:text-left pb-4 md:pb-0 text-center gap-3">
                <div className="flex items-center gap-4">


                </div>

              </div>

              {/* Column 2: 3 Buttons / Actions */}
              <div className="flex flex-col md:flex-row md:items-start gap-1 sm:gap-4">

                {/* Button 1: Add New */}
                <button
                  onClick={handleAddNew}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Plus size={20} />
                  <span>Add New Location</span>
                </button>

                {/* Button 2: Sync */}
                <button
                  onClick={() => setIsSyncModalOpen(true)}
                  disabled={draftCount === 0 || isSyncing}
                  // onClick={handleSyncData}
                  className={`flex items-center justify-center gap-2  px-5 py-2.5 rounded-lg font-semibold transition-all
                    ${draftCount === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 cursor-pointer"
                    }`}
                >
                  <RefreshCcw size={20} />
                  <span>Sync All</span>
                </button>

                {/* Button 2.1: Import */}
                <button
                  onClick={handleImportClick}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Import size={20} />
                  <span>{loading ? "Fetching ..." : "Import"}</span>
                </button>

                {/* Button 3: Logout */}


              </div>
            </div>
          </div>
          {/* <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Knockerball Locations
            </h1>
            <p className="text-slate-500 text-sm">
              Manage and monitor your automated mapping system data.
            </p>
          </div>
          <LogoutButton />
          <button
            onClick={handleAddNew}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus size={20} />
            <span>Add New Business</span>
          </button>
        </div> */}
        </header>


        {/*Table Content */}
        <div className="max-w-7xl md:mx-auto mx-5 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <BusinessTable onEdit={handleEditClick} />
        </div>

        {/* Drawer is organized as a clean wrapper */}
        <BusinessDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          title={selectedBusiness ? "Edit Location" : "New Location"}
        >
          <BusinessForm
            key={selectedBusiness?.id || 'new'}
            onSubmit={handleFormSubmit}
            isLoading={isCreating || isUpdating}
            defaultValues={selectedBusiness || undefined}
          />
        </BusinessDrawer>
      </main>

      {/* The Modal */}
      <BulkSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onConfirm={handleBulkSync}
        isLoading={isSyncing}
      />


      {/* Import Component */}
      {stagingData && (
        <ImportStagingTable
          data={stagingData}
          existingIds={existingGhlIds}
          onCancel={() => setStagingData(null)}
          onConfirm={confirmBulkImport}
          isSaving={isSaving}
        />
      )}
    </>
  );
}