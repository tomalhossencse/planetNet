import { FaUserCog, FaUserTag } from "react-icons/fa";
import MenuItem from "./MenuItem";

const AdminMenu = ({ handleToggle }) => {
  return (
    <>
      <MenuItem
        handleToggle={handleToggle}
        icon={FaUserCog}
        label="Manage Users"
        address="manage-users"
      />
      <MenuItem
        handleToggle={handleToggle}
        icon={FaUserTag}
        label="Seller Requests"
        address="seller-requests"
      />
    </>
  );
};

export default AdminMenu;
