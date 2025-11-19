import { WarehouseCol } from "@/interfaces/warehouseManagementType";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getWarehouse() {
  const res = await fetch(`${API_URL}/info/warehouses`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch warehouses: ${res.statusText}`);
  }

  return res.json();
}
