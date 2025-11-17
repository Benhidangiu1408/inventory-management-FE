"use client";

import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { ReactNode } from "react";

type ModalProps = {
  width?: string;
  startIcon?: ReactNode;
  btnName: string;
  modalContent: ReactNode;
  onSave: () => void;
};

export default function CustomContentModalBox({
  width,
  startIcon,
  btnName,
  modalContent,
  onSave,
}: ModalProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    onSave();
    closeModal();
  };

  return (
    <div>
      <Button size="sm" onClick={openModal} startIcon={startIcon}>
        {btnName}
      </Button>
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
