// "use client";

// import React, { useState } from "react";
// import { storage } from "@/lib/firebase";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

// interface ImageUploadProps {
//     value: string;
//     onChange: (url: string) => void;
//     onRemove: () => void;
// }

// export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
//     const [isUploading, setIsUploading] = useState(false);

//     const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         setIsUploading(true);
//         try {
//             // Create a unique path for the image
//             const storageRef = ref(storage, `businesses/${Date.now()}-${file.name}`);
//             const snapshot = await uploadBytes(storageRef, file);
//             const url = await getDownloadURL(snapshot.ref);

//             onChange(url);
//         } catch (error) {
//             console.error("Upload failed:", error);
//             alert("Failed to upload image. Please try again.");
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     return (
//         <div className="space-y-4 w-full">
//             <div className="flex items-center gap-4">
//                 {value ? (
//                     <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-slate-200">
//                         <img src={value} alt="Preview" className="object-cover w-full h-full" />
//                         <button
//                             onClick={onRemove}
//                             type="button"
//                             className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
//                         >
//                             <X size={14} />
//                         </button>
//                     </div>
//                 ) : (
//                     <label className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-all group">
//                         {isUploading ? (
//                             <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
//                         ) : (
//                             <>
//                                 <ImageIcon className="h-8 w-8 text-slate-400 group-hover:text-blue-500" />
//                                 <span className="text-xs text-slate-500 mt-2">Upload Photo</span>
//                             </>
//                         )}
//                         <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
//                     </label>
//                 )}
//             </div>
//         </div>
//     );
// }