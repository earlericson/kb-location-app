import { useState } from 'react';
import { collection, deleteDoc, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Adjust your path
import { toast } from 'react-hot-toast';
import { BusinessLocation } from '@/types';
import { logActivity } from '@/lib/logger';
import { BusinessFormValues, BusinessSchema } from '@/types/business';
import { MappedLocation } from '@/types/location';
import { getCoordinates } from '@/lib/geocoding';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';


export const useLocationActions = (defaultValues?: BusinessLocation) => {
    // Add New
    const methods = useForm<BusinessFormValues>({
        resolver: zodResolver(BusinessSchema),
        mode: "onChange",
        defaultValues: defaultValues || {
            address: "",
            latitude: 0,
            longitude: 0,
            imageUrl: "",
            // status: "active"
        },
    });

    // State for submit & update data
    const [pendingData, setPendingData] = useState<BusinessLocation | null>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    // State for delete data
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<BusinessLocation | null>(null);

    // State for sync data
    const [isSyncing, setIsSyncing] = useState(false);
    const [pendingLocation, setPendingLocation] = useState<BusinessLocation | null>(null);

    // State for details data
    // const [isDetails, setIsDetails] = useState(false);
    const [detailsLocation, setDetailsLocation] = useState<BusinessLocation | null>(null);

    // State for Sync popup modal
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

    // State for Importing data from GHL
    const [stagingData, setStagingData] = useState<MappedLocation[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);


    // Single map view
    const handleViewOnMap = (item: BusinessLocation) => {
        // 1. Temporarily save the selected location object to browser storage
        localStorage.setItem("selectedMapLocation", JSON.stringify(item));

        // 2. Open the clean URL directly into a completely new browser tab
        window.open("/map", "_blank");
    };

    // Submit data
    const handleFormSubmit = async (
        data: BusinessFormValues,
        onSubmit: (data: BusinessLocation) => Promise<void>
    ) => {
        const isEditMode = !!defaultValues?.businessName;

        const formattedData = {
            ...data,
            // id: crypto.randomUUID(),
            // createdAt: Timestamp.now(),
        };

        if (isEditMode) {
            setPendingData(formattedData as BusinessLocation);
            setShowUpdateModal(true);
        } else {
            try {
                await onSubmit(formattedData as BusinessLocation);
                await logActivity('Created', formattedData.businessName);
                methods.reset();
                toast.success("New location was added successfully!");
            } catch (error) {
                toast.error("Failed to add location.");
            }
        }
    };

    // Update Data
    const handleConfirmUpdate = async (onSubmit: (data: BusinessLocation) => Promise<void>) => {
        if (pendingData) {
            // 1. Prepare the payload (Logic remains the same)
            const updatedPayload = {
                ...pendingData,
                isSynced: false,
            } as BusinessLocation;

            try {
                // 2. Perform the update via the passed onSubmit
                await onSubmit(updatedPayload);

                // 3. Log the activity
                await logActivity('Updated', updatedPayload.businessName);

                // 4. Cleanup
                setShowUpdateModal(false);
                setPendingData(null);
                methods.reset(); // Reset form after successful update

                toast.success("The location was updated. Sync now!");
            } catch (error) {
                toast.error("Failed to update location.");
            }
        }
    };


    // Delete data
    const deleteLocation = async (id: string) => {
        const docRef = doc(db, "locations", id);
        await deleteDoc(docRef);
    };

    const handleConfirmDelete = async (
        business: BusinessLocation | null,
        onClose: () => void
    ) => {
        if (!business) return;
        setIsDeleting(true);

        try {
            await deleteLocation(business.id);
            await logActivity('Deleted', business.businessName);
            toast.success(`"${business.businessName}" was deleted successfully!`);
            onClose();
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error("Failed to delete location. Please try again.");
        } finally {
            // This runs whether the try succeeded or the catch failed
            setIsDeleting(false);
        }
    };


    // Individual Sync
    const handleSingleSync = async () => {
        if (!pendingLocation) return;

        // Destructure everything from the pendingLocation object
        const { id, address, latitude, longitude, businessName } = pendingLocation;

        // 1. Validation Logic
        const hasAddress = address?.trim();
        const hasValidCoords =
            latitude !== undefined && latitude !== null && latitude !== 0 &&
            longitude !== undefined && longitude !== null && longitude !== 0;

        if (!hasAddress || !hasValidCoords) {
            toast.error(`${businessName || 'Location'}: Missing address or valid coordinates.`, { duration: 5000, });
            setPendingLocation(null); // Close the modal
            return;
        }

        setIsSyncing(true);
        try {
            // 2. Perform the Firestore update
            const docRef = doc(db, "locations", id);
            await updateDoc(docRef, {
                isSynced: true,
            });

            await logActivity('Synced', businessName);

            toast.success(`${businessName} is now live on the map!`);
            setPendingLocation(null);
        } catch (error) {
            console.error("Sync error:", error);
            toast.error("Failed to publish changes.");
        } finally {
            setIsSyncing(false);
        }
    };

    // Bulk Sync
    const handleBulkSync = async () => {
        setIsSyncing(true);

        try {
            const q = query(collection(db, "locations"), where("isSynced", "==", false));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                // Use a plain toast or info toast instead of error
                toast('No new changes to sync.',);
                setIsSyncModalOpen(false);
                setIsSyncing(false);
                return;
            }

            const batch = writeBatch(db);
            let syncCount = 0;

            const syncedNames: string[] = [];

            // snapshot.forEach((doc) => {

            //     const data = doc.data();
            //     const invalidLocations = data.businessName || "Unnamed Location";

            //     // 1. Check for string-based empty values
            //     const hasAddress = data.address && data.address.trim() !== "";

            //     // 2. Check for numeric existence AND ensure they aren't exactly 0
            //     const hasValidCoords =
            //         data.latitude !== undefined && data.latitude !== null && data.latitude !== 0 && data.latitude !== "" &&
            //         data.longitude !== undefined && data.longitude !== null && data.longitude !== 0 && data.longitude !== "";


            //     if (hasAddress && hasValidCoords) {
            //         batch.update(doc.ref, {
            //             isSynced: true,
            //         });
            //         syncCount++;
            //     } else {
            //         toast.error(`${invalidLocations}: Missing address or valid coordinates.`, { duration: 5000, });
            //     }
            // });

            snapshot.forEach((doc) => {
                const data = doc.data();
                const businessName = data.businessName || "Unnamed Location";

                const hasAddress = data.address && data.address.trim() !== "";
                const hasValidCoords =
                    data.latitude !== undefined && data.latitude !== null && data.latitude !== 0 && data.latitude !== "" &&
                    data.longitude !== undefined && data.longitude !== null && data.longitude !== 0 && data.longitude !== "";

                if (hasAddress && hasValidCoords) {
                    batch.update(doc.ref, {
                        isSynced: true,
                        updatedAt: serverTimestamp(), // Best practice to update timestamp on sync
                    });
                    syncCount++;
                    syncedNames.push(businessName);
                } else {
                    toast.error(`${businessName}: Missing address or valid coordinates.`, { duration: 5000 });
                }
            });

            if (syncCount > 0) {
                // This commit triggers the onSnapshot listener automatically
                await batch.commit();

                await Promise.all(
                    syncedNames.map(name => logActivity('Synced', name))
                );

                toast.success(`${syncCount} locations are now live on the map!`);
            }

        } catch (error) {
            console.error("Sync Error:", error);
            toast.error("Sync failed.");
        } finally {
            setIsSyncing(false);
            setIsSyncModalOpen(false);
        }
    };


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

                // return setDoc(docRef, {
                //     ...item,
                //     latitude: coords?.latitude || 0,
                //     longitude: coords?.longitude || 0,
                //     createdAt: serverTimestamp(),
                //     updatedAt: serverTimestamp()
                // }, { merge: true });

                // Create the data object for consistency
                const locationData = {
                    ...item,
                    latitude: coords?.latitude || 0,
                    longitude: coords?.longitude || 0,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                };

                // Execute the Firestore update and the Activity Log in parallel
                await Promise.all([
                    setDoc(docRef, locationData, { merge: true }),
                    // Assuming your logger is imported as logActivity
                    logActivity('Imported', item.businessName)
                ]);

                return docId;

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

    return {
        // Submit & Update data
        methods,
        handleFormSubmit,
        handleConfirmUpdate,
        pendingData,
        setPendingData,
        showUpdateModal,
        setShowUpdateModal,

        //Delete data
        handleConfirmDelete,
        isDeleting,
        isDeleteModalOpen,
        setIsDeleteModalOpen,

        // Sync data
        handleSingleSync,
        handleBulkSync,
        isSyncing,
        pendingLocation,
        setPendingLocation,

        // Details data
        detailsLocation,
        setDetailsLocation,

        // State for Sync popup modal
        isSyncModalOpen,
        setIsSyncModalOpen,

        // Import GHL data
        handleImportClick,
        confirmBulkImport,
        loading,
        isSaving,
        stagingData,
        setStagingData,

        // Map view
        handleViewOnMap
    };
};