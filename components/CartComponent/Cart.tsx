import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Link from "next/link";

const Cart = () => {
  return (
    <div>
      <Link href="/cart">
        <div>
          <ShoppingCartOutlinedIcon />
          <span className="hidden sm:inline">Cart</span>
        </div>
      </Link>
    </div>
  );
};
export default Cart;
