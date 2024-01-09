import React from "react";
import "./_profilebanner.scss";
import bannerPlaceholder from "./assets/bannerPlaceholder.png";
import cawsIcon from "./assets/cawsIcon.png";
import confluxScanIcon from "./assets/confluxScanIcon.svg";
import discordIcon from "./assets/discordIcon.svg";
import favoriteIcon from "./assets/favoriteIcon.svg";
import followIcon from "./assets/followIcon.svg";
import instagramIcon from "./assets/instagramIcon.svg";
import twitterIcon from "./assets/twitterIcon.svg";
import websiteIcon from "./assets/websiteIcon.svg";
import telegramIcon from "./assets/telegramIcon.svg";
import uploadIcon from "./assets/uploadIcon.svg";
import settingsIcon from "./assets/settingsIcon.svg";
import checkIcon from "../../Collections/TopCollections/assets/checkIcon.svg";

const ProfileBanner = ({
  title,
  logo,
  banner,
  socials,
  bannerActions,
  credentials,
  desc,
  info,
}) => {
  return (
    <div className="container-lg py-0 py-lg-5">
      <div className="row px-0">
        <div className="collection-banner d-flex flex-column px-0">
          <div className="collection-banner-up position-relative">
            {/* <img src={banner} className="w-100 d-none d-lg-flex" alt="" /> */}
            <div className="collection-banner-empty"></div>

            <div className="ps-0 ps-lg-5 collection-position">
              <div className="collection-banner-main-info d-flex flex-column flex-lg-row gap-3 gap-lg-0 align-items-start ps-3 ps-lg-5 pe-3 py-3 justify-content-between">
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-2 position-relative">
                    <img src={logo} className="collection-logo" alt="" />
                    <h6 className="collection-title mb-0">{title}</h6>
                    <img src={checkIcon} alt="" />
                  </div>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    {credentials.map((item, index) => (
                      <div className="d-flex align-items-center gap-1">
                        <span className="collection-info-span mb-0">{item.key}</span>
                        <span className="collection-info mb-0">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                    {socials.map((item, index) => (
                       <a href="#" target="_blank">
                       <img src={require(`./assets/${item}Icon.svg`)} alt="" />
                     </a>
                    ))}
                  <div
                    className="info-divider"
                    style={{ height: "25px" }}
                  ></div>
                  <img src={uploadIcon} alt="" />
                  <img src={settingsIcon} alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="collection-banner-down py-3 ps-0 ps-lg-5">
            <div className="d-flex align-items-start flex-column flex-lg-row gap-3 gap-lg-0 justify-content-between ps-3 ps-lg-5 pe-3">
              <p className="collection-desc mb-0">
              {desc}
              </p>
              <div className="collection-amounts-grid">
             {info.map((item, index) => (
                <div className="d-flex flex-column gap-1">
                <span className="collection-amount-span mb-0">
                 {item.title}
                </span>
                <div className="collection-amount-wrapper p-2 d-flex align-items-center justify-content-between">
                  <h6 className="collection-amount">{item.value}</h6>
                  <h6 className="collection-amount">{item.valueType}</h6>
                </div>
              </div>
             ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;
