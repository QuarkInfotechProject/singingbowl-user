import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Value {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface LegacyAndImpactProps {
  values: Value[];
  faqItems: FaqItem[];
}

const LegacyAndImpact = ({
  values,
  faqItems,
}: LegacyAndImpactProps) => (
  <section className="py-24 md:py-32 px-6 md:px-12 bg-gradient-t0-b from-stone-100 to-bg-white border-t border-stone-200">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-amber-100 border-amber-200 text-amber-800 tracking-wider">
          Our Enduring Legacy
        </Badge>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
          The Resonance of Our Values
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-12 mb-20">
        {values.map((value, idx) => (
          <div key={idx} className="flex items-start gap-6">
            <div className="flex-shrink-0 p-3 bg-amber-100/70 rounded-full">
              {value.icon}
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-stone-800 mb-2">
                {value.title}
              </h3>
              <p className="text-stone-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-16 bg-stone-200" />

      <div className="text-center mb-16">
        <Badge className="mb-4 bg-stone-200 border-stone-300 text-stone-600 tracking-wider">
          Deeper Wisdom
        </Badge>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-6">
          Your Questions Answered
        </h2>
      </div>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {faqItems.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="border-b border-stone-200"
          >
            <AccordionTrigger className="py-4 text-lg text-left font-medium text-stone-800 hover:text-amber-700">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 text-base text-stone-600 leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default LegacyAndImpact;
