import ProductGrid from "./ProductGrid";

const ProductSection = () => {
  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-4 items-start justify-start text-start">
        <p className="font-bold text-3xl">Jambati Bowls</p>
        <p>
          The Enigmatic Jambati Bowls: A Deep Dive into History and
          Craftsmanship Jambati bowls, cherished for their deep, resonant tones
          and exquisite craftsmanship, hail from the Himalayan regions of Nepal
          and Tibet. Historically used in spiritual rituals by Tibetan Buddhist
          monks, these bowls feature wide rims, gently sloping sides, and flat
          bottoms, producing harmonious tones that enhance meditation and
          promote healing. Crafted from a blend of seven metals, Jambati bowls
          are meticulously hammered into shape, resulting in unique vibrational
          qualities that aid in stress reduction, emotional balance, and chakra
          alignment.
        </p>

        <ProductGrid />
      </div>
    </div>
  );
}
export default ProductSection