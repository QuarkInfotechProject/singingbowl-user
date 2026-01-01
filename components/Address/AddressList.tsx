"use client";

import React, { useEffect, useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchAddresses } from "@/lib/apiItems";
import { Address } from "@/types/address.types";
import AddressCard from "./AddressCard";
import { AddressSkeleton } from "@/components/ui/skeletons";

interface AddressListProps {
    onAddressSelect?: (address: Address | null) => void;
    selectedAddressId?: string | null;
    selectable?: boolean;
    showActions?: boolean;
    redirectPath?: string;
}

const AddressList: React.FC<AddressListProps> = ({
    onAddressSelect,
    selectedAddressId,
    selectable = false,
    showActions = true,
    redirectPath = "",
}) => {
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            setLoading(true);
            const res = await fetchAddresses();

            // The API returns a single address under data.address, not an array
            // Since user can only have one address, we wrap it in an array
            let addressList: Address[] = [];
            if (res?.data?.address) {
                // Single address object - wrap in array
                addressList = [res.data.address];
            } else if (Array.isArray(res?.data)) {
                // Fallback: if it's already an array
                addressList = res.data;
            }


            setAddresses(addressList);

            // Auto-select default address if selectable and no selection
            if (selectable && !selectedAddressId && addressList.length > 0) {
                const defaultAddr = addressList.find((a: Address) => a.isDefault) || addressList[0];
                onAddressSelect?.(defaultAddr);
            }
        } catch (error) {
            console.error("Failed to load addresses", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        const redirect = redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : "";
        router.push(`/address/add${redirect}`);
    };

    const handleEdit = (uuid: string) => {
        const redirect = redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : "";
        router.push(`/address/edit/${uuid}${redirect}`);
    };

    const handleSelect = (uuid: string) => {
        const selected = addresses.find((a) => a.uuid === uuid) || null;
        onAddressSelect?.(selected);
    };

    if (loading) {
        return <AddressSkeleton />;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                    {selectable ? "Select Delivery Address" : "Your Address"}
                </h3>
                {/* Only show Add Address button if no address exists (user can only have one) */}
                {addresses.length === 0 && (
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#A12717] rounded-lg hover:bg-blue-100 transition font-medium text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Address
                    </button>
                )}
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                    <p className="text-slate-600 mb-4">No addresses added yet</p>
                    <button
                        onClick={handleAddNew}
                        className="px-6 py-2 bg-[#A12717] text-white rounded-lg hover:opacity-90 transition font-medium"
                    >
                        Add Your First Address
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {addresses.map((address) => (
                        <AddressCard
                            key={address.uuid}
                            address={address}
                            isSelected={selectedAddressId === address.uuid}
                            onSelect={handleSelect}
                            onEdit={handleEdit}
                            showActions={showActions}
                            selectable={selectable}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressList;
