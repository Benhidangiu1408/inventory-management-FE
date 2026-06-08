"use server";

import {
  ChangePasswordRequest,
  UserLogin,
  UserRequest,
} from "@/interfaces/userManagementType";
import { userManagementService } from "@/services/UserManagementService";
import { cookies } from "next/headers";

export async function RegisterAction(data: UserRequest) {
  await userManagementService.register(data);
}

export async function loginAction(data: UserLogin) {
  try {
    const response = await userManagementService.login(data);
    const accessToken = response.accessToken;

    const payloadBase64 = accessToken.split(".")[1];
    const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
    const userId = JSON.parse(payloadJson).userId;
    const rawPermissions = JSON.parse(payloadJson).permissions;
    const permissions = Array.isArray(rawPermissions)
      ? rawPermissions.join(",")
      : String(rawPermissions ?? "");

    // Set the HTTP-only cookie
    const cookieStore = await cookies();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 3600 * 24, // 1d
    };
    cookieStore.set("jwt", accessToken, cookieOptions);
    cookieStore.set("userId", userId, cookieOptions);
    cookieStore.set("permissions", permissions, cookieOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { error: error.message || "An unexpected error happened!" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("jwt");
  cookieStore.delete("userId");
  cookieStore.delete("permissions");
}

export async function changePasswordAction(data: ChangePasswordRequest) {
  await userManagementService.changePassword(
    data.username,
    data.oldPassword,
    data.newPassword,
  );
}
export async function changePhoneAction(username: string, phoneNumber: string) {
  await userManagementService.updateProfile(username, phoneNumber);
}

export async function DeactivateAccountAction(username: string) {
  await userManagementService.deactivateAccount(username);
}

export async function ActivateAccountAction(username: string) {
  await userManagementService.activateAccount(username);
}

export async function DeleteAccountAction(username: string) {
  await userManagementService.deleteAccount(username);
}
