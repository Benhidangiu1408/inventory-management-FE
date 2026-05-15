"use client";

import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import Button from "@/default_components/ui/button/Button";
import { useState } from "react";
import { UserRequest } from "@/interfaces/userManagementType";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { RegisterAction } from "@/actions/auth";
import Select from "@/default_components/form/Select";

type NewUserFormData = UserRequest & {
  confirmPassword?: string;
};

export default function NewUserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewUserFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      username: "",
      passwordHash: "",
      confirmPassword: "",
      status: "ACTIVE",
    },
  });

  const onSubmit: SubmitHandler<NewUserFormData> = async (data) => {
    setLoading(true);
    try {
      const payload: UserRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        username: data.username,
        passwordHash: data.passwordHash,
        status: data.status,
      };
      await RegisterAction(payload);
      toast.success("User created successfully!");
      router.replace("/admin/user-management");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={"mt-4 space-y-6"}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="col-span-2 lg:col-span-1">
            <Label>First Name</Label>
            <Input
              type="text"
              placeholder="Musharof"
              {...register("firstName", {
                required: "First name is required",
              })}
              error={!!errors.firstName}
              hint={errors.firstName?.message}
            />
          </div>

          <div className="col-span-2 lg:col-span-1">
            <Label>Last Name</Label>
            <Input
              type="text"
              placeholder="Chowdhury"
              {...register("lastName", {
                required: "Last name is required",
              })}
              error={!!errors.lastName}
              hint={errors.lastName?.message}
            />
          </div>

          <div className="col-span-2">
            <Label>Email Address</Label>
            <Input
              type="email"
              placeholder="randomuser@pimjo.com"
              {...register("email", {
                required: "Warehouse name is required",
              })}
              error={!!errors.email}
              hint={errors.email?.message}
            />
          </div>

          <div className="col-span-2">
            <Label>Phone</Label>
            <Input
              type="tel"
              placeholder="+09 363 398 46"
              {...register("phoneNumber", {
                required: "Phone number is required",
              })}
              error={!!errors.phoneNumber}
              hint={errors.phoneNumber?.message}
            />
          </div>

          <div className="col-span-2 lg:col-span-1">
            <Label>Username</Label>
            <Input
              type="text"
              placeholder="Chowdhury"
              {...register("username", {
                required: "Username is required",
              })}
              error={!!errors.username}
              hint={errors.username?.message}
            />
          </div>

          <div className="col-span-2 lg:col-span-1">
            <Label>Status</Label>
            <Select
              {...register("status")}
              placeholder={"Select status"}
              options={[
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
              ]}
            />
          </div>

          <div className="col-span-2 lg:col-span-1">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="New Password"
              {...register("passwordHash", {
                required: "Password is required",
              })}
              error={!!errors.passwordHash}
              hint={errors.passwordHash?.message}
            />
          </div>

          <div className="col-span-2 lg:col-span-1">
            <Label>Confirm Password</Label>
            <Input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value, formValues) =>
                  value === formValues.passwordHash || "Passwords do not match",
              })}
              error={!!errors.confirmPassword}
              hint={errors.confirmPassword?.message}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.back()}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={loading}>
            Create
          </Button>
        </div>
      </div>
    </form>
  );
}
