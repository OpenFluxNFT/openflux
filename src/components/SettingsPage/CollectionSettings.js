import React, { useState } from "react";
import "./_settingspage.scss";
import infoIcon from "./assets/infoIcon.svg";
import twitterIcon from "./assets/twitterIcon.svg";
import instagramIcon from "./assets/instagramIcon.svg";
import confluxScanIcon from "./assets/confluxScanIcon.svg";
import discordIcon from "./assets/discordIcon.svg";
import telegramIcon from "./assets/telegramIcon.svg";
import penIcon from "./assets/penIcon.svg";
import editIcon from "./assets/editIcon.svg";
import collectionSettingsIcon from "./assets/collectionSettingsIcon.svg";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import styled from "@emotion/styled";
import axios from "axios";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#141843",
    maxWidth: 220,
    border: "1px solid rgba(47, 128, 237, 0.20)",
  },
}));

const CollectionSettings = ({userCollection}) => {


  const [collection, setCollection] = useState(null);

  const [profileImage, setProfileImage] = useState();
  const [bannerImage, setBannerImage] = useState();
  const [featuredImage, setFeaturedImage] = useState();
  const [collectionsImage, setCollectionsImage] = useState();
  const [collectionOwner, setcollectionOwner] = useState();

  const [collectionInfo, setcollectionInfo] = useState({
    username: "",
    email: "",
    website: "",
    bio: "",
    profilePicture: "",
    bannerPicture: "",
  });

  const getCollectionOwner = async (collectionAddress) => {
    const result = await axios
      .get(
        `https://confluxapi.worldofdypians.com/api/collections/getCollectionOwner/${collectionAddress}`,
        {
          headers: {
            "x-api-key":
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
          },
        }
      )
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      setcollectionOwner(result.data);
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
        resolve(img.width / img.height === targetWidth / targetHeight);
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
        (await isAspectRatioValidProfile(file, 1, 1))
      ) {
        // Set the selected image
        const reader = new FileReader();

        reader.onload = () => {
          // Set the selected image as a data URL
          setProfileImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        // Display an error message or handle invalid file type, size, or aspect ratio
        if (!isImage(file)) {
          alert("Please select a valid image file (PNG, JPG, JPEG)");
        } else if (file.size > maxSizeInBytes) {
          alert("Selected image exceeds the maximum size of 500KB");
        } else {
          alert("Selected image must have an aspect ratio of 1:1");
        }
      }
    }
  };
  const uploadCollectionsImage = async (e) => {
    const maxSizeInBytes = 500 * 1024; // 500KB

    const files = e.target.files;

    if (files.length > 0) {
      const file = files[0];

      if (
        file &&
        (await isImage(file)) &&
        file.size <= maxSizeInBytes &&
        (await isAspectRatioValidProfile(file, 0.87, 1))
      ) {
        // Set the selected image
        const reader = new FileReader();

        reader.onload = () => {
          // Set the selected image as a data URL
          setCollectionsImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        // Display an error message or handle invalid file type, size, or aspect ratio
        if (!isImage(file)) {
          alert("Please select a valid image file (PNG, JPG, JPEG)");
        } else if (file.size > maxSizeInBytes) {
          alert("Selected image exceeds the maximum size of 500KB");
        } else {
          alert("Selected image must have an aspect ratio of 4:1");
        }
      }
    }
  };
  const uploadFeaturedImage = async (e) => {
    const maxSizeInBytes = 500 * 1024; // 500KB

    const files = e.target.files;

    if (files.length > 0) {
      const file = files[0];

      if (
        file &&
        (await isImage(file)) &&
        file.size <= maxSizeInBytes &&
        (await isAspectRatioValidProfile(file, 2, 1))
      ) {
        // Set the selected image
        const reader = new FileReader();

        reader.onload = () => {
          // Set the selected image as a data URL
          setFeaturedImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        // Display an error message or handle invalid file type, size, or aspect ratio
        if (!isImage(file)) {
          alert("Please select a valid image file (PNG, JPG, JPEG)");
        } else if (file.size > maxSizeInBytes) {
          alert("Selected image exceeds the maximum size of 500KB");
        } else {
          alert("Selected image must have an aspect ratio of 4:1");
        }
      }
    }
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
        (await isAspectRatioValidProfile(file, 4, 1))
      ) {
        // Set the selected image
        const reader = new FileReader();

        reader.onload = () => {
          // Set the selected image as a data URL
          setBannerImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        // Display an error message or handle invalid file type, size, or aspect ratio
        if (!isImage(file)) {
          alert("Please select a valid image file (PNG, JPG, JPEG)");
        } else if (file.size > maxSizeInBytes) {
          alert("Selected image exceeds the maximum size of 500KB");
        } else {
          alert("Selected image must have an aspect ratio of 4:1");
        }
      }
    }
  };

  return (
    <div className="col-12 col-lg-10">
      <div className="row">
        <h6 className="settings-header mb-3">
          {collection ? collection.title : "NFT Collections"}
        </h6>
        {collection ? (
          <>
            <div className="col-12 col-lg-6">
              <div className="d-flex flex-column gap-4">
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="input-label mb-0">Name</h6>
                    <HtmlTooltip
                      placement="top"
                      title={
                        <p className="tooltip-text mb-0">
                          Not editable for badged collections. Please contact
                          support for additional help.
                        </p>
                      }
                    >
                      <img src={infoIcon} width={16} height={16} alt="" />
                    </HtmlTooltip>
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    className="settings-input w-100"
                    disabled
                    value={collection.collectionName}
                  />
                </div>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="input-label mb-0">Blockchain</h6>
                    <img src={infoIcon} width={16} height={16} alt="" />
                  </div>
                  <input
                    type="text"
                    placeholder="Email"
                    className="settings-input w-100"
                    value={"Conflux eSpace"}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="d-flex flex-column gap-4">
                <div className="d-flex flex-column gap-2">
                  <h6 className="input-label mb-0">Contract Owner</h6>
                  <input
                    type="text"
                    placeholder="0xc...3453"
                    className="settings-input w-100"
                    disabled
                    value={collectionOwner}
                  />
                </div>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="input-label mb-0">Website</h6>
                  </div>
                  <input
                    type="text"
                    placeholder="https://opensea.io/"
                    className="settings-input w-100"
                    value={collection.websiteLink}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 mt-4">
              <div className="d-flex flex-column gap-4">
                <div className="d-flex flex-column gap-2">
                  <h6 className="input-label mb-0">Tags</h6>
                  <input
                    type="text"
                    placeholder="0xc...3453"
                    className="settings-input w-100"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-lg-6 mt-4">
                <div className="d-flex flex-column justify-content-between mt-4 mt-lg-0 h-100">
                  <div className="d-flex align-items-center">
                    <div className="col-3">
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
                                <p className="tooltip-text mb-0">
                                  Max size: 500KB
                                </p>
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
                    <div className="col-9">
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
                                <p className="tooltip-text mb-0">
                                  Max size: 500KB
                                </p>
                              </div>
                            }
                          >
                            <img src={infoIcon} width={16} height={16} alt="" />
                          </HtmlTooltip>
                        </div>
                        <div className="profile-banner-placeholder">
                          {}
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
                </div>
              </div>
              <div className="col-12 col-lg-6 mt-4">
                <div className="d-flex flex-column justify-content-between mt-4 mt-lg-0 h-100">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="col-6">
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="input-label mb-0">Featured Banner</h6>
                          <HtmlTooltip
                      placement="top"
                      title={
                        <div className="d-flex flex-column gap-2">
                          <p className="tooltip-text mb-0">
                            Recommended: 600px x 400px
                          </p>
                          <p className="tooltip-text mb-0">Max size: 500KB</p>
                        </div>
                      }
                    >
                      <img src={infoIcon} width={16} height={16} alt="" />
                    </HtmlTooltip>
                        </div>
                        <div className="featured-banner-placeholder">
                          <img src={editIcon} alt="" className="edit-image" />
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="input-label mb-0">
                            Collection Banner
                          </h6>
                          <HtmlTooltip
                      placement="top"
                      title={
                        <div className="d-flex flex-column gap-2">
                          <p className="tooltip-text mb-0">
                            Recommended: 350px x 400px
                          </p>
                          <p className="tooltip-text mb-0">Max size: 500KB</p>
                        </div>
                      }
                    >
                      <img src={infoIcon} width={16} height={16} alt="" />
                    </HtmlTooltip>
                        </div>
                        <div className="collection-banner-placeholder">
                          <img src={editIcon} alt="" className="edit-image" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 mt-4">
              <div className="d-flex flex-column gap-2 mt-4 mt-lg-0">
                <h6 className="input-label mb-0">Description</h6>
                <textarea
                  type="text"
                  placeholder="Description"
                  className="settings-input w-100"
                  style={{ height: "100%" }}
                  rows={5}
                />
              </div>
              <div className="row">
                <div className="col-12 col-lg-6 mt-4">
                  <div className="d-flex flex-column gap-4">
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <img src={twitterIcon} alt="" />
                        <h6 className="input-label mb-0">Twitter</h6>
                      </div>
                      <div className="social-connection-item p-2 d-flex align-items-center justify-content-between gap-5 w-100">
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="mb-0 input-label">Twitter</h6>
                        </div>
                        <button className="connect-social-btn">Connect</button>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <img src={telegramIcon} alt="" />
                        <h6 className="input-label mb-0">Telegram</h6>
                      </div>
                      <input
                        type="text"
                        placeholder="Telegram"
                        className="settings-input w-100"
                        value={collection.tgLink}
                      />
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <img src={confluxScanIcon} alt="" />
                        <h6 className="input-label mb-0">Conflux Scan</h6>
                      </div>
                      <input
                        type="text"
                        placeholder="Conflux Scan"
                        className="settings-input w-100"
                        disabled
                        value={`https://evm.confluxscan.net/address/${collection.contractAddress}`}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-6 mt-4">
                  <div className="d-flex flex-column gap-4">
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <img src={instagramIcon} alt="" />
                        <h6 className="input-label mb-0">Instagram</h6>
                      </div>
                      <div className="social-connection-item p-2 d-flex align-items-center justify-content-between gap-5 w-100">
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="mb-0 input-label">Instagram</h6>
                        </div>
                        <button className="connect-social-btn">Connect</button>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <img src={discordIcon} alt="" />
                        <h6 className="input-label mb-0">Discord</h6>
                      </div>
                      <input
                        type="text"
                        placeholder="Discord"
                        className="settings-input w-100"
                        value={collection.discordLink}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between">
                <div className="d-flex flex-column gap-2">
                  <h6 className="input-label mb-0">Creator Earnings</h6>
                  <span className="social-connections-span">
                    A fee for earning on each NFT transaction happening for this
                    collection in marketplace.
                  </span>
                </div>
                <div className="col-12 col-lg-3">
                  <input
                    type="text"
                    placeholder="Enter creator earning fee (e.g. 2%)"
                    className="settings-input w-100"
                  />
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center mt-4">
                <button
                  className="connect-social-btn px-3 py-1"
                  style={{ fontSize: "16px" }}
                >
                  Save
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="col-12">
            <h6 className="input-label">My Collections</h6>
            {userCollection && userCollection.length > 0 ? (
              <div className="small-cards-grid">
                {userCollection.map((item, index) => (
                  <div
                    className="collection-card d-flex flex-column"
                    key={index}
                  >
                    <img
                      src={require(`../Profile/assets/favoritesPlaceholder1.png`)}
                      className="w-100"
                      alt=""
                    />
                    <div className="p-3 collection-lower d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="mb-0">{item.collectionName}</h6>
                      </div>
                      {/* <img src={star} alt="" /> */}
                      <button
                        className="edit-collection-btn d-flex align-items-center gap-1"
                        onClick={() => {
                          setCollection(item);
                          getCollectionOwner(item.contractAddress);
                        }}
                      >
                        <img src={penIcon} alt="" />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="d-flex flex-column mt-4 gap-2">
                <div className="no-collections-wrap p-2 w-100 d-flex align-items-center gap-2">
                  <img src={collectionSettingsIcon} alt="" />
                  <span className="no-collections-text">
                    You haven’t created any collections yet.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionSettings;
