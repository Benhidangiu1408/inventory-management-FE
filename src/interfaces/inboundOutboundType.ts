import { SheetStatus } from "@/interfaces/inventoryManagementType";
import { LocationStatus, LocationType } from "./warehouseManagementType";

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

export enum ImportSheetType {
  INTERNAL = "INTERNAL",
  FACTORY = "FACTORY",
  SUPPLIER = "SUPPLIER",
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
  toUnit: UnitResponse;
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

export interface ProductVariantResponse {
  id: number;
  description: string;
  product: ProductRepsonse;
}

export interface LocationResponse {
  id: number;
  code: string;
  name: string;
  locationType: LocationType;
  locationStatus: LocationStatus;
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
  location: LocationResponse;
  productVariant: ProductVariantResponse;
  unit: UnitResponse;
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
}

export interface ImportSheetDetailCreateReq {
  productVariantId: number;
  expectedQuantity: number;
  unitId: number;
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
  actualQuantity?: number;
  reason?: string;
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
  details?: ImportSheetDetailCreateReq[];
}

export interface ImportSheetUpdateReq {
  status?: SheetStatus;
  warehouseId?: number;
  sourceWarehouseId?: number;
  supplierId?: number;
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
  details?: ExportSheetDetailUpdateReq[];
}

export interface ExportSheetCreateReq {
  type: ExportSheetType;
  status: SheetStatus;
  warehouseId: number;
  sourceWarehouseId?: number;
  destinationWarehouseId?: number;
  supplierId?: number;
  customerId?: number;
  details?: ImportSheetDetailCreateReq[];
}

export interface ExportedItemResponse {
  id: number;
  itemId: number;
  barcode: string;
  serialNumber: string;
}
