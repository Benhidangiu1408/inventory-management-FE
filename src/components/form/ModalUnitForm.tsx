"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Label from "@/default_components/form/Label";
import Input from "@/default_components/form/input/InputField";
import NoControlModalBox from "@/components/modal/NoControlModalBox";
import { useModal } from "@/hooks/useModal";
import {
  UnitRequest,
  UnitResponse,
} from "@/interfaces/warehouseManagementType";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api-mask";
import { useForm, SubmitHandler } from "react-hook-form";
import { getUnitHeaders } from "../table/CustomizableTableHeader";
import CustomizableTable from "../table/CustomizableTable";
import { unitService } from "@/services/WarehouseManagementService";

interface UnitFormProps {
  setLoading: (loading: boolean) => void;
  setDisable: (loading: boolean) => void;
  onSuccess: () => void;
  initialData?: UnitResponse;
}

const UnitForm = ({
  setLoading,
  setDisable,
  onSuccess,
  initialData,
}: UnitFormProps) => {
  const router = useRouter();
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UnitRequest>({
    defaultValues: {
      name: initialData?.name || "",
      abb: initialData?.abb || "",
      description: initialData?.description || null,
    },
  });

  useEffect(() => {
    setDisable(!isDirty);
  }, [isDirty, setDisable]);

  const onSubmit: SubmitHandler<UnitRequest> = async (data) => {
    setLoading(true);
    try {
      const payload: UnitRequest = {
        name: data.name,
        abb: data.abb,
        description: data.description !== "" ? data.description : null,
      };
      if (isEditMode) {
        await unitService.update(initialData.id, payload);
        toast.success("Unit updated successfully!");
      } else {
        await unitService.create(payload);
        toast.success("Unit created successfully!");
      }
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
      id={"tableForm"}
      onSubmit={handleSubmit(onSubmit)}
      className={"mt-4 space-y-6"}
    >
      {/* Name Input */}
      <div>
        <Label>Unit Name</Label>
        <Input
          type="text"
          placeholder={"e.g. Kilogram"}
          {...register("name", {
            required: "Unit name is required",
          })}
          error={!!errors.name}
          hint={errors.name?.message}
        />
      </div>
      {/* Abb Input */}
      <div>
        <Label>Unit Abbreviation</Label>
        <Input
          type="text"
          placeholder={"e.g. Kg"}
          {...register("abb", {
            required: "Unit abbreviation is required",
          })}
          error={!!errors.abb}
          hint={errors.abb?.message}
        />
      </div>
      {/* Description Input */}
      <div>
        <Label>Unit Description</Label>
        <Input
          type="text"
          placeholder={"Describe your unit"}
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
    </form>
  );
};

export function ModalUnitForm({ data }: { data: UnitResponse[] }) {
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedUpdateUnit, setSelectedUpdateUnit] = useState<
    UnitResponse | undefined
  >(undefined);
  const handleEdit = useCallback(
    (item: UnitResponse) => {
      setSelectedUpdateUnit(item);
      openModal();
    },
    [openModal],
  );
  const headers = useMemo(() => getUnitHeaders(handleEdit), [handleEdit]);

  return (
    <div>
      <div className={"pt-6 px-6 flex justify-end"}>
        <NoControlModalBox
          startIcon={<Plus size={16} />}
          openBtnTitle={"New Unit"}
          formId={"tableForm"}
          isLoading={loading}
          isOpen={isOpen}
          disableSaveBtn={disable}
          onOpen={() => {
            setSelectedUpdateUnit(undefined);
            openModal();
          }}
          onClose={closeModal}
          modalContent={
            <UnitForm
              setDisable={setDisable}
              setLoading={setLoading}
              onSuccess={closeModal}
              initialData={selectedUpdateUnit}
            />
          }
        />
      </div>
      <div className="p-6">
        <CustomizableTable headers={headers} data={data} />
      </div>
    </div>
  );
}
