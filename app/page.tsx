"use client";

import { useState } from "react";
import BusinessForm from "@/features/form/insert-data";
import { useBusinessMutations } from "@/hooks/use-business-mutation";
import { BusinessLocation, BusinessFormValues } from "@/types/business";
import BusinessTable from "@/features/table/locations-table";
import { X, Plus } from "lucide-react";

export default function BusinessDashboard() {
  // State for drawer visibility and tracking the selected record
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessLocation | null>(null);

  const { createBusiness, updateBusiness, isCreating, isUpdating } = useBusinessMutations();

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


  return (
    <div className="relative min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Business Locations
          </h1>
          <p className="text-slate-500 text-sm">
            Manage and monitor your automated mapping system data.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Plus size={20} />
          <span>Add New Business</span>
        </button>
      </div>

      {/* Main Table Content */}
      <main className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <BusinessTable onEdit={handleEditClick} />
      </main>

      {/* Slide-out Drawer Component */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${isDrawerOpen ? "visible" : "invisible"
          }`}
      >
        {/* Semi-transparent Backdrop */}
        <div
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setIsDrawerOpen(false)}
        />

        {/* Form Panel */}
        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >

          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {selectedBusiness ? "Edit Location" : "New Location"}
                </h2>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
                  {selectedBusiness ? "Database Entry ID: " + selectedBusiness.id.slice(0, 8) : "Enter Business Details"}
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-900 p-2 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Content Area */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <BusinessForm
                key={selectedBusiness?.id || 'new'}
                onSubmit={handleFormSubmit}
                isLoading={isCreating || isUpdating}
                defaultValues={selectedBusiness || undefined}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}