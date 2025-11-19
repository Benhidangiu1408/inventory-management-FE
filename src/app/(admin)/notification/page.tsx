"use client";

import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import ComponentCard from "@/default_components/common/ComponentCard";
import Button from "@/default_components/ui/button/Button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";
import CustomizableTable, {
  Column,
} from "@/components/table/CustomizableTable";

type NotificationRow = {
  id: string;
  title: string;
  message: string;
  channel: string;
  frequency: string;
  status: "Active" | "Paused" | "Draft";
  actions?: ReactNode;
};

export default function NotificationPage() {
  const columns: Column<NotificationRow>[] = [
    { key: "title", label: "Title" },
    { key: "message", label: "Message" },
    { key: "channel", label: "Channel" },
    { key: "frequency", label: "Frequency" },
    { key: "status", label: "Status" },
    {
      key: "actions",
      label: "Actions",
      render: (
        _: NotificationRow[keyof NotificationRow],
        row: NotificationRow,
      ) => (
        <div className="flex items-center gap-3">
          <Link href={`/notification/details/${row.id}`}>
            <FontAwesomeIcon
              icon={faEye}
              className="cursor-pointer hover:text-blue-500"
            />
          </Link>
          <Link href={`/notification/edit/${row.id}`}>
            <FontAwesomeIcon
              icon={faPen}
              className="cursor-pointer hover:text-blue-500"
            />
          </Link>
        </div>
      ),
    },
  ];

  const data: NotificationRow[] = [
    {
      id: "ntf-1001",
      title: "Low Stock Alert",
      message: "Product XYZ is below threshold.",
      channel: "Email",
      frequency: "Immediate",
      status: "Active",
    },
    {
      id: "ntf-1002",
      title: "Daily Summary",
      message: "Inventory summary for the day.",
      channel: "Email, Push",
      frequency: "Daily",
      status: "Paused",
    },
    {
      id: "ntf-1003",
      title: "Inbound Shipment",
      message: "Shipment ABC arriving soon.",
      channel: "SMS",
      frequency: "Immediate",
      status: "Draft",
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Notifications" />

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-theme-lg font-semibold">Notification List</h2>
        <Link href="/notification/new">
          <Button
            size="sm"
            variant="primary"
            startIcon={<FontAwesomeIcon icon={faPlus} />}
          >
            New Notification
          </Button>
        </Link>
      </div>

      <ComponentCard title="All Notifications">
        <CustomizableTable<NotificationRow> headers={columns} data={data} />
      </ComponentCard>
    </div>
  );
}
