"use client";
import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import Button from "@/default_components/ui/button/Button";
import React, { useState } from "react";
import { userManagementService } from "@/services/UserManagementService";
import { UserStatus } from "@/interfaces/userManagementType";

export default function NewUserForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<UserStatus>("ACTIVE");
  // loading + error
  const [, setLoading] = useState(false);
  const [, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        await userManagementService.register({
            username,
            passwordHash: password,
            firstName,
            lastName,
            email,
            phoneNumber: phone,
            status,
            createdDate: new Date().toISOString().slice(0, 19),
            updatedDate: new Date().toISOString().slice(0, 19)
        });

      window.location.href = "/admin/user-management";
    } catch (err) {
      setError("Error creating user");
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
              Create User
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the details to create a new user.
            </p>
          </div>
          <div>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>First Name</Label>
                    <Input type="text" placeholder="Musharof" onChange={(e) => setFirstName(e.target.value)} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Last Name</Label>
                    <Input type="text" placeholder="Chowdhury" onChange={(e) => setLastName(e.target.value)} />
                  </div>

                  <div className="col-span-2">
                    <Label>Email Address</Label>
                    <Input type="text" placeholder="randomuser@pimjo.com" onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div className="col-span-2">
                    <Label>Phone</Label>
                    <Input type="text" placeholder="+09 363 398 46" onChange={(e) => setPhone(e.target.value)} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Username</Label>
                    <Input type="text" placeholder="Chowdhury" onChange={(e) => setUsername(e.target.value)} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Password</Label>
                    <Input type="text" placeholder="Chowdhury" onChange={(e) => setPassword(e.target.value)} />
                  </div>

                  <div className="col-span-2">
                    <Label>
                     Status <span className="text-error-500">*</span>{" "}
                    </Label>
                    <select
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as UserStatus)
                      }
                    >
                      <option value="">Select status</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
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
