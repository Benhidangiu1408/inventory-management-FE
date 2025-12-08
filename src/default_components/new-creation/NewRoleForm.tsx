"use client";
import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import Button from "@/default_components/ui/button/Button";
import React, { useState } from "react";
import { roleAssignment } from "@/services/UserManagementService";
import { RoleStatus } from "@/interfaces/userManagementType";

export default function NewRoleForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [roleStatus, setRoleStatus] = useState<RoleStatus>("ACTIVE");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await roleAssignment.createRole({
        name,
        description,
        status: roleStatus,
      });

      // redirect
      window.location.href = "/admin/role-management";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-5 mb-5 flex w-full flex-1">
      <div className="mx-auto mb-5 flex w-full justify-center">
        <div className="w-full max-w-md">
          <div className="mb-5 flex flex-col items-center sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              Create Role
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the details to create a new role.
            </p>
          </div>
          <div>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Role Name <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="Enter role name"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Role Description{" "}
                    <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="Enter role description"
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Role Status <span className="text-error-500">*</span>{" "}
                  </Label>
                  <select
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    value={roleStatus}
                    onChange={(e) => setRoleStatus(e.target.value as RoleStatus)}
                  >
                    <option value="">Select status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div>
                  <Button
                    className="w-full"
                    size="sm"
                    type="submit"
                  >
                    Create
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

   