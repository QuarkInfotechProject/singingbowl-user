"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2, Camera, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchUserProfile, updateUserProfile } from "@/lib/apiItems";
import { ProfileFormData } from "./types";
import Image from "next/image";

export default function ProfileDetails() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<ProfileFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        profilePicture: "",
        gender: "",
        dateOfBirth: "",
        offersNotification: false,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const res = await fetchUserProfile();
            if (res?.data) {
                const { fullName, email, phone, profilePicture, gender, dateOfBirth, offersNotification } = res.data;
                const nameParts = (fullName || "").split(" ");
                const firstName = nameParts[0] || "";
                const lastName = nameParts.slice(1).join(" ") || "";

                setFormData({
                    firstName,
                    lastName,
                    email: email || "",
                    phone: phone || "",
                    profilePicture: profilePicture || "",
                    gender: gender || "",
                    dateOfBirth: dateOfBirth || "",
                    offersNotification: !!offersNotification,
                });
            }
        } catch (error) {
            console.error("Failed to load profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "offersNotification") {
            const target = e.target as HTMLInputElement;
            setFormData({ ...formData, [name]: target.checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();

            const data = new FormData();
            data.append("fullName", fullName);
            data.append("phoneNumber", formData.phone);
            data.append("gender", formData.gender || "");
            data.append("dateOfBirth", formData.dateOfBirth || "");
            data.append("offersNotification", formData.offersNotification ? "1" : "0");

            if (selectedFile) {
                data.append("profilePicture", selectedFile);
            }

            const res = await updateUserProfile(data);
            if (res.code === 0 || res.success) {
                toast.success(res.message || "Profile updated successfully!");
                // Reload profile to ensure data consistency
                loadProfile();
            } else {
                toast.error(res.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Profile Details
            </h1>

            <div className="flex flex-col items-center mb-8">
                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-100 relative">
                        {previewUrl || formData.profilePicture ? (
                            <Image
                                src={previewUrl || formData.profilePicture}
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <User size={48} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Camera className="text-white h-8 w-8" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 border-2 border-white shadow-sm">
                        <Camera className="text-white h-4 w-4" />
                    </div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
                <p className="mt-2 text-sm text-gray-500">Click to change profile picture</p>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleProfileChange}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleProfileChange}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none transition"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleProfileChange}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={formData.gender || ""}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth || ""}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="offersNotification"
                        name="offersNotification"
                        checked={!!formData.offersNotification}
                        onChange={handleProfileChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-4 w-4"
                    />
                    <label htmlFor="offersNotification" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                        Receive email notifications about special offers and updates
                    </label>
                </div>

                <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                >
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </div>
        </div>
    );
}
