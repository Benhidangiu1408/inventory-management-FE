"use client";

import { updateRolePermissionsAction } from "@/actions/user";
import ComponentCard from "@/default_components/common/ComponentCard";
import Checkbox from "@/default_components/form/input/Checkbox";
import Label from "@/default_components/form/Label";
import Select, { Option } from "@/default_components/form/Select";
import Button from "@/default_components/ui/button/Button";
import { Permission, Role } from "@/interfaces/userManagementType";
import { ArrowRightLeft } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import ModalRoleForm from "./form/ModalRoleForm";

export function RoleAssignmentList({
  initialRolesData,
  initialPermissionsData,
}: {
  initialRolesData: Role[];
  initialPermissionsData: Permission[];
}) {
  const [loading, setLoading] = useState(false);
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
  const handleTransfer = async () => {
    try {
      setLoading(true);
      // Find the current role
      const currentRole = rolesData.find((r) => r.id === selectedRoleId);
      if (!currentRole) return;
      // Find the correct perms id list
      let updatedPermissions = [...currentRole.permissions];
      updatedPermissions = updatedPermissions.filter(
        (p) => !selectedGranted.includes(p.name),
      );
      const permissionsToAdd = initialPermissionsData.filter((p) =>
        selectedUngranted.includes(p.name),
      );
      updatedPermissions = [...updatedPermissions, ...permissionsToAdd];
      const permissionIds = updatedPermissions.map((p) => p.id);

      const updatedRole = await updateRolePermissionsAction(
        selectedRoleId,
        permissionIds,
      );

      setRolesData((prevRoles) =>
        prevRoles.map((role) =>
          role.id === updatedRole.id ? updatedRole : role,
        ),
      );
      toast.success("Permissions updated successfully!");
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
    }

    setSelectedUngranted([]);
    setSelectedGranted([]);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between border-b-1 p-6">
        <div className="w-3/5">
          <Select
            options={selectOpts}
            placeholder="Select a role"
            onChange={handleRoleChange}
            disabled={rolesData.length === 0}
          />
        </div>
        <ModalRoleForm
          onRoleCreated={(newRole: Role) => {
            setRolesData((prevRoles) => [...prevRoles, newRole]);
          }}
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
          onClick={handleTransfer}
          disabled={!hasSelection || loading}
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
