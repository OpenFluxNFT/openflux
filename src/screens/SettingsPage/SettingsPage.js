import React from 'react'
import '../../components/SettingsPage/_settingspage.scss'
import Sidebar from '../../components/SettingsPage/Sidebar'
import ProfileSettings from '../../components/SettingsPage/ProfileSettings'

const SettingsPage = () => {
  return (
    <div className="container-fluid py-4 home-wrapper px-0">
        <div className="container-lg pt-4">
          <div className="row">
            <div className="settings-wrapper p-3">
              <div className="row">

              <Sidebar />
              <ProfileSettings />
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default SettingsPage