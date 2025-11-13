
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface ExpandableSectionProps {
  title: string;
  content: string;
  value: string;
}

export function ExpandableSection({
  title,
  content,
  value,
}: ExpandableSectionProps) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={value}>
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-semibold text-gray-900 tracking-wide">
              {title}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-600 text-sm leading-relaxed font-light">
            {content}
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
