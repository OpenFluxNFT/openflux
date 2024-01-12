import React, { useState, useEffect } from "react";
import "../../components/SettingsPage/_settingspage.scss";
import Sidebar from "../../components/SettingsPage/Sidebar";
import ProfileSettings from "../../components/SettingsPage/ProfileSettings";
import NotificationSettings from "../../components/SettingsPage/NotificationSettings";
import SupportSettings from "../../components/SettingsPage/SupportSettings";
import CollectionSettings from "../../components/SettingsPage/CollectionSettings";
import axios from "axios";

const SettingsPage = ({ coinbase, userData, updateUserData,userCollection }) => {
  const [category, setCategory] = useState("profile");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <div className="container-lg pt-4">
        <div className="row">
          <div className="settings-wrapper p-3" style={{ minHeight: "70vh" }}>
            <div className="row" style={{ height: "100%" }}>
              <Sidebar onChangeCategory={setCategory} category={category} />
              {category === "profile" ? (
                <ProfileSettings
                  coinbase={coinbase}
                  userData={userData}
                  updateUserData={updateUserData}
                />
              ) : category === "notifications" ? (
                <NotificationSettings />
              ) : category === "support" ? (
                <SupportSettings />
              ) : (
                <CollectionSettings userCollection={userCollection}/>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
