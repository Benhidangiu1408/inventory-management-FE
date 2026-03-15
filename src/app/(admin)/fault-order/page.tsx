"use client";
import { getFaultOrdersByWarehouseAction } from "@/actions/faultHandling";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import CustomizableTable from "@/components/table/CustomizableTable";
import Filter from "@/components/Filter";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  orderColumns,
  type OrderRow,
} from "@/components/table/CustomizableTableHeader";
import type { FaultOrderSummary } from "@/interfaces/inventoryManagementType";
import toast from "react-hot-toast";

function formatEnumLabel(value?: string | null) {
  if (!value) {
    return undefined;
  }

  return value
    .toLowerCase()
    .split("_")
    .map((part, index) =>
      index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part,
    )
    .join(" ");
}

function formatCreatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN").format(date);
}

function mapFaultOrderToRow(order: FaultOrderSummary): OrderRow {
  return {
    id: order.id,
    orderId: order.code,
    date: formatCreatedAt(order.createdAt),
    warehouse: "-",
    handle: (formatEnumLabel(order.status) as OrderRow["handle"]) ?? "Pending",
    actions: ["edit", "check"],
  };
}

export default function FaultOrderPage() {
  const [faultOrders, setFaultOrders] = useState<FaultOrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) {
      return;
    }

    hasFetchedRef.current = true;

    const fetchFaultOrders = async () => {
      setIsLoading(true);

      const response = await getFaultOrdersByWarehouseAction();

      if (response.error) {
        toast.error(response.error);
        setFaultOrders([]);
        setIsLoading(false);
        return;
      }

      setFaultOrders(response.data ?? []);
      setIsLoading(false);
    };

    void fetchFaultOrders();
  }, []);

  const tableData = useMemo(
    () => faultOrders.map(mapFaultOrderToRow),
    [faultOrders],
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Fault Order List" />
      <div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <Filter type="fault order" />
          <div className="p-6">
            {isLoading && (
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Loading fault orders...
              </p>
            )}
            <CustomizableTable
              headers={orderColumns}
              data={tableData}
              getRowId={({ data }) => (data?.id != null ? String(data.id) : "")}
            ></CustomizableTable>
          </div>
        </div>
      </div>
    </div>
  );
}
