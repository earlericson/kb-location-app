"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BusinessSchema, BusinessFormValues } from "@/types/business";
import BusinessFormFields from "./form-fields/insert-fields";
import UpdateConfirmModal from "../component/modal/update-confirm-modal";

interface BusinessFormProps {
  onSubmit: (data: BusinessFormValues) => Promise<void>;
  isLoading: boolean;
  defaultValues?: Partial<BusinessFormValues>;
}

export default function BusinessForm({ onSubmit, isLoading, defaultValues }: BusinessFormProps) {

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pendingData, setPendingData] = useState<BusinessFormValues | null>(null);

  const methods = useForm<BusinessFormValues>({
    resolver: zodResolver(BusinessSchema),
    defaultValues: defaultValues || {},
  });

  // Reset form when defaultValues changes (switching between Edit/Add)
  useEffect(() => {
    methods.reset(defaultValues || {});
  }, [defaultValues, methods]);
  

  /**
   * handlePreSubmit intercepts the standard form submission.
   * If we are in "Edit Mode", it opens the confirmation modal.
   * If we are in "Add Mode", it proceeds directly to the onSubmit.
   */
  const handleFormSubmit = (data: BusinessFormValues) => {
    const isEditMode = !!defaultValues?.businessName;

    if (isEditMode) {
      setPendingData(data);
      setShowUpdateModal(true);
    } else {
      onSubmit(data);
    }
  };

  // This is triggered only after the user clicks "Confirm" in the modal
  const handleConfirmUpdate = async () => {
    if (pendingData) {
      await onSubmit(pendingData);
      setShowUpdateModal(false);
      setPendingData(null);
    }
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleFormSubmit)}
        className="space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200"
      >
        <BusinessFormFields
          isLoading={isLoading}
          isEditing={!!defaultValues?.businessName}
        />
      </form>

      {/* Dedicated Update Confirmation Modal */}
      <UpdateConfirmModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setPendingData(null);
        }}
        onConfirm={handleConfirmUpdate}
        isLoading={isLoading}
      />

    </FormProvider>
  );
}
