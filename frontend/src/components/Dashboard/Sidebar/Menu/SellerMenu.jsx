import { BsFillHouseAddFill } from "react-icons/bs";
import { MdHomeWork, MdOutlineManageHistory } from "react-icons/md";
import MenuItem from "./MenuItem";
const SellerMenu = ({ handleToggle }) => {
  return (
    <>
      <MenuItem
        handleToggle={handleToggle}
        icon={BsFillHouseAddFill}
        label="Add Plant"
        address="add-plant"
      />
      <MenuItem
        handleToggle={handleToggle}
        icon={MdHomeWork}
        label="My Inventory"
        address="my-inventory"
      />
      <MenuItem
        handleToggle={handleToggle}
        icon={MdOutlineManageHistory}
        label="Manage Orders"
        address="manage-orders"
      />
    </>
  );
};

export default SellerMenu;
