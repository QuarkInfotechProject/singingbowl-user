
import React from "react";
import { Sparkles, Music, Factory } from "lucide-react";
import { Course } from "./CourseCard";

export const courses: Course[] = [
    {
        id: 1,
        title: "Introductory Session",
        subtitle: "A Beginner's Guide",
        duration: "2 Days",
        hoursPerDay: "2 Hours per Day",
        price: "$229",
        location: "Thamel-17, Kathmandu, Nepal",
        description:
            "Start your journey into the world of singing bowls. Learn what they are, their purpose, and how to use them for meditation, mindfulness, and daily wellness. This beginner-friendly course provides hands-on guidance, helping you explore the healing power of sound.",
        highlights: [
            "Understanding singing bowl origins",
            "Basic playing techniques",
            "Meditation & mindfulness practices",
            "Daily wellness integration",
        ],
        icon: <Sparkles className="w-6 h-6" />,
        image: "/assets/images/courses/introductory-session.jpg",
    },
    {
        id: 2,
        title: "Sound Healing Session",
        subtitle: "Deep Immersion Course",
        duration: "4 Days",
        hoursPerDay: "2.5 Hours per Day",
        price: "$899",
        location: "Thamel-17, Kathmandu, Nepal",
        description:
            "Dive deeper into the transformative power of sound. This immersive course teaches you how to use singing bowls for chakra balancing, sound therapy, meditation, and overall wellbeing. Ideal for wellness enthusiasts, yoga instructors, or anyone seeking professional or personal mastery in sound healing.",
        highlights: [
            "Chakra balancing techniques",
            "Professional sound therapy",
            "Advanced meditation practices",
            "Certification upon completion",
        ],
        icon: <Music className="w-6 h-6" />,
        image: "/assets/images/courses/sound-healing-session.jpg",
    },
    {
        id: 3,
        title: "Factory Visit & Tour",
        subtitle: "Experience Authentic Craftsmanship",
        duration: "Half-Day",
        hoursPerDay: "Pickup & Drop-Off Included",
        price: "$100 per Person",
        location: "1-Hour Drive from Thamel Store",
        description:
            "Experience the heart of our craft with a guided tour of our singing bowl factory. Witness how raw metal transforms into handcrafted, authentic Himalayan singing bowls. Pickup and drop-off to and from our Thamel store is included for a hassle-free experience.",
        highlights: [
            "Guided factory tour",
            "Meet master artisans",
            "Witness traditional craftsmanship",
            "Complimentary transport",
        ],
        icon: <Factory className="w-6 h-6" />,
        image: "/assets/images/courses/factory-visit-tour.jpg",
    },
];
