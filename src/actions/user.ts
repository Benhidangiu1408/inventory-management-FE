"use server";

import { RoleRequest } from "@/interfaces/userManagementType";
import {
  roleManagementService,
  userManagementService,
} from "@/services/UserManagementService";
import { cookies } from "next/headers";

export async function AssignRoleAction(roleId: number, assignedUserId: number) {
  const cookieStore = await cookies();
  return await userManagementService.assignRole(
    roleId,
    assignedUserId,
    Number(cookieStore.get("userId")?.value),
  );
}

export async function updateRolePermissionsAction(
  roleId: number,
  permissionIds: number[],
) {
  return await roleManagementService.updateRolePermissions(
    roleId,
    permissionIds,
  );
}

export async function CreateRoleAction(data: RoleRequest) {
  return await roleManagementService.createRole(data);
}
export async function UpdateRoleAction(roleId: number, data: RoleRequest) {
  return await roleManagementService.updateRole(roleId, data);
}
