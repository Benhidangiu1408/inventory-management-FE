"use client";

import React, { FormEvent, useState } from "react";
import CustomContentModalBox from "@/components/modal/CustomContentModalBox";
import { Plus } from "lucide-react";
import Label from "@/default_components/form/Label";
import Input from "@/default_components/form/input/InputField";

interface CategoryFormProps {
  setLoading: (loading: boolean) => void; // To tell Modal to spin
}

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  console.log("submit");
};

function CategoryForm({ setLoading }: CategoryFormProps) {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  return (
    <form id={"catForm"} onSubmit={handleSubmit} className={"mt-4"}>
      {/* Name Input */}
      <div className="space-y-6">
        <div>
          <Label>Category Name</Label>
          <Input
            type="text"
            placeholder={"e.g. Electronics"}
            name={"catName"}
          />
        </div>
        <div>
          <Label>Category Description</Label>
          <Input
            type="text"
            placeholder={"Describe your category"}
            name={"catDesc"}
          />
        </div>
      </div>
    </form>
  );
}

export function ModalCategoryForm() {
  const [loading, setLoading] = useState(false);

  const onSave = (f: () => void) => {
    setLoading(true);
    f();
  };

  return (
    <CustomContentModalBox
      startIcon={<Plus size={16} />}
      openBtnTitle={"New Category"}
      formId={"catForm"}
      isLoading={loading}
      modalContent={<CategoryForm setLoading={setLoading} />}
    />
  );
}
