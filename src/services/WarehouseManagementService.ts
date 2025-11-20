import { WarehouseCol } from "@/interfaces/warehouseManagementType";
import { apiClient } from "@/lib/api-mask";

export async function getWarehouse() {
  return apiClient.get<WarehouseCol>("/info/warehouses", { cache: "no-store" });
}
