"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Plus, ArrowRightLeft, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ComponentCard from "@/default_components/common/ComponentCard";
import Input from "@/default_components/form/input/InputField";
import Select from "@/default_components/form/Select";
import Button from "@/default_components/ui/button/Button";
import Label from "@/default_components/form/Label";
import {
  UnitSummary,
  UnitResponse,
  UnitConversionResponse,
  ConversionStatus,
} from "@/interfaces/warehouseManagementType";
import Switch from "@/default_components/form/switch/Switch";
import {
  ConversionCreateAction,
  ToggleConversionAction,
} from "@/actions/system-info";
import { useAuth } from "@/context/AuthContext";

interface UIConversionRule {
  ruleId?: number;
  fromUnitId: string | number;
  conversionRate: string | number;
  isActive: boolean;
}

interface UnitConversionFormProps {
  productId: number;
  baseUnit: UnitSummary;
  existingConversions: UnitConversionResponse[];
  availableUnits: UnitResponse[];
}

// Helper function to map server data to our UI format consistently
const formatServerRules = (
  conversions: UnitConversionResponse[],
): UIConversionRule[] => {
  return [...conversions]
    .sort((a, b) => a.conversionRate - b.conversionRate)
    .map((conv) => ({
      ruleId: conv.id,
      fromUnitId: conv.fromUnit.id,
      conversionRate: conv.conversionRate,
      isActive: conv.status === ConversionStatus.ACTIVE,
    }));
};

