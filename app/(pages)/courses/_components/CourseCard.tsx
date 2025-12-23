"use client";

import React from "react";
import Image from "next/image";
import { Clock, MapPin, DollarSign, ArrowRight, CheckCircle } from "lucide-react";

export interface Course {
    id: number;
    title: string;
    subtitle: string;
    duration: string;
    hoursPerDay?: string;
    price: string;
    location: string;
    description: string;
    highlights: string[];
    icon: React.ReactNode;
    image: string;
}

interface CourseCardProps {
    course: Course;
    variant?: "left" | "right";
}

export default function CourseCard({ course, variant = "left" }: CourseCardProps) {
    const mailtoLink = `mailto:singingbowlvillagenepal@gmail.com?subject=Booking Inquiry: ${encodeURIComponent(course.title)}&body=Hello,%0D%0A%0D%0AI am interested in booking the ${encodeURIComponent(course.title)}.%0D%0A%0D%0APreferred Date:%0D%0A%0D%0AThank you!`;

    const isRight = variant === "right";

    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500">
            <div className={`flex flex-col ${isRight ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
                {/* Image Section */}
                <div className="relative lg:w-1/2 h-64 lg:h-auto lg:min-h-[400px] overflow-hidden">
                    <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-${isRight ? "l" : "r"} from-black/40 via-black/20 to-transparent lg:hidden`} />
                    <div className={`absolute inset-0 bg-gradient-to-${isRight ? "l" : "r"} from-black/30 to-transparent hidden lg:block`} />

                    {/* Price Badge */}
                    <div className="absolute top-4 left-4 bg-[#A12717] text-white px-4 py-2 rounded-lg shadow-lg">
                        <span className="text-lg font-bold">{course.price}</span>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-slate-800 px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#A12717]" />
                        <span className="text-sm font-medium">{course.duration}</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
                    {/* Subtitle & Icon */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#A12717]/10 rounded-lg flex items-center justify-center text-[#A12717]">
                            {course.icon}
                        </div>
                        <span className="text-sm font-medium text-[#A12717] uppercase tracking-wider">
                            {course.subtitle}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
                        {course.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-slate-500 mb-4">
                        <MapPin className="w-4 h-4 text-[#A12717]" />
                        <span className="text-sm">{course.location}</span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 leading-relaxed mb-5">
                        {course.description}
                    </p>

                    {/* Highlights */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {course.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-[#A12717] mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-slate-700">{highlight}</span>
                            </div>
                        ))}
                    </div>

                    {/* Hours Info */}
                    {course.hoursPerDay && (
                        <div className="flex items-center gap-2 text-slate-500 mb-5 pb-5 border-b border-slate-100">
                            <Clock className="w-4 h-4 text-[#A12717]" />
                            <span className="text-sm">{course.hoursPerDay}</span>
                        </div>
                    )}

                    {/* CTA Button */}
                    <a
                        href={mailtoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-[#A12717] hover:bg-[#8B1F12] text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-300 hover:shadow-lg group/btn"
                    >
                        Book This Experience
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </a>
                </div>
            </div>
        </div>
    );
}
