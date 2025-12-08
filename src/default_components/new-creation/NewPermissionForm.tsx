"use client";
import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import Button from "@/default_components/ui/button/Button";
import React, { useState } from "react";
import { roleAssignment } from "@/services/UserManagementService";

export default function NewPermissionForm() {

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // loading + error
  const [, setLoading] = useState(false);
  const [, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await roleAssignment.createPermission({
        code,
        name,
        description,
      });

      // redirect
      window.location.href = "/admin/role-management";
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-1 mb-5 mt-5">
      <div className="mx-auto mb-5 flex w-full justify-center">
        <div className="w-full max-w-md">
          <div className="mb-5 sm:mb-8 flex items-center flex-col">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              Create Permission
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the details to create a new permission.
            </p>
          </div>
          <div>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Permission Code <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="Enter permission code"
                    type="text"
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Permission Name <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="Enter permission name"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Permission Description <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="Enter permission description"
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                  />
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
