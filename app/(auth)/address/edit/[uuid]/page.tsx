"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import { fetchAddressById, updateAddress } from "@/lib/apiItems";
import { AddressFormData } from "@/types/address.types";
import { toast } from "sonner";
import countries from "@/data/countries.json";

const initialFormData: AddressFormData = {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    backupMobile: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    landmark: "",
    addressType: "home",
    deliveryInstructions: "",
    isDefault: false,
    label: "Home",
    countryId: "1",
    countryName: "NP",
    provinceId: "1",
    provinceName: "Bagmati",
    cityId: "65",
    cityName: "Kathmandu Valley",
    zoneId: "1247",
    zoneName: "Kumaripati",
};

function EditAddressContent() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const uuid = params.uuid as string;
    const redirect = searchParams.get("redirect") || "/profile";

    const [formData, setFormData] = useState<AddressFormData>(initialFormData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (uuid) {
            loadAddress();
        }
    }, [uuid]);

    const loadAddress = async () => {
        try {
            setLoading(true);
            const res = await fetchAddressById(uuid);
            const data = res?.data || res;
            if (data) {
                setFormData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    mobile: data.mobile || "",
                    backupMobile: data.backupMobile || "",
                    addressLine1: data.addressLine1 || "",
                    addressLine2: data.addressLine2 || "",
                    postalCode: data.postalCode || "",
                    landmark: data.landmark || "",
                    addressType: data.addressType || "home",
                    deliveryInstructions: data.deliveryInstructions || "",
                    isDefault: data.isDefault || false,
                    label: data.label || "",
                    countryId: data.countryId || "1",
                    countryName: data.countryName || "",
                    provinceId: data.provinceId || "",
                    provinceName: data.provinceName || "",
                    cityId: data.cityId || "",
                    cityName: data.cityName || "",
                    zoneId: data.zoneId || "",
                    zoneName: data.zoneName || "",
                });
            }
        } catch (error) {
            console.error("Failed to load address", error);
            toast.error("Failed to load address");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
        setFormData((prev) => ({ ...prev, [name]: newValue }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCode = e.target.value;
        const selectedCountry = countries.find((c) => c.code === selectedCode);
        if (selectedCountry) {
            setFormData((prev) => ({
                ...prev,
                countryId: selectedCountry.code,
                countryName: selectedCountry.name,
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
        if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
        if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setSaving(true);
            await updateAddress({ ...formData, uuid });
            toast.success("Address updated successfully!");
            router.push(redirect);
        } catch (error: any) {
            console.error("Failed to update address", error);
            toast.error(error?.response?.data?.message || "Failed to update address");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <MapPin className="w-6 h-6" />
                            Edit Address
                        </h1>
                        <p className="text-sm text-slate-600 mt-1">
                            Update your delivery address details
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                    <div className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.firstName ? "border-red-500" : "border-slate-300"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                    placeholder="John"
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.lastName ? "border-red-500" : "border-slate-300"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                    placeholder="Doe"
                                />
                                {errors.lastName && (
                                    <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Contact Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-slate-300"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                    placeholder="john@example.com"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Mobile Number *
                                </label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.mobile ? "border-red-500" : "border-slate-300"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                    placeholder="9860269571"
                                />
                                {errors.mobile && (
                                    <p className="text-sm text-red-500 mt-1">{errors.mobile}</p>
                                )}
                            </div>
                        </div>

                        {/* Backup Mobile */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Backup Mobile (Optional)
                            </label>
                            <input
                                type="tel"
                                name="backupMobile"
                                value={formData.backupMobile}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Alternative contact number"
                            />
                        </div>

                        {/* Address Line 1 */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Address Line 1 *
                            </label>
                            <input
                                type="text"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.addressLine1 ? "border-red-500" : "border-slate-300"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                placeholder="Street address, house number"
                            />
                            {errors.addressLine1 && (
                                <p className="text-sm text-red-500 mt-1">{errors.addressLine1}</p>
                            )}
                        </div>

                        {/* Address Line 2 */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Address Line 2 (Optional)
                            </label>
                            <input
                                type="text"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Near the Monastery"
                            />
                        </div>

                        {/* Location Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Country *
                                </label>
                                <select
                                    name="countryId"
                                    value={formData.countryId}
                                    onChange={handleCountryChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.countryId ? "border-red-500" : "border-slate-300"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                >
                                    <option value="">Select a country</option>
                                    {countries.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.countryId && (
                                    <p className="text-sm text-red-500 mt-1">{errors.countryId}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Province/State
                                </label>
                                <input
                                    type="text"
                                    name="provinceName"
                                    value={formData.provinceName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Bagmati"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="cityName"
                                    value={formData.cityName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Kathmandu Valley"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Zone/Area
                                </label>
                                <input
                                    type="text"
                                    name="zoneName"
                                    value={formData.zoneName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Kumaripati"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Postal Code *
                                </label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.postalCode ? "border-red-500" : "border-slate-300"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                    placeholder="44600"
                                />
                                {errors.postalCode && (
                                    <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>
                                )}
                            </div>
                        </div>

                        {/* Landmark */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Landmark (Optional)
                            </label>
                            <input
                                type="text"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Opposite to grocery store"
                            />
                        </div>

                        {/* Address Type & Label */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Address Type
                                </label>
                                <select
                                    name="addressType"
                                    value={formData.addressType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                >
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Label
                                </label>
                                <input
                                    type="text"
                                    name="label"
                                    value={formData.label}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Home, Office, etc."
                                />
                            </div>
                        </div>

                        {/* Delivery Instructions */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Delivery Instructions (Optional)
                            </label>
                            <textarea
                                name="deliveryInstructions"
                                value={formData.deliveryInstructions}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                                placeholder="Call upon arrival, leave at door, etc."
                            />
                        </div>

                        {/* Default Address Checkbox */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isDefault"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="isDefault" className="text-sm font-medium text-slate-700">
                                Set as default address
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-[#A12717] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Address"
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-3 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function EditAddressPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        }>
            <EditAddressContent />
        </Suspense>
    );
}
