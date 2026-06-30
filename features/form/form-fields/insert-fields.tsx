"use client";

import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { BusinessFormValues } from "@/types/business";
import { ImageUpload } from "./image-upload";
import { MapPin } from "lucide-react";
import { BusinessStatus, statusStyles } from "@/features/map/components/map-marker-color";

// 1. Add isEditing to the interface
interface FieldsProps {
  isLoading: boolean;
  isEditing: boolean;
  businessId?: string;
  initialImageUrl?: string;
}

// const STATUS_OPTIONS = ["Active", "For Sale", "Available"] as const;
// type BusinessStatus = typeof STATUS_OPTIONS[number];

// const statusStyles: Record<string, string> = {
//   'Active': 'text-red-500',
//   'For Sale': 'text-orange-500',
//   'Available': 'text-green-500',
//   '': 'text-slate-500' // Default state
// };

// Predefined contact values
const CONTACT_DEFAULTS = {
  'For Sale': {
    email: 'info@knockerball.com',
    phone: '800-583-7250',
    websiteUrl: 'https://knockerball.com/'
  },
  'Available': {
    email: 'info@knockerball.com',
    phone: '800-583-7250',
    websiteUrl: 'https://knockerball.com/'
  }
};

export default function BusinessFormFields({ isLoading, isEditing, businessId, initialImageUrl }: FieldsProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useFormContext<BusinessFormValues>();

  // const status = watch("status") as BusinessStatus | "";
  // const styleClass = statusStyles[status] || statusStyles[''];

  // Watch the status value to react to user selection instantly
  const selectedStatus = watch("status") as BusinessStatus;

  // Retrieve the configuration for the current status
  const statusConfig = statusStyles[selectedStatus];

  // Apply the text color class dynamically; fallback to slate if nothing is selected
  const statusColor = statusConfig ? statusConfig.text : 'text-slate-500';

  useEffect(() => {
    if (!selectedStatus) return;

    const currentEmail = watch("email");
    const currentPhone = watch("phone");
    const currentWebsiteUrl = watch("websiteUrl");

    // 1. Identify if we are in an auto-populated state
    // Checking if the email AND phone match the "For Sale" defaults
    const isCurrentlySales =
      currentEmail === CONTACT_DEFAULTS['For Sale'].email &&
      currentPhone === CONTACT_DEFAULTS['For Sale'].phone &&
      currentWebsiteUrl === CONTACT_DEFAULTS['For Sale'].websiteUrl;

    // Checking if the email AND phone match the "Available" defaults
    const isCurrentlyLeasing =
      currentEmail === CONTACT_DEFAULTS['Available'].email &&
      currentPhone === CONTACT_DEFAULTS['Available'].phone &&
      currentWebsiteUrl === CONTACT_DEFAULTS['Available'].websiteUrl;

    // The system state is "auto-populated" if it matches either, or if both are empty
    const isAutoPopulated = isCurrentlySales || isCurrentlyLeasing || (!currentEmail && !currentPhone && !currentWebsiteUrl);

    // 2. Logic for Active
    if (selectedStatus === 'Active') {
      if (currentEmail || currentPhone || currentWebsiteUrl) {
        setValue("email", "");
        setValue("phone", "");
        setValue("websiteUrl", "");
      }
    }
    // 3. Logic for Interchangeable Auto-population
    else if (CONTACT_DEFAULTS[selectedStatus as keyof typeof CONTACT_DEFAULTS]) {
      const { email, phone, websiteUrl } = CONTACT_DEFAULTS[selectedStatus as keyof typeof CONTACT_DEFAULTS];

      // Only update if the field is empty OR was previously auto-populated by us
      if (isAutoPopulated) {
        setValue("email", email, { shouldDirty: true, shouldValidate: true });
        setValue("phone", phone, { shouldDirty: true, shouldValidate: true });
        setValue("websiteUrl", websiteUrl, { shouldDirty: true, shouldValidate: true });
      }
    }
  }, [selectedStatus, setValue, watch]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Business Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Business Name</label>
          <input
            {...register("businessName")}
            className={`p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.businessName ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="e.g. Knockerball"
          />
          {errors.businessName && <span className="text-red-500 text-xs mt-1">{errors.businessName.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Owner */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Business Owner</label>
          <input
            {...register("businessOwner")}
            className={`p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.businessOwner ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="e.g. Quinn"
          />
          {errors.businessOwner && <span className="text-red-500 text-xs mt-1">{errors.businessOwner.message}</span>}
        </div>

        {/* Business Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Status</label>

          <div className={`flex p-1 rounded-lg items-center border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 outline-none transition-all ${errors.status ? 'border-red-500' : 'border-slate-300'}`}>
            <MapPin className={`w-5 h-5 ml-1 mb-1 ${statusColor}`} />
            <select
              {...register("status")}
              className={`w-full bg-transparent font-medium p-2 outline-none cursor-pointer ${statusColor}`}
              defaultValue=""
            >
              <option value="" disabled className="text-gray-900">
                Select ...
              </option>
              {/* {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option} className="text-gray-900 cursor-pointer">
                  {option}
                </option>
              ))} */}

              {/* Generate options dynamically from the keys of your style config */}
              {(Object.keys(statusStyles) as BusinessStatus[]).map((status) => (
                <option key={status} value={status} className="text-gray-900">
                  {status}
                </option>
              ))}



            </select>
          </div>

          {errors.status && <span className="text-red-500 text-xs mt-1">{errors.status.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Email Address</label>
          <input
            {...register("email")}
            type="email"
            className={`p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="info@knockerball.com"
          />
          {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Phone Number</label>
          <input
            {...register("phone")}
            className={`p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="800-583-7250"
          />
          {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
        </div>

        {/* Image URL */}
        {/* <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Image URL</label>
          <input
            {...register("imageUrl")}
            className={`p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.imageUrl ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="https://example.com/photo.jpg"
          />
          {errors.imageUrl && <span className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</span>}
        </div> */}

        {/* Address - Spans 2 columns */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Physical Address</label>
          <input
            {...register("address")}
            className={`p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.address ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="P.O. Box 342112 Kailua, HI 96734"
          />
          {errors.address && <span className="text-red-500 text-xs mt-1">{errors.address.message}</span>}
        </div>

        {/* Latitude */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Latitude</label>
          <input
            {...register("latitude", {
              setValueAs: (v) => (v === "" ? undefined : parseFloat(v))
            })}
            type="number"
            step="any"
            className={`p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.latitude ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="e.g. 40.741895"
          />
          {errors.latitude && <span className="text-red-500 text-xs mt-1">{errors.latitude.message}</span>}
        </div>

        {/* Longitude */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Longitude</label>
          <input
            {...register("longitude", {
              setValueAs: (v) => (v === "" ? undefined : parseFloat(v))
            })}
            type="number"
            step="any"
            className={`p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.longitude ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="e.g. -73.989308"
          />
          {errors.longitude && <span className="text-red-500 text-xs mt-1">{errors.longitude.message}</span>}
        </div>

        {/* Website URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Website URL</label>
          <input
            {...register("websiteUrl")}
            className={`p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.websiteUrl ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="https://knockerball.com/"
          />
          {errors.websiteUrl && <span className="text-red-500 text-xs mt-1">{errors.websiteUrl.message}</span>}
        </div>

        {/* Content URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Content URL</label>
          <input
            {...register("contentUrl")}
            className={`p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.contentUrl ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="https://content-source.com"
          />
          {errors.contentUrl && <span className="text-red-500 text-xs mt-1">{errors.contentUrl.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* This field is for image upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Image</label>
          <ImageUpload
            businessId={businessId}
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading || !isValid}
          className={!isValid ? "w-full disabled:bg-blue-300 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2"
            : "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3.5 rounded-lg transition-colors shadow-md shadow-blue-100 flex items-center justify-center gap-2"}>
          {isLoading
            ? "Processing..."
            : isEditing
              ? "Update Location Details"
              : "Save Location Details"
          }
        </button>
      </div>
    </>
  );
}