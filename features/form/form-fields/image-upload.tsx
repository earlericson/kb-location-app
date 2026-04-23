"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { UploadCloud, X, Loader2 } from "lucide-react";
// 1. Import the compression library
import imageCompression from "browser-image-compression";
import { doc, updateDoc } from "firebase/firestore";

interface ImageUploadProps {
  businessId?: string;
  initialImageUrl?: string; // Add this prop
}

export const ImageUpload = ({ businessId, initialImageUrl }: ImageUploadProps) => {
    const { setValue, watch, formState: { errors } } = useFormContext();
    const [isUploading, setIsUploading] = useState(false);

    const imageUrl = watch("imageUrl");

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);

            // 2. Compression Options
            const options = {
                maxSizeMB: 0.48,          // Aim for slightly under 500KB (0.5MB)
                // maxWidthOrHeight: 1920,   // Standard HD maximum
                useWebWorker: true,
                fileType: "image/webp",   // Force WebP conversion
            };

            console.log(`Original size: ${(file.size / 1024).toFixed(2)} KB`);

            // 3. Perform Compression & Conversion
            const compressedFile = await imageCompression(file, options);

            console.log(`Compressed size: ${(compressedFile.size / 1024).toFixed(2)} KB`);

            // 4. Create Firebase Ref with .webp extension
            const fileName = `businesses/${Date.now()}.webp`;
            const storageRef = ref(storage, fileName);

            // 5. Upload to Firebase
            const snapshot = await uploadBytes(storageRef, compressedFile);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 6. Update Form
            setValue("imageUrl", downloadURL, {
                shouldValidate: true,
                shouldDirty: true
            });

        } catch (error) {
            console.error("Compression or Upload failed:", error);
        } finally {
            setIsUploading(false);
        }
    };

    // Remove uploaded image
    // const handleRemove = async () => {
    //     if (!imageUrl) return;

    //     try {
    //         // This physically deletes it from the bucket immediately
    //         const fileRef = ref(storage, imageUrl);
    //         await deleteObject(fileRef);

    //         setValue("imageUrl", "", { shouldValidate: true, shouldDirty: true });
    //     } catch (error) {
    //         console.error("Cleanup failed", error);
    //     }
    // };


    // Remove uploaded image and update Firestore instantly
    // const handleRemove = async () => {
    //     if (!imageUrl) return;

    //     try {
    //         // 1. Physically delete from Storage
    //         const fileRef = ref(storage, imageUrl);
    //         await deleteObject(fileRef);

    //         // 2. Clear the local form state
    //         setValue("imageUrl", "", { shouldValidate: true, shouldDirty: true });

    //         // Update Firestore instantly if we have an ID
    //         if (businessId) {
    //             const businessRef = doc(db, "businesses", businessId);
    //             await updateDoc(businessRef, {
    //                 imageUrl: ""
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Cleanup failed", error);
    //     }
    // };

    const handleRemove = async () => {
        if (!imageUrl) return;

        try {
            // Storage deletion
            const fileRef = ref(storage, imageUrl);
            await deleteObject(fileRef);

            // Local UI update
            setValue("imageUrl", "", { shouldValidate: true, shouldDirty: true });

            // DATABASE UPDATE
            if (businessId) {
                const businessRef = doc(db, "businesses", businessId);
                await updateDoc(businessRef, { imageUrl: "" });
                console.log("Firestore synced successfully");
            }

            console.log(`Business ID:`, {businessId})
        } catch (error) {
            console.error("Cleanup failed", error);
        }
    };

    return (
        <>
            <div className="space-y-2 w-full">
                <div className="flex w-full items-center gap-4">
                    {imageUrl ? (
                        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200">
                            <img src={imageUrl} alt="Preview" className="object-cover w-full h-full" />
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <label className={`w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-all group ${errors.imageUrl ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                            {isUploading ? <Loader2 className="h-8 w-8 text-blue-500 animate-spin" /> : <UploadCloud className="text-slate-500" />}
                            <span className="text-[10px] mt-2 font-medium text-gray-500 text-center">
                                {isUploading ? "Uploading..." : <span className="text-[10px] font-medium text-slate-500 text-center">Upload Image<br />(PNG, JPG, HEIC)</span>}
                            </span>
                            <input type="file" className="hidden" onChange={handleUpload} accept="image/*" disabled={isUploading} />
                        </label>
                    )}
                </div>
                {errors.imageUrl && <p className="text-xs text-red-500 mt-1">{errors.imageUrl.message as string}</p>}
            </div>


            {/* <div className="space-y-4 w-full">
            <div className="flex items-center gap-4">
                {value ? (
                    <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-slate-200">
                        <img src={value} alt="Preview" className="object-cover w-full h-full" />
                        <button
                            onClick={onRemove}
                            type="button"
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <label className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-all group">
                        {isUploading ? (
                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                        ) : (
                            <>
                                <ImageIcon className="h-8 w-8 text-slate-400 group-hover:text-blue-500" />
                                <span className="text-xs text-slate-500 mt-2">Upload Photo</span>
                            </>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
                    </label>
                )}
            </div>
        </div> */}
        </>











    );
};