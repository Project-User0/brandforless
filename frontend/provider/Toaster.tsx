"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      closeButton={true}
      visibleToasts={4}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "w-full md:w-[380px] flex items-start gap-3 p-4 bg-white border border-neutral-200 text-neutral-900 rounded-none shadow-sm font-sans text-xs sm:text-sm tracking-wide transition-all relative group mb-2 sm:mb-3",
          title: "font-medium text-neutral-950",
          description:
            "text-neutral-500 font-light mt-0.5 leading-relaxed text-[11px] sm:text-xs",
          actionButton:
            "bg-neutral-900 text-white font-light text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-none hover:bg-neutral-800 transition-colors",
          cancelButton:
            "bg-neutral-100 text-neutral-600 font-light text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-none hover:bg-neutral-200 transition-colors",
          closeButton:
            "absolute right-2 top-2 !bg-transparent !border-none text-neutral-400 hover:text-neutral-950 transition-colors !opacity-0 group-hover:!opacity-100 transition-opacity",

          success: "border-l-2 border-l-neutral-900 border-neutral-200",
          error: "border-l-2 border-l-red-600 border-neutral-200",
          info: "border-l-2 border-l-blue-600 border-neutral-200",
          warning: "border-l-2 border-l-amber-500 border-neutral-200",
        },
      }}
    />
  );
}
