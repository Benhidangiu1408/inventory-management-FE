"use client";

import { useRef, useState } from "react";
import { useModal } from "@/hooks/useModal";
import { ConfirmModal } from "@/components/modal/ConfirmModal";

type ConfirmOptions = {
  title?: string;
  message?: string;
};

export const useConfirmModal = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const resolverRef = useRef<(value: boolean) => void | null>(null);
  const [options, setOptions] = useState<ConfirmOptions>({});

  const confirm = (opts?: ConfirmOptions) => {
    setOptions(opts ?? {});
    openModal();

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const handleConfirm = () => {
    resolverRef.current?.(true);
    resolverRef.current = null;
    closeModal();
  };

  const handleCancel = () => {
    resolverRef.current?.(false);
    resolverRef.current = null;
    closeModal();
  };

  const ConfirmationModal = (
    <ConfirmModal
      isOpen={isOpen}
      title={options.title}
      message={options.message}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, ConfirmationModal };
};
