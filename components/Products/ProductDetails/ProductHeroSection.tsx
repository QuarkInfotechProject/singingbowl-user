import ProductImage from "./ProductImage"
import ProductInfo from "./ProductInfo"

const ProductHeroSection = () => {
  return (
    <div className="w-full">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <ProductImage />
            </div>
            <div>
                <ProductInfo />
            </div>
        </div>
    </div>
  )
}
export default ProductHeroSection