"use server";

import { userManagementService } from "@/services/UserManagementService";
import { cookies } from "next/headers";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error happened!";
}

export async function getAllUsersByRoleAction(roleId?: number) {
  try {
    const response = await userManagementService.getAll(roleId);
    return { data: response, error: null };
  } catch (error: unknown) {
    return { data: null, error: getErrorMessage(error) };
  }
}

export async function AssignRoleAction(roleId: number, assignedUserId: number) {
  const cookieStore = await cookies();
  return await userManagementService.assignRole(
    roleId,
    assignedUserId,
    Number(cookieStore.get("userId")?.value),
  );
}
