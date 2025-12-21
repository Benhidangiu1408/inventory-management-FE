"use client";

import ComponentCard from "@/default_components/common/ComponentCard";
import Checkbox from "@/default_components/form/input/Checkbox";
import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import MultiSelect from "@/default_components/form/MultiSelect";
import Select from "@/default_components/form/Select";
import Button from "@/default_components/ui/button/Button";
import { CreateInventoryCheckRequest } from "@/interfaces/inventoryManagementType";
import {
  ProductResponse,
  WarehouseGeneral,
} from "@/interfaces/warehouseManagementType";
import { ApiError } from "@/lib/api-mask";
import { inventoryCheckService } from "@/services/InventoryManagementService";
import { userManagementService } from "@/services/UserManagementService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

export const CreateICSheetForm = ({
  warehouse,
  product,
}: {
  warehouse: WarehouseGeneral[];
  product: ProductResponse[];
}) => {
  // Initiate form control
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const warehouseOption = warehouse.map((val) => ({
    value: val.id.toString(),
    label: `${val.name} (${val.code})`,
  }));
  const productOption = product.map((val) => ({
    value: val.id.toString(),
    text: `${val.name} (${val.code})`,
    selected: false,
  }));
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<
    CreateInventoryCheckRequest & {
      cycleValue: number;
      cycleUnit: "DAYS" | "WEEKS" | "MONTHS";
    }
  >({
    defaultValues: {
      warehouseId: null,
      targetProductIds: [],
      plannedDate: "",
      note: "",
      isCycleCheck: false,
      cycleValue: 1, // Default 1
      cycleUnit: "WEEKS", // Default Weeks
      assignedUserId: null,
    },
  });
  const isCycleCheck = useWatch({ control, name: "isCycleCheck" });
  const cycleValue = useWatch({ control, name: "cycleValue" });
  const cycleUnit = useWatch({ control, name: "cycleUnit" });
  const creator = sessionStorage.getItem("userId");

  const [users, setUsers] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const users = await userManagementService.getAll(1);
        if (users) {
          const options = users
            .filter((val) => String(val.id) !== creator)
            .map((u) => ({
              value: u.id.toString(),
              label: `${u.username}`,
            }));
          setUsers(options);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        toast.error("Could not load user list");
      }
    };
    fetchManagers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Validation Logic
  const onSubmit: SubmitHandler<
    CreateInventoryCheckRequest & {
      cycleValue: number;
      cycleUnit: "DAYS" | "WEEKS" | "MONTHS";
    }
  > = async (data) => {
    setLoading(true);
    try {
      let calculatedDays = undefined;
      if (data.isCycleCheck) {
        const val = Number(data.cycleValue);
        switch (data.cycleUnit) {
          case "WEEKS":
            calculatedDays = val * 7;
            break;
          case "MONTHS":
            calculatedDays = val * 30;
            break;
          default:
            calculatedDays = val;
        }
      }
      const payload: CreateInventoryCheckRequest = {
        note: data.note !== "" ? data.note : null,
        warehouseId: Number(data.warehouseId),
        assignedUserId: Number(data.assignedUserId),
        creatorId: Number(creator),
        targetProductIds: data.targetProductIds
          ? (data.targetProductIds as unknown as string[]).map((id: string) =>
              Number(id),
            )
          : [],
        plannedDate: new Date(data.plannedDate).toISOString(),
        isCycleCheck: Boolean(data.isCycleCheck),
        cycleIntervalDays: calculatedDays,
      };
      await inventoryCheckService.create(payload);
      reset();
      toast.success("Inventory Check Scheduled!");
      router.replace("/warehouse-management/inventory-check");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={"mt-4 space-y-6"}>
      <ComponentCard title="Sheet Detail">
        <div className="flex grid-cols-2 flex-col gap-6 md:grid">
          {/* Warehouse */}
          <div className="col-span-1">
            <Label>Warehouse</Label>
            <Select
              {...register("warehouseId", {
                required: "Please select a warehouse",
              })}
              options={warehouseOption}
              placeholder="Select Warehouse"
              error={!!errors.warehouseId}
              hint={errors.warehouseId?.message}
            />
          </div>
          {/* Assignee */}
          <div className="col-span-1">
            <Label>Assignee</Label>
            <Select
              {...register("assignedUserId", {
                required: "Please assign an employee",
              })}
              options={users}
              placeholder="Select Employee"
              error={!!errors.assignedUserId}
              hint={errors.assignedUserId?.message}
            />
          </div>
          {/* Planned Date */}
          <div className="col-span-1">
            <Label>Planned Date & Time</Label>
            <Input
              type="datetime-local"
              {...register("plannedDate", { required: "Date is required" })}
              min={new Date().toISOString().slice(0, 16)}
              error={!!errors.plannedDate}
              hint={errors.plannedDate?.message}
            />
          </div>
          {/* Target Product (MultiSelect) */}
          <div className="col-span-1">
            {/* Using Controller to bridge MultiSelect with React Hook Form */}
            <Controller
              control={control}
              name="targetProductIds"
              render={({ field: { onChange, value } }) => (
                <MultiSelect
                  label="Target Products (Optional)"
                  options={productOption}
                  // We map the numeric IDs (if any) to strings for the component
                  defaultSelected={value ? value.map(String) : []}
                  onChange={(selected) => {
                    onChange(selected); // Pass array of ID strings to form state
                  }}
                />
              )}
            />
            <p className="mt-2 text-xs text-gray-500">
              Select specific products to check. Leave empty to check{" "}
              <strong>entire warehouse</strong>.
            </p>
          </div>
          {/* Note */}
          <div className="col-span-2">
            <Label>Note</Label>
            <Input
              {...register("note")}
              placeholder="e.g. Focus on Aisle 5 damaged goods..."
            />
          </div>
        </div>
      </ComponentCard>
      <ComponentCard title="Cycle Settings">
        <div className="space-y-4">
          <div>
            <Checkbox
              id="cycle-check"
              label="Enable Recurring Cycle Count"
              {...register("isCycleCheck")}
            />
            <p className="mt-1 ml-8 text-xs text-gray-500">
              If enabled, the system will automatically schedule the next check
              after this one starts.
            </p>
          </div>

          {/* Conditional Input for Days */}
          {isCycleCheck && (
            <div className="animate-in fade-in slide-in-from-top-2 ml-8 w-full duration-200">
              <Label>Repeat Every</Label>
              <div className="flex items-start">
                {/* Number Input */}
                <div className="w-24">
                  <Input
                    type="number"
                    className="rounded-r-none border-r-0 text-center"
                    placeholder="e.g. 1"
                    {...register("cycleValue", {
                      required: isCycleCheck,
                      min: { value: 1, message: "Must be at least 1" },
                    })}
                    error={!!errors.cycleValue}
                    hint={errors.cycleValue?.message}
                  />
                </div>

                {/* Unit Selector */}
                <div className="w-40">
                  <Select
                    className="rounded-l-none"
                    options={[
                      { value: "DAYS", label: "Days" },
                      { value: "WEEKS", label: "Weeks" },
                      { value: "MONTHS", label: "Months" },
                    ]}
                    {...register("cycleUnit")}
                  />
                </div>
              </div>

              {/* Helper text showing calculation */}
              <p className="mt-2 text-xs text-gray-500">
                Next check created automatically {cycleValue || 1}{" "}
                {cycleUnit?.toLowerCase()} after completion.
              </p>
            </div>
          )}
        </div>
      </ComponentCard>
      <div className="flex gap-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            router.replace("/warehouse-management/inventory-check")
          }
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
