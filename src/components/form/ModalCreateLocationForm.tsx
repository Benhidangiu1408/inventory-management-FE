"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import NoControlModalBox from "../modal/NoControlModalBox";
import { useModal } from "@/hooks/useModal";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  LocationBulkCreate,
  LocationResponse,
  LocationType,
} from "@/interfaces/warehouseManagementType";
import {
  Control,
  FieldErrors,
  useFieldArray,
  useForm,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import toast from "react-hot-toast";
import Select, { Option } from "@/default_components/form/Select";
import Label from "@/default_components/form/Label";
import Input from "@/default_components/form/input/InputField";
import Radio from "@/default_components/form/input/Radio";
import {
  locationCreateAction,
  locationGetChildrenAction,
  locationGetRootAction,
} from "@/actions/system-info";

// Form input structure helper
const HIERARCHY = [
  LocationType.ROOM,
  LocationType.ZONE,
  LocationType.AISLE,
  LocationType.RACK,
  LocationType.SHELF,
  LocationType.BIN,
];
interface LevelConfigFormValues {
  type: LocationType;
  mode: "create" | "select";
  quantity?: number; // Create mode only
  namePrefix?: string | null; // Create mode only
  maxLength?: number;
  maxWidth?: number;
  maxHeight?: number;
  maxWeight?: number;
  selectedId?: string; // Select mode only
}
interface ConfigLevelArrayData {
  uiLevels: LevelConfigFormValues[];
}

// The Main Form
const CreateForm = ({
  setLoading,
  onSuccess,
}: {
  setLoading: (loading: boolean) => void;
  onSuccess: () => void;
}) => {
  // Initiate form control
  const warehouseId = Number(useParams().id);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ConfigLevelArrayData>({
    defaultValues: {
      uiLevels: [
        {
          type: LocationType.ROOM,
          mode: "create",
          quantity: 1,
          namePrefix: null,
        },
      ],
    },
  });

  // Initiate input array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "uiLevels",
  });
  // Add level logic
  const nextLevelIndex = fields.length;
  const nextLevelType = HIERARCHY[nextLevelIndex];
  const canAddLevel = nextLevelIndex < HIERARCHY.length;
  const handleAddLevel = () => {
    if (canAddLevel) {
      append({
        type: nextLevelType,
        mode: "create",
        quantity: 1,
        namePrefix: null,
      });
    }
  };

  // Handle submit event
  const onSubmit = async (data: ConfigLevelArrayData) => {
    setLoading(true);
    try {
      // The chain must end with a "Create" action
      const lastLevel = data.uiLevels[data.uiLevels.length - 1];
      if (lastLevel.mode !== "create") {
        throw new Error("You must create something!");
      }
      // Prepare data
      let anchorParentId: number | null = null;
      const levelsConfig = [];
      for (const level of data.uiLevels) {
        if (level.mode === "select") {
          if (!level.selectedId) {
            throw new Error(`Please select a parent for ${level.type}`);
          }
          anchorParentId = parseInt(level.selectedId, 10);
        } else {
          levelsConfig.push({
            type: level.type,
            quantity: level.quantity || 1,
            namePrefix: level.namePrefix || null,
            maxLength:
              level.maxLength && !isNaN(level.maxLength)
                ? level.maxLength
                : null,
            maxWidth:
              level.maxWidth && !isNaN(level.maxWidth) ? level.maxWidth : null,
            maxHeight:
              level.maxHeight && !isNaN(level.maxHeight)
                ? level.maxHeight
                : null,
            maxWeight:
              level.maxWeight && !isNaN(level.maxWeight)
                ? level.maxWeight
                : null,
          });
        }
      }
      if (levelsConfig.length === 0) {
        throw new Error("You must create something!");
      }

      const payload: LocationBulkCreate = {
        warehouseId: warehouseId,
        parentId: anchorParentId,
        levels: levelsConfig,
      };
      await locationCreateAction(payload);
      toast.success("Location(s) created successfully!");
      onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="createLocationForm"
      onSubmit={handleSubmit(onSubmit)}
      className={"mt-7 max-h-[60vh] space-y-6 overflow-auto px-3"}
    >
      {fields.map((field, index) => (
        <LevelRow
          key={field.id}
          index={index}
          control={control}
          register={register}
          setValue={setValue}
          isLast={index === fields.length - 1}
          onRemove={() => remove(index)}
          errors={errors}
        />
      ))}

      {/* Add level button */}
      {canAddLevel && (
        <button
          type="button"
          onClick={handleAddLevel}
          className="default-button group dark:hover:bg-brand-500/15 flex w-full items-center justify-center gap-2 border-2 border-dashed py-4 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-500"
        >
          <div className="rounded-full bg-gray-200 p-1 group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-gray-600 dark:group-hover:bg-blue-400/15">
            <Plus size={18} />
          </div>
          <span className="font-medium">Add Level: {nextLevelType}</span>
        </button>
      )}
    </form>
  );
};

