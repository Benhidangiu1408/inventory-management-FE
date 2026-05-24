"use client";

import { useModal } from "@/hooks/useModal";
import { Modal } from "@/default_components/ui/modal";
import Button from "@/default_components/ui/button/Button";
import { LocationResponse } from "@/interfaces/inboundOutboundType";
import { useState } from "react";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LocationStatus } from "@/interfaces/warehouseManagementType";

interface ChooseLocationModalProps {
  locations: LocationResponse[];
  currentLocation?: LocationResponse;
  onSave: (locationId: number) => Promise<void>;
  disabled?: boolean;
}

const statusBadge: Record<LocationStatus, string> = {
  [LocationStatus.EMPTY]: "bg-success-100 text-success-700",
  [LocationStatus.OCCUPIED]: "bg-warning-100 text-warning-700",
  [LocationStatus.RESERVED]: "bg-blue-100 text-blue-700",
  [LocationStatus.BLOCKED]: "bg-error-100 text-error-700",
  [LocationStatus.INACTIVE]: "bg-gray-100 text-gray-500",
  [LocationStatus.UNDER_MAINTENANCE]: "bg-orange-100 text-orange-700",
};

export default function ChooseLocationModal({
  locations,
  currentLocation,
  onSave,
  disabled = false,
}: ChooseLocationModalProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedId, setSelectedId] = useState<number | null>(
    currentLocation?.id ?? null,
  );
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    setSelectedId(currentLocation?.id ?? null);
    openModal();
  };

  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      await onSave(selectedId);
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        size="sm"
        variant="outline"
        onClick={handleOpen}
        disabled={disabled}
        className="h-[38px]"
        startIcon={<FontAwesomeIcon icon={faLocationDot} />}
      >
        Choose Location
      </Button>

      {currentLocation && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {currentLocation.code} — {currentLocation.name}
        </span>
      )}

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[640px] p-6">
        <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white">
          Choose Storage Location
        </h4>
        <p className="mb-4 text-sm text-gray-500">
          Select a location from the list below.
        </p>

        <div className="max-h-[400px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {locations.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    No locations available.
                  </td>
                </tr>
              )}
              {locations.map((loc) => {
                const isSelected = selectedId === loc.id;
                return (
                  <tr
                    key={loc.id}
                    onClick={() => setSelectedId(loc.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-brand-50 dark:bg-brand-900/20"
                        : "bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span className="text-brand-500">✓</span>
                        )}
                        <span className="font-medium">{loc.code}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {loc.name}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          statusBadge[loc.locationStatus] ??
                          "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {loc.locationStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!selectedId || saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
