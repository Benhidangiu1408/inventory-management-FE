"use client";

import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import { useEffect, useState } from "react";
import { Role, RoleRequest } from "@/interfaces/userManagementType";
import toast from "react-hot-toast";
import { useModal } from "@/hooks/useModal";
import NoControlModalBox from "../modal/NoControlModalBox";
import { Edit, Plus } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateRoleAction, UpdateRoleAction } from "@/actions/user";

interface RoleFormProps {
  setLoading: (loading: boolean) => void;
  setDisable: (loading: boolean) => void;
  onSuccess: (newRole: Role) => void;
  roleToEdit?: Role;
}

const RoleForm = ({
  setLoading,
  setDisable,
  onSuccess,
  roleToEdit,
}: RoleFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<RoleRequest>({
    defaultValues: {
      name: roleToEdit ? roleToEdit.name : "",
      description: roleToEdit ? roleToEdit.description : "",
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
      let savedRole: Role;
      // Determine if we are creating or updating based on roleToEdit
      if (roleToEdit) {
        savedRole = await UpdateRoleAction(roleToEdit.id, payload);
        toast.success("Role updated successfully!");
      } else {
        savedRole = await CreateRoleAction(payload);
        toast.success("Role created successfully!");
      }

      onSuccess(savedRole);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id={roleToEdit ? "editRoleForm" : "newRoleForm"}
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
      {/* <div className="flex flex-col gap-1">
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
      </div> */}
    </form>
  );
};

export default function ModalRoleForm({
  onSuccess,
  roleToEdit,
}: {
  onSuccess: (role: Role) => void;
  roleToEdit?: Role;
}) {
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const isEditMode = !!roleToEdit;

  return (
    <NoControlModalBox
      startIcon={isEditMode ? <Edit size={16} /> : <Plus size={16} />}
      openBtnTitle={isEditMode ? "Edit Role" : "New Role"}
      formId={isEditMode ? "editRoleForm" : "newRoleForm"}
      isLoading={loading}
      isOpen={isOpen}
      disableSaveBtn={disable}
      onOpen={openModal}
      onClose={closeModal}
      modalContent={
        <RoleForm
          setDisable={setDisable}
          setLoading={setLoading}
          roleToEdit={roleToEdit}
          onSuccess={(savedRole) => {
            onSuccess(savedRole);
            closeModal();
          }}
        />
      }
    />
  );
}
