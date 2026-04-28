"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { BusinessFormValues } from "@/types/business";
import { ImageUpload } from "./image-upload";

// 1. Add isEditing to the interface
interface FieldsProps {
  isLoading: boolean;
  isEditing: boolean;
  businessId?: string;
  initialImageUrl?: string;
}

export default function BusinessFormFields({ isLoading, isEditing, businessId, initialImageUrl }: FieldsProps) {
  const {
    register,
    formState: { errors, isValid },
  } = useFormContext<BusinessFormValues>();

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

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
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
          // initialImageUrl={defaultValues?.imageUrl}
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