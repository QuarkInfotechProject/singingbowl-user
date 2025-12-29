"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import CountryCodeDropdown from "@/components/ui/CountryCodeDropdown";
import countries from "@/data/countries.json";

interface AddressFormProps {
  initialData?: any;
  isEdit?: boolean;
  addressUuid?: string;
  redirect?: string;
  onSubmit: (data: any) => Promise<void>;
}

const defaultFormData = {
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
  isDefault: true,
  label: "Home",
  countryId: "",
  countryCode: "NP",
  countryName: "Nepal",
  provinceName: "",
  cityName: "",
  zoneName: "",
};

export default function AddressForm({
  initialData = null,
  isEdit = false,
  addressUuid = "",
  redirect = "/profile",
  onSubmit,
}: AddressFormProps) {
  const router = useRouter();

  // Parse phone number to extract country code and number
  const parsePhoneNumber = (phone: string) => {
    if (!phone) return { code: "+977", number: "" };
    // Match pattern like "+977 9860269571" or "+977-9860269571"
    const match = phone.match(/^(\+\d+)[\s-]?(.+)$/);
    if (match) {
      return { code: match[1], number: match[2].trim() };
    }
    return { code: "+977", number: phone };
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [mobileCountryCode, setMobileCountryCode] = useState("+977");
  const [backupMobileCountryCode, setBackupMobileCountryCode] = useState("+977");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load initial data for edit mode
  useEffect(() => {
    if (initialData) {
      const mobileParsed = parsePhoneNumber(initialData.mobile || "");
      const backupMobileParsed = parsePhoneNumber(initialData.backupMobile || "");

      setMobileCountryCode(mobileParsed.code);
      setBackupMobileCountryCode(backupMobileParsed.code);

      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        mobile: mobileParsed.number,
        backupMobile: backupMobileParsed.number,
        addressLine1: initialData.addressLine1 || "",
        addressLine2: initialData.addressLine2 || "",
        postalCode: initialData.postalCode || "",
        landmark: initialData.landmark || "",
        addressType: initialData.addressType || "home",
        deliveryInstructions: initialData.deliveryInstructions || "",
        isDefault: initialData.isDefault || false,
        label: initialData.label || "Home",
        countryId: initialData.countryId || "",
        countryCode: initialData.countryCode || "NP",
        countryName: initialData.countryName || "Nepal",
        provinceName: initialData.provinceName || "",
        cityName: initialData.cityName || "",
        zoneName: initialData.zoneName || "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    let newFormData = { ...formData, [name]: newValue };

    // Automatically set label based on addressType
    if (name === "addressType") {
      const labelValue = newValue as string;
      newFormData.label = labelValue.charAt(0).toUpperCase() + labelValue.slice(1);
    }

    setFormData(newFormData);

    // Clear error when user types
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
        countryCode: selectedCountry.code,
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
    if (!isEdit && !formData.backupMobile.trim()) newErrors.backupMobile = "Backup mobile is required";
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

      // Combine country code and phone numbers
      const fullMobile = `${mobileCountryCode} ${formData.mobile}`;
      const fullBackupMobile = formData.backupMobile 
        ? `${backupMobileCountryCode} ${formData.backupMobile}` 
        : "";

      // Prepare payload
      const payload = {
        ...formData,
        mobile: fullMobile,
        backupMobile: fullBackupMobile,
        countryId: formData.countryCode === "NP" ? "1" : "1",
        provinceId: "1",
        cityId: "1",
        zoneId: "1",
        ...(isEdit && { uuid: addressUuid }),
      };

      await onSubmit(payload);
      toast.success(`Address ${isEdit ? "updated" : "added"} successfully!`);
      router.push(redirect);
    } catch (error: any) {
      console.error(`Failed to ${isEdit ? "update" : "add"} address`, error);

      // Handle backend validation errors
      const backendErrors = error?.response?.data?.errors;
      if (backendErrors && typeof backendErrors === "object") {
        const newErrors: { [key: string]: string } = {};
        Object.keys(backendErrors).forEach((field) => {
          const messages = backendErrors[field];
          if (Array.isArray(messages) && messages.length > 0) {
            newErrors[field] = messages[0];
          }
        });
        setErrors(newErrors);
        toast.error("Please fix the validation errors below");
      } else {
        toast.error(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            `Failed to ${isEdit ? "update" : "add"} address`
        );
      }
    } finally {
      setSaving(false);
    }
  };

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
              {isEdit ? "Edit Address" : "Add New Address"}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {isEdit ? "Update" : "Enter"} your delivery address details
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100"
        >
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
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.firstName ? "border-red-500" : "border-slate-300"
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
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.lastName ? "border-red-500" : "border-slate-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-slate-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Mobile Number with Country Code */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mobile Number *
              </label>
              <div className="flex">
                <CountryCodeDropdown
                  value={mobileCountryCode}
                  onChange={setMobileCountryCode}
                  className="[&_button]:rounded-r-none [&_button]:h-[50px]"
                />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`flex-1 min-w-0 px-4 py-3 h-[50px] rounded-r-lg bg-slate-50 border ${
                    errors.mobile ? "border-red-500" : "border-slate-300"
                  } border-l-0 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-blue-500 transition-all`}
                  placeholder="9860269571"
                />
              </div>
              {errors.mobile && (
                <p className="text-sm text-red-500 mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* Backup Mobile with Country Code */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Backup Mobile {!isEdit && "*"}
              </label>
              <div className="flex">
                <CountryCodeDropdown
                  value={backupMobileCountryCode}
                  onChange={setBackupMobileCountryCode}
                  className="[&_button]:rounded-r-none [&_button]:h-[50px]"
                />
                <input
                  type="tel"
                  name="backupMobile"
                  value={formData.backupMobile}
                  onChange={handleChange}
                  className={`flex-1 min-w-0 px-4 py-3 h-[50px] rounded-r-lg bg-slate-50 border ${
                    errors.backupMobile ? "border-red-500" : "border-slate-300"
                  } border-l-0 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-blue-500 transition-all`}
                  placeholder="9843488252"
                />
              </div>
              {errors.backupMobile && (
                <p className="text-sm text-red-500 mt-1">{errors.backupMobile}</p>
              )}
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
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.addressLine1 ? "border-red-500" : "border-slate-300"
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
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.countryId ? "border-red-500" : "border-slate-300"
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
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.postalCode ? "border-red-500" : "border-slate-300"
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

            {/* Address Type */}
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
                <option value="office">Office</option>
                <option value="other">Other</option>
              </select>
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
            {isEdit && (
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
            )}

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
                    {isEdit ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>{isEdit ? "Update Address" : "Save Address"}</>
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