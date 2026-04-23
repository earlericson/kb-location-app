"use client";

import { useEffect, useState } from "react";
import BusinessForm from "@/features/form/insert-data";
import { useBusinessMutations } from "@/hooks/use-business-mutation";
import { BusinessLocation, BusinessFormValues } from "@/types/business";
import BusinessTable from "@/features/table/business-table";
import { X, Plus } from "lucide-react";
import BusinessDrawer from "@/features/components/drawer/business-drawer";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LogoutButton } from "@/features/auth/logout-btn";

export default function BusinessDashboard() {
  const router = useRouter();

  // State for drawer visibility and tracking the selected record
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessLocation | null>(null);

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


  // Reset state and open drawer for creation
  const handleAddNew = () => {
    setSelectedBusiness(null);
    setIsDrawerOpen(true);
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
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Column 1: Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="font-bold text-gray-900 text-lg hidden xs:block">
                Admin<span className="text-blue-600">Panel</span>
              </span>
            </div>

            {/* Column 2: 3 Buttons / Actions */}
            <div className="flex items-center gap-1 sm:gap-4">

              {/* Button 1: Dashboard Link */}
              <button
                onClick={handleAddNew}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Plus size={20} />
                <span>Add New Business</span>
              </button>

              {/* Button 2: Profile/Settings */}
              <button
                onClick={handleAddNew}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Plus size={20} />
                <span>Add New Business</span>
              </button>

              {/* Button 3: Logout Component */}
              <div className="pl-2 border-l border-gray-100 ml-1 sm:ml-0">
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





      <main className="relative min-h-screen bg-slate-50 p-4 md:p-8">
        {/*Table Content */}
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <BusinessTable onEdit={handleEditClick} />
        </div>

        {/* Drawer is organized as a clean wrapper */}
        <BusinessDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          title={selectedBusiness ? "Edit Business" : "New Business"}
        >
          <BusinessForm
            key={selectedBusiness?.id || 'new'}
            onSubmit={handleFormSubmit}
            isLoading={isCreating || isUpdating}
            defaultValues={selectedBusiness || undefined}
          />
        </BusinessDrawer>
      </main>
    </>
  );
}