// -------------Category-----------------------
export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface SubCategory {
  id: number;
  code: string;
  name: string;
  description: string | null;
  parentCategoryId: number | null;
  parentCategoryName: string | null;
  status: CategoryStatus;
}

export interface Category {
  id: number;
  code: string;
  name: string;
  description: string | null;
  status: CategoryStatus;
  subcategories: SubCategory[];
}

export interface CategoryRequest {
  name: string;
  description: string;
  status: CategoryStatus;
  parentCategoryId: number | null; // Optional
}

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

export interface WarehouseGeneral {
  id: number;
  code: string;
  name: string;
  description: string;
  type: WarehouseType;
  status: WarehouseStatus;
  // managerName: string; // Derived from backend `manager.firstName` + `last`
}

export interface NewWarehouseRequest {
  name: string;
  address: string;
  description: string;
  type: WarehouseType;
  status: WarehouseStatus;
  // userId: string;
}
