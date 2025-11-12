import { FilterCategory } from "@/types/filter.types";

export const FILTER_DATA: FilterCategory[] = [
  {
    id: "category",
    title: "Category",
    options: [
      { id: "jambati", label: "Jambati Bowls" },
      { id: "ultabati", label: "Ultabati Bowls" },
      { id: "fullmoon", label: "Full moon Bowls" },
      { id: "carving", label: "Carving bowls" },
      { id: "thadobati", label: "Thadobati bowls" },
      { id: "mani", label: "Mani bowls" },
      { id: "lingam", label: "Lingam bowls" },
      { id: "handhammered", label: "New Handhammered bowls" },
      { id: "antique", label: "Different shaped antique bowls" },
      { id: "jhumka", label: "New Jhumka bowls" },
    ],
  },
  {
    id: "price",
    title: "Price",
    options: [
      { id: "under50", label: "Under $50" },
      { id: "50-100", label: "$50 - $100" },
      { id: "100-200", label: "$100 - $200" },
      { id: "200-500", label: "$200 - $500" },
      { id: "over500", label: "Over $500" },
    ],
  },
];
