"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Filter from "@/components/TA_List/Filter";
import {
  faMagnifyingGlass,
  faRightLeft,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const coreAdminPermissions = [
  "Create user",
  "Edit user",
  "Deactivate user",
  "Assign role",
  "Manage roles & permissions",
  "Configure system settings",
  "View audit logs",
  "Export activity report",
];

const warehouseAdminPermissions = [
  "Create warehouse",
  "Edit warehouse details",
  "Delete warehouse",
  "Add product",
  "Update product information",
  "Adjust stock quantity",
  "Perform inventory check",
  "Approve stock adjustments",
  "Create export order",
  "Approve shipment",
];

export default function RoleManagementPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Role Management" />
      <div className="rounded-2xl border border-[#E4E7EC] bg-white">
        <Filter type="category" />
        {/* Role Assignment */}
        <div className="flex p-6">
          <div className="flex w-full flex-col">
            <div className="relative">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute top-1/2 left-4 -translate-y-1/2"
              />
              <Input
                type="text"
                placeholder="Search or type command..."
                className="pl-12"
              />
            </div>
            <div className="m-3 text-center text-2xl font-bold">
              UNASSIGNED PERMISSION
            </div>
            <div className="m-5 flex flex-col gap-2">
              {coreAdminPermissions.map((val, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 rounded-xl p-4 hover:bg-blue-300"
                >
                  <div className="block font-medium text-gray-700 dark:text-gray-400">
                    {val}
                  </div>
                  <FontAwesomeIcon icon={faPlus} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faRightLeft} />
          </div>
          <div className="flex w-full flex-col">
            <div className="relative">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute top-1/2 left-4 -translate-y-1/2"
              />
              <Input
                type="text"
                placeholder="Search or type command..."
                className="pl-12"
              />
            </div>
            <div className="m-3 text-center text-2xl font-bold">
              ASSIGNED PERMISSION
            </div>
            <div className="m-5 flex flex-col gap-2">
              {warehouseAdminPermissions.map((val, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 rounded-xl p-4 hover:bg-blue-300"
                >
                  <div className="block font-medium text-gray-700 dark:text-gray-400">
                    {val}
                  </div>
                  <FontAwesomeIcon icon={faMinus} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
