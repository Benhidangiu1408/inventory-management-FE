"use client";

import ExportConfirm from "@/app/(dashboard)/export/process/[type]/[id]/[step]/ExportConfirm";
import ExportQuantityCheck from "@/app/(dashboard)/export/process/[type]/[id]/[step]/ExportQuantityCheck";
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
