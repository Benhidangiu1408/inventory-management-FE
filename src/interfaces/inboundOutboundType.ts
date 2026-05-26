import { SheetStatus } from "@/interfaces/inventoryManagementType";
import {
  BatchStatus,
  LocationStatus,
  LocationType,
} from "./warehouseManagementType";

export enum CustomerStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export enum QCSheetDetailStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  PASSED = "PASSED",
  FAILED = "FAILED",
  RECHECK_REQUIRED = "RECHECK_REQUIRED",
  REJECTED = "REJECTED",
  SKIPPED = "SKIPPED",
}

export enum ImportSheetDetailMappingStatus {
  UNMAPPED = "UNMAPPED",
  AUTO_MAPPED = "AUTO_MAPPED",
  MANUAL_MAPPED = "MANUAL_MAPPED",
  CREATED_NEW = "CREATED_NEW",
}

export enum ImportSheetType {
  INTERNAL = "INTERNAL",
  FACTORY = "FACTORY",
  SUPPLIER = "SUPPLIER",
  EXTERNAL_SUPPLIER = "EXTERNAL_SUPPLIER",
}

export enum ExportSheetType {
  INTERNAL = "INTERNAL",
  FACTORY = "FACTORY",
  CUSTOMER = "CUSTOMER",
}

export interface Sort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface PageResponse<T> {
  content: T[];

  pageable: Pageable;

  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;

  size: number;
  number: number;

  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}

export interface UnitResponse {
  id: number;
  abb: string;
  name: string;
  description: string;
}

export interface UnitConversionResponse {
  id: number;
  conversionRate: number;
  fromUnit: UnitResponse;
}

export interface SupplierCreateReq {
  address: string;
  email: string;
  name: string;
  phone: string;
}

export interface SupplierResponse {
  id: number;
  address: string;
  email: string;
  name: string;
  phone: string;
}

export interface CustomerCreateReq {
  address: string;
  email: string;
  name: string;
  phoneNumber: string;
  status: CustomerStatus;
}

export interface CustomerResponse {
  id: number;
  address: string;
  email: string;
  name: string;
  phoneNumber: string;
  status: CustomerStatus;
}

export interface ProductRepsonse {
  id: number;
  name: string;
  code: string;
  baseUnit: UnitResponse;
  unitConversions: UnitConversionResponse[];
}

export interface AttributeResponse {
  id: number;
  name: string;
  description: string;
  value: string;
}

export interface ProductVariantResponse {
  id: number;
  description: string;
  code: string;
  product: ProductRepsonse;
  attributes: AttributeResponse[];
}

export interface ProductVariantStockResponse extends ProductVariantResponse {
  stockQuantity: number;
}

export interface LocationResponse {
  id: number;
  code: string;
  name: string;
  locationType: LocationType;
  locationStatus: LocationStatus;
  maxWeight?: number;
  maxLength?: number;
  maxWidth?: number;
  maxHeight?: number;
  maxVolume?: number;
}

export interface ItemResponse {
  id: number;
  barcode: string;
  serialNumber: string;
}

export interface BatchResponse {
  id: number;
  code: string;
  initialQuantity: number;
  baseQuantity: number;
  location: LocationResponse;
  productVariant: ProductVariantResponse;
  unit: UnitResponse;
  unitConversion: UnitConversionResponse;
  status?: BatchStatus;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  expirationDate?: string;
}

export interface BatchSummaryResponse {
  batch: BatchResponse;
  quantity: number;
}

export interface ImportSheetDetailResponse {
  id: number;
  description: string;
  productVariant: ProductVariantResponse;
  unit?: UnitResponse;
  batch?: BatchResponse;
  expectedQuantity?: number;
  actualQuantity?: number;
  reason?: string;
  rawProductName: string;
  rawUnitName: string;
  rawSku: string;
  unitConversion: UnitConversionResponse;
  mappingStatus: ImportSheetDetailMappingStatus;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  expirationDate?: string;
}

export interface ImportSheetDetailCreateReq {
  productVariantId: number;
  expectedQuantity: number;
  unitId: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
}

