"use client";

import React from "react";
import { MapPin, Edit2, Trash2, CheckCircle } from "lucide-react";
import { Address } from "@/types/address.types";

interface AddressCardProps {
    address: Address;
    isSelected?: boolean;
    onSelect?: (uuid: string) => void;
    onEdit?: (uuid: string) => void;
    onDelete?: (uuid: string) => void;
    showActions?: boolean;
    selectable?: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({
    address,
    isSelected = false,
    onSelect,
    onEdit,
    onDelete,
    showActions = true,
    selectable = false,
}) => {
    return (
        <div
            onClick={() => selectable && onSelect?.(address.uuid || "")}
            className={`p-4 rounded-xl border-2 transition ${selectable ? "cursor-pointer" : ""
                } ${isSelected
                    ? "border-green-500 bg-green-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">
                            {address.firstName} {address.lastName}
                        </span>
                        {address.isDefault && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                Default
                            </span>
                        )}
                        <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full capitalize">
                            {address.addressType}
                        </span>
                    </div>

                    <div className="text-sm text-slate-600 mt-2 space-y-0.5">
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                            <div>
                                <p>{address.addressLine1}</p>
                                {address.addressLine2 && <p>{address.addressLine2}</p>}
                                <p>
                                    {address.cityName}, {address.provinceName} {address.postalCode}
                                </p>
                                <p>{address.countryName}</p>
                            </div>
                        </div>

                        {address.landmark && (
                            <div className="text-slate-500 text-xs mt-1">
                                Landmark: {address.landmark}
                            </div>
                        )}

                        <div className="mt-2 pt-2 border-t border-slate-100">
                            <p>📞 {address.mobile}</p>
                            <p>✉️ {address.email}</p>
                        </div>

                        {address.deliveryInstructions && (
                            <div className="mt-2 text-xs text-slate-500 italic">
                                "{address.deliveryInstructions}"
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isSelected && selectable && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    )}

                    {showActions && (
                        <div className="flex gap-1">
                            {onEdit && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(address.uuid || "");
                                    }}
                                    className="p-2 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    title="Edit"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(address.uuid || "");
                                    }}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddressCard;
