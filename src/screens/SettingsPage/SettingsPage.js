import React, { useState, useEffect } from "react";
import "../../components/SettingsPage/_settingspage.scss";
import Sidebar from "../../components/SettingsPage/Sidebar";
import ProfileSettings from "../../components/SettingsPage/ProfileSettings";
import NotificationSettings from "../../components/SettingsPage/NotificationSettings";
import SupportSettings from "../../components/SettingsPage/SupportSettings";
import CollectionSettings from "../../components/SettingsPage/CollectionSettings";
import axios from "axios";
import { useParams } from "react-router-dom";

const SettingsPage = ({
  coinbase,
  userData,
  updateUserData,
  userCollection,
  successUpdateProfile,
  updateCollectionData,
  onSelectCollection,
  successUpdateCollectionProfile,
}) => {
  const { type } = useParams();

  const [category, setCategory] = useState(type);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setCategory(type);
  }, [type]);

  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <div className="container-lg  pt-4">
        <div className="row">
          <div className="settings-wrapper p-3" style={{ minHeight: "70vh" }}>
            <div className="row" style={{ height: "100%" }}>
              <Sidebar category={category} />
              {category === "profile" ? (
                <ProfileSettings
                  coinbase={coinbase}
                  userData={userData}
                  updateUserData={updateUserData}
                  successUpdateProfile={successUpdateProfile}
                />
              ) : category === "notifications" ? (
                <NotificationSettings />
              ) : category === "support" ? (
                <SupportSettings coinbase={coinbase} />
              ) : (
                <CollectionSettings
                  userCollection={userCollection}
                  updateCollectionData={updateCollectionData}
                  onSelectCollection={onSelectCollection}
                  successUpdateCollectionProfile={
                    successUpdateCollectionProfile
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
