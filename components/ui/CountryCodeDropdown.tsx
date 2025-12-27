"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

export interface CountryCode {
    code: string;
    name: string;
    dial_code: string;
    flag: string;
}

// Common country codes - can be extended as needed
export const countryCodes: CountryCode[] = [
    { code: "NP", name: "Nepal", dial_code: "+977", flag: "🇳🇵" },
    { code: "IN", name: "India", dial_code: "+91", flag: "🇮🇳" },
    { code: "US", name: "United States", dial_code: "+1", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", dial_code: "+44", flag: "🇬🇧" },
    { code: "AU", name: "Australia", dial_code: "+61", flag: "🇦🇺" },
    { code: "CA", name: "Canada", dial_code: "+1", flag: "🇨🇦" },
    { code: "DE", name: "Germany", dial_code: "+49", flag: "🇩🇪" },
    { code: "FR", name: "France", dial_code: "+33", flag: "🇫🇷" },
    { code: "IT", name: "Italy", dial_code: "+39", flag: "🇮🇹" },
    { code: "ES", name: "Spain", dial_code: "+34", flag: "🇪🇸" },
    { code: "JP", name: "Japan", dial_code: "+81", flag: "🇯🇵" },
    { code: "CN", name: "China", dial_code: "+86", flag: "🇨🇳" },
    { code: "KR", name: "South Korea", dial_code: "+82", flag: "🇰🇷" },
    { code: "SG", name: "Singapore", dial_code: "+65", flag: "🇸🇬" },
    { code: "AE", name: "UAE", dial_code: "+971", flag: "🇦🇪" },
    { code: "TH", name: "Thailand", dial_code: "+66", flag: "🇹🇭" },
    { code: "MY", name: "Malaysia", dial_code: "+60", flag: "🇲🇾" },
    { code: "ID", name: "Indonesia", dial_code: "+62", flag: "🇮🇩" },
    { code: "PH", name: "Philippines", dial_code: "+63", flag: "🇵🇭" },
    { code: "VN", name: "Vietnam", dial_code: "+84", flag: "🇻🇳" },
    { code: "BD", name: "Bangladesh", dial_code: "+880", flag: "🇧🇩" },
    { code: "PK", name: "Pakistan", dial_code: "+92", flag: "🇵🇰" },
    { code: "LK", name: "Sri Lanka", dial_code: "+94", flag: "🇱🇰" },
    { code: "NZ", name: "New Zealand", dial_code: "+64", flag: "🇳🇿" },
    { code: "ZA", name: "South Africa", dial_code: "+27", flag: "🇿🇦" },
    { code: "BR", name: "Brazil", dial_code: "+55", flag: "🇧🇷" },
    { code: "MX", name: "Mexico", dial_code: "+52", flag: "🇲🇽" },
    { code: "RU", name: "Russia", dial_code: "+7", flag: "🇷🇺" },
    { code: "NL", name: "Netherlands", dial_code: "+31", flag: "🇳🇱" },
    { code: "BE", name: "Belgium", dial_code: "+32", flag: "🇧🇪" },
    { code: "CH", name: "Switzerland", dial_code: "+41", flag: "🇨🇭" },
    { code: "AT", name: "Austria", dial_code: "+43", flag: "🇦🇹" },
    { code: "SE", name: "Sweden", dial_code: "+46", flag: "🇸🇪" },
    { code: "NO", name: "Norway", dial_code: "+47", flag: "🇳🇴" },
    { code: "DK", name: "Denmark", dial_code: "+45", flag: "🇩🇰" },
    { code: "FI", name: "Finland", dial_code: "+358", flag: "🇫🇮" },
    { code: "IE", name: "Ireland", dial_code: "+353", flag: "🇮🇪" },
    { code: "PT", name: "Portugal", dial_code: "+351", flag: "🇵🇹" },
    { code: "GR", name: "Greece", dial_code: "+30", flag: "🇬🇷" },
    { code: "TR", name: "Turkey", dial_code: "+90", flag: "🇹🇷" },
    { code: "IL", name: "Israel", dial_code: "+972", flag: "🇮🇱" },
    { code: "SA", name: "Saudi Arabia", dial_code: "+966", flag: "🇸🇦" },
    { code: "QA", name: "Qatar", dial_code: "+974", flag: "🇶🇦" },
    { code: "KW", name: "Kuwait", dial_code: "+965", flag: "🇰🇼" },
    { code: "BH", name: "Bahrain", dial_code: "+973", flag: "🇧🇭" },
    { code: "OM", name: "Oman", dial_code: "+968", flag: "🇴🇲" },
];

interface CountryCodeDropdownProps {
    value: string;
    onChange: (dialCode: string) => void;
    className?: string;
}

export default function CountryCodeDropdown({ value, onChange, className = "" }: CountryCodeDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Find selected country
    const selectedCountry = countryCodes.find(c => c.dial_code === value) || countryCodes[0];

    // Filter countries based on search
    const filteredCountries = countryCodes.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.dial_code.includes(searchQuery) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (country: CountryCode) => {
        onChange(country.dial_code);
        setIsOpen(false);
        setSearchQuery("");
    };

    return (
        <div ref={dropdownRef} className={`relative flex-shrink-0 ${className}`}>
            {/* Selected Value Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-20 flex items-center gap-1 px-3 py-3 bg-slate-100 border border-slate-300 rounded-l-lg hover:bg-slate-200 transition-colors cursor-pointer min-w-[100px] h-[50px]"
            >
                <span className="text-lg">{selectedCountry.flag}</span>
                <span className="text-sm font-medium text-slate-700">{selectedCountry.dial_code}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-slate-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search country..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A12717] focus:border-transparent"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Country List */}
                    <div className="max-h-48 overflow-y-auto">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                                <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => handleSelect(country)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 text-left transition-colors cursor-pointer ${country.dial_code === value ? "bg-[#A12717]/5 text-[#A12717]" : "text-slate-700"
                                        }`}
                                >
                                    <span className="text-lg">{country.flag}</span>
                                    <span className="flex-1 text-sm">{country.name}</span>
                                    <span className="text-sm text-slate-500">{country.dial_code}</span>
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-center text-sm text-slate-500">
                                No countries found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
