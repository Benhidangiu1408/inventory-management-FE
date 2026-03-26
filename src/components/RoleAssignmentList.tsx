"use client";

import ComponentCard from "@/default_components/common/ComponentCard";
import Checkbox from "@/default_components/form/input/Checkbox";
import Label from "@/default_components/form/Label";
import Select, { Option } from "@/default_components/form/Select";
import Button from "@/default_components/ui/button/Button";
import { Permission, Role } from "@/interfaces/userManagementType";
import { ArrowRightLeft } from "lucide-react";
import { useMemo, useState } from "react";

export function RoleAssignmentList({
  initialRolesData,
  initialPermissionsData,
}: {
  initialRolesData: Role[];
  initialPermissionsData: Permission[];
}) {
  const [rolesData, setRolesData] = useState<Role[]>(initialRolesData);
  // Role Select Options
  const selectOpts = useMemo<Option[]>(() => {
    return rolesData.map((role) => ({
      value: String(role.id),
      label: role.name,
    }));
  }, [rolesData]);
  // Current Role
  const [selectedRoleId, setSelectedRoleId] = useState<number>(
    rolesData[0]?.id || 0,
  );
  // Initial permissions data
  const grantedPerms = useMemo(() => {
    const role = rolesData.find((r) => r.id === selectedRoleId);
    return role?.permissions.map((p) => p.name) || [];
  }, [rolesData, selectedRoleId]);
  const ungrantedPerms = useMemo(() => {
    return initialPermissionsData
      .filter((perm) => !grantedPerms.includes(perm.name))
      .map((p) => p.name);
  }, [initialPermissionsData, grantedPerms]);
  // Selected permissions data
  const [selectedUngranted, setSelectedUngranted] = useState<string[]>([]);
  const [selectedGranted, setSelectedGranted] = useState<string[]>([]);

  // Select change
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoleId(Number(e.target.value));
    setSelectedUngranted([]);
    setSelectedGranted([]);
  };
  const hasSelection =
    selectedGranted.length > 0 || selectedUngranted.length > 0;
  // Checkbox change
  const toggleSelection = (
    permissionName: string,
    type: "ungranted" | "granted",
  ) => {
    if (type === "ungranted") {
      setSelectedUngranted((prevSelected) =>
        prevSelected.includes(permissionName)
          ? prevSelected.filter((item) => item !== permissionName)
          : [...prevSelected, permissionName],
      );
    } else {
      setSelectedGranted((prevSelected) =>
        prevSelected.includes(permissionName)
          ? prevSelected.filter((item) => item !== permissionName)
          : [...prevSelected, permissionName],
      );
    }
  };

  // transfer button
  // const handleTransfer = () => {
  //   if (!hasSelection) return;

  //   if (selectedGranted.length > 0) {
  //     const grantedIds = selectedGranted
  //       .map((name) => fullPermission.find((p) => p.name === name)?.id)
  //       .filter((id): id is number => id !== undefined);
  //     console.log(grantedIds);
  //     roleAssignment.removeRolePermissions(selectedRole, grantedIds);
  //   }

  //   if (selectedUngranted.length > 0) {
  //     const ungrantedIds = selectedUngranted
  //       .map((name) => fullPermission.find((p) => p.name === name)?.id)
  //       .filter((id): id is number => id !== undefined);
  //     roleAssignment.updateRolePermissions(selectedRole, ungrantedIds);
  //   }

  //   setSelectedUngranted([]);
  //   setSelectedGranted([]);
  // };

  return (
    <div className="flex flex-col">
      <div className="flex p-3">
        <Select
          options={selectOpts}
          placeholder="Select a role"
          onChange={handleRoleChange}
          disabled={rolesData.length === 0}
        />
      </div>
      <div className="flex p-6">
        <ComponentCard title="Ungranted" className="h-full w-full">
          <div className="m-5 max-h-96 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-2">
              {ungrantedPerms.map((val) => (
                <Label
                  key={val}
                  className={`rounded-xl border p-4 text-gray-700 hover:bg-blue-50 dark:text-gray-400 dark:hover:bg-white/[0.07] ${
                    selectedUngranted.includes(val)
                      ? "border-blue-500 bg-blue-50 dark:border-blue-900 dark:bg-white/[0.07]"
                      : ""
                  }`}
                >
                  <Checkbox
                    labelSize="text-base"
                    checked={selectedUngranted.includes(val)}
                    onChange={() => toggleSelection(val, "ungranted")}
                    label={val}
                  />
                </Label>
              ))}
            </div>
          </div>
        </ComponentCard>
        <Button
          type="button"
          variant="outline"
          className={`m-6 !rounded-full`}
          // onClick={handleTransfer}
          disabled={!hasSelection}
        >
          <ArrowRightLeft size={30} />
        </Button>
        <ComponentCard title="Granted" className="h-full w-full">
          <div className="m-5 max-h-96 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-2">
              {grantedPerms.map((val) => (
                <Label
                  key={val}
                  className={`rounded-xl border p-4 text-gray-700 hover:bg-blue-50 dark:text-gray-400 dark:hover:bg-white/[0.07] ${
                    selectedGranted.includes(val)
                      ? "border-blue-500 bg-blue-50 dark:border-blue-900 dark:bg-white/[0.07]"
                      : ""
                  }`}
                >
                  <Checkbox
                    labelSize="text-base"
                    checked={selectedGranted.includes(val)}
                    onChange={() => toggleSelection(val, "granted")}
                    label={val}
                  />
                </Label>
              ))}
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
