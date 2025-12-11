"use client";
import ComponentCard from "@/default_components/common/ComponentCard";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import Filter from "@/components/Filter";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { roleAssignment } from "@/services/UserManagementService";
import { Role } from "@/interfaces/userManagementType";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export type roleStructure = {
  id: number;
  name: string;
};
export default function RoleManagementPage() {
  const [ungrantedPermissions, setUngrantedPermissions] = useState<string[]>(
    [],
  );
  const [grantedPermissions, setGrantedPermissions] = useState<string[]>([]);
  const [selectedUngranted, setSelectedUngranted] = useState<string[]>([]);
  const [selectedGranted, setSelectedGranted] = useState<string[]>([]);

  const [selectedRole, setSelectedRole] = useState<number>(0);
  const [role, setRole] = useState<roleStructure[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [fullPermission, setFullPermission] = useState<roleStructure[]>([]);

  const loadRolePermissions = async (roleId: number) => {
    const role = roles.find((r) => r.id === roleId);

    if (!role) {
      console.error("Role not found:", roleId);
      return;
    }
    const granted = role.permissions.map((p) => p.name);
    const ungranted = fullPermission
      .filter((perm) => !granted.includes(perm.name))
      .map((p) => p.name);

    setGrantedPermissions(granted);
    setUngrantedPermissions(ungranted);
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await roleAssignment.getAllRole();
        const roles = res; // Role[]

        if (!roles || roles.length === 0) return;
        setRoles(roles);

        const fullPermissionList = await roleAssignment
          .getAllPermission()
          .then((res) => res.map((perm) => ({ id: perm.id, name: perm.name }))); // Permission[]

        setFullPermission(fullPermissionList);

        setRole(roles.map((r) => ({ id: r.id, name: r.name })));

        setSelectedRole(roles[0].id);
      } catch (err) {
        console.error("Failed to load roles", err);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if (roles.length > 0 && fullPermission.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadRolePermissions(roles[0].id); // role index 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles, fullPermission]);

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
      return [...selectedUngranted, ...remainingGranted];
    });

    setUngrantedPermissions((prev) => {
      const remainingUngranted = prev.filter(
        (permission) => !selectedUngranted.includes(permission),
      );
      return [...selectedGranted, ...remainingUngranted];
    });

    if (selectedGranted.length > 0) {
      const grantedIds = selectedGranted
        .map((name) => fullPermission.find((p) => p.name === name)?.id)
        .filter((id): id is number => id !== undefined);
      console.log(grantedIds);
      roleAssignment.removeRolePermissions(selectedRole, grantedIds);
    }

    if (selectedUngranted.length > 0) {
      const ungrantedIds = selectedUngranted
        .map((name) => fullPermission.find((p) => p.name === name)?.id)
        .filter((id): id is number => id !== undefined);
      roleAssignment.updateRolePermissions(selectedRole, ungrantedIds);
    }

    setSelectedUngranted([]);
    setSelectedGranted([]);
  };

  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("created") === "1") {
      toast.success("Role created successfully!");
    }
  }, []);
  useEffect(() => {
    if (searchParams.get("created2") === "1") {
      toast.success("Permission created successfully!");
    }
  }, []);
  return (
    <div>
      <PageBreadcrumb pageTitle="Role Management" />
      <div className="rounded-2xl border border-[#E4E7EC] bg-white">
        <Filter
          type="role"
          roles={role}
          onRoleChange={(id: number) => {
            setSelectedRole(id);
            loadRolePermissions(id);
          }}
        />
        {/* Role Assignment */}
        <div className="flex p-6">
          <div className="flex w-full flex-col">
            <ComponentCard title="Ungranted" className="h-full">
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
