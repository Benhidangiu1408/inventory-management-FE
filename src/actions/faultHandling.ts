"use server";

import type {
	AssignFaultOrderUsersRequest,
	CreateFaultBatchProcessOrderRequest,
	CreateFaultBatchRequest,
	CreateFaultOrderRequest,
	CreateFaultQuestionRequest,
	CreateFaultTaskRequest,
	FaultOrderStatus,
	UpdateFaultBatchProcessOrderRequest,
	UpdateFaultBatchHandlingStatusRequest,
	UpdateTasksStatusRequest,
} from "@/interfaces/inventoryManagementType";
import { faultOrderService } from "@/services/InventoryManagementService";

function getErrorMessage(error: unknown) {
	if (error instanceof Error) {
		return error.message;
	}

	return "An unexpected error happened!";
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

export async function assignAnalyzerAndAssigneeAction(
	faultOrderId: number,
	data: AssignFaultOrderUsersRequest,
) {
	try {
		const response = await faultOrderService.assignAnalyzerAndAssignee(
			faultOrderId,
			data,
		);
		return { data: response, error: null };
	} catch (error: unknown) {
		return { data: null, error: getErrorMessage(error) };
	}
}

export async function updateFaultOrderStatusAction(
	faultOrderId: number,
	status: FaultOrderStatus,
) {
	try {
		const response = await faultOrderService.updateFaultOrderStatus(
			faultOrderId,
			status,
		);
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

export async function getFaultOrdersByWarehouseAction(
	warehouseId?: number | null,
) {
	try {
		const response = await faultOrderService.getFaultOrdersByWarehouse(
			warehouseId,
		);
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
		const response = await faultOrderService.getFaultBatchProcessOrdersByFaultOrderId(
			faultOrderId,
		);
		return { data: response, error: null };
	} catch (error: unknown) {
		return { data: null, error: getErrorMessage(error) };
	}
}

export async function createFaultBatchProcessOrderAction(
	data: CreateFaultBatchProcessOrderRequest,
) {
	try {
		const response = await faultOrderService.createFaultBatchProcessOrder(data);
		return { data: response, error: null };
	} catch (error: unknown) {
		return { data: null, error: getErrorMessage(error) };
	}
}

export async function updateFaultBatchProcessOrderAction(
	faultBatchProcessOrderId: number,
	data: UpdateFaultBatchProcessOrderRequest,
) {
	try {
		const response = await faultOrderService.updateFaultBatchProcessOrder(
			faultBatchProcessOrderId,
			data,
		);
		return { data: response, error: null };
	} catch (error: unknown) {
		return { data: null, error: getErrorMessage(error) };
	}
}

export async function updateProcessOrderApprovalAction(
	faultBatchProcessOrderId: number,
	approverUserId: number | null,
) {
	try {
		const response = await faultOrderService.updateProcessOrderApproval(
			faultBatchProcessOrderId,
			approverUserId,
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

export async function addQuestionsToProcessOrderAction(
	faultBatchProcessOrderId: number,
	questions: CreateFaultQuestionRequest[],
) {
	try {
		const response = await faultOrderService.addQuestionsToProcessOrder(
			faultBatchProcessOrderId,
			questions,
		);
		return { data: response, error: null };
	} catch (error: unknown) {
		return { data: null, error: getErrorMessage(error) };
	}
}

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
		const response = await faultOrderService.assignTaskToFaultBatch(faultBatchId, taskId);
		return { data: response, error: null };
	} catch (error: unknown) {
		return { data: null, error: getErrorMessage(error) };
	}
}
