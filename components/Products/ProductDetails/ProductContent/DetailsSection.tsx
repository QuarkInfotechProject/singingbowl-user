"use client";

import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface DetailsSectionProps {
  description?: string;
  additionalDescription?: string;
}

export function DetailsSection({ description, additionalDescription }: DetailsSectionProps) {
  // Build dynamic items from props, falling back to defaults
  const DETAIL_ITEMS = [
    {
      id: "description",
      title: "PRODUCT DESCRIPTION",
      content: description || "Premium singing bowl crafted from traditional bronze alloy. Hand-tuned for optimal resonance and therapeutic sound.",
    },
    {
      id: "additional",
      title: "ADDITIONAL INFORMATION",
      content: additionalDescription || "Includes mallets for proper playing technique.",
    },
    {
      id: "how_to_use",
      title: "HOW TO USE",
      content:
        "To use a singing bowl, place it in the palm of your non-dominant hand or on a stable, non-touching surface, then gently strike the bowl with a mallet.",
    },
    {
      id: "quality",
      title: "QUALITY",
      content:
        "Handcrafted by master artisans with decades of experience. Each bowl is individually tested for acoustic quality and durability.",
    },
  ];

  return (
    <Accordion type="single" collapsible className="space-y-3">
      {DETAIL_ITEMS.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className="hover:no-underline">
            <span className="text-sm font-semibold text-gray-900 tracking-wide">
              {item.title}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-600 text-sm leading-relaxed font-light">
              {item.content}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
