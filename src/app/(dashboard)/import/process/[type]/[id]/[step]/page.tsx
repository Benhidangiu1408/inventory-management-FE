import QualityCheckPage from "@/app/(dashboard)/import/process/[type]/[id]/[step]/QualityCheck";
import ImportProcessPage from "@/app/(dashboard)/import/process/[type]/[id]/[step]/QuantityCheck";
import StorageLocationPage from "@/app/(dashboard)/import/process/[type]/[id]/[step]/StorageLocation";
import { inboundOutboundService } from "@/services/InboundOutboundService";

export default async function StepPage({
  params,
}: {
  params: { id: string; step: string };
}) {
  const { id, step } = await params;

  const importSheetDetail =
    await inboundOutboundService.getImportSheetDetail(id);

  // console.log(importSheetDetail);

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
