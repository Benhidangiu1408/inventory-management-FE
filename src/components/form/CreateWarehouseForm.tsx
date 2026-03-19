"use client";

import { warehouseCreateAction } from "@/actions/system-info";
import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import Select from "@/default_components/form/Select";
import Button from "@/default_components/ui/button/Button";
import {
  NewWarehouseRequest,
  WarehouseStatus,
  WarehouseType,
} from "@/interfaces/warehouseManagementType";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const CreateWarehouseForm = () => {
  // Initiate form control
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const typeOptions = Object.values(WarehouseType).map((type) => ({
    value: type,
    label: type.replace("_", " "), // Makes "COLD_STORAGE" look like "COLD STORAGE"
  }));

  const statusOptions = Object.values(WarehouseStatus).map((status) => ({
    value: status,
    label: status.replace("_", " "),
  }));
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewWarehouseRequest>({
    defaultValues: {
      name: "",
      address: "",
      description: null,
      status: WarehouseStatus.ACTIVE,
      type: WarehouseType.STORAGE,
      managerId: null,
    },
  });

  const [managerOptions, setManagerOptions] = useState<
    { value: string; label: string }[]
  >([]);
  // useEffect(() => {
  //   const fetchManagers = async () => {
  //     try {
  //       const users = await userManagementService.getAll(1);
  //       if (users) {
  //         const options = users.map((u) => ({
  //           value: u.id.toString(),
  //           label: `${u.username}`,
  //         }));
  //         setManagerOptions(options);
  //       }
  //     } catch (error) {
  //       console.error("Failed to load managers:", error);
  //       toast.error("Could not load user list");
  //     }
  //   };
  //   fetchManagers();
  // }, []);

  //Validation Logic
  const onSubmit: SubmitHandler<NewWarehouseRequest> = async (data) => {
    setLoading(true);
    try {
      const payload: NewWarehouseRequest = {
        name: data.name,
        description: data.description !== "" ? data.description : null,
        address: data.address,
        type: data.type,
        status: data.status,
        managerId: Number(data.managerId),
      };
      console.log(payload);
      await warehouseCreateAction(payload);
      reset();
      toast.success("Warehouse created successfully!");
      router.replace("/warehouse-management/warehouse");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={"mt-4 space-y-6"}>
      {/* Name */}
      <div>
        <Label>Warehouse Name</Label>
        <Input
          placeholder={"e.g. Export Storage"}
          {...register("name", {
            required: "Warehouse name is required",
          })}
          error={!!errors.name}
          hint={errors.name?.message}
        />
      </div>
      {/* Address */}
      <div>
        <Label>Address</Label>
        <Input
          type="text"
          placeholder={"Where is your warehouse?"}
          {...register("address", {
            required: "Please specify warehouse address",
          })}
          error={!!errors.address}
          hint={errors.address?.message}
        />
      </div>
      {/* Manager Select (New Field) */}
      <div>
        <Label>Warehouse Manager</Label>
        <Select
          {...register("managerId", { required: "Please select a manager" })}
          placeholder={"Select manager"}
          options={managerOptions}
          disabled={managerOptions.length === 0}
          error={!!errors.managerId}
          hint={errors.managerId?.message}
        />
      </div>
      {/* Description */}
      <div>
        <Label>Description</Label>
        <Input
          type="text"
          placeholder={"Describe your warehouse"}
          {...register("description", {
            maxLength: {
              value: 100,
              message: "Description is too long (max 100 chars)",
            },
          })}
          error={!!errors.description}
          hint={errors.description?.message}
        />
      </div>
      {/* Select */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="w-full">
          <Label>Warehouse Type</Label>
          <Select
            {...register("type", { required: "Please select a type" })}
            placeholder={"Select type"}
            options={typeOptions}
            error={!!errors.type}
            hint={errors.type?.message}
          />
        </div>
        <div className="w-full">
          <Label>Status</Label>
          <Select
            {...register("status", { required: "Please select a status" })}
            placeholder={"Select status"}
            options={statusOptions}
            error={!!errors.status}
            hint={errors.status?.message}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.replace("/warehouse-management/warehouse")}
          type="button"
        >
          Cancel
        </Button>
        <Button size="sm" disabled={loading} type="submit">
          Save
        </Button>
      </div>
    </form>
  );
};
