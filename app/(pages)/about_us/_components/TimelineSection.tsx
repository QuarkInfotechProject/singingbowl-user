import React from "react";
import { Badge } from "@/components/ui/badge";

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface TimelineSectionProps {
  milestones: Milestone[];
}

const TimelineSection = ({
  milestones,
}: TimelineSectionProps) => (
  <section className="py-24 md:py-32 px-6 md:px-12">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-amber-100 border-amber-200 text-amber-800 tracking-wider">
          Our Journey
        </Badge>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
          A Timeline of Resonance
        </h2>
      </div>
      <div className="relative">
        <div
          className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-stone-200 hidden md:block"
          style={{ transform: "translateX(-1px)" }}
        ></div>
        {milestones.map((milestone, idx) => (
          <div
            key={idx}
            className={`mb-8 flex justify-between items-center w-full ${
              idx % 2 === 0 ? "flex-row-reverse" : ""
            }`}
          >
            <div className="hidden md:block w-5/12"></div>
            <div className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-stone-50 border-2 border-amber-300 shadow-md">
              {milestone.icon}
            </div>
            <div className="w-full md:w-5/12 bg-white p-6 rounded-lg shadow-md border border-stone-200">
              <Badge className="bg-amber-100 border-amber-200 text-amber-800 mb-2">
                {milestone.year}
              </Badge>
              <h3 className="text-xl font-bold font-serif text-stone-800 mb-2">
                {milestone.title}
              </h3>
              <p className="text-stone-600 text-sm">{milestone.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TimelineSection;
