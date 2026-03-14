"use client";

import { useModal } from "@/hooks/useModal";
import { Modal } from "@/default_components/ui/modal";
import Button from "@/default_components/ui/button/Button";
import { ReactNode } from "react";
import { useImport } from "@/context/ImportContext";
import { SheetStatus } from "@/interfaces/inventoryManagementType";

type ModalProps = {
  width?: string;
  startIcon?: ReactNode;
  btnName: string;
  modalContent: ReactNode;
  onSave: () => void;
  step?: string;
};

export default function CustomContentModalBox({
  width,
  startIcon,
  btnName,
  modalContent,
  onSave,
  step = "quantity-check",
}: ModalProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    onSave();
    closeModal();
  };

  const { importData } = useImport();

  return (
    <div>
      {step === "quantity-check" &&
        importData.status === SheetStatus.CREATED && (
          <Button size="sm" onClick={openModal} startIcon={startIcon}>
            {btnName}
          </Button>
        )}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className={`${width ? width : "max-w-[584px]"} p-5 lg:p-10`}
      >
        {modalContent}
        <div className="mt-6 flex w-full items-center justify-end gap-3">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Close
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </Modal>
    </div>
  );
}
