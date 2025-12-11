export interface Product {
  id: number;
  uuid: string;
  productName: string;
  url: string;
  originalPrice: string;
  specialPrice: string | null;
  discountPercentage: number;
  description: string;
  inStock: boolean;
  files: {
    baseImage: { url: string } | null;
    additionalImage: string[];
  };
}
