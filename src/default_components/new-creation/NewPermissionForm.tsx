"use client";
import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import Button from "@/default_components/ui/button/Button";
import React, { useState } from "react";
import { roleAssignment } from "@/services/UserManagementService";
import { ApiError } from "@/lib/api-mask";
import toast from "react-hot-toast";

export default function NewPermissionForm({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // loading + error
  const [, setLoading] = useState(false);
  const [, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await roleAssignment.createPermission({
        code,
        name,
        description,
      });

      // redirect
      // window.location.href = "/admin/role-management";
      onClose();

      // setTimeout(() => {
      //   toast.success("Permission created successfully!");
      // }, 150);
      window.location.href = "/admin/role-management?created2=1";
    } catch (error) {
      // window.location.href = "/admin/role-management";
      onClose();
      setTimeout(() => {
        if (error instanceof ApiError) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      }, 150);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 mb-5 flex w-full flex-1">
      <div className="mx-auto mb-5 flex w-full justify-center">
        <div className="w-full max-w-md">
          <div className="mb-5 flex flex-col items-center sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              Create Permission
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the details to create a new permission.
            </p>
          </div>
          <div>
            <form >
              <div className="space-y-6">
                <div>
                  <Label>
                    Permission Code{" "}
                    <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="Enter permission code"
                    type="text"
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Permission Name{" "}
                    <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="Enter permission name"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Permission Description{" "}
                    <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="Enter permission description"
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Button type="button" className="w-full" size="sm" onClick={handleLogin}>
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
