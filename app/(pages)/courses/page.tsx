import React from "react";
import HeroSection from "./_components/HeroSection";
import CourseCard from "./_components/CourseCard";
import ContactSection from "./_components/ContactSection";
import { courses } from "./_components/coursesData";

export default function CoursesPage() {
    return (
        <div className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            {/* <HeroSection /> */}

            {/* Courses Section */}
            <section className="py-12 ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                            Our Courses and Experiences
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Choose from our carefully curated selection of courses and experiences
                            designed to deepen your connection with sound healing.
                        </p>
                    </div>

                    {/* Course Cards - Stacked with alternating layout */}
                    <div className="space-y-8 lg:space-y-12">
                        {courses.map((course, index) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                variant={index % 2 === 0 ? "left" : "right"}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <ContactSection courses={courses} />
        </div>
    );
}
