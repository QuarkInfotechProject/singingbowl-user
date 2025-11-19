import Image from "next/image";
import Search from "../Searchsection/Search";
import Authorization from "../Auth/Authorization";
import Cart from "../CartComponent/Cart";
import Link from "next/link";

const Middlebar = () => {
  return (
    <div className="overflow-x-hidden w-full px-2 md:px-20 mx-auto mb-2">
      <div className="flex items-center gap-4 md:justify-between ">
        <Link href="/">
          <Image
            src="/assets/images/logo/logo.png"
            alt="Logo"
            width={150}
            height={50}
          />
        </Link>

        <Search />

        <div className="flex items-center gap-4">
          <Authorization />
          <Cart />
        </div>
      </div>
    </div>
  );
}
export default Middlebar