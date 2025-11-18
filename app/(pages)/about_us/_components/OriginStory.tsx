import React from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const OriginStory = () => (
  <section className="py-24 md:py-32 px-6 md:px-12">
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
      <div className="md:pr-12">
        <Badge className="mb-4 bg-amber-100 border-amber-200 text-amber-800 tracking-wider">
          Our Heritage
        </Badge>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6 leading-tight">
          From a Sacred Vow to a Living Legacy
        </h2>
        <p className="text-lg text-stone-600 mb-6">
          In 1984, amidst the spiritual heart of Kathmandu, our founder, the
          late Mr. Kashiram Lama Tamang, embarked on a sacred mission: to
          preserve the ancient art of singing bowl craftsmanship. His vision was
          to create not just a workshop, but a sanctuary where the ancestral
          echoes of the Himalayas could resonate globally.
        </p>
        <blockquote className="border-l-4 border-amber-600 pl-6 italic text-stone-700 text-xl my-8">
          "We do not merely sell bowls. We are custodians of a sound that has
          healed for centuries. It is our duty to protect it."
        </blockquote>
        <p className="text-lg text-stone-600">
          He sought out the last remaining master artisans, families who had
          passed down this sacred knowledge for generations, and built a
          community founded on respect, authenticity, and shared purpose.
        </p>
      </div>
      <div className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-xl">
        <Image
          src="/assets/images/home/why/history.png"
          alt="Founder of the Himalayan Singing Bowl brand"
          width={500}
          height={600}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
    </div>
  </section>
);

export default OriginStory;
