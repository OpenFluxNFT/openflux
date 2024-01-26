import React from "react";
import "./_settingspage.scss";
import collectionsIcon from "./assets/collectionsIcon.svg";
import profileIcon from "./assets/profileIcon.svg";
import notificationsIcon from "./assets/notificationsIcon.svg";
import securityIcon from "./assets/securityIcon.svg";
import { NavLink } from "react-router-dom";

const Sidebar = ({  category }) => {
  return (
    <div className="col-12 col-lg-2 mb-4 mb-lg-0">
      <div
        className="sidebar-wrapper py-3 d-flex flex-column gap-3"
        style={{ height: "100%" }}
      >
        <NavLink
          to={"/settings/profile"}
          className={`sidebar-item ${
            category === "profile" && "sidebar-item-active"
          } px-3 py-2 d-flex align-items-center gap-2`}
        >
          <img src={profileIcon} alt="" />
          <h6 className="mb-0">Profile</h6>
        </NavLink>
        <NavLink
          to={"/settings/notifications"}
          className={`sidebar-item ${
            category === "notifications" && "sidebar-item-active"
          } px-3 py-2 d-flex align-items-center gap-2`}
        >
          <img src={notificationsIcon} alt="" />
          <h6 className="mb-0">Notifications</h6>
        </NavLink>
        <NavLink
          to={"/settings/support"}
          className={`sidebar-item ${
            category === "support" && "sidebar-item-active"
          } px-3 py-2 d-flex align-items-center gap-2`}
        >
          <img src={securityIcon} alt="" />
          <h6 className="mb-0">Support</h6>
        </NavLink>
        <NavLink
          to={"/settings/collection"}
          className={`sidebar-item ${
            category === "collection" && "sidebar-item-active"
          } px-3 py-2 d-flex align-items-center gap-2`}
        >
          <img src={collectionsIcon} alt="" />
          <h6 className="mb-0">Collections</h6>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
