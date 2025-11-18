import React from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Artisan {
  name: string;
  role: string;
  experience: string;
  quote: string;
  specialty: string;
  image: string;
}

interface ArtisansSectionProps {
  artisans: Artisan[];
}

const ArtisansSection: React.FC<ArtisansSectionProps> = ({ artisans }) => (
  <section className="py-24 md:py-32 px-6 md:px-12">
    <div className="text-center mb-20 md:mb-24">
      <Badge className="mb-4 bg-amber-100 border-amber-200 text-amber-800 tracking-wider">
        Guardians of the Craft
      </Badge>
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
        Meet Our Managing Directors
      </h2>
      <p className="text-lg text-stone-600 leading-relaxed max-w-3xl mx-auto">
        Each bowl carries the soul of its maker. Your purchase directly supports
        these families, empowering them to pass their sacred knowledge to the
        next generation.
      </p>
    </div>

    <div className="max-w-6xl mx-auto space-y-24">
      {artisans.map((artisan, idx) => (
        <div
          key={idx}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
        >
          <div
            className={`relative h-[500px] rounded-lg overflow-hidden shadow-xl ${
              idx % 2 !== 0 ? "md:order-last" : ""
            }`}
          >
            <Image
              src={artisan.image}
              width={500}
              height={500}
              alt={artisan.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-4xl font-serif text-stone-900 mb-2">
              {artisan.name}
            </h3>
            <p className="text-amber-700 font-semibold text-lg mb-6">
              {artisan.role}
            </p>
            <blockquote
              className={`text-2xl font-light italic text-stone-600 leading-relaxed mb-8 border-amber-600 relative py-4 px-6`}
            >
              <span className="absolute top-0 left-0 text-6xl text-amber-200 font-serif -z-10">
                “
              </span>
              {artisan.quote}
            </blockquote>
            <p className="font-semibold text-stone-700">
              Specialty:{" "}
              <span className="font-normal text-stone-600">
                {artisan.specialty}
              </span>
            </p>
            <p className="font-semibold text-stone-700">
              Experience:{" "}
              <span className="font-normal text-stone-600">
                {artisan.experience}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ArtisansSection;
