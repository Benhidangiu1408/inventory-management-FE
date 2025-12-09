import { User, UserRequest,UserLogin, Role, Permission, RoleRequest, PermissionRequest, RoleAssignmentRequest } from "@/interfaces/userManagementType";
import { apiClient } from "@/lib/api-mask";

// const authToken = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYW0zLm5ndXllbiIsInVzZXJJZCI6NSwiaWF0IjoxNzY1MjA3ODU2LCJleHAiOjE3NjUyMTE0NTZ9.57oM7prjNFJZP9Xp6o6aBXno4ShsVQFFgwZwY53F8Ds";
const token = sessionStorage.getItem("token");

if (!token) {
  console.error("Token not found in sessionStorage");
}

const authToken = `Bearer ${token ?? ""}`;


export const userManagementService = {
  register: async (data: UserRequest) => {
    console.log(data)
    return apiClient.post<UserRequest>("users/register", data, {
      headers: { Authorization: authToken },
    });
  },

  login: async (data: UserLogin) => {
    // return apiClient.post<{ token: string }>("users/login", data);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Login failed");
    }
    const token = await res.text(); // nhận string
    return token;
  },

  getAll: async () => {
    return apiClient.get<User[]>("users", {
      headers: { Authorization: authToken },
      cache: "no-store",
    });
  },

  getById: async (id: string) => {
    return apiClient.get<User>(`/users/${id}`, {
      headers: { Authorization: authToken },
      cache: "no-store",
    });
  },

  update: async (id: number, data: UserRequest) => {
    return apiClient.put<UserRequest>(`users/update/${id}`, data, {
      headers: { Authorization: authToken },
    });
  },

  getRoleByUsername: async (username: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/role`, {
        headers: { Authorization: authToken },
        cache: "no-store",
    });
    const text = await res.text(); // nhận string
    return text; // "WAREHOUSE_STAFF"
  },

  updateProfile: async (username: string, phoneNumber: string) => {
    return apiClient.put<User>(`users/${username}/profile`, {phoneNumber}, {
      headers: { Authorization: authToken },
    });
  },

//   changePassword: async (username: string, currentPassword: string, newPassword: string) => {
//     const query = new URLSearchParams({ currentPassword, newPassword }).toString();
//     return apiClient.put<User>(`users/${username}/password?${query}`, null, {
//       headers: { Authorization: authToken },
//     });
//   }

  changePassword: async (username: string, currentPassword: string, newPassword: string) => {
    return apiClient.put(
        `users/${username}/password`,
        { oldPassword: currentPassword, newPassword },
        { headers: { Authorization: authToken } }
    );
  },

  activateAccount: async (username: string) => {
    return apiClient.put<void>(`/users/${username}/activate`, null, {
      headers: { Authorization: authToken },
    });
  },

  deactivateAccount: async (username: string) => {
    return apiClient.put<void>(`/users/${username}/deactivate`, null, {
      headers: { Authorization: authToken },
    });
  },

  deleteAccount: async (username: string) => {
    return apiClient.delete<void>(`/users/${username}`, [], {
      headers: { Authorization: authToken },
      cache: "no-store",
    });
  },

  assignRole: async (roleId: number, assigningId: number, assignedId: number) => {
    const payload: RoleAssignmentRequest = {
      roleAssignmentKey: {
        roleId: roleId,
        assignedUserId: assignedId,
      },
      assignedDate: new Date().toISOString().slice(0, 19),
      role: {
        id: roleId,
      },
      assignedUser: {
        id: assignedId,
      },
      assigningUser: {
        id: assigningId,
      },
    };
    return apiClient.post<RoleAssignmentRequest>(`/users/role-assignments`, payload, {
      headers: { Authorization: authToken },
    });
  },






  // delete: async (id: number) => {
  //   return apiClient.delete<void>(`/api/users/${id}`, {
  //     headers: { Authorization: authToken },
  //   });
  // },
};

export const roleAssignment = {
  createRole: async (data: RoleRequest) => {
    return apiClient.post<Role>("/users/roles", data, {
      headers: { Authorization: authToken },
    });
  },
  createPermission: async (data: PermissionRequest) => {
    return apiClient.post<Permission>("/users/permissions", data, {
      headers: { Authorization: authToken },
    });
  },
    getAllRole: async () => {
        return apiClient.get<Role[]>("/users/roles", {
        headers: { Authorization: authToken },
        cache: "no-store",
       });
    },

    getAllPermission: async () => {
        return apiClient.get<Permission[]>("/users/permissions", {
        headers: { Authorization: authToken },
        cache: "no-store",
       });
    },

    updateRolePermissions: async (roleId: number, permissionIds: number[]) => {
        return apiClient.put<Role>(`/users/roles/${roleId}/permissions`, permissionIds, {
            headers: { Authorization: authToken },
            cache: "no-store",
        });
    },

  removeRolePermissions: async (roleId: number, permissionIds: number[]) => {
    return apiClient.delete<Role>(`/users/roles/${roleId}/permissions`, permissionIds, {
      headers: { Authorization: authToken },
      cache: "no-store",
    });
  },
  
};