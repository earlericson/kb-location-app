import React from 'react'

import { useEffect, useMemo, useState } from "react";
import { BusinessLocation } from "@/types/business";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, onSnapshot, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { MappedLocation } from "@/types/location";
import { useBusinessQuery } from "@/hooks/use-business-query";

type BusinessStatus = BusinessLocation['status'];

export const useTableHeader = (status: 'all' | BusinessStatus) => {

    // State for drawer visibility and tracking the selected record
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState<BusinessLocation | null>(null);

    // State to check if GHL data is exist in the dashboard table
    const [locations, setLocations] = useState<MappedLocation[]>([]);

    // State for counting the draft location
    const [draftCount, setDraftCount] = useState(0);

    // State for searchbar
    const [searchTerm, setSearchTerm] = useState("");

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Check the GhlIds if existing in the database
    const existingGhlIds = locations.map(loc => loc.ghlId);

    // Table status filter
    const { data: businesses, isLoading } = useBusinessQuery(status);

    // Table row per page
    const itemsPerPage = 5;

    // Logic to filter businesses based on search term
    const filteredBusinesses = useMemo(() => {
        if (!businesses) return [];

        return businesses.filter((business) => {
            const searchStr = searchTerm.toLowerCase();
            return (
                business.businessName?.toLowerCase().includes(searchStr) ||
                business.address?.toLowerCase().includes(searchStr) ||
                business.email?.toLowerCase().includes(searchStr)
            );
        });
    }, [searchTerm, businesses]);

    // 2. Pagination logic
    const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredBusinesses.slice(start, start + itemsPerPage);
    }, [filteredBusinesses, currentPage]);

    // Reset to page 1 when searching
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // CRITICAL: Reset to page 1 whenever the search term changes
        setCurrentPage(1);
    };

    // 2. NEW: Calculate the sliding window of 5 pages
    const getVisiblePages = () => {
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        // Adjust if we are near the end of the list
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const visiblePages = getVisiblePages();


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

    // Set selected record and open drawer for editing
    const handleEditClick = (business: BusinessLocation) => {
        setSelectedBusiness(business);
        setIsDrawerOpen(true);
    };

    // Drawer
    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedBusiness(null);
    };


    const handleSubmitToDB = async (data: BusinessLocation) => {
        // 1. Destructure to pull out fields we don't want to overwrite
        const { id, createdAt, ...fieldsToSave } = data;

        if (id) {
            // 2. Perform the update
            const docRef = doc(db, "locations", id);

            // 3. Pass only the fields that should change, plus the new updatedAt
            await updateDoc(docRef, {
                ...fieldsToSave,
                updatedAt: Timestamp.now(),
                // createdAt is intentionally omitted, so it remains untouched in Firestore
            });
        } else {
            // 3. For new entries, use 'fieldsToSave' (which excludes id)
            const colRef = collection(db, "locations");

            await addDoc(colRef, {
                ...fieldsToSave,
                createdAt: Timestamp.now(), // Set creation timestamp
            });
        }

        setIsDrawerOpen(false);
        setSelectedBusiness(null);
    };

    return {
        isDrawerOpen,
        selectedBusiness,
        draftCount,
        existingGhlIds,
        isLoading,
        paginatedData,
        handleSearchChange,
        visiblePages,
        handleAddNew,
        handleEditClick,
        closeDrawer,
        handleSubmitToDB,

        currentPage,
        totalPages,
        setCurrentPage,
        filteredBusinesses,
        itemsPerPage,

        searchTerm
    }
}
