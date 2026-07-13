"use client";

import { useEffect } from "react";
import { FormProvider, useWatch, useFormState } from "react-hook-form";
import { BusinessLocation } from "@/types/business";
import BusinessFormFields from "./form-fields/insert-fields";
import UpdateConfirmModal from "../components/modal/update-confirm-modal";

import { getCoordinates } from "@/lib/geocoding";
import { useLocationActions } from "@/hooks/use-location-action";

interface BusinessFormProps {
  // Use the specific form values schema
  onSubmit: (data: BusinessLocation) => Promise<void>;
  isLoading: boolean;
  // Use the full interface or Partial for default values
  defaultValues?: BusinessLocation;
  //   businessId?: string;
}

export default function BusinessForm({ onSubmit, isLoading, defaultValues }: BusinessFormProps) {
  const {
    methods,
    handleFormSubmit,
    handleConfirmUpdate,
    showUpdateModal,
    setShowUpdateModal,
    setPendingData,
  } = useLocationActions(defaultValues);


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


  // Reset form when defaultValues changes (switching between Edit/Add)
  useEffect(() => {
    methods.reset(defaultValues || {});
  }, [defaultValues, methods]);

  // Disable/Enable button in the form
  // const { isValid } = methods.formState;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((data) => {
          // console.log("Data submitted to form:", data); // Check if 'id' is here!
          return handleFormSubmit(data, onSubmit);
        })}
        className="space-y-6 bg-white"
      >
        <input type="hidden" {...methods.register("id")} />
        <BusinessFormFields
          isLoading={isLoading}
          isEditing={!!defaultValues?.businessName}
        // businessId={businessId}
        />
      </form>


      {/* Dedicated Update Confirmation Modal */}
      <UpdateConfirmModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setPendingData(null);
        }}
        onConfirm={() => handleConfirmUpdate(onSubmit)}
        isLoading={isLoading}
      />

    </FormProvider>
  );
}