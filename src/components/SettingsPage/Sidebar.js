import React from 'react'
import './_settingspage.scss'
import collectionsIcon from './assets/collectionsIcon.svg'
import profileIcon  from './assets/profileIcon.svg'
import notificationsIcon from './assets/notificationsIcon.svg'
import securityIcon from './assets/securityIcon.svg'


const Sidebar = () => {
  return (
    <div className="col-2">
      <div className="sidebar-wrapper py-3 d-flex flex-column gap-3">
        <div className="sidebar-item sidebar-item-active px-3 py-2 d-flex align-items-center gap-2">
            <img src={profileIcon} alt="" />
            <h6 className="mb-0">Profile</h6>
        </div>
        <div className="sidebar-item px-3 py-2 d-flex align-items-center gap-2">
            <img src={notificationsIcon} alt="" />
            <h6 className="mb-0">Notifications</h6>
        </div>
        <div className="sidebar-item px-3 py-2 d-flex align-items-center gap-2">
            <img src={securityIcon} alt="" />
            <h6 className="mb-0">Support</h6>
        </div>
        <div className="sidebar-item px-3 py-2 d-flex align-items-center gap-2">
            <img src={collectionsIcon} alt="" />
            <h6 className="mb-0">Collection</h6>
        </div>
      </div>
    </div>
  )
}

export default Sidebar