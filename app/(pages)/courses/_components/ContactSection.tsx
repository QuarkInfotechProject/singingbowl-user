"use client";

import React, { useState } from "react";
import { Mail, Calendar, MapPin, ChevronDown, Send } from "lucide-react";
import { Course } from "./CourseCard";
import BookingModal from "./BookingModal";

interface ContactSectionProps {
    courses: Course[];
}

export default function ContactSection({ courses }: ContactSectionProps) {
    const [selectedCourse, setSelectedCourse] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleInquiryClick = () => {
        if (!selectedCourse) {
            // If no course selected, prompt to select one
            setIsDropdownOpen(true);
            return;
        }
        setIsModalOpen(true);
    };

    const handleBookingSubmit = (data: { preferredDate: string; contactInfo: string; contactType: string }) => {
        // Format the date nicely
        const formattedDate = new Date(data.preferredDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Build email body with user's information
        const subject = `Course Inquiry: ${selectedCourse}`;
        const body = `Hello,

I am interested in learning more about the ${selectedCourse}.

Preferred Date: ${formattedDate}

Contact Information:
${data.contactType.charAt(0).toUpperCase() + data.contactType.slice(1)}: ${data.contactInfo}

Thank you!`;

        // Construct Gmail compose URL
        const gmailLink = `https://mail.google.com/mail/?view=cm&to=singingbowlvillagenepal@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Close modal and open Gmail
        setIsModalOpen(false);
        window.open(gmailLink, '_blank');
    };

    const handleDirectMailClick = () => {
        const gmailLink = 'https://mail.google.com/mail/?view=cm&to=singingbowlvillagenepal@gmail.com';
        window.open(gmailLink, '_blank');
    };

    return (
        <>
            <section className="py-12 md:py-16 bg-white border-t border-slate-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-stone-50 border border-slate-200 rounded-xl p-6 md:p-10">
                        <div className="text-center mb-8">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#A12717] rounded-xl mb-4">
                                <Mail className="w-6 h-6 text-white" />
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                                Bookings & Queries
                            </h2>

                            {/* Description */}
                            <p className="text-slate-600 max-w-lg mx-auto">
                                Select your course of interest and send us an email. Include your
                                preferred date so we can assist you promptly.
                            </p>
                        </div>

                        {/* Course Selection Dropdown */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Select a Course
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-[#A12717] focus:border-transparent transition-all cursor-pointer"
                                >
                                    <span className={selectedCourse ? "text-slate-900" : "text-slate-400"}>
                                        {selectedCourse || "Choose a course..."}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                                        {courses.map((course) => (
                                            <button
                                                key={course.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedCourse(course.title);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors cursor-pointer ${selectedCourse === course.title ? "bg-[#A12717]/5 text-[#A12717]" : "text-slate-700"
                                                    }`}
                                            >
                                                <span className="text-[#A12717]">{course.icon}</span>
                                                <div>
                                                    <span className="font-medium block">{course.title}</span>
                                                    <span className="text-sm text-slate-500">{course.price}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Email CTA - Opens modal */}
                        <button
                            type="button"
                            onClick={handleInquiryClick}
                            className="w-full flex items-center justify-center gap-2 bg-[#A12717] hover:bg-[#8B1F12] text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-300 hover:shadow-lg cursor-pointer"
                        >
                            <Send className="w-5 h-5" />
                            Send Inquiry Email
                        </button>

                        {/* Email Display */}
                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <p className="text-center text-sm text-slate-500 mb-2">
                                Or email us directly at
                            </p>
                            <button
                                type="button"
                                onClick={handleDirectMailClick}
                                className="block w-full text-center text-[#A12717] hover:text-[#8B1F12] font-medium transition-colors cursor-pointer bg-transparent border-none"
                            >
                                singingbowlvillagenepal@gmail.com
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#A12717]" />
                                <span>Flexible Scheduling</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#A12717]" />
                                <span>Thamel, Kathmandu</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking Modal */}
            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                courseTitle={selectedCourse || "Course Inquiry"}
                onSubmit={handleBookingSubmit}
            />
        </>
    );
}
