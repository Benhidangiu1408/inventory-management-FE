import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import ComponentCard from "@/default_components/common/ComponentCard";
import Badge from "@/default_components/ui/badge/Badge";
import Button from "@/default_components/ui/button/Button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPen,
  faTrash,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";

type NotificationRow = {
  id: string;
  title: string;
  message: string;
  channel: string;
  frequency: string;
  status: "Active" | "Paused" | "Draft";
  createdAt: string;
  updatedAt: string;
};

const MOCK_DATA: NotificationRow[] = [
  {
    id: "ntf-1001",
    title: "Low Stock Alert",
    message: "Product XYZ is below threshold.",
    channel: "Email",
    frequency: "Immediate",
    status: "Active",
    createdAt: "2025-01-01 09:00",
    updatedAt: "2025-01-02 10:30",
  },
  {
    id: "ntf-1002",
    title: "Daily Summary",
    message: "Inventory summary for the day.",
    channel: "Email, Push",
    frequency: "Daily",
    status: "Paused",
    createdAt: "2025-01-05 08:00",
    updatedAt: "2025-01-06 08:00",
  },
  {
    id: "ntf-1003",
    title: "Inbound Shipment",
    message: "Shipment ABC arriving soon.",
    channel: "SMS",
    frequency: "Immediate",
    status: "Draft",
    createdAt: "2025-01-10 14:20",
    updatedAt: "2025-01-10 14:20",
  },
];

export default function NotificationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const notification = MOCK_DATA.find((n) => n.id === params.id);

  return (
    <div>
      <PageBreadcrumb pageTitle="Notification Details" />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/notification">
            <Button
              size="sm"
              variant="outline"
              startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
            >
              Back
            </Button>
          </Link>
          <h2 className="text-theme-lg font-semibold">
            {notification?.title ?? "Notification"}
          </h2>
        </div>
        {notification && (
          <div className="flex items-center gap-3">
            <Link href={`/notification/edit/${notification.id}`}>
              <Button
                size="sm"
                variant="primary"
                startIcon={<FontAwesomeIcon icon={faPen} />}
              >
                Edit
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              startIcon={<FontAwesomeIcon icon={faToggleOn} />}
            >
              {notification.status === "Paused" ? "Activate" : "Pause"}
            </Button>
            <Button
              size="sm"
              variant="danger"
              startIcon={<FontAwesomeIcon icon={faTrash} />}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      <ComponentCard title="Summary">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-theme-xs text-gray-500">ID</p>
            <p className="text-theme-sm text-gray-800 dark:text-white/90">
              {notification?.id ?? params.id}
            </p>
          </div>
          <div>
            <p className="text-theme-xs text-gray-500">Status</p>
            {notification ? (
              <Badge
                size="sm"
                color={
                  notification.status === "Active"
                    ? "success"
                    : notification.status === "Paused"
                      ? "warning"
                      : "info"
                }
              >
                {notification.status}
              </Badge>
            ) : (
              <span className="text-theme-sm text-gray-500">-</span>
            )}
          </div>
          <div className="md:col-span-2">
            <p className="text-theme-xs text-gray-500">Message</p>
            <p className="text-theme-sm text-gray-800 dark:text-white/90">
              {notification?.message ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-theme-xs text-gray-500">Channel</p>
            <p className="text-theme-sm text-gray-800 dark:text-white/90">
              {notification?.channel ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-theme-xs text-gray-500">Frequency</p>
            <p className="text-theme-sm text-gray-800 dark:text-white/90">
              {notification?.frequency ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-theme-xs text-gray-500">Created At</p>
            <p className="text-theme-sm text-gray-800 dark:text-white/90">
              {notification?.createdAt ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-theme-xs text-gray-500">Updated At</p>
            <p className="text-theme-sm text-gray-800 dark:text-white/90">
              {notification?.updatedAt ?? "-"}
            </p>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
