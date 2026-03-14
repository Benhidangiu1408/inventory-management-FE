// userManagementType.ts
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type RoleStatus = "ACTIVE" | "DISABLED" | "DELETED";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  status: UserStatus;
  createdDate: string | null;
  updatedDate: string | null;
}

export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  passwordHash: string;
  status: UserStatus;
  createdDate: string | null;
  updatedDate: string | null;
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
  status: RoleStatus; // or "ACTIVE" | "INACTIVE"
  permissions: Permission[];
}

export interface RoleRequest {
  name: string;
  description: string;
  status: RoleStatus; // or "ACTIVE" | "INACTIVE"
}

export interface RoleAssignmentKey {
  roleId: number;
  assignedUserId: number;
}

export interface RoleRef {
  id: number;
}

export interface UserRef {
  id: number;
}

export interface RoleAssignmentRequest {
  roleAssignmentKey: RoleAssignmentKey;
  assignedDate: string; // ISO datetime string
  role: RoleRef;
  assignedUser: UserRef;
  assigningUser: UserRef;
}
