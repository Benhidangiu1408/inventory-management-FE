import QualityCheckPage from "@/app/(dashboard)/import/process/[type]/[id]/[step]/QualityCheck";
import ImportProcessPage from "@/app/(dashboard)/import/process/[type]/[id]/[step]/QuantityCheck";
import StorageLocationPage from "@/app/(dashboard)/import/process/[type]/[id]/[step]/StorageLocation";

export default async function StepPage({
  params,
}: {
  params: { step: string };
}) {
  const { step } = await params;

  if (step === "storage-location") {
    return <StorageLocationPage />;
  }

  if (step === "quality-check") {
    return <QualityCheckPage />;
  }

  if (step === "quantity-check") {
    return <ImportProcessPage />;
  }
}
