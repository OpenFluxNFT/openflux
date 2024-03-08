import React, { useEffect, useState } from "react";
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
import { NavLink } from "react-router-dom";
import { shortAddress } from "../../../hooks/shortAddress";
import editIcon from "../../SettingsPage/assets/editIcon.svg";
import Toast from "../../Toast/Toast";
import OutsideClickHandler from "react-outside-click-handler";

const ProfileBanner = ({
  title,
  logo,
  banner,
  socials,
  bannerActions,
  credentials,
  desc,
  info,
  updateUserData,
  successUpdateProfile,
  website
}) => {
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [uploadDropdown, setUploadDropdown] = useState(false)


  const [userInfo, setUserInfo] = useState({
    profilePicture: "",
    bannerPicture: "",
  });
 

 

  const isImage = async (file) => {
    const acceptedImageTypes = ["image/png"];
    return acceptedImageTypes.includes(file.type);
  };

  const isAspectRatioValidProfile = async (file, targetWidth, targetHeight) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img.width <= targetWidth || img.height <= targetHeight);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadProfileImage = async (e) => {
    const maxSizeInBytes = 500 * 1024; // 500KB

    const files = e.target.files;

    if (files.length > 0) {
      const file = files[0];

      if (
        file &&
        (await isImage(file)) &&
        //  isSizeValid(file) &&
        file.size <= maxSizeInBytes &&
        (await isAspectRatioValidProfile(file, 400, 400))
      ) {
        // Set the selected image
        const reader = new FileReader();

        reader.onload = () => {
          // Set the selected image as a data URL
          setProfileImage(reader.result);
          updateUserData({
            ...userInfo,
            profilePicture: file,
          });
          setUserInfo((userInfo) => ({
            ...userInfo,
            profilePicture: file,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        // Display an error message or handle invalid file type, size, or aspect ratio
        if (!isImage(file)) {
          alert("Please select a valid image file (PNG, JPG, JPEG)");
        } else if (file.size > maxSizeInBytes) {
          alert("Selected image exceeds the maximum size of 500KB");
        } else {
          alert("Selected image must be a maximum of 400px x 400px");
        }
      }
    }
    setUserInfo({
      profilePicture: "",
      bannerPicture: "",
    });
  };
  const uploadBannerImage = async (e) => {
    const maxSizeInBytes = 500 * 1024; // 500KB

    const files = e.target.files;

    if (files.length > 0) {
      const file = files[0];

      if (
        file &&
        (await isImage(file)) &&
        file.size <= maxSizeInBytes &&
        (await isAspectRatioValidProfile(file, 1400, 350))
      ) {
        // Set the selected image
        const reader = new FileReader();

        reader.onload = () => {
          // Set the selected image as a data URL
          setBannerImage(reader.result);
          updateUserData({
            ...userInfo,
            bannerPicture: file,
          });
          setUserInfo((userInfo) => ({
            ...userInfo,
            bannerPicture: file,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        // Display an error message or handle invalid file type, size, or aspect ratio
        if (!isImage(file)) {
          alert("Please select a valid image file (PNG, JPG, JPEG)");
        } else if (file.size > maxSizeInBytes) {
          alert("Selected image exceeds the maximum size of 500KB");
        } else {
          alert("Selected image must be a maximum of 1400px x 350px");
        }
      }
    }
    setUserInfo({
      profilePicture: "",
      bannerPicture: "",
    });
  };
  useEffect(() => {
    if (banner) {
      setBannerImage(`https://confluxapi.worldofdypians.com/${banner}`);
    } else {
      setBannerImage()
    }

    if (logo) {
      setProfileImage(`https://confluxapi.worldofdypians.com/${logo}`);
    }
    else {
      setProfileImage()
    }
  }, [banner, logo]);

  return (
    <>
    <div className="container-lg py-0 py-lg-5">
      <div className="row px-0">
        <div className="collection-banner d-flex flex-column px-0">
          <div className="collection-banner-up position-relative">
            <div className="collection-banner-empty position-relative">
              <input
                type="file"
                accept=".png"
                onChange={uploadBannerImage}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                }}
              />
              {bannerImage && (
                <img
                  src={bannerImage}
                  className="w-100 d-flex user-banner-img "
                  alt=""
                />
              )}
              <img
                src={editIcon}
                alt=""
                className="edit-image"
                style={{ cursor: "pointer" }}
              />
            </div>

            <div className="ps-0 ps-lg-5 collection-position">
              <div className="collection-banner-main-info d-flex flex-column flex-lg-row gap-3 gap-lg-0 align-items-start ps-3 ps-lg-5 pe-3 py-3 justify-content-between">
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-2 position-relative">
                    <div
                      className="profile-image-placeholder-small position-relative"
                      style={{ cursor: "pointer" }}
                    >
                      {profileImage && (
                        <img
                          src={profileImage}
                          className="collection-logo"
                          alt=""
                        />
                      )}
                      <input
                        type="file"
                        accept=".png"
                        onChange={uploadProfileImage}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          opacity: 0,
                          cursor: "pointer",
                        }}
                      />
                      <img
                        src={editIcon}
                        alt=""
                        className="edit-image"
                        style={{ cursor: "pointer" }}
                      />
                    </div>

                    <h6 className="collection-title mb-0">{title}</h6>
                    {title !== "Unnamed" && <img src={checkIcon} alt="" />}
                  </div>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    {credentials.map((item, index) => (
                      <div
                        className="d-flex align-items-center gap-1"
                        key={index}
                      >
                        <span className="collection-info-span mb-0">
                          {item.key}
                        </span>

                        {item.key === "Wallet" && item.value !== "-" ? (
                          <a
                            href={`https://evm.confluxscan.net/address/${item.value}`}
                            className="collection-info mb-0"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {shortAddress(item.value)}
                          </a>
                        ) : (
                          <span className="collection-info mb-0">
                            {item.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                    {website?.length > 0 &&
                    <a href={website} target="_blank" >
                    <img src={require(`./assets/websiteIcon.svg`).default} alt="" />
                  </a>
                    }
                  <div
                    className="info-divider"
                    style={{ height: "25px" }}
                  ></div>
                  <div className="position-relative">
                  <img src={uploadIcon} style={{cursor: "pointer"}} onClick={() => setUploadDropdown(true)} alt="" />
                    {uploadDropdown &&
                    <OutsideClickHandler onOutsideClick={() => setUploadDropdown(false)}>
                        <div className="upload-dropdown p-3 d-flex flex-column gap-2">
                          <div className="d-flex align-items-center gap-2" style={{cursor: "pointer"}}>
                            <img src={uploadIcon} alt="" />
                            <h6 className="collection-info mb-0">Copy Link</h6>
                          </div>
                        </div>
                    </OutsideClickHandler>
                    }
                  </div>
                  <NavLink to="/settings/profile">
                    <img src={settingsIcon} alt="" />
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <div className="collection-banner-down py-3 ps-0 ps-lg-5">
            <div className="d-flex align-items-start flex-column flex-lg-row gap-3 gap-lg-0 justify-content-between ps-3 ps-lg-5 pe-3">
              <p className="collection-desc mb-0">{desc}</p>
              <div className="collection-amounts-grid">
                {info.map((item, index) => (
                  <div className="d-flex flex-column gap-1" key={index}>
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
    <Toast
        isSuccess={successUpdateProfile.success ? true : false}
        isError={successUpdateProfile.success === false ? true : false}
        message={successUpdateProfile.message}
      />
    </>
  );
};

export default ProfileBanner;
