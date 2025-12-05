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
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  } = useForm<CreateInventoryCheckRequest>({
    defaultValues: {
      warehouseId: null,
      targetProductIds: [],
      plannedDate: "",
      note: "",
      isCycleCheck: false,
      cycleIntervalDays: 7,
    },
  });
  const isCycleCheck = useWatch({ control, name: "isCycleCheck" });

  //Validation Logic
  const onSubmit: SubmitHandler<CreateInventoryCheckRequest> = async (data) => {
    setLoading(true);
    try {
      const payload: CreateInventoryCheckRequest = {
        note: data.note,
        warehouseId: Number(data.warehouseId),
        assigneeId: null,
        targetProductIds: data.targetProductIds
          ? (data.targetProductIds as unknown as string[]).map((id: string) =>
              Number(id),
            )
          : [],
        plannedDate: new Date(data.plannedDate).toISOString(),
        isCycleCheck: Boolean(data.isCycleCheck),
        cycleIntervalDays: data.isCycleCheck
          ? Number(data.cycleIntervalDays)
          : undefined,
      };
      await inventoryCheckService.create(payload);
      reset();
      toast.success("Product created successfully!");
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
              // {...register("assigneeId", { required: "Please assign a checker" })}
              options={[]}
              placeholder="Select Person"
              error={!!errors.assigneeId}
              hint={errors.assigneeId?.message}
              disabled
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
            <div className="animate-in fade-in slide-in-from-top-2 ml-8 w-full max-w-xs duration-200">
              <Label>Repeat Interval (Days)</Label>
              <Input
                type="number"
                placeholder="e.g. 7"
                {...register("cycleIntervalDays", {
                  valueAsNumber: true,
                  min: { value: 1, message: "Interval must be at least 1 day" },
                  required: isCycleCheck ? "Interval is required" : false,
                })}
                error={!!errors.cycleIntervalDays}
                hint={errors.cycleIntervalDays?.message}
              />
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
