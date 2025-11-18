import React from "react";
import { Badge } from "@/components/ui/badge";

const ChairmanMessage = () => (
  <section className="py-24 md:py-32 px-6 md:px-12 bg-stone-100 border-y border-stone-200">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
      <div className="md:w-2/5 flex-shrink-0">
        <img
          src="/assets/images/md/4.avif"
          alt="Chairman Ramesh Tamang"
          className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full mx-auto shadow-xl border-4 border-white"
        />
      </div>
      <div className="md:w-3/5 text-center md:text-left">
        <Badge className="mb-4 bg-amber-100 border-amber-200 text-amber-800 tracking-wider">
          A Message From Our Chairman
        </Badge>
        <h2 className="text-4xl font-serif font-bold text-stone-900 mb-6">
          Carrying the Flame Forward
        </h2>
        <p className="text-lg text-stone-600 leading-relaxed mb-6">
          "My father didn't just build a business; he preserved a soul—the soul
          of our culture, encapsulated in the resonant hum of a singing bowl. I
          am humbled to carry that flame forward. Our commitment is to honor the
          sacred traditions of our ancestors and share their healing power with
          a world in need of peace. Thank you for being a part of our story."
        </p>
        <div className="mt-8 border-t border-amber-200 pt-6">
          <p className="text-2xl font-serif font-semibold text-stone-800">
            Mr. Narendra Lama
          </p>
          <p className="text-amber-800">Chairman & Son of the Founder</p>
        </div>
      </div>
    </div>
  </section>
);

export default ChairmanMessage;
