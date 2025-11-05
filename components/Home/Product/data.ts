export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Ultabiti Bowls",
    description: "Singing Bowl with Ultabiti",
    image: "/assets/images/product/1.jpg",
  },
  {
    id: 2,
    name: "Crystal Singing",
    description: "Premium Crystal Sound Bowl",
    image: "/assets/images/product/2.jpg",
  },
  {
    id: 3,
    name: "Meditation Bowl",
    description: "Handcrafted Meditation Bowl",
    image: "/assets/images/product/3.jpg",
  },
  {
    id: 4,
    name: "Brass Harmony",
    description: "Traditional Brass Bowl",
    image: "/assets/images/product/4.jpg",
  },
  {
    id: 5,
    name: "Golden Resonance",
    description: "Golden Healing Bowl",
    image: "/assets/images/product/5.jpg",
  },
  {
    id: 6,
    name: "Sacred Sound",
    description: "Sacred Singing Bowl",
    image: "/assets/images/product/6.jpg",
  },
];
