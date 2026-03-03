import { NewImportClient } from "@/components/InboundOutboundClient/NewImportClient";
import { inboundOutboundService } from "@/services/InboundOutboundService";

export default async function NewImportPage() {
  const warehouses = await inboundOutboundService.getWarehouses();

  return <NewImportClient warehouses={warehouses || []} />;
}
