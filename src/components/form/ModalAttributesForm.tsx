"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Label from "@/default_components/form/Label";
import Input from "@/default_components/form/input/InputField";
import NoControlModalBox from "@/components/modal/NoControlModalBox";
import { useModal } from "@/hooks/useModal";
import {
  AttributeRequest,
  AttributeResponse,
} from "@/interfaces/warehouseManagementType";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api-mask";
import { attributesService } from "@/services/WarehouseManagementService";
import { useForm, SubmitHandler } from "react-hook-form";
import { getAttributeHeaders } from "../table/CustomizableTableHeader";
import CustomizableTable from "../table/CustomizableTable";

interface AttributeFormProps {
  setLoading: (loading: boolean) => void;
  setDisable: (loading: boolean) => void;
  onSuccess: () => void;
  initialData?: AttributeResponse;
}

const AttributeForm = ({
  setLoading,
  setDisable,
  onSuccess,
  initialData,
}: AttributeFormProps) => {
  const router = useRouter();
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<AttributeRequest>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || null,
    },
  });

  useEffect(() => {
    setDisable(!isDirty);
  }, [isDirty, setDisable]);

  const onSubmit: SubmitHandler<AttributeRequest> = async (data) => {
    setLoading(true);
    try {
      const payload: AttributeRequest = {
        name: data.name,
        description: data.description !== "" ? data.description : null,
      };
      if (isEditMode) {
        await attributesService.update(initialData.id, payload);
        toast.success("Attribute updated successfully!");
      } else {
        await attributesService.create(payload);
        toast.success("Attribute created successfully!");
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
        <Label>Attribute Name</Label>
        <Input
          type="text"
          placeholder={"e.g. Color"}
          {...register("name", {
            required: "Attribute name is required",
          })}
          error={!!errors.name}
          hint={errors.name?.message}
        />
      </div>
      {/* Description Input */}
      <div>
        <Label>Category Description</Label>
        <Input
          type="text"
          placeholder={"Describe your attribute"}
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

export function ModalAttributesForm({ data }: { data: AttributeResponse[] }) {
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedUpdateAttr, setSelectedUpdateAttr] = useState<
    AttributeResponse | undefined
  >(undefined);
  const handleEdit = useCallback(
    (item: AttributeResponse) => {
      setSelectedUpdateAttr(item);
      openModal();
    },
    [openModal],
  );
  const headers = useMemo(() => getAttributeHeaders(handleEdit), [handleEdit]);

  return (
    <div>
      <div className={"pt-6 pl-6"}>
        <NoControlModalBox
          startIcon={<Plus size={16} />}
          openBtnTitle={"New Attribute"}
          formId={"tableForm"}
          isLoading={loading}
          isOpen={isOpen}
          disableSaveBtn={disable}
          onOpen={() => {
            setSelectedUpdateAttr(undefined);
            openModal();
          }}
          onClose={closeModal}
          modalContent={
            <AttributeForm
              setDisable={setDisable}
              setLoading={setLoading}
              onSuccess={closeModal}
              initialData={selectedUpdateAttr}
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
