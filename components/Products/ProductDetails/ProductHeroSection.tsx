import ProductImage from "./ProductImage"
import ProductInfo from "./ProductInfo"
import { ProductDetail } from "@/app/(pages)/products/[slug]/page";

interface ProductHeroSectionProps {
  product: ProductDetail;
}

const ProductHeroSection = ({ product }: ProductHeroSectionProps) => {
  // Build images array from API response
  const images = [
    product.files?.baseImage?.url,
    ...(product.files?.additionalImage || []),
  ].filter(Boolean) as string[];

  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ProductImage images={images} />
        </div>
        <div>
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  )
}
export default ProductHeroSection