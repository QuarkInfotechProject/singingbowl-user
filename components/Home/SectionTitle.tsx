"use client";

interface SectionTitleProps {
  title: string;
}

export default function SectionTitle({ title }: SectionTitleProps) {
  return (
    <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-black tracking-tight w-full">
      {title}
    </h2>
  );
}
