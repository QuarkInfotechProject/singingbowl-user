"use client";

import React from "react";
import { ExpandableSection } from "./ExpandableSection";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface DetailItem {
  id: string;
  title: string;
  content: string;
}

const DETAIL_ITEMS: DetailItem[] = [
  {
    id: "features",
    title: "KEY FEATURES",
    content:
      "Premium singing bowl crafted from traditional bronze alloy. Hand-tuned for optimal resonance and therapeutic sound. Includes mallets for proper playing technique.",
  },
  {
    id: "ingredients",
    title: "INGREDIENTS",
    content:
      "Bronze (70% Copper, 30% Tin), Natural Wood Mallet Handle, Eco-friendly Felt Padding",
  },
  {
    id: "how_to_use",
    title: "HOW TO USE",
    content:
      "To use a singing bowl, place it in the palm of your non-dominant hand or on a stable, non-touching surface, then gently strike the bowl with a mallet. ",
  },
  {
    id: "quality",
    title: "QUALITY",
    content:
      "Handcrafted by master artisans with decades of experience. Each bowl is individually tested for acoustic quality and durability.",
  },
];

export function DetailsSection() {
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
