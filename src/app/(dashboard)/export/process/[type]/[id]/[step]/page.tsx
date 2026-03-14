"use client";

import ExportQuantityCheck from "@/app/(dashboard)/export/process/[type]/[id]/[step]/ExportQuantityCheck";
import ExportConfirm from "@/app/(dashboard)/export/process/[type]/[id]/[step]/ExportConfirm";
import { useParams } from "next/navigation";

export default function ExportStepPage() {
  const { step } = useParams();

  if (step === "confirm") {
    return <ExportConfirm />;
  }

  if (step === "quantity-check") {
    return <ExportQuantityCheck />;
  }

  return null;
}
