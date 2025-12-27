"use client";

import React, { useState } from "react";
import { X, Calendar, Phone, Send } from "lucide-react";
import CountryCodeDropdown from "@/components/ui/CountryCodeDropdown";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseTitle: string;
    onSubmit: (data: { preferredDate: string; contactInfo: string; contactType: string }) => void;
}

export default function BookingModal({ isOpen, onClose, courseTitle, onSubmit }: BookingModalProps) {
    const [preferredDate, setPreferredDate] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [countryCode, setCountryCode] = useState("+977"); // Default to Nepal
    const [emailAddress, setEmailAddress] = useState("");
    const [contactType, setContactType] = useState("whatsapp");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Combine country code and phone number for phone/whatsapp, or use email
        const contactInfo = contactType === "email"
            ? emailAddress
            : `${countryCode} ${phoneNumber}`;

        onSubmit({ preferredDate, contactInfo, contactType });

        // Reset form
        setPreferredDate("");
        setPhoneNumber("");
        setCountryCode("+977");
        setEmailAddress("");
        setContactType("whatsapp");
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 min-h-screen h-full"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-visible animate-in fade-in zoom-in duration-200 relative z-[10000]">
                {/* Header */}
                <div className="bg-[#A12717] rounded-t-2xl text-white px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Book: {courseTitle}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">


                    {/* Contact Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            <Phone className="w-4 h-4 inline-block mr-2 text-[#A12717]" />
                            Contact Method
                        </label>
                        <div className="flex gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="contactType"
                                    value="whatsapp"
                                    checked={contactType === "whatsapp"}
                                    onChange={(e) => setContactType(e.target.value)}
                                    className="w-4 h-4 text-[#A12717] focus:ring-[#A12717]"
                                />
                                <span className="text-sm text-slate-700">WhatsApp</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="contactType"
                                    value="phone"
                                    checked={contactType === "phone"}
                                    onChange={(e) => setContactType(e.target.value)}
                                    className="w-4 h-4 text-[#A12717] focus:ring-[#A12717]"
                                />
                                <span className="text-sm text-slate-700">Phone</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="contactType"
                                    value="email"
                                    checked={contactType === "email"}
                                    onChange={(e) => setContactType(e.target.value)}
                                    className="w-4 h-4 text-[#A12717] focus:ring-[#A12717]"
                                />
                                <span className="text-sm text-slate-700">Email</span>
                            </label>
                        </div>
                    </div>

                    {/* Contact Info - Phone with Country Code or Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            {contactType === "email" ? "Email Address" :
                                contactType === "whatsapp" ? "WhatsApp Number" : "Phone Number"}
                        </label>

                        {contactType === "email" ? (
                            <input
                                type="email"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-0 focus:border-[#A12717] transition-all"
                            />
                        ) : (
                            <div className="flex">
                                <CountryCodeDropdown
                                    value={countryCode}
                                    onChange={setCountryCode}
                                />
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="98XXXXXXXX"
                                    required
                                    className="flex-1 min-w-0 px-4 py-3 h-[50px] border border-slate-300 border-l-0 rounded-r-lg focus:outline-none focus:ring-0 focus:border-gray-300 transition-all"
                                />
                            </div>
                        )}
                    </div>

                    {/* Preferred Date */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            <Calendar className="w-4 h-4 inline-block mr-2 text-[#A12717]" />
                            Preferred Date
                        </label>
                        <input
                            type="date"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A12717] focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-[#A12717] hover:bg-[#8B1F12] text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-300 hover:shadow-lg cursor-pointer"
                    >
                        <Send className="w-5 h-5" />
                        Send Inquiry
                    </button>

                    <p className="text-xs text-slate-500 text-center">
                        This will open Gmail with your inquiry details pre-filled.
                    </p>
                </form>
            </div>
        </div>
    );
}
