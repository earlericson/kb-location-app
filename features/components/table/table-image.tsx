"use client";

import { useState, useEffect } from "react";
import { ImageIcon, X, ZoomIn } from "lucide-react";

interface TableImageProps {
  src?: string;
  alt: string; // This is where businessName is passed
}

export default function TableImage({ src, alt }: TableImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (isPreviewOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isPreviewOpen]);

  if (!src || hasError) {
    return (
      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
        <ImageIcon className="text-slate-400" size={20} />
      </div>
    );
  }

  return (
    <>
      {/* Thumbnail */}
      <div 
        className="relative w-12 h-12 rounded-lg border border-slate-200 overflow-hidden shrink-0 cursor-zoom-in group/img"
        onClick={() => setIsPreviewOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-110"
          onError={() => setHasError(true)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 flex items-center justify-center transition-all">
          <ZoomIn size={16} className="text-white opacity-0 group-hover/img:opacity-100" />
        </div>
      </div>

      {/* Large Preview Modal */}
      {isPreviewOpen && (
        <div 
          className="fixed inset-0 z-60 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 transition-all"
          onClick={() => setIsPreviewOpen(false)}
        >
          {/* Close Button */}
          <button className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
            <X size={14} />
          </button>

          <div className="relative max-w-5xl w-full flex flex-col items-center">
            {/* The Image */}
            <div className="relative group">
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
              />
              
              {/* Business Name Overlay/Caption */}
              <div className="mt-4 text-center">
                <h3 className="text-white text-md font-bold tracking-wide drop-shadow-md">
                  {alt}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}