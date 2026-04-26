"use server";

import type {
  AssignFaultOrderUsersRequest,
  CreateFaultBatchProcessOrderRequest,
  CreateFaultTaskRequest,
  UpdateFaultBatchHandlingStatusRequest,
  AnalyzeFaultBatchProcessOrderRequest,
  FaultQuestion,
  ProcessOrderDecisionRequest,
  UpdateTaskStatusRequest,
} from "@/interfaces/inventoryManagementType";
import { faultOrderService } from "@/services/InventoryManagementService";

export async function assignAnalyzerAndAssigneeAction(
  faultOrderId: number,
  data: AssignFaultOrderUsersRequest,
) {
  return await faultOrderService.assignAnalyzerAndAssignee(faultOrderId, data);
}

export async function createFaultBatchProcessOrderAction(
  data: CreateFaultBatchProcessOrderRequest,
) {
  return await faultOrderService.createFaultBatchProcessOrder(data);
}

export async function analyzeFaultBatchProcessOrderAction(
  faultBatchProcessOrderId: number,
  data: AnalyzeFaultBatchProcessOrderRequest,
) {
  return await faultOrderService.analyzeFaultBatchProcessOrder(
    faultBatchProcessOrderId,
    data,
  );
}

export async function updateFaultBatchProcessOrderQuestionAction(
  faultBatchProcessOrderId: number,
  data: FaultQuestion[],
) {
  return await faultOrderService.updateFaultBatchProcessOrderQuestion(
    faultBatchProcessOrderId,
    data,
  );
}

export async function updateProcessOrderDecisionAction(
  faultBatchProcessOrderId: number,
  data: ProcessOrderDecisionRequest,
) {
  return await faultOrderService.updateProcessOrderDecision(
    faultBatchProcessOrderId,
    data,
  );
}

export async function createTaskForProcessOrderAction(
  faultBatchProcessOrderId: number,
  task: CreateFaultTaskRequest,
) {
  return await faultOrderService.createTaskForProcessOrder(
    faultBatchProcessOrderId,
    task,
  );
}

export async function updateTaskStatusAction(data: UpdateTaskStatusRequest) {
  return await faultOrderService.updateTaskStatus(data);
}

export async function markFaultBatchesFixedAction(
  data: UpdateFaultBatchHandlingStatusRequest,
) {
  return await faultOrderService.markFaultBatchesFixed(data);
}

export async function assignTaskToFaultBatchAction(
  faultBatchId: number,
  taskId?: number,
) {
  return await faultOrderService.assignTaskToFaultBatch(faultBatchId, taskId);
}
