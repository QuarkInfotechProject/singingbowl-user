import Socialmedia from "../Socialmedia";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

const Topbar = () => {
  return (
    <div className="bg-[#F4F4F4] overflow-x-hidden w-full px-20 mx-auto">
      <div className="p-2 w-full mx-auto">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-1 text-xs">
            <LocalPhoneIcon sx={{ fontSize: 16 }} />
            <span>Contact number:</span>
            <span>+977 9841000000</span>
          </div>

          <div>
            <Socialmedia />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Topbar;
