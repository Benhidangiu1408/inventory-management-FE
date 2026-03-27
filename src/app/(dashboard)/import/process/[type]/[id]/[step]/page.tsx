"use client";

import ProductMappingPage from "@/app/(dashboard)/import/process/[type]/[id]/[step]/ProductMapping";
import QualityCheckPage from "@/app/(dashboard)/import/process/[type]/[id]/[step]/QualityCheck";
import ImportProcessPage from "@/app/(dashboard)/import/process/[type]/[id]/[step]/QuantityCheck";
import StorageLocationPage from "@/app/(dashboard)/import/process/[type]/[id]/[step]/StorageLocation";
import { useParams } from "next/navigation";

export default function StepPage() {
  const { step } = useParams();

  if (step === "storage-location") {
    return <StorageLocationPage />;
  }

  if (step === "quality-check") {
    return <QualityCheckPage />;
  }

  if (step === "quantity-check") {
    return <ImportProcessPage />;
  }

  if (step === "product-mapping") {
    return <ProductMappingPage />;
  }
}