export interface ExportSheetDetailCreateReq {
  productVariantId: number;
  expectedQuantity: number;
  scannedQuantity?: number;
  unitId?: number;
  batchId?: number[];
  destinationLocationId?: number;
  destinationLocationWarehouseId?: number;
}

export interface ImportSheetDetailUpdateReq {
  productVariantId?: number;
  expectedQuantity?: number;
  unitId?: number;
  actualQuantity?: number;
  reason?: string;
  mappingStatus?: ImportSheetDetailMappingStatus;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  expirationDate?: string;
}

export interface ImportSheetResponse {
  id: number;
  status: SheetStatus;
  type: ImportSheetType;
  details: ImportSheetDetailResponse[];
  createdAt: string;
  warehouse: WarehoseResponse;
  sourceWarehouse: WarehoseResponse;
  supplier: SupplierResponse;
  referenceExportSheet: ExportSheetResponse;
}

export interface WarehoseResponse {
  id: number;
  name: string;
}

export interface ImportSheetCreateReq {
  type: ImportSheetType;
  status: SheetStatus;
  warehouseId: number;
  sourceWarehouseId?: number;
  supplierId?: number;
  userId?: number;
  details?: ImportSheetDetailCreateReq[];
}

export interface ImportSheetUpdateReq {
  status?: SheetStatus;
  warehouseId?: number;
  sourceWarehouseId?: number;
  supplierId?: number;
  userId?: number;
  details?: ImportSheetDetailUpdateReq[];
}

export interface QCSheetDetailResponse {
  id: number;
  status: QCSheetDetailStatus;
  description: string;
  batch: BatchResponse;
  reason: string;
  notes: string;
}

export interface QCSheetDetailUpdateReq {
  id: number;
  status?: QCSheetDetailStatus;
  description?: string;
  reason?: string;
  notes?: string;
}

export interface QCSheetResponse {
  id: number;
  status: SheetStatus;
  details: QCSheetDetailResponse[];
}

export interface QCSheetUpdateReq {
  status?: SheetStatus;
  details?: QCSheetDetailUpdateReq[];
}

export interface SetBatchLocationReq {
  importSheetDetailId: number;
  locationId: number;
}

export interface SetSingleBatchLocationReq {
  importSheetDetailId: number;
  locationId: number;
}

export interface ExportSheetDetailResponse {
  id: number;
  productVariant: ProductVariantResponse;
  batches: BatchSummaryResponse[];
  expectedQuantity: number;
  scannedQuantity: number;
  expectedBaseQuantity: number;
  scannedBaseQuantity: number;
  destinationLocationId: number;
  destinationLocationWarehouseId: number;
  unit: UnitResponse;
  unitConversion: UnitConversionResponse;
}

export interface ExportSheetDetailCreateReq {
  productVariantId: number;
  expectedQuantity: number;
  estinationLocationId?: number;
  destinationLocationWarehouseId?: number;
}

export interface ExportSheetDetailUpdateReq {
  itemBarcode?: string;
  expectedQuantity?: number;
  scannedQuantity?: number;
  batchId?: number[];
}

export interface ExportSheetResponse {
  id: number;
  status: SheetStatus;
  type: ExportSheetType;
  details: ExportSheetDetailResponse[];
  warehouse: WarehoseResponse;
  destinationWarehouse: WarehoseResponse;
  createdAt: string;
  customer: CustomerResponse;
}

export interface ExportSheetUpdateReq {
  status?: SheetStatus;
  customerId?: number;
  destinationWarehouseId?: number;
  userId?: number;
  details?: ExportSheetDetailUpdateReq[];
}

export interface ExportSheetCreateReq {
  type: ExportSheetType;
  status: SheetStatus;
  warehouseId: number;
  sourceWarehouseId?: number;
  destinationWarehouseId?: number;
  supplierId?: number;
  userId?: number;
  customerId?: number;
  details?: ImportSheetDetailCreateReq[];
}

export interface ExportedItemResponse {
  id: number;
  itemId: number;
  barcode: string;
  serialNumber: string;
}
