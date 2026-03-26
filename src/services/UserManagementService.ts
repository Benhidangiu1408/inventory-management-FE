import {
  User,
  UserRequest,
  UserLogin,
  Role,
  Permission,
  RoleRequest,
  RoleAssignmentRequest,
  RoleAssignmentResponse,
} from "@/interfaces/userManagementType";
import { apiClient } from "@/lib/api-mask";

export const userManagementService = {
  register: async (data: UserRequest) => {
    return apiClient.post<UserRequest>("users/register", data, {});
  },
  login: async (data: UserLogin) => {
    return apiClient.post<{ accessToken: string }>("/users/login", data);
  },
  getAll: async (roleId?: number) => {
    const query = roleId ? `?roleId=${roleId}` : "";
    return apiClient.get<User[]>(`users${query}`, {
      cache: "no-store",
    });
  },
  getById: async (id: string) => {
    return apiClient.get<User>(`/users/${id}`, {
      cache: "no-store",
    });
  },
  //   update: async (id: number, data: UserRequest) => {
  //     return apiClient.put<UserRequest>(`users/update/${id}`, data, {
  //       headers: { Authorization: authToken },
  //     });
  //   },
  //   updateProfile: async (username: string, phoneNumber: string) => {
  //     return apiClient.put<User>(
  //       `users/${username}/profile`,
  //       { phoneNumber },
  //       {
  //         headers: { Authorization: authToken },
  //       },
  //     );
  //   },
  //   //   changePassword: async (username: string, currentPassword: string, newPassword: string) => {
  //   //     const query = new URLSearchParams({ currentPassword, newPassword }).toString();
  //   //     return apiClient.put<User>(`users/${username}/password?${query}`, null, {
  //   //       headers: { Authorization: authToken },
  //   //     });
  //   //   }
  //   changePassword: async (
  //     username: string,
  //     currentPassword: string,
  //     newPassword: string,
  //   ) => {
  //     return apiClient.put(
  //       `users/${username}/password`,
  //       { oldPassword: currentPassword, newPassword },
  //       { headers: { Authorization: authToken } },
  //     );
  //   },
  activateAccount: async (username: string) => {
    return apiClient.put<void>(`/users/${username}/activate`, null);
  },
  deactivateAccount: async (username: string) => {
    return apiClient.put<void>(`/users/${username}/deactivate`, null);
  },
  //   deleteAccount: async (username: string) => {
  //     return apiClient.delete<void>(`/users/${username}`, [], {
  //       headers: { Authorization: authToken },
  //       cache: "no-store",
  //     });
  //   },
  assignRole: async (
    roleId: number,
    assignedUserId: number,
    assigningUserId: number,
  ) => {
    const payload: RoleAssignmentRequest = {
      roleId,
      assignedUserId,
      assigningUserId,
    };
    return apiClient.post<RoleAssignmentResponse>(
      `/users/role-assignments`,
      payload,
    );
  },
  //   // delete: async (id: number) => {
  //   //   return apiClient.delete<void>(`/api/users/${id}`, {
  //   //     headers: { Authorization: authToken },
  //   //   });
  //   // },
  // };
};

export const roleManagementService = {
  createRole: async (data: RoleRequest) => {
    return apiClient.post<Role>("/users/roles", data);
  },
  getAllRole: async () => {
    return apiClient.get<Role[]>("/users/roles", {
      cache: "no-store",
    });
  },
  getAllPermission: async () => {
    return apiClient.get<Permission[]>("/users/permissions", {
      cache: "no-store",
    });
  },
  updateRolePermissions: async (roleId: number, permissionIds: number[]) => {
    return apiClient.put<Role>(
      `/users/roles/${roleId}/update-permissions`,
      permissionIds,
      {
        cache: "no-store",
      },
    );
  },
};
