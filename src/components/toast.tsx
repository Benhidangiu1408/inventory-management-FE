"use client";

import toast, { resolveValue, Toaster } from "react-hot-toast";
import { CheckCircle } from "lucide-react";

export const callToast = () => {
  toast("message");
};

export default function MyToast() {
  return (
    <Toaster
      position={"top-right"}
      toastOptions={{ duration: 3000 }}
      containerStyle={{ top: 40 }}
    >
      {(t) => (
        <div
          className={
            "shadow-theme-sm border-success-500 z-999999 flex w-full items-center justify-between gap-3 rounded-md border-b-4 bg-white p-3 sm:max-w-[340px] dark:bg-[#1E2634]"
          }
        >
          <div className={"flex items-center gap-4"}>
            <CheckCircle size={24} color={"var(--color-success-500)"} />
            <h4
              className={
                "text-sm text-gray-800 sm:text-base dark:text-white/90"
              }
            >
              {resolveValue(t.message, t)}
            </h4>
          </div>
        </div>
      )}
    </Toaster>
  );
}
