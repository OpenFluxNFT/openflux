import React, { useEffect, useState } from "react";
import "./_settingspage.scss";
import infoIcon from "./assets/infoIcon.svg";
import twitterIcon from "./assets/twitterIcon.svg";
import instagramIcon from "./assets/instagramIcon.svg";
import editIcon from "./assets/editIcon.svg";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import styled from "@emotion/styled";
import Toast from "../Toast/Toast";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#141843",
    maxWidth: 220,
    border: "1px solid rgba(47, 128, 237, 0.20)",
  },
}));

const ProfileSettings = ({
  coinbase,
  userData,
  updateUserData,
  successUpdateProfile,
}) => {
  const baseUrl = "https://confluxapi.worldofdypians.com/";

  const [profileImage, setProfileImage] = useState();
  const [bannerImage, setBannerImage] = useState();
  const [toastInfo, setToastInfo] = useState({
    message: "",
    error: false,
  });
  const [isEdit, setIsEdit] = useState(false);

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    website: "",
    bio: "",
    profilePicture: "",
    bannerPicture: "",
  });

  const display = () => {
    if (userData && userData._id) {
      setUserInfo((userInfo) => ({
        ...userInfo,
        username: userData?.username,
        email: userData?.email,
        website: userData?.website,
        bio: userData?.bio,
        profilePicture: userData?.profilePicture
          ? baseUrl + userData?.profilePicture
          : "",
        bannerPicture: userData?.bannerPicture
          ? baseUrl + userData?.bannerPicture
          : "",
      }));

      if (userData?.profilePicture) {
        setProfileImage(baseUrl + userData?.profilePicture);
      }
      if (userData?.bannerPicture) {
        setBannerImage(baseUrl + userData?.bannerPicture);
      }
    }
  };

  const isImage = async (file) => {
    const acceptedImageTypes = ["image/png"];
    return acceptedImageTypes.includes(file.type);
  };

  const isAspectRatioValidProfile = async (file, targetWidth, targetHeight) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        console.log(img.width <= targetWidth && img.height <= targetHeight);
        resolve(img.width <= targetWidth && img.height <= targetHeight);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadProfileImage = async (e) => {
    const maxSizeInBytes = 500 * 1024; // 500KB
    setIsEdit(true);

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
          setUserInfo((userInfo) => ({
            ...userInfo,
            profilePicture: file,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        // Display an error message or handle invalid file type, size, or aspect ratio
        if (!isImage(file)) {
          setToastInfo({
            message: "Please select a valid image file (PNG, JPG, JPEG)",
            error: true,
          });
        } else if (file.size > maxSizeInBytes) {
          setToastInfo({
            message: "Selected image exceeds the maximum size of 500KB",
            error: true,
          });
        } else {
          setToastInfo({
            message: "Selected image must be a maximum of 400px x 400px",
            error: true,
          });
        }
      }
    }
    setTimeout(() => {
      setToastInfo({
        message: "",
        error: false,
      });
    }, 5000);
  };
  const uploadBannerImage = async (e) => {
    const maxSizeInBytes = 500 * 1024; // 500KB
    setIsEdit(true);

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
          setUserInfo((userInfo) => ({
            ...userInfo,
            bannerPicture: file,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        // Display an error message or handle invalid file type, size, or aspect ratio
        if (!isImage(file)) {
          setToastInfo({
            message: "Please select a valid image file (PNG, JPG, JPEG)",
            error: true,
          });
        } else if (file.size > maxSizeInBytes) {
          setToastInfo({
            message: "Selected image exceeds the maximum size of 500KB",
            error: true,
          });
        } else {
          setToastInfo({
            message: "Selected image must be a maximum of 1400px x 350px",
            error: true,
          });
        }
      }
    }
    setTimeout(() => {
      setToastInfo({
        message: "",
        error: false,
      });
    }, 5000);
  };

  useEffect(() => {
    display();
  }, [userData]);

  return (
    <>
      <div className="col-12 col-lg-10">
        <div className="row">
          <h6 className="settings-header mb-3">Profile Details</h6>
          <div className="col-12 col-lg-6">
            <div className="d-flex flex-column gap-4">
              <div className="d-flex flex-column gap-2">
                <h6 className="input-label mb-0">Username</h6>
                <input
                  type="text"
                  placeholder={
                    userData?.username ? userData.username : "Username"
                  }
                  className="settings-input w-100"
                  value={userInfo.username}
                  onChange={(e) => {
                    setIsEdit(true);
                    setUserInfo((userInfo) => ({
                      ...userInfo,
                      username: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-2">
                  <h6 className="input-label mb-0">Email</h6>
                  <HtmlTooltip
                    placement="top"
                    title={
                      <p className="tooltip-text mb-0">
                        The email address will be used to send various
                        notifications related to activity on the Marketplace.
                      </p>
                    }
                  >
                    <img src={infoIcon} width={16} height={16} alt="" />
                  </HtmlTooltip>
                </div>
                <input
                  type="email"
                  placeholder={userData?.email ? userData?.email : "Email"}
                  className="settings-input w-100"
                  value={userInfo.email}
                  onChange={(e) => {
                    setIsEdit(true);
                    setUserInfo((userInfo) => ({
                      ...userInfo,
                      email: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="d-flex flex-column gap-2">
                <h6 className="input-label mb-0">Website</h6>
                <input
                  type="text"
                  placeholder={
                    userData?.website ? userData?.website : "Website"
                  }
                  className="settings-input w-100"
                  value={userInfo.website}
                  onChange={(e) => {
                    setIsEdit(true);
                    setUserInfo((userInfo) => ({
                      ...userInfo,
                      website: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="d-flex flex-column justify-content-between mt-4 mt-lg-0 h-100">
              <div className="row">
                <div className="col-12 col-lg-3 mb-4 mb-lg-0">
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="input-label mb-0">Profile Image</h6>
                      <HtmlTooltip
                        placement="top"
                        title={
                          <div className="d-flex flex-column gap-2">
                            <p className="tooltip-text mb-0">
                              Recommended: 400px x 400px
                            </p>
                            <p className="tooltip-text mb-0">Max size: 500KB</p>
                          </div>
                        }
                      >
                        <img src={infoIcon} width={16} height={16} alt="" />
                      </HtmlTooltip>
                    </div>
                    <div className="profile-image-placeholder">
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
                      {profileImage && (
                        <img
                          src={profileImage}
                          className="profile-image"
                          alt=""
                        />
                      )}
                      <img src={editIcon} className="edit-image" alt="" />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-9">
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="input-label mb-0">Profile Banner</h6>
                      <HtmlTooltip
                        placement="top"
                        title={
                          <div className="d-flex flex-column gap-2">
                            <p className="tooltip-text mb-0">
                              Recommended: 1400px x 350px
                            </p>
                            <p className="tooltip-text mb-0">Max size: 500KB</p>
                          </div>
                        }
                      >
                        <img src={infoIcon} width={16} height={16} alt="" />
                      </HtmlTooltip>
                    </div>
                    <div className="profile-banner-placeholder">
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
                          className="banner-image"
                          alt=""
                        />
                      )}
                      <img src={editIcon} className="edit-image" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column gap-2">
                <h6 className="input-label mb-0">Wallet Address</h6>
                <input
                  type="text"
                  // placeholder="Website"
                  className="settings-input w-100"
                  value={coinbase}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="col-12 mt-4">
            <div className="d-flex flex-column gap-2 mt-4 mt-lg-0">
              <h6 className="input-label mb-0">Bio</h6>
              <textarea
                type="text"
                placeholder={userData?.bio ? userData?.bio : "Bio"}
                className="settings-input w-100"
                style={{ height: "100%" }}
                rows={5}
                value={userInfo.bio}
                onChange={(e) => {
                  setIsEdit(true);
                  setUserInfo((userInfo) => ({
                    ...userInfo,
                    bio: e.target.value,
                  }));
                }}
              />
            </div>
            {/* <div className="mt-4 d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between">
            <div className="d-flex flex-column gap-2">
              <h6 className="input-label mb-0">Social Connections</h6>
              <span className="social-connections-span">
                Help collectors verify your account by connecting social
                accounts
              </span>
            </div>
            <div className="d-flex align-items-center flex-column flex-lg-row gap-3 mt-4 mt-lg-0">
              <div className="social-connection-item p-2 d-flex align-items-center justify-content-between gap-5 w-100">
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
          </div> */}
            <div className="d-flex align-items-center justify-content-center mt-4">
              <button
                className={` ${
                  !isEdit && "disabled-save-btn"
                } connect-social-btn px-3 py-1`}
                style={{ fontSize: "16px" }}
                disabled={!isEdit}
                onClick={() =>
                  updateUserData(userInfo).then(() => {
                    setUserInfo({
                      username: "",
                      email: "",
                      website: "",
                      bio: "",
                      profilePicture: "",
                      bannerPicture: "",
                    });
                  })
                }
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* {successUpdateProfile &&  */}
      <Toast
        isSuccess={successUpdateProfile.success ? true : false}
        isError={successUpdateProfile.success === false ? true : false}
        message={successUpdateProfile.message}
      />
      <Toast isError={toastInfo.error} message={toastInfo.message} />
      {/* } */}
    </>
  );
};

export default ProfileSettings;
