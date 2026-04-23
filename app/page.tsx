"use client";

import { useEffect, useState } from "react";
import BusinessForm from "@/features/form/insert-data";
import { useBusinessMutations } from "@/hooks/use-business-mutation";
import { BusinessLocation, BusinessFormValues } from "@/types/business";
import BusinessTable from "@/features/table/business-table";
import { X, Plus, RefreshCcw } from "lucide-react";
import BusinessDrawer from "@/features/components/drawer/business-drawer";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LogoutButton } from "@/features/auth/logout-btn";
import { SyncModal } from "@/features/components/modal/sync-confirm-modal";

export default function BusinessDashboard() {
  const router = useRouter();

  // State for drawer visibility and tracking the selected record
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessLocation | null>(null);

  // State for Sync popup modal
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false)

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


  // Open drawer for creation
  const handleAddNew = () => {
    setSelectedBusiness(null);
    setIsDrawerOpen(true);
  };

  // Open sync popup modal
  const handleStartSync = async () => {
    setIsSyncing(true);

    try {
      // Your Firebase/Apps Script polling logic goes here
      // await performSyncTask(); 

      console.log("Sync Complete!");
      setIsSyncModalOpen(false); // Close after success
    } catch (error) {
      console.error("Sync failed", error);
    } finally {
      setIsSyncing(false);
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


  return (
    <>
      <main className="relative min-h-screen bg-slate-50 py-10 md:py-10">
        <header>
          <div className="max-w-7xl mx-auto pb-4 sm:pb-4 lg:px-2">
            <div className="flex justify-between items-center">

              {/* Column 1: Logo */}
              <div className="shrink-0 items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Knockerball Locations
                </h1>
                <p className="text-slate-500 text-sm">
                  Manage and monitor your automated mapping system data.
                </p>
              </div>

              {/* Column 2: 3 Buttons / Actions */}
              <div className="flex items-center gap-1 sm:gap-4">

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
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <RefreshCcw size={20} />
                  <span>Sync</span>
                </button>

                {/* Button 3: Logout */}
                <div className="pl-4 border-l border-slate-300 ml-1 sm:ml-0">
                  <LogoutButton />
                </div>

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
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onConfirm={handleStartSync}
        isLoading={isSyncing}
      />
    </>
  );
}