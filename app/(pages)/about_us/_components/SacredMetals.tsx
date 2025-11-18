import { Badge } from "@/components/ui/badge";

interface SacredMetal {
  name: string;
  planet: string;
}

interface SacredMetalsProps {
  sacredMetals: SacredMetal[];
}

const SacredMetals = ({
  sacredMetals,
}: SacredMetalsProps) => (
  <section className="py-24 md:py-32 px-6 md:px-12 bg-amber-50/50 border-y border-stone-200">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-amber-100 border-amber-200 text-amber-800 tracking-wider">
          The Alchemy
        </Badge>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
          The Seven Sacred Metals
        </h2>
        <p className="text-lg text-stone-600 leading-relaxed max-w-3xl mx-auto">
          Authentic singing bowls are forged from an alloy of seven metals, each
          corresponding to a celestial body, creating a sound that resonates
          with the cosmic and human system.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 md:gap-8">
        {sacredMetals.map((metal) => (
          <div
            key={metal.name}
            className="text-center flex flex-col items-center p-4 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-md border border-transparent hover:border-stone-200"
          >
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-amber-100">
              <p className="text-3xl font-serif text-amber-700">
                {metal.name.slice(0, 2)}
              </p>
            </div>
            <h3 className="text-lg font-bold text-stone-800">{metal.name}</h3>
            <p className="text-sm text-stone-500">{metal.planet}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SacredMetals;
