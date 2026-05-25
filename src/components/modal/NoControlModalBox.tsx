"use client";

import { Modal } from "@/default_components/ui/modal";
import Button from "@/default_components/ui/button/Button";
import { ReactNode } from "react";

type ModalProps = {
  // Config
  width?: string;
  title?: string;
  startIcon?: ReactNode;
  openBtnTitle: string;
  btnClassName?: string;
  disableSaveBtn?: boolean;
  // Logic
  formId?: string;
  isLoading?: boolean;
  onSave?: () => void;
  // Control
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  modalContent: ReactNode;
  showOpenBtn?: boolean;
};

export default function NoControlModalBox({
  width,
  title,
  startIcon,
  isLoading = false,
  btnClassName = "",
  disableSaveBtn = false,
  openBtnTitle,
  formId,
  modalContent,
  onSave,
  isOpen,
  onOpen,
  onClose,
  showOpenBtn = true,
}: ModalProps) {
  const handleSave = () => {
    if (onSave) onSave();
  };

  return (
    <div>
      {/* 1. The Trigger Button (Opens the Modal) */}
      {showOpenBtn && (
        <Button
          size="sm"
          onClick={onOpen}
          startIcon={startIcon}
          className={btnClassName}
        >
          {openBtnTitle}
        </Button>
      )}
      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className={`${width ? width : "max-w-[584px]"} p-5 lg:p-10`}
      >
        {/* Modal Header & content */}
        {title && (
          <h4 className="text-title-sm mb-7 font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h4>
        )}
        <div className={"mb-6"}>{modalContent}</div>
        {/* Modal Footer */}
        <div className="flex w-full items-center justify-end gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button
            type={formId ? "submit" : "button"}
            form={formId}
            size="sm"
            onClick={formId ? undefined : handleSave}
            disabled={isLoading || disableSaveBtn}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
