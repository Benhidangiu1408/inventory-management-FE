// userManagementType.ts
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type RoleStatus = "ACTIVE" | "DISABLED" | "DELETED";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  username: string;
  status: UserStatus;
  createdDate: string | null;
  updatedDate: string | null;
  role: string;
}

export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  passwordHash: string;
  status: UserStatus;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface EditPhoneNumberRequest {
  phoneNumber: string;
}

export interface Permission {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface PermissionRequest {
  code: string;
  name: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  status: RoleStatus;
  permissions: Permission[];
}

export interface RoleRequest {
  name: string;
  description: string;
  status: RoleStatus; // or "ACTIVE" | "INACTIVE"
}

export interface RoleAssignmentRequest {
  roleId: number;
  assignedUserId: number;
  assigningUserId: number;
}

export interface RoleAssignmentResponse {
  roleId: number;
  roleName: string;
  assignedUserId: number;
  assignedUsername: string;
  assigningUserId: number;
  assigningUsername: string;
  assignedDate: "2026-03-17T10:06:05.141174600Z";
}
