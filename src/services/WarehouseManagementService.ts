import { Category } from "@/interfaces/warehouseManagementType";
import { apiClient } from "@/lib/api-mask";

export async function getCategories() {
  return apiClient.get<Category[]>("/info/v1/categories", {
    cache: "no-store",
  });
}
