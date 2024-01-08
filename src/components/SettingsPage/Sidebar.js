import React from 'react'
import './_settingspage.scss'
import collectionsIcon from './assets/collectionsIcon.svg'
import profileIcon  from './assets/profileIcon.svg'
import notificationsIcon from './assets/notificationsIcon.svg'
import securityIcon from './assets/securityIcon.svg'


const Sidebar = ({onChangeCategory, category}) => {
  return (
    <div className="col-12 col-lg-2 mb-4 mb-lg-0">
      <div className="sidebar-wrapper py-3 d-flex flex-column gap-3" style={{height: "100%"}}>
        <div className={`sidebar-item ${category === "profile" && "sidebar-item-active"} px-3 py-2 d-flex align-items-center gap-2`} onClick={() => onChangeCategory("profile")}>
            <img src={profileIcon} alt="" />
            <h6 className="mb-0">Profile</h6>
        </div>
        <div className={`sidebar-item ${category === "notifications" && "sidebar-item-active"} px-3 py-2 d-flex align-items-center gap-2`} onClick={() => onChangeCategory("notifications")}>
            <img src={notificationsIcon} alt="" />
            <h6 className="mb-0">Notifications</h6>
        </div>
        <div className={`sidebar-item ${category === "support" && "sidebar-item-active"} px-3 py-2 d-flex align-items-center gap-2`} onClick={() => onChangeCategory("support")}>
            <img src={securityIcon} alt="" />
            <h6 className="mb-0">Support</h6>
        </div>
        <div className={`sidebar-item ${category === "collection" && "sidebar-item-active"} px-3 py-2 d-flex align-items-center gap-2`} onClick={() => onChangeCategory("collection")}>
            <img src={collectionsIcon} alt="" />
            <h6 className="mb-0">Collection</h6>
        </div>
      </div>
    </div>
  )
}

export default Sidebar