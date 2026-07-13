"use client";

import BusinessForm from "@/features/form/insert-data";
import BusinessTable from "@/features/components/table/business-table";
import BusinessDrawer from "@/features/components/drawer/business-drawer";
import { BulkSyncModal } from "@/features/components/modal/sync-confirm-modal";
import ImportStagingTable from "@/features/import/components/ImportStagingTable";
import { Pagination } from "@/features/components/table/pagination";
import { useLocationActions } from "@/hooks/use-location-action";
import { useTableHeader } from '@/hooks/table/use-table-header';
import { TableHeader } from "@/features/components/table/table-header";

export default function LocationsPage() {

  const {
    handleBulkSync,
    handleImportClick,
    confirmBulkImport,
    loading,
    isSaving,
    stagingData,
    setStagingData,
    isSyncing,
    isSyncModalOpen,
    setIsSyncModalOpen
  } = useLocationActions();

  const {
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
  } = useTableHeader('all');

  if (isLoading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <>
      <main className="relative min-h-screen bg-slate-50 py-5 md:py-5">
        <TableHeader
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onAdd={handleAddNew}
          onSync={() => setIsSyncModalOpen(true)}
          onImport={handleImportClick}
          draftCount={draftCount}
          isSyncing={isSyncing}
          isLoading={loading}
        />

        {/*Table Content */}
        <div className="max-w-7xl md:mx-auto mx-5 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <BusinessTable onEdit={handleEditClick} data={paginatedData} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBusinesses.length}
            itemsPerPage={itemsPerPage}
            visiblePages={visiblePages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Drawer is organized as a clean wrapper */}
        <BusinessDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          title={selectedBusiness ? "Edit Location" : "New Location"}
        >
          {/* <BusinessForm
            key={selectedBusiness?.id || 'new'}
            onSubmit={handleFormSubmit}
            isLoading={isCreating || isUpdating}
            defaultValues={selectedBusiness || undefined}
          /> */}

          <BusinessForm
            key={selectedBusiness?.id || 'new'}
            onSubmit={handleSubmitToDB}
            isLoading={false}
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