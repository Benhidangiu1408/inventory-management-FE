"use server";

import type { InboundOutboundMonthlyRequest } from "@/interfaces/inventoryManagementType";
import { inventoryDashboardService } from "@/services/InventoryManagementService";

export async function getOverviewSummaryAction() {
  return await inventoryDashboardService.getOverviewSummary();
}

export async function getInboundOutboundMonthlySummaryAction(
  request?: InboundOutboundMonthlyRequest | null,
) {
  return await inventoryDashboardService.getInboundOutboundMonthlySummary(
    request,
  );
}

export async function getInboundOutboundTotalSummaryAction(
  request?: InboundOutboundMonthlyRequest | null,
) {
  return await inventoryDashboardService.getInboundOutboundTotalSummary(request);
}
