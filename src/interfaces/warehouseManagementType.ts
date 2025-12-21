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
  description: string | null;
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
  description: string | null;
  type: WarehouseType;
  status: WarehouseStatus;
  // managerName: string; // Derived from backend `manager.firstName` + `last`
}

export interface WarehouseDetail {
  id: number;
  code: string;
  name: string;
  address: string;
  description: string | null;
  type: WarehouseType;
  status: WarehouseStatus;
  managerId: number;
  managerName: string;
}

export interface NewWarehouseRequest {
  name: string;
  address: string;
  description: string | null;
  type: WarehouseType;
  status: WarehouseStatus;
  managerId: number | null;
}

// ----------------- Location --------------------
export enum LocationType {
  ROOM = "ROOM",
  ZONE = "ZONE",
  AISLE = "AISLE",
  SHELF = "SHELF",
  RACK = "RACK",
  BIN = "BIN",
}

export enum LocationStatus {
  INACTIVE = "INACTIVE",
  OCCUPIED = "OCCUPIED",
  EMPTY = "EMPTY",
  RESERVED = "RESERVE",
  BLOCKED = "BLOCKED",
  UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
}

export interface LocationResponse {
  id: number;
  name: string;
  code: string;
  type: LocationType;
  status: LocationStatus;
}

export interface LocationUpdate {
  name: string;
  status: LocationStatus;
}

export interface LocationBulkCreate {
  warehouseId: number;
  parentId: number | null;
  levels: LevelConfig[];
}

interface LevelConfig {
  type: LocationType;
  quantity: number;
  namePrefix: string | null;
}

// Unit
export interface UnitResponse {
  id: number;
  name: string;
  abb: string;
  description: string | null;
}

export interface UnitRequest {
  name: string;
  abb: string;
  description: string | null;
}

// VARIANT ATTRIBUTES
export interface AttributeResponse {
  id: number;
  name: string;
  description: string | null;
}

export interface AttributeRequest {
  name: string;
  description: string | null;
}

// Product
export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface ProductCreateRequest {
  name: string;
  description: string | null;
  categoryId: number | null;
  // Base Unit Config
  baseUnitId: number | null;
  // Batch Unit Config
  batchUnitId: number | null;
  batchConversionRate?: number; // Required if batchUnitId != baseUnitId
  // Item Unit Config
  itemUnitId: number | null;
  itemConversionRate?: number; // Required if itemUnitId != baseUnitId
  additionalConversions?: {
    fromUnitId: number | null;
    conversionRate: number | null;
  }[];
}

export interface UnitSummary {
  id: number;
  name: string;
  abb: string;
}

export interface VariantAttributeResponse {
  attributeId: number;
  attributeName: string;
  value: string;
}

export interface VariantResponse {
  id: number;
  code: string;
  description: string | null;
  image: string | null;
  minimumQuantity: number;
  status: ProductStatus;
  attributes: VariantAttributeResponse[];
}

export interface ProductResponse {
  id: number;
  code: string;
  name: string;
  description: string | null;
  status: ProductStatus;
  categoryName: string;
  // Unit Config
  baseUnit: UnitSummary;
  batchUnit: UnitSummary | null;
  itemUnit: UnitSummary | null;
  // Variants list
  variants: VariantResponse[];
}
// Uncheck

export interface AttributeValue {
  attributeId: number;
  value: string;
}

export interface VariantCreateRequest {
  productId: number;
  minimumStockRequire?: number;
  description: string | null;
  image: string | null;
  attributes: AttributeValue[];
}

export interface VariantUpdateRequest {
  description?: string;
  image?: string;
  minimumStockRequire?: number;
  status?: ProductStatus;
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  status?: ProductStatus;
}

export interface ProductAddConversionRequest {
  fromUnitId: number;
  toUnitId: number;
  conversionRate: number;
}
