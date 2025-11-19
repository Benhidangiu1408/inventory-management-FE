// -------------- Warehouse ---------------------
export enum WarehouseStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
}

export enum WarehouseType {
  STORAGE = "STORAGE",
  DEFECT = "DEFECT",
}

// The Col Data Type (What your table consumes)
export interface WarehouseCol {
  id: string;
  code: string;
  name: string;
  address: string;
  type: WarehouseType;
  status: WarehouseStatus;
  managerName: string; // Derived from backend `manager.firstName` + `last`
  capacity: string; // Optional: if you add this later
  actions: string[]; // e.g. ["r", "w", "d"]
}
