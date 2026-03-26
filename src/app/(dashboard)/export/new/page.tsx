import { NewExportClient } from "@/components/InboundOutboundClient/NewExportClient";
import { inboundOutboundService } from "@/services/InboundOutboundService";

export default async function NewExportPage() {
  const warehouses = await inboundOutboundService.getWarehouses();

  return <NewExportClient warehouses={warehouses || []} />;
}