// Input Row Component
interface LevelRowProps {
  index: number;
  control: Control<ConfigLevelArrayData>;
  register: UseFormRegister<ConfigLevelArrayData>;
  setValue: UseFormSetValue<ConfigLevelArrayData>;
  isLast: boolean;
  onRemove: () => void;
  errors: FieldErrors<ConfigLevelArrayData>;
}
const LevelRow = ({
  index,
  control,
  register,
  setValue,
  isLast,
  onRemove,
  errors,
}: LevelRowProps) => {
  const warehouseId = Number(useParams().id);
  // the current input mode, type
  const myMode = useWatch({ control, name: `uiLevels.${index}.mode` });
  const myType = HIERARCHY[index];
  // prev input mode, type
  const prevMode = useWatch({ control, name: `uiLevels.${index - 1}.mode` });
  const prevSelectedId = useWatch({
    control,
    name: `uiLevels.${index - 1}.selectedId`,
  });
  // parent id which is prev
  const parentId = index === 0 ? null : prevSelectedId;
  // prev is create mode
  const isParentCreated = index > 0 && prevMode === "create";

  // State
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOptions = useCallback(async () => {
    setLoading(true);
    try {
      let res: LocationResponse[] = [];
      if (index === 0) {
        res = await locationGetRootAction(warehouseId);
      } else if (parentId) {
        res = await locationGetChildrenAction(warehouseId, Number(parentId));
      }
      const formattedOptions: Option[] = res.map((loc) => ({
        value: loc.id.toString(),
        label: `${loc.name} (${loc.code})`,
      }));
      setOptions(formattedOptions);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [index, parentId, warehouseId]);

  // Allow create only (disable select) if the prev is create (strict no select in middle of create)
  useEffect(() => {
    if (isParentCreated && myMode !== "create") {
      setValue(`uiLevels.${index}.mode`, "create");
    }
  }, [isParentCreated, index, setValue, myMode]);

  // fetch option
  useEffect(() => {
    // fetch if root or has parent
    if (index === 0 || (prevMode === "select" && prevSelectedId)) {
      fetchOptions();
    } else {
      setOptions((prev) => (prev.length > 0 ? [] : prev));
    }
  }, [fetchOptions, index, prevMode, prevSelectedId]);

  // Errors for this specific row
  const rowErrors = errors.uiLevels?.[index];

  return (
    // Container
    <div
      className={`default-card p-5 transition-all duration-200 ${
        myMode === "create"
          ? "border-green-200 bg-white shadow-sm ring-1 ring-green-100 dark:border-green-900 dark:bg-white/5 dark:ring-green-950"
          : "border-gray-200 bg-slate-50 dark:border-gray-600 dark:bg-white/5"
      }`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-1 text-xs font-bold uppercase ${
              myMode === "create"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
            }`}
          >
            Level {index + 1}: {myType}
          </span>
        </div>
        {/* Delete last */}
        {index > 0 && isLast && (
          <button
            type="button"
            onClick={onRemove}
            className="text-gray-400 transition-colors hover:text-red-500"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Input */}
      <div className="space-y-4">
        {/* --- OPTION 1: CREATE --- */}
        <div className={`space-y-3 ${myMode === "create" ? "" : "opacity-60"}`}>
          <Radio
            id={`mode-create-${index}`}
            value="create"
            label={`Create New ${myType}`}
            {...register(`uiLevels.${index}.mode`)}
            className={`rounded-lg border p-3 transition-colors ${
              myMode === "create"
                ? "border-green-500 bg-green-50/30 dark:border-green-900"
                : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
          />
          {myMode === "create" && (
            <div className="animate-in fade-in slide-in-from-top-1 grid grid-cols-1 gap-4 pl-7 md:grid-cols-2">
              <div>
                <Label className="mb-2">Prefix (Optional)</Label>
                <Input
                  {...register(`uiLevels.${index}.namePrefix`)}
                  placeholder={`${myType} (Default)`}
                />
              </div>
              <div>
                <Label className="mb-2">Quantity</Label>
                <Input
                  type="number"
                  {...register(`uiLevels.${index}.quantity`, {
                    valueAsNumber: true,
                    min: { value: 1, message: "Minimum of 1" },
                  })}
                  error={!!rowErrors?.quantity}
                  hint={rowErrors?.quantity?.message}
                />
              </div>
              {/* Row 2: Dimensions and Capacity (ONLY SHOW FOR BIN) */}
              {myType === "BIN" && (
                <>
                  <div>
                    <Label className="mb-2">Max Length (cm)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 200"
                      {...register(`uiLevels.${index}.maxLength`, {
                        valueAsNumber: true,
                        min: { value: 1, message: "Minimum of 1" },
                        max: {
                          value: 9999.99,
                          message: "The maximum is 9999.99",
                        },
                      })}
                      error={!!rowErrors?.maxLength}
                      hint={rowErrors?.maxLength?.message}
                    />
                  </div>
                  <div>
                    <Label className="mb-2">Max Width (cm)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 100"
                      {...register(`uiLevels.${index}.maxWidth`, {
                        valueAsNumber: true,
                        min: { value: 1, message: "Minimum of 1" },
                        max: {
                          value: 9999.99,
                          message: "The maximum is 9999.99",
                        },
                      })}
                      error={!!rowErrors?.maxWidth}
                      hint={rowErrors?.maxWidth?.message}
                    />
                  </div>
                  <div>
                    <Label className="mb-2">Max Height (cm)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 150"
                      {...register(`uiLevels.${index}.maxHeight`, {
                        valueAsNumber: true,
                        min: { value: 1, message: "Minimum of 1" },
                        max: {
                          value: 9999.99,
                          message: "The maximum is 9999.99",
                        },
                      })}
                      error={!!rowErrors?.maxHeight}
                      hint={rowErrors?.maxHeight?.message}
                    />
                  </div>
                  <div>
                    <Label className="mb-2">Max Weight (kg)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 500"
                      {...register(`uiLevels.${index}.maxWeight`, {
                        valueAsNumber: true,
                        min: { value: 1, message: "Minimum of 1" },
                        max: {
                          value: 999999.99,
                          message: "The maximum is 999999.99",
                        },
                      })}
                      error={!!rowErrors?.maxWeight}
                      hint={rowErrors?.maxWeight?.message}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700"></div>
        {/* --- OPTION 2: SELECT --- */}
        <div
          className={`space-y-3 ${isParentCreated ? "pointer-events-none opacity-40" : ""}`}
        >
          <Radio
            id={`mode-select-${index}`}
            value="select"
            label="Select Existing Parent"
            disabled={isParentCreated}
            {...register(`uiLevels.${index}.mode`)}
            className={`rounded-lg border p-3 transition-colors ${
              myMode === "select"
                ? "border-blue-500 bg-blue-50/30 dark:border-blue-900"
                : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
          />
          {myMode === "select" && (
            <div className="animate-in fade-in slide-in-from-top-1 pl-7">
              {loading ? (
                <div className="flex h-11 items-center gap-2 text-sm text-gray-500">
                  <Loader2 size={16} className="animate-spin" />
                  Loading {myType}...
                </div>
              ) : (
                <Select
                  options={options}
                  placeholder={`-- Choose ${myType} --`}
                  {...register(`uiLevels.${index}.selectedId`, {
                    required:
                      myMode === "select"
                        ? "Please select parent location"
                        : false,
                  })}
                  error={!!rowErrors?.selectedId}
                  hint={rowErrors?.selectedId?.message}
                  disabled={options.length === 0}
                />
              )}
              {!loading && options.length === 0 && (
                <p className="mt-1 text-xs text-orange-500">
                  No existing {myType}s found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function ModalCreateLocationForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);

  return (
    <NoControlModalBox
      startIcon={<Plus size={16} />}
      openBtnTitle={"New Location"}
      formId={"createLocationForm"}
      isLoading={loading}
      isOpen={isOpen}
      onOpen={openModal}
      onClose={closeModal}
      modalContent={
        <CreateForm
          setLoading={setLoading}
          onSuccess={() => {
            closeModal();
            onSuccess();
          }}
        />
      }
    />
  );
}
