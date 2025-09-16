import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { ReactNode } from "react";

type ModalProps = {
    btnName: string;
    modalContent: ReactNode;
    onSave: () => void;
};

export default function CustomContentModalBox ({
    btnName,
    modalContent,
    onSave,
} : ModalProps) {
    const { isOpen, openModal, closeModal } = useModal();
    const handleSave = () => {
        onSave();
        closeModal();
    };
    
    return (
        <div>
            <Button size="sm" onClick={openModal}>
                {btnName}
            </Button>
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
                {modalContent}
                <div className="flex items-center justify-end w-full gap-3 mt-6">
                    <Button size="sm" variant="outline" onClick={closeModal}>
                        Close
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            </Modal>
        </div>
    )
}