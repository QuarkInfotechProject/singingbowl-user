import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative h-[80vh] border-b border-slate-200 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/images/md/bg.webp"
                    alt="Singing Bowls Background"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-white/30" />
            </div>

            {/* Content - Centered vertically and horizontally */}
            <div className="relative z-10 h-full flex items-center justify-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#A12717]/20 rounded-full px-4 py-1.5 mb-6 shadow-sm">
                            <Sparkles className="w-4 h-4 text-[#A12717]" />
                            <span className="text-sm font-medium text-[#A12717]">
                                Transform Your Journey
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 drop-shadow-sm">
                            Courses & Experiences
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto">
                            Immerse yourself in the ancient art of sound healing. From
                            beginner sessions to professional courses, discover the
                            transformative power of Himalayan singing bowls.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
