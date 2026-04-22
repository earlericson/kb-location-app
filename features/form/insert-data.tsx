"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useWatch, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BusinessSchema, BusinessFormValues } from "@/types/business";
import BusinessFormFields from "./form-fields/insert-fields";
import UpdateConfirmModal from "../components/modal/update-confirm-modal";

import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { getCoordinates } from "@/lib/geocoding";

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
    mode: "onChange",
    defaultValues: defaultValues || {
      address: "",
      latitude: 0,
      longitude: 0
    },
  });

  // Reset form when defaultValues changes (switching between Edit/Add)
  useEffect(() => {
    methods.reset(defaultValues || {});
  }, [defaultValues, methods]);

  // Disable/Enable button in the form
  const { isValid } = methods.formState;


  // Geocoding Map
  const { control, setValue } = methods;

  // Define watchedAddress using the control
  const watchedAddress = useWatch({
    control,
    name: "address", // Make sure this matches the key in your BusinessSchema
  });

  const { dirtyFields } = useFormState({ control });

  useEffect(() => {
    const timer = setTimeout(async () => {
      // Only auto-populate if the address is "dirty" (the user just changed it)
      if (watchedAddress && dirtyFields.address && !dirtyFields.latitude) {
        const coords = await getCoordinates(watchedAddress);
        if (coords) {
          setValue("latitude", coords.latitude, { shouldValidate: true, shouldDirty: true });
          setValue("longitude", coords.longitude, { shouldValidate: true, shouldDirty: true });
        }
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [watchedAddress, dirtyFields.address, dirtyFields.latitude, setValue]);


  const handleFormSubmit = async (data: BusinessFormValues) => {
    const isEditMode = !!defaultValues?.businessName;

    if (isEditMode) {
      setPendingData(data);
      setShowUpdateModal(true);
    } else {
      // 1. Wait for the database submission to complete
      await onSubmit(data);

      // 2. Explicitly reset the form to empty values
      methods.reset();
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
        className="space-y-6 bg-white"
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
