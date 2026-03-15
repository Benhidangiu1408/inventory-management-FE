"use server";

import {
  CreateInventoryCheckRequest,
  SubmitCheckResultRequest,
} from "@/interfaces/inventoryManagementType";
import { inventoryCheckService } from "@/services/InventoryManagementService";

export async function inventoryCheckSubmitAction(
  data: SubmitCheckResultRequest,
) {
  await inventoryCheckService.submit(data);
}
export async function inventoryCheckStartAction(id: number) {
  await inventoryCheckService.start(id);
}
export async function inventoryCheckCompleteAction(id: number) {
  await inventoryCheckService.complete(id);
}
export async function inventoryCheckApproveAction(id: number, userId: number) {
  await inventoryCheckService.approve(id, userId);
}
export async function inventoryCheckRejectAction(id: number, userId: number) {
  await inventoryCheckService.reject(id, userId);
}
export async function inventoryCheckCreateAction(
  data: CreateInventoryCheckRequest,
) {
  await inventoryCheckService.create(data);
}
