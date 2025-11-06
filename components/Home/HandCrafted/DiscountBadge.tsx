interface DiscountBadgeProps {
  discount: string;
}

const DiscountBadge: React.FC<DiscountBadgeProps> = ({ discount }) => {
  return (
    <div className="absolute top-3 left-3 bg-[#802010] text-white text-xs font-bold px-3 py-2 rounded-full">
      {discount}
      <br />
      OFF
    </div>
  );
};

export default DiscountBadge;