export default function UnitConversionManager({
  productId,
  baseUnit,
  existingConversions,
  availableUnits,
}: UnitConversionFormProps) {
  const { user } = useAuth();
  const hasEditProductPerm =
    user?.permissions.includes("EDIT_PRODUCT") ?? false;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const unitOptions = availableUnits.map((u) => ({
    value: u.id.toString(),
    label: `${u.abb} (${u.name})`,
  }));

  const {
    register,
    control,
    getValues,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<{ rules: UIConversionRule[] }>({
    defaultValues: { rules: formatServerRules(existingConversions) },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rules",
  });
  const watchedRules = useWatch({ control, name: "rules" });
  useEffect(() => {
    const currentRules = getValues("rules");
    // Keep any rows the user is currently typing that haven't been saved yet
    const unsavedRules = currentRules.filter((r) => r.ruleId === undefined);
    // Grab the fresh data from the server
    const serverRules = formatServerRules(existingConversions);
    // Merge them together and update the UI
    reset({ rules: [...serverRules, ...unsavedRules] });
  }, [existingConversions, reset, getValues]);

  // --- ACTION 1: Instant Toggle for Existing Rules ---
  const handleToggleExisting = async (
    index: number,
    ruleId: number,
    newState: boolean,
  ) => {
    setLoading(true);
    try {
      console.log(
        `API Call: Toggling rule ${ruleId} to ${newState ? "ACTIVE" : "DELETED"}`,
      );
      await ToggleConversionAction(ruleId);
      toast.success(
        `Conversion rule ${newState ? "activated" : "deactivated"}!`,
      );
      router.refresh();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setValue(`rules.${index}.isActive`, !newState);
      toast.error(error.message ?? "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // --- ACTION 2: Save New Rule ---
  const handleSaveNew = async (index: number) => {
    const isValid = await trigger(`rules.${index}`);
    if (!isValid) return;

    const rule = getValues(`rules.${index}`);
    setLoading(true);
    try {
      await ConversionCreateAction(productId, {
        fromUnitId: Number(rule.fromUnitId),
        conversionRate: Number(rule.conversionRate),
      });
      toast.success("New conversion rule added!");
      remove(index);
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard title="Product Unit Conversions">
      <div className="space-y-6">
        {/* Read-Only Base Unit Display */}
        <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
            <ArrowRightLeft size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Base Unit
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {baseUnit.name} ({baseUnit.abb})
            </p>
          </div>
        </div>

        {/* Dynamic Rules List */}
        <div className="max-h-[75vh] space-y-4 overflow-auto p-2">
          {fields.map((field, index) => {
            const isActive = watchedRules?.[index]?.isActive ?? true;
            const isExistingRule = !!field.ruleId; // Check if it's already in the DB
            // Setup Select Registration
            const unitRegister = register(`rules.${index}.fromUnitId`, {
              required: isActive ? "Required" : false,
              validate: (val) => {
                if (!isActive) return true;
                if (Number(val) === baseUnit.id) return "Cannot be Base Unit";

                const allRules = getValues("rules");
                const duplicateActive = allRules.find(
                  (r, idx) =>
                    idx !== index &&
                    r.isActive &&
                    Number(r.fromUnitId) === Number(val),
                );

                if (duplicateActive)
                  return "Another active rule already exists for this unit.";
                return true;
              },
            });
            // Setup Toggle Registration
            const toggleRegister = register(`rules.${index}.isActive`);
            return (
              <div
                key={field.id}
                className={`flex flex-col gap-6 rounded-lg border p-4 transition-all duration-200 lg:flex-row lg:items-start${
                  isActive
                    ? "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                    : "border-gray-100 bg-gray-50 opacity-60 grayscale-[50%] dark:border-gray-800/50 dark:bg-gray-900/50"
                } `}
              >
                {/* From Unit */}
                <div className="w-full">
                  <Label>From Unit</Label>
                  <Select
                    // Disable input if rule exists or is inactive
                    disabled={!isActive || isExistingRule || loading}
                    {...unitRegister}
                    options={unitOptions}
                    placeholder="Select Unit"
                    error={!!errors.rules?.[index]?.fromUnitId}
                    hint={errors.rules?.[index]?.fromUnitId?.message}
                  />
                </div>
                <div className="flex w-full items-start gap-3">
                  {/* Conversion Rate */}
                  <div className="w-full">
                    <Label>Conversion Rate</Label>
                    <div className="flex w-full">
                      <div className="flex h-11 min-w-fit items-center justify-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        <span>=</span>
                      </div>
                      <div className="w-full">
                        <Input
                          type="number"
                          // Disable input if rule exists or is inactive
                          disabled={!isActive || isExistingRule || loading}
                          className="rounded-l-none"
                          placeholder={`e.g. 10`}
                          {...register(`rules.${index}.conversionRate`, {
                            required: isActive ? "Required" : false,
                            min: { value: 0.01, message: "Must be > 0" },
                          })}
                          error={!!errors.rules?.[index]?.conversionRate}
                          hint={errors.rules?.[index]?.conversionRate?.message}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Actions Column (Status Toggle & Save/Delete) */}
                  {hasEditProductPerm && (
                    <div className="flex w-fit flex-col items-center">
                      {/* Status Toggle */}
                      <Label>Actions</Label>
                      <div className="flex h-11 items-center gap-2">
                        {isExistingRule && (
                          <Switch
                            color="blue"
                            disabled={loading}
                            {...toggleRegister}
                            onChange={(e) => {
                              // Let React Hook Form update its state
                              toggleRegister.onChange(e);
                              // If it's an existing rule, trigger the API immediately!
                              if (isExistingRule && field.ruleId) {
                                handleToggleExisting(
                                  index,
                                  field.ruleId,
                                  e.target.checked,
                                );
                              }
                            }}
                          />
                        )}
                        {/* Action Buttons (ONLY FOR NEW RULES) */}
                        {!isExistingRule && (
                          <div className="flex items-center gap-2">
                            {/* Save Button for this specific row */}
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => handleSaveNew(index)}
                              className="border-brand-200 text-brand-600 hover:bg-brand-50 hover:text-brand-700 dark:border-brand-900/50 dark:text-brand-400 dark:hover:bg-brand-900/20 flex h-10 w-10 items-center justify-center rounded-lg border transition-colors disabled:opacity-50"
                            >
                              <Plus size={18} />
                            </button>
                            {/* Only allow deleting if it's a NEW rule that hasn't been saved to the DB */}
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => remove(index)}
                              className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50 dark:border-red-900/50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {fields.length === 0 && (
            <div className="py-6 text-center text-sm text-gray-400 italic">
              No conversion rules configured.
            </div>
          )}

          {hasEditProductPerm && (
            <Button
              type="button"
              variant="outline"
              startIcon={<Plus size={16} />}
              disabled={loading}
              onClick={() =>
                append({ fromUnitId: "", conversionRate: "", isActive: true })
              }
              className="w-full border-dashed border-gray-300 hover:border-gray-400"
            >
              Add New Rule
            </Button>
          )}
        </div>
      </div>
    </ComponentCard>
  );
}
