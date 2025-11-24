"use client";

import toast, { resolveValue, Toaster, ToastType } from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";

export default function MyToast() {
  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle size={24} className="text-green-500" />,
          borderColor: "border-green-500",
        };
      case "error":
        return {
          icon: <XCircle size={24} className="text-red-500" />,
          borderColor: "border-red-500",
        };
      default: // blank or custom
        return {
          icon: <CheckCircle size={24} className="text-brand-500" />, // Default brand color
          borderColor: "border-brand-500",
        };
    }
  };

  return (
    <Toaster
      position={"top-right"}
      toastOptions={{ duration: 3000 }}
      containerStyle={{ top: 40 }}
    >
      {(t) => {
        const { icon, borderColor } = getToastStyles(t.type);
        return (
          <div
            className={`${borderColor} shadow-theme-sm flex items-center justify-between gap-3 rounded-md border-b-4 bg-white p-3 sm:max-w-[340px] dark:bg-[#1E2634]`}
          >
            <div className={"flex items-center gap-4"}>
              {icon}
              <h4
                className={
                  "text-sm text-gray-800 sm:text-base dark:text-white/90"
                }
              >
                {resolveValue(t.message, t)}
              </h4>
            </div>
          </div>
        );
      }}
    </Toaster>
  );
}
