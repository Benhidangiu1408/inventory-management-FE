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
import GeneralInfoSection from "./GeneralInformation";
import Input from "@/default_components/form/input/InputField";

export function RoleAssignmentList({
  initialRolesData,
  initialPermissionsData,
}: {
  initialRolesData: Role[];
  initialPermissionsData: Permission[];
}) {
  const [loading, setLoading] = useState(false);
  const [rolesData, setRolesData] = useState<Role[]>(initialRolesData);
  // --- SEARCH STATES ---
  const [ungrantedSearch, setUngrantedSearch] = useState("");
  const [grantedSearch, setGrantedSearch] = useState("");
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
    return role?.permissions || [];
  }, [rolesData, selectedRoleId]);
  const ungrantedPerms = useMemo(() => {
    const grantedNames = grantedPerms.map((p) => p.name);
    return initialPermissionsData.filter(
      (perm) => !grantedNames.includes(perm.name),
    );
  }, [initialPermissionsData, grantedPerms]);
  // --- FILTERED LISTS ---
  const filteredUngrantedPerms = useMemo(() => {
    return ungrantedPerms.filter((perm) => {
      const term = ungrantedSearch.toLowerCase();
      return (
        perm.name.toLowerCase().includes(term) ||
        (perm.description && perm.description.toLowerCase().includes(term))
      );
    });
  }, [ungrantedPerms, ungrantedSearch]);
  const filteredGrantedPerms = useMemo(() => {
    return grantedPerms.filter((perm) => {
      const term = grantedSearch.toLowerCase();
      return (
        perm.name.toLowerCase().includes(term) ||
        (perm.description && perm.description.toLowerCase().includes(term))
      );
    });
  }, [grantedPerms, grantedSearch]);
  // Selected permissions data
  const [selectedUngranted, setSelectedUngranted] = useState<string[]>([]);
  const [selectedGranted, setSelectedGranted] = useState<string[]>([]);

  // Select change
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoleId(Number(e.target.value));
    setSelectedUngranted([]);
    setSelectedGranted([]);
    setUngrantedSearch("");
    setGrantedSearch("");
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

  const handleRoleSaved = (savedRole: Role) => {
    setRolesData((prev) => {
      const exists = prev.find((r) => r.id === savedRole.id);
      if (exists) {
        // It was an update, map over and replace it
        return prev.map((r) => (r.id === savedRole.id ? savedRole : r));
      } else {
        // It was a creation, add to the end
        return [...prev, savedRole];
      }
    });
    setSelectedRoleId(savedRole.id);
  };
  const currentRole = rolesData.find((r) => r.id === selectedRoleId);

  return (
    <div className="flex flex-col gap-6">
      <div className="default-card flex justify-between gap-2 p-6">
        <div className="w-3/5">
          <Select
            options={selectOpts}
            value={String(selectedRoleId)}
            placeholder="Select a role"
            onChange={handleRoleChange}
            disabled={rolesData.length === 0}
            autoComplete="off"
          />
        </div>
        <div className="flex gap-3">
          <ModalRoleForm onSuccess={handleRoleSaved} />
          <ModalRoleForm onSuccess={handleRoleSaved} roleToEdit={currentRole} />
        </div>
      </div>
      <GeneralInfoSection
        title="Role Information"
        items={[
          { label: "Name", value: currentRole?.name },
          { label: "Description", value: currentRole?.description },
        ]}
      />
      <div className="flex flex-col lg:flex-row">
        <ComponentCard title="Ungranted" className="h-full w-full">
          <div className="px-5">
            <Input
              type="text"
              placeholder="Search ungranted permissions..."
              value={ungrantedSearch}
              onChange={(e) => setUngrantedSearch(e.target.value)}
            />
          </div>
          <div className="m-5 max-h-96 overflow-y-auto pr-2">
            {filteredUngrantedPerms.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No permissions found.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {filteredUngrantedPerms.map((perm) => (
                  <Label
                    title={perm.description}
                    key={perm.name}
                    className={`rounded-xl border p-4 text-gray-700 hover:bg-blue-50 dark:text-gray-400 dark:hover:bg-white/[0.07] ${
                      selectedUngranted.includes(perm.name)
                        ? "border-blue-500 bg-blue-50 dark:border-blue-900 dark:bg-white/[0.07]"
                        : ""
                    }`}
                  >
                    <Checkbox
                      labelSize="text-base"
                      checked={selectedUngranted.includes(perm.name)}
                      onChange={() => toggleSelection(perm.name, "ungranted")}
                      label={perm.name}
                    />
                  </Label>
                ))}
              </div>
            )}
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
          <div className="px-5">
            <Input
              type="text"
              placeholder="Search granted permissions..."
              value={grantedSearch}
              onChange={(e) => setGrantedSearch(e.target.value)}
            />
          </div>
          <div className="m-5 max-h-96 overflow-y-auto pr-2">
            {filteredGrantedPerms.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No permissions found.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {filteredGrantedPerms.map((perm) => (
                  <Label
                    title={perm.description}
                    key={perm.name}
                    className={`rounded-xl border p-4 text-gray-700 hover:bg-blue-50 dark:text-gray-400 dark:hover:bg-white/[0.07] ${
                      selectedGranted.includes(perm.name)
                        ? "border-blue-500 bg-blue-50 dark:border-blue-900 dark:bg-white/[0.07]"
                        : ""
                    }`}
                  >
                    <Checkbox
                      labelSize="text-base"
                      checked={selectedGranted.includes(perm.name)}
                      onChange={() => toggleSelection(perm.name, "granted")}
                      label={perm.name}
                    />
                  </Label>
                ))}
              </div>
            )}
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
