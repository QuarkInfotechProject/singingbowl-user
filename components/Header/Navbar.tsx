import Topbar from "./Topbar";
import Middlebar from "./Middlebar";
import Categories from "./Categories";
import NavigationBar from "./Navigationbar";


const Navbar = () => {
  return (
    <div className="flex flex-col gap-2 shadow-sm">
      <Topbar />
      <Middlebar />
      <Categories />
      <NavigationBar />
    </div>
  );
};
export default Navbar;
