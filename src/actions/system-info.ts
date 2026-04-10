"use server";

import {
  AttributeRequest,
  CategoryRequest,
  LocationBulkCreate,
  LocationType,
  NewWarehouseRequest,
  ProductAddConversionRequest,
  ProductCreateRequest,
  ProductUpdateRequest,
  UnitRequest,
  VariantCreateRequest,
  VariantUpdateRequest,
} from "@/interfaces/warehouseManagementType";
import {
  attributesService,
  categoryService,
  locationService,
  productService,
  unitService,
  warehouseService,
} from "@/services/WarehouseManagementService";

export async function categoryUpdateAction(id: number, data: CategoryRequest) {
  await categoryService.update(id, data);
}
export async function categoryCreateAction(data: CategoryRequest) {
  await categoryService.create(data);
}
export async function categoryDeleteAction(id: number) {
  await categoryService.delete(id);
}
export async function warehouseCreateAction(data: NewWarehouseRequest) {
  await warehouseService.create(data);
}
export async function warehouseUpdateAction(
  id: number,
  data: NewWarehouseRequest,
) {
  await warehouseService.update(id, data);
}
export async function warehouseDeleteAction(id: number) {
  await warehouseService.delete(id);
}
export async function locationGetByTypeAction(
  warehouseId: number,
  type: LocationType,
) {
  return await locationService.getByType(warehouseId, type);
}
export async function locationGetRootAction(id: number) {
  return await locationService.getRoot(id);
}
export async function locationGetChildrenAction(
  warehouseId: number,
  parentId: number,
) {
  return await locationService.getChildren(warehouseId, parentId);
}
export async function locationCreateAction(data: LocationBulkCreate) {
  await locationService.create(data);
}
export async function locationDeleteAction(id: number) {
  await locationService.delete(id);
}
export async function UnitCreateAction(data: UnitRequest) {
  await unitService.create(data);
}
export async function UnitUpdateAction(id: number, data: UnitRequest) {
  await unitService.update(id, data);
}
export async function AttrCreateAction(data: AttributeRequest) {
  await attributesService.create(data);
}
export async function AttrUpdateAction(id: number, data: AttributeRequest) {
  await attributesService.update(id, data);
}
export async function ProductCreateAction(data: ProductCreateRequest) {
  await productService.create(data);
}
export async function ProductUpdateAction(
  id: number,
  data: ProductUpdateRequest,
) {
  await productService.update(id, data);
}
export async function ConversionCreateAction(
  id: number,
  data: ProductAddConversionRequest,
) {
  await productService.createConversion(id, data);
}
export async function ToggleConversionAction(id: number) {
  await productService.toggleConversion(id);
}
export async function ProductCreateVariantAction(data: VariantCreateRequest) {
  await productService.createVariant(data);
}
export async function ProductDeleteAction(id: number) {
  await productService.deleteProduct(id);
}
export async function VariantDeleteAction(id: number) {
  await productService.deleteVariant(id);
}
export async function VariantUpdateAction(
  id: number,
  data: VariantUpdateRequest,
) {
  await productService.updateVariant(id, data);
}
