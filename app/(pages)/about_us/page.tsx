import React from "react";
import { Leaf, Users, Zap, Heart, Mountain, Award, Globe } from "./_components/Icons";

import HeroSection from "./_components/HeroSection";
import OriginStory from "./_components/OriginStory";
import SacredMetals from "./_components/SacredMetals";
import ArtisansSection from "./_components/ArtisansSection";
import ChairmanMessage from "./_components/ChairmanMessage";
import TimelineSection from "./_components/TimelineSection";
import LegacyAndImpact from "./_components/LegacyAndImpact";

interface Artisan {
  name: string;
  role: string;
  experience: string;
  quote: string;
  specialty: string;
  image: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

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

interface SacredMetal {
  name: string;
  planet: string;
}

const AboutUsPage = () => {
  const artisans: Artisan[] = [
    {
      name: "Mr. Babindra Singh Tamang",
      role: "Managing Director",
      experience: "45 years",
      specialty: "Hand-hammering & alloy mixing",
      quote:
        "Each bowl is a meditation. Every strike of the hammer carries intention and the spirit of the Himalayas.",
      image: "/assets/images/md/1.avif",
    },
    {
      name: "Dawa Sherpa",
      role: "Managing Director",
      experience: "38 years",
      specialty: "Sacred blessings & acoustic tuning",
      quote:
        "We don't just make bowls; we create vessels of healing. The blessings transform them into instruments of peace.",
      image: "/assets/images/md/2.avif",
    },
    {
      name: "Karma Lama",
      role: "Managing Director",
      experience: "32 years",
      specialty: "Tone verification & finishing",
      quote:
        "Perfect sound requires perfect patience. We test every bowl until it sings with clarity and grace.",
      image: "/assets/images/md/3.avif",
    },
  ];

  const milestones: Milestone[] = [
    {
      year: "Ancient Origins",
      title: "The First Echoes",
      description:
        "Rooted in pre-Buddhist Tibetan Bon culture, the first bowls were crafted for ritual and healing.",
      icon: <Mountain className="w-6 h-6 text-amber-700" />,
    },
    {
      year: "1984",
      title: "A Sacred Vow",
      description:
        "Mr. Kashiram Lama Tamang establishes a workshop, vowing to preserve this sacred art.",
      icon: <Heart className="w-6 h-6 text-amber-700" />,
    },
    {
      year: "2005",
      title: "A Living Museum",
      description:
        "Our gallery is recognized as South Asia's largest authentic singing bowl museum.",
      icon: <Award className="w-6 h-6 text-amber-700" />,
    },
    {
      year: "2015",
      title: "Global Resonance",
      description:
        "Our bowls find homes in over 80 countries, trusted by healers, monks, and seekers of peace.",
      icon: <Globe className="w-6 h-6 text-amber-700" />,
    },
    {
      year: "Today",
      title: "The Legacy Continues",
      description:
        "We carry the torch, ensuring each bowl is a testament to Himalayan heritage and healing.",
      icon: <Leaf className="w-6 h-6 text-amber-700" />,
    },
  ];

  const values: Value[] = [
    {
      icon: <Heart className="w-8 h-8 text-amber-700" />,
      title: "Authenticity",
      description:
        "Every bowl is handcrafted using 600-year-old techniques passed through family lineages, never compromising tradition for convenience.",
    },
    {
      icon: <Leaf className="w-8 h-8 text-amber-700" />,
      title: "Cultural Preservation",
      description:
        "Protecting ancient Himalayan craftsmanship while ensuring master artisans continue their sacred work and pass knowledge to apprentices.",
    },
    {
      icon: <Users className="w-8 h-8 text-amber-700" />,
      title: "Community Impact",
      description:
        "Fair wages, ethical practices, and direct support for 200+ local artisans and their families in rural Himalayan villages.",
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-700" />,
      title: "Wellness & Spirituality",
      description:
        "Holistic healing through sound therapy—each bowl blessed and tuned to promote meditation, healing, and spiritual connection.",
    },
  ];

  const faqItems: FaqItem[] = [
    {
      id: "origin",
      question: "Where do singing bowls originate?",
      answer:
        "Singing bowls emerged from the Himalayan region over 600 years ago, born from the spiritual traditions of Tibetan Buddhism, Nepal, and India. They were created by monks and ritual practitioners as instruments for meditation, healing ceremonies, and spiritual awakening.",
    },
    {
      id: "spiritual",
      question: "What is the spiritual significance of singing bowls?",
      answer:
        "In Buddhism and Hinduism, singing bowls are sacred instruments used in rituals, meditation, and sound therapy. The vibrations are believed to carry spiritual blessings and facilitate connection to higher realms of awareness.",
    },
    {
      id: "crafting",
      question: "How are singing bowls handcrafted?",
      answer:
        "Each bowl is created through an ancient seven-step process: ore selection, metal alloy mixing, hand-hammering by master craftsmen over 8-12 hours, shaping, acoustic tuning, sacred blessings, and final quality verification. No two bowls are identical.",
    },
    {
      id: "benefits",
      question: "What are the modern wellness benefits?",
      answer:
        "Modern research supports what ancient practitioners knew: singing bowl sound therapy reduces stress, lowers cortisol levels, promotes deep relaxation, enhances meditation, supports emotional healing, and aids in sleep.",
    },
  ];

  const sacredMetals: SacredMetal[] = [
    { name: "Gold", planet: "Sun" },
    { name: "Silver", planet: "Moon" },
    { name: "Mercury", planet: "Mercury" },
    { name: "Copper", planet: "Venus" },
    { name: "Iron", planet: "Mars" },
    { name: "Tin", planet: "Jupiter" },
    { name: "Lead", planet: "Saturn" },
  ];

  return (
    <div className="w-full bg-stone-50 text-stone-700 font-sans leading-relaxed">
      <HeroSection />
      <OriginStory />
      <SacredMetals sacredMetals={sacredMetals} />
      <ArtisansSection artisans={artisans} />
      <ChairmanMessage />
      <TimelineSection milestones={milestones} />
      <LegacyAndImpact values={values} faqItems={faqItems} />
    </div>
  );
};

export default AboutUsPage;
