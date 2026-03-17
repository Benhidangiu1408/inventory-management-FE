"use server";

import { UserLogin, UserRequest } from "@/interfaces/userManagementType";
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
    const permissions = JSON.parse(payloadJson).permissions;

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

// export async function getUserProfileAction(id: string) {
//   try {
//     const user = await userManagementService.getById(id);
//     return { data: user, error: null };
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     return { data: null, error: error.message };
//   }
// }

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("jwt");
  cookieStore.delete("userId");
  cookieStore.delete("permissions");
}
