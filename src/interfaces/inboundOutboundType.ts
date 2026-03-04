import { SheetStatus } from "@/interfaces/inventoryManagementType";

export enum QCSheetDetailStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  PASSED = "PASSED",
  FAILED = "FAILED",
  RECHECK_REQUIRED = "RECHECK_REQUIRED",
  REJECTED = "REJECTED",
}

export enum ImportSheetType {
  INTERNAL = "INTERNAL",
  FACTORY = "FACTORY",
  SUPPLIER = "SUPPLIER",
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

export interface ProductRepsonse {
  id: number;
  name: string;
  code: string;
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
}

export interface BatchResponse {
  id: number;
  code: string;
  initialQuantity: number;
  location: LocationResponse;
  productVariant: ProductVariantResponse;
}

export interface ImportSheetDetailResponse {
  id: number;
  description: string;
  productVariant: ProductVariantResponse;
  batch?: BatchResponse;
  expectedQuantity?: number;
  actualQuantity?: number;
  reason?: string;
}

export interface ImportSheetDetailCreateReq {
  productVariantId: number;
  expectedQuantity: number;
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
}

export interface QCSheetResponse {
  id: number;
  details: QCSheetDetailResponse[];
}
