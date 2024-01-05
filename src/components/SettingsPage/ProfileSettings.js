import React from "react";
import "./_settingspage.scss";
import infoIcon from "./assets/infoIcon.svg";
import twitterIcon from "./assets/twitterIcon.svg";
import instagramIcon from "./assets/instagramIcon.svg";

const ProfileSettings = () => {
  return (
    <div className="col-12 col-lg-10">
      <div className="row">
        <h6 className="settings-header mb-3">Profile Details</h6>
        <div className="col-6">
          <div className="d-flex flex-column gap-4">
            <div className="d-flex flex-column gap-2">
              <h6 className="input-label mb-0">Username</h6>
              <input
                type="text"
                placeholder="Username"
                className="settings-input w-100"
              />
            </div>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2">
                <h6 className="input-label mb-0">Email</h6>
                <img src={infoIcon} width={16} height={16} alt="" />
              </div>
              <input
                type="text"
                placeholder="Email"
                className="settings-input w-100"
              />
            </div>
            <div className="d-flex flex-column gap-2">
              <h6 className="input-label mb-0">Website</h6>
              <input
                type="text"
                placeholder="Website"
                className="settings-input w-100"
              />
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="d-flex flex-column justify-content-between h-100">
            <div className="d-flex align-items-center">
              <div className="col-4">
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="input-label mb-0">Profile Image</h6>
                    <img src={infoIcon} width={16} height={16} alt="" />
                  </div>
                  <div className="profile-image-placeholder"></div>
                </div>
              </div>
              <div className="col-8">
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="input-label mb-0">Profile Banner</h6>
                    <img src={infoIcon} width={16} height={16} alt="" />
                  </div>
                  <div className="profile-banner-placeholder"></div>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column gap-2">
              <h6 className="input-label mb-0">Website</h6>
              <input
                type="text"
                placeholder="Website"
                className="settings-input w-100"
              />
            </div>
          </div>
        </div>
        <div className="col-12 mt-4">
          <div className="d-flex flex-column gap-2">
            <h6 className="input-label mb-0">Bio</h6>
            <textarea
              type="text"
              placeholder="Bio"
              className="settings-input w-100"
              style={{ height: "100%" }}
              rows={5}
            />
          </div>
          <div className="mt-4 d-flex align-items-center justify-content-between">
            <div className="d-flex flex-column gap-2">
              <h6 className="input-label mb-0">Social Connections</h6>
              <span className="social-connections-span">
                Help collectors verify your account by connecting social
                accounts
              </span>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="social-connection-item p-2 d-flex align-items-center gap-5">
                <div className="d-flex align-items-center gap-2">
                  <img src={twitterIcon} alt="" />
                  <h6 className="mb-0 input-label">Twitter</h6>
                </div>
                <button className="connect-social-btn">Connect</button>
              </div>
              <div className="social-connection-item p-2 d-flex align-items-center gap-5">
                <div className="d-flex align-items-center gap-2">
                  <img src={instagramIcon} alt="" />
                  <h6 className="mb-0 input-label">Instagram</h6>
                </div>
                <button className="connect-social-btn">Connect</button>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-center mt-4">
          <button className="connect-social-btn px-3 py-1" style={{fontSize: "16px"}}>Save</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
