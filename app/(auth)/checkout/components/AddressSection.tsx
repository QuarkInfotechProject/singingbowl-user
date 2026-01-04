"use client";
import React from 'react';
import { Truck } from 'lucide-react';
import AddressList from '@/components/Address/AddressList';
import { Address } from '@/types/address.types';

interface AddressSectionProps {
    selectedAddressId?: string;
    onAddressSelect: (address: Address | null) => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({ selectedAddressId, onAddressSelect }) => {
    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
                <Truck className="w-5 h-5 md:w-6 md:h-6 text-slate-700" />
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    Delivery Address
                </h2>
            </div>

            <AddressList
                onAddressSelect={onAddressSelect}
                selectedAddressId={selectedAddressId}
                selectable={true}
                showActions={true}
                redirectPath="/checkout"
            />
        </div>
    );
};

export default AddressSection;
