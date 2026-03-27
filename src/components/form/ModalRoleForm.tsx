"use client";

import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import { useEffect, useState } from "react";
import { Role, RoleRequest } from "@/interfaces/userManagementType";
import toast from "react-hot-toast";
import { useModal } from "@/hooks/useModal";
import NoControlModalBox from "../modal/NoControlModalBox";
import { Plus } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import Radio from "@/default_components/form/input/Radio";
import { CreateRoleAction } from "@/actions/user";

interface RoleFormProps {
  setLoading: (loading: boolean) => void;
  setDisable: (loading: boolean) => void;
  onSuccess: (newRole: Role) => void;
}

const RoleForm = ({ setLoading, setDisable, onSuccess }: RoleFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<RoleRequest>({
    defaultValues: {
      name: "",
      description: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    setDisable(!isDirty);
  }, [isDirty, setDisable]);

  const onSubmit: SubmitHandler<RoleRequest> = async (data) => {
    setLoading(true);
    try {
      const payload: RoleRequest = {
        name: data.name,
        description: data.description,
        status: data.status,
      };
      const newRole = await CreateRoleAction(payload);
      toast.success("Role created successfully!");

      onSuccess(newRole);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id={"roleForm"}
      onSubmit={handleSubmit(onSubmit)}
      className={"mt-4 space-y-6"}
    >
      {/* Name Input */}
      <div>
        <Label>Role Name</Label>
        <Input
          type="text"
          placeholder={"e.g. Color"}
          {...register("name", {
            required: "Role name is required",
          })}
          error={!!errors.name}
          hint={errors.name?.message}
        />
      </div>
      {/* Description Input */}
      <div>
        <Label>Role Description</Label>
        <Input
          type="text"
          placeholder={"Describe your role"}
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
      {/* Status Radio */}
      <div className="flex flex-col gap-1">
        <Label>Role Status</Label>
        <div className="flex items-center gap-3">
          <Radio
            id="status-active"
            label="Active"
            value={"ACTIVE"}
            {...register("status")}
          />
          <Radio
            id="status-disabled"
            label="Disable"
            value={"DISABLED"}
            {...register("status")}
          />
        </div>
      </div>
    </form>
  );
};

export default function ModalRoleForm({
  onRoleCreated,
}: {
  onRoleCreated: (role: Role) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <NoControlModalBox
      startIcon={<Plus size={16} />}
      openBtnTitle={"New Role"}
      formId={"roleForm"}
      isLoading={loading}
      isOpen={isOpen}
      disableSaveBtn={disable}
      onOpen={openModal}
      onClose={closeModal}
      modalContent={
        <RoleForm
          setDisable={setDisable}
          setLoading={setLoading}
          onSuccess={(newRole) => {
            closeModal();
            onRoleCreated(newRole);
          }}
        />
      }
    />
  );
}
