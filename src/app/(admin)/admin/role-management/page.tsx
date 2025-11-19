"use client";
import ComponentCard from "@/default_components/common/ComponentCard";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import Filter from "@/components/Filter";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";

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
  const [ungrantedPermissions, setUngrantedPermissions] =
    useState(coreAdminPermissions);
  const [grantedPermissions, setGrantedPermissions] = useState(
    warehouseAdminPermissions,
  );
  const [selectedUngranted, setSelectedUngranted] = useState<string[]>([]);
  const [selectedGranted, setSelectedGranted] = useState<string[]>([]);

  const hasSelection = useMemo(
    () => selectedUngranted.length > 0 || selectedGranted.length > 0,
    [selectedGranted.length, selectedUngranted.length],
  );

  const toggleSelection = (
    permission: string,
    type: "ungranted" | "granted",
  ) => {
    const setter =
      type === "ungranted" ? setSelectedUngranted : setSelectedGranted;

    setter((prev) =>
      prev.includes(permission)
        ? prev.filter((item) => item !== permission)
        : [...prev, permission],
    );
  };

  const handleTransfer = () => {
    if (!hasSelection) return;

    setGrantedPermissions((prev) => {
      const remainingGranted = prev.filter(
        (permission) => !selectedGranted.includes(permission),
      );
      return [...remainingGranted, ...selectedUngranted];
    });

    setUngrantedPermissions((prev) => {
      const remainingUngranted = prev.filter(
        (permission) => !selectedUngranted.includes(permission),
      );
      return [...remainingUngranted, ...selectedGranted];
    });

    setSelectedUngranted([]);
    setSelectedGranted([]);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Role Management" />
      <div className="rounded-2xl border border-[#E4E7EC] bg-white">
        <Filter type="role" />
        {/* Role Assignment */}
        <div className="flex p-6">
          <div className="flex w-full flex-col">
            <ComponentCard title="Ungranted" className="h-full">
              {/* <div className="relative">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute top-1/2 left-4 -translate-y-1/2"
                />
                <Input
                  type="text"
                  placeholder="Search or type command..."
                  className="pl-12"
                />
              </div> */}
              <div className="relative m-5 max-h-96 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-2">
                  {ungrantedPermissions.map((val) => (
                    <label
                      key={val}
                      className={`flex cursor-pointer items-center justify-start gap-3 rounded-xl p-4 transition hover:bg-blue-50 ${
                        selectedUngranted.includes(val)
                          ? "border border-blue-500 bg-blue-50"
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedUngranted.includes(val)}
                        onChange={() => toggleSelection(val, "ungranted")}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="block font-medium text-gray-700 dark:text-gray-400">
                        {val}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </ComponentCard>
          </div>
          <button
            type="button"
            aria-label="Move selected permissions"
            className={`m-6 flex items-center rounded-full border border-gray-200 bg-white p-4 shadow-sm transition hover:scale-105 ${
              hasSelection ? "text-blue-600" : "text-gray-300"
            }`}
            onClick={handleTransfer}
            disabled={!hasSelection}
          >
            <FontAwesomeIcon icon={faRightLeft} size="lg" />
          </button>
          <div className="flex w-full flex-col">
            <ComponentCard title="Granted" className="h-full">
              <div className="relative m-5 max-h-96 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-2">
                  {grantedPermissions.map((val) => (
                    <label
                      key={val}
                      className={`flex cursor-pointer items-center justify-start gap-3 rounded-xl p-4 transition hover:bg-blue-50 ${
                        selectedGranted.includes(val)
                          ? "border border-blue-500 bg-blue-50"
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedGranted.includes(val)}
                        onChange={() => toggleSelection(val, "granted")}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="block font-medium text-gray-700 dark:text-gray-400">
                        {val}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </ComponentCard>
          </div>
        </div>
      </div>
    </div>
  );
}
