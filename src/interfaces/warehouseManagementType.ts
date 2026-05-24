// -------------Category-----------------------
export type CategoryStatus = "ACTIVE" | "INACTIVE" | "DELETED";

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
  totalBins: number;
  occupiedBins: number;
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

export enum BatchStatus {
  ACTIVE = "ACTIVE",
  DEPLETED = "DEPLETED",
  FAULT = "FAULT",
  ARCHIVED = "ARCHIVED",
}

export enum LocationStatus {
  INACTIVE = "INACTIVE",
  OCCUPIED = "OCCUPIED",
  EMPTY = "EMPTY",
  RESERVED = "RESERVE",
  BLOCKED = "BLOCKED",
  UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
}

export interface LocationBatch {
  id: number;
  code: string;
  status: BatchStatus;
  initialQty: number;
  currentQty: number;
  productName: string;
  unitName: string;
}

export interface LocationResponse {
  id: number;
  name: string;
  code: string;
  type: LocationType;
  maxLength: number;
  maxWidth: number;
  maxHeight: number;
  maxVolume: number;
  maxWeight: number;
  status: LocationStatus;
  batch: LocationBatch;
  totalBins: number;
  occupiedBins: number;
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
  maxLength: number | null;
  maxWidth: number | null;
  maxHeight: number | null;
  maxWeight: number | null;
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
  DELETED = "DELETED",
}
export enum ConversionStatus {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
}

export interface ProductCreateRequest {
  name: string;
  description: string | null;
  categoryId: number | null;
  baseUnitId: number | null;
  image: string | null;
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
  status: ProductStatus;
  attributes: VariantAttributeResponse[];
}

export interface ProductResponse {
  id: number;
  code: string;
  name: string;
  description: string | null;
  status: ProductStatus;
  categoryId: number;
  categoryName: string;
  baseUnit: UnitSummary;
  variants: VariantResponse[];
  unitConversions: UnitConversionResponse[];
}

export interface UnitConversionResponse {
  id: number;
  fromUnit: UnitSummary;
  conversionRate: number;
  status: ConversionStatus;
}

export interface AttributeValue {
  attributeId: number;
  value: string;
}

export interface VariantCreateRequest {
  productId: number;
  description: string | null;
  image: string | null;
  attributes: AttributeValue[];
}

export interface VariantUpdateRequest {
  description: string | null;
  image: string | null;
}

export interface ProductUpdateRequest {
  name: string;
  description: string | null;
  categoryId: number | string;
}

export interface ProductAddConversionRequest {
  fromUnitId: number;
  conversionRate: number;
}
