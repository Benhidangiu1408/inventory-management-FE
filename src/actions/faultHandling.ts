"use server";

import type {
  AssignFaultOrderUsersRequest,
  CreateFaultBatchProcessOrderRequest,
  CreateFaultBatchRequest,
  CreateFaultOrderRequest,
  CreateFaultTaskRequest,
  FaultOrderStatus,
  UpdateFaultBatchHandlingStatusRequest,
  UpdateTasksStatusRequest,
  AnalyzeFaultBatchProcessOrderRequest,
  FaultQuestion,
  ProcessOrderDecisionRequest,
} from "@/interfaces/inventoryManagementType";
import { faultOrderService } from "@/services/InventoryManagementService";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error happened!";
}

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

// checked

export async function updateFaultOrderStatusAction(
  faultOrderId: number,
  status: FaultOrderStatus,
) {
  return await faultOrderService.updateFaultOrderStatus(faultOrderId, status);
}
export async function createFaultBatchAction(data: CreateFaultBatchRequest) {
  try {
    const response = await faultOrderService.createFaultBatch(data);
    return { data: response, error: null };
  } catch (error: unknown) {
    return { data: null, error: getErrorMessage(error) };
  }
}

export async function createFaultOrderAction(data: CreateFaultOrderRequest) {
  try {
    const response = await faultOrderService.createFaultOrder(data);
    return { data: response, error: null };
  } catch (error: unknown) {
    return { data: null, error: getErrorMessage(error) };
  }
}

export async function updateFaultOrderPriorityAction(
  faultOrderId: number,
  priorityId?: number | null,
) {
  try {
    const response = await faultOrderService.updateFaultOrderPriority(
      faultOrderId,
      priorityId,
    );
    return { data: response, error: null };
  } catch (error: unknown) {
    return { data: null, error: getErrorMessage(error) };
  }
}

export async function getFaultOrderAction(faultOrderId: number) {
  try {
    const response = await faultOrderService.getFaultOrder(faultOrderId);
    return { data: response, error: null };
  } catch (error: unknown) {
    return { data: null, error: getErrorMessage(error) };
  }
}

export async function getFaultBatchProcessOrderWithDetailsAction(
  faultBatchProcessOrderId: number,
) {
  try {
    const response =
      await faultOrderService.getFaultBatchProcessOrderWithDetails(
        faultBatchProcessOrderId,
      );
    return { data: response, error: null };
  } catch (error: unknown) {
    return { data: null, error: getErrorMessage(error) };
  }
}

export async function getFaultBatchProcessOrdersByFaultOrderIdAction(
  faultOrderId: number,
) {
  try {
    const response =
      await faultOrderService.getFaultBatchProcessOrdersByFaultOrderId(
        faultOrderId,
      );
    return { data: response, error: null };
  } catch (error: unknown) {
    return { data: null, error: getErrorMessage(error) };
  }
}

export async function createTasksForProcessOrderAction(
  faultBatchProcessOrderId: number,
  tasks: CreateFaultTaskRequest[],
) {
  try {
    const response = await faultOrderService.createTasksForProcessOrder(
      faultBatchProcessOrderId,
      tasks,
    );
    return { data: response, error: null };
  } catch (error: unknown) {
    return { data: null, error: getErrorMessage(error) };
  }
}

// export async function addQuestionsToProcessOrderAction(
//   faultBatchProcessOrderId: number,
//   questions: CreateFaultQuestionRequest[],
// ) {
//   try {
//     const response = await faultOrderService.addQuestionsToProcessOrder(
//       faultBatchProcessOrderId,
//       questions,
//     );
//     return { data: response, error: null };
//   } catch (error: unknown) {
//     return { data: null, error: getErrorMessage(error) };
//   }
// }

export async function updateTasksStatusAction(data: UpdateTasksStatusRequest) {
  try {
    const response = await faultOrderService.updateTasksStatus(data);
    return { data: response, error: null };
  } catch (error: unknown) {
    return { data: null, error: getErrorMessage(error) };
  }
}

export async function markFaultBatchesFixedAction(
  data: UpdateFaultBatchHandlingStatusRequest[],
) {
  try {
    const response = await faultOrderService.markFaultBatchesFixed(data);
    return { data: response, error: null };
  } catch (error: unknown) {
    return { data: null, error: getErrorMessage(error) };
  }
}

export async function assignTaskToFaultBatchAction(
  faultBatchId: number,
  taskId?: number | null,
) {
  try {
    const response = await faultOrderService.assignTaskToFaultBatch(
      faultBatchId,
      taskId,
    );
    return { data: response, error: null };
  } catch (error: unknown) {
    return { data: null, error: getErrorMessage(error) };
  }
}
