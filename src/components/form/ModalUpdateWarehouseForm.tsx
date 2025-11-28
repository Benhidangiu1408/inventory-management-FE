"use client";

import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import Select from "@/default_components/form/Select";
import {
  NewWarehouseRequest,
  WarehouseDetail,
  WarehouseStatus,
  WarehouseType,
} from "@/interfaces/warehouseManagementType";
import { ApiError } from "@/lib/api-mask";
import { warehouseService } from "@/services/WarehouseManagementService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import NoControlModalBox from "../modal/NoControlModalBox";
import { useModal } from "@/hooks/useModal";
import { Pencil } from "lucide-react";

interface WarehouseFormProps {
  setLoading: (loading: boolean) => void;
  setDisable: (loading: boolean) => void;
  onSuccess: () => void;
  initialData?: WarehouseDetail;
}

const UpdateWarehouseForm = ({
  setLoading,
  setDisable,
  onSuccess,
  initialData,
}: WarehouseFormProps) => {
  // Initiate form control
  const router = useRouter();
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
    formState: { errors, isDirty },
  } = useForm<NewWarehouseRequest>({
    defaultValues: initialData,
  });

  useEffect(() => {
    setDisable(!isDirty);
  }, [isDirty, setDisable]);

  //Validation Logic
  const onSubmit: SubmitHandler<NewWarehouseRequest> = async (data) => {
    setLoading(true);
    try {
      const payload: NewWarehouseRequest = {
        name: data.name,
        description: data.description,
        address: data.address,
        type: data.type,
        status: data.status,
      };
      await warehouseService.update(Number(initialData?.id), payload);
      toast.success("Warehouse created successfully!");
      router.refresh();
      onSuccess();
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
    <form
      id="updateWarehouseForm"
      onSubmit={handleSubmit(onSubmit)}
      className={"mt-4 space-y-6"}
    >
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
          placeholder={"Describe your warehouse"}
          {...register("address", {
            required: "Please specify warehouse address",
          })}
          error={!!errors.address}
          hint={errors.address?.message}
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
      {/* Manager? */}
    </form>
  );
};

export function ModalUpdateWarehouseForm({
  initialData,
}: {
  initialData: WarehouseDetail;
}) {
  const [loading, setLoading] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const [disable, setDisable] = useState(false);

  return (
    <NoControlModalBox
      btnClassName="h-8 w-8"
      startIcon={<Pencil size={16} />}
      openBtnTitle={""}
      formId={"updateWarehouseForm"}
      isLoading={loading}
      isOpen={isOpen}
      onOpen={openModal}
      onClose={closeModal}
      disableSaveBtn={disable}
      modalContent={
        <UpdateWarehouseForm
          setLoading={setLoading}
          setDisable={setDisable}
          onSuccess={closeModal}
          initialData={initialData}
        />
      }
    />
  );
}
