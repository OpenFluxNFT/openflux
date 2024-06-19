import React, { useState, useEffect } from "react";
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
import Toast from "../Toast/Toast";
import { Checkbox } from "@mui/material";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#141843",
    maxWidth: 220,
    border: "1px solid rgba(47, 128, 237, 0.20)",
  },
}));

const CollectionSettings = ({
  userCollection,
  updateCollectionData,
  onSelectCollection,
  successUpdateCollectionProfile,
}) => {
  const [collection, setCollection] = useState(null);

  const [profileImage, setProfileImage] = useState();
  const [bannerImage, setBannerImage] = useState();
  const [featuredImage, setFeaturedImage] = useState();
  const [collectionsImage, setCollectionsImage] = useState();
  const [collectionOwner, setcollectionOwner] = useState();
  const [collectionFeeRate, setcollectionFeeRate] = useState(0);
  const [status, setstatus] = useState("initial");

  const [isEdit, setIsEdit] = useState(false);
  const [isEditFee, setIsEditFee] = useState(false);

  const [collectionInfo, setcollectionInfo] = useState({
    collectionProfilePic: "",
    collectionBackgroundPic: "",
    collectionBannerPic: "",
    featuredBannerPic: "",
    websiteLink: "",
    twitterLink: "",
    tgLink: "",
    discordLink: "",
    instagramLink: "",
    tags: [],
    description: "",
  });

  const [toastInfo, setToastInfo] = useState({
    message: "",
    error: false,
  });

  let tagsArray = [];
  const baseUrl = "https://confluxapi.worldofdypians.com/";

  const getCollectionOwner = async (collectionAddress) => {
    const result = await axios
      .get(
        `https://confluxapi.worldofdypians.com/api/collections/getCollectionOwner/${collectionAddress}`,
        {
          headers: {
            cascadestyling:
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

  const display = () => {
    if (collection) {
      setcollectionInfo((collectionInfo) => ({
        ...collectionInfo,
        websiteLink: collection.websiteLink,
        twitterLink: collection.twitterLink,
        tgLink: collection.tgLink,
        discordLink: collection.discordLink,
        instagramLink: collection.instagramLink,
        tags: collection.tags,
        description: collection.description,
      }));

      if (collection?.collectionProfilePic) {
        setProfileImage(baseUrl + collection?.collectionProfilePic);
      }

      if (collection?.collectionBackgroundPic) {
        setBannerImage(baseUrl + collection?.collectionBackgroundPic);
      }

      if (collection?.featuredBannerPicture) {
        setFeaturedImage(baseUrl + collection?.featuredBannerPicture);
      }
      if (collection?.collectionBannerPicture) {
        setCollectionsImage(baseUrl + collection?.collectionBannerPicture);
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
          setcollectionInfo((collectionInfo) => ({
            ...collectionInfo,
            collectionProfilePic: file,
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
  const uploadCollectionsImage = async (e) => {
    const maxSizeInBytes = 500 * 1024; // 500KB
    setIsEdit(true);
    const files = e.target.files;

    if (files.length > 0) {
      const file = files[0];

      if (
        file &&
        (await isImage(file)) &&
        file.size <= maxSizeInBytes &&
        (await isAspectRatioValidProfile(file, 350, 400))
      ) {
        // Set the selected image
        const reader = new FileReader();

        reader.onload = () => {
          setcollectionInfo((collectionInfo) => ({
            ...collectionInfo,
            collectionBannerPic: file,
          }));
          setCollectionsImage(reader.result);
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
            message: "Selected image must be a maximum of 350px x 400px",
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
  const uploadFeaturedImage = async (e) => {
    const maxSizeInBytes = 500 * 1024; // 500KB
    setIsEdit(true);
    const files = e.target.files;

    if (files.length > 0) {
      const file = files[0];

      if (
        file &&
        (await isImage(file)) &&
        file.size <= maxSizeInBytes &&
        (await isAspectRatioValidProfile(file, 350, 230))
      ) {
        // Set the selected image
        const reader = new FileReader();

        reader.onload = () => {
          // Set the selected image as a data URL
          setFeaturedImage(reader.result);
          setcollectionInfo((collectionInfo) => ({
            ...collectionInfo,
            featuredBannerPic: file,
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
            message: "Selected image must be a maximum of 350px x 230px",
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
        (await isAspectRatioValidProfile(file, 1400, 320))
      ) {
        // Set the selected image
        const reader = new FileReader();

        reader.onload = () => {
          // Set the selected image as a data URL
          setBannerImage(reader.result);
          setcollectionInfo((collectionInfo) => ({
            ...collectionInfo,
            collectionBannerPic: file,
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
            message: "Selected image must be a maximum of 1400px x 320px",
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
  const addTags = (tag) => {
    let tagArray = collectionInfo.tags;
    if (tagArray.includes(tag)) {
      const index = tagArray.indexOf(tag);
      tagArray.splice(index, 1);
    } else {
      tagArray.push(tag);
    }
 const finaltagArray = tagArray.filter((obj)=>{return obj !== ''})
 
    setcollectionInfo((collectionInfo) => ({
      ...collectionInfo,
      tags: finaltagArray,
    }));
  };

  const getCollectionInfo = async () => {
    const result = await axios
      .get(`${baseUrl}api/collection-info/${collection.contractAddress}`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      setcollectionFeeRate(result.data.collectionFeeRate / 10);
    }
  };

  const getCollectionInfoCache = async () => {
    const result = await axios
      .get(
        `${baseUrl}api/refresh-collection-info/${collection.contractAddress}`,
        {
          headers: {
            cascadestyling:
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
          },
        }
      )
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      getCollectionInfo();
    }
  };

  const handleUpdateCollectionFee = async () => {
    setstatus("loading");
    await window.window
      .updateCollectionFee(collection.contractAddress, collectionFeeRate)
      .then(() => {
        getCollectionInfoCache();
        setstatus("success");
        setTimeout(() => {
          setIsEditFee(false);
          setstatus("initial");
        }, 3000);
      })
      .catch((e) => {
        console.error(e);
        setstatus("error");

        setTimeout(() => {
          setstatus("initial");
        }, 3000);
      });
  };

  useEffect(() => {
    display();
  }, [collection]);

  useEffect(() => {
    if (collection) {
      getCollectionInfo();
    }
  }, [collection]);

  return (
    <>
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
                      placeholder="Blockchain"
                      className="settings-input w-100"
                      value={"Conflux eSpace"}
                      disabled
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
                      value={collectionInfo.websiteLink}
                      onChange={(e) => {
                        setIsEdit(true);
                        setcollectionInfo((collectionInfo) => ({
                          ...collectionInfo,
                          websiteLink: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 mt-4">
                <div className="d-flex flex-column gap-4">
                  <div className="d-flex flex-column gap-2">
                    <h6 className="input-label mb-0">Tags</h6>
                    <div className="checkbox-grid">
                      <div className="d-flex align-items-center gap-2">
                        <Checkbox
                          onChange={() => {
                            addTags("Gaming");
                            setIsEdit(true);
                          }}
                          sx={{
                            color: "white",
                            "&.Mui-checked": {
                              color: "#00FECF",
                            },
                          }}
                          checked={
                            collectionInfo.tags.find((item) => {
                              return item === "Gaming";
                            }) !== undefined
                              ? true
                              : false
                          }
                        />
                        <span className="checkbox-title">Gaming</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Checkbox
                          onChange={() => {
                            addTags("Art");
                            setIsEdit(true);
                          }}
                          sx={{
                            color: "white",
                            "&.Mui-checked": {
                              color: "#00FECF",
                            },
                          }}
                          checked={
                            collectionInfo.tags.find((item) => {
                              return item === "Art";
                            }) !== undefined
                              ? true
                              : false
                          }
                        />
                        <span className="checkbox-title">Art</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Checkbox
                          onChange={() => {
                            addTags("Virtual World");
                            setIsEdit(true);
                          }}
                          sx={{
                            color: "white",
                            "&.Mui-checked": {
                              color: "#00FECF",
                            },
                          }}
                          checked={
                            collectionInfo.tags.find((item) => {
                              return item === "Virtual World";
                            }) !== undefined
                              ? true
                              : false
                          }
                        />
                        <span className="checkbox-title">Virtual World</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Checkbox
                          onChange={() => {
                            addTags("Music");
                            setIsEdit(true);
                          }}
                          sx={{
                            color: "white",
                            "&.Mui-checked": {
                              color: "#00FECF",
                            },
                          }}
                          checked={
                            collectionInfo.tags.find((item) => {
                              return item === "Music";
                            }) !== undefined
                              ? true
                              : false
                          }
                        />
                        <span className="checkbox-title">Music</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Checkbox
                          onChange={() => {
                            addTags("Sports");
                            setIsEdit(true);
                          }}
                          sx={{
                            color: "white",
                            "&.Mui-checked": {
                              color: "#00FECF",
                            },
                          }}
                          checked={
                            collectionInfo.tags.find((item) => {
                              return item === "Sports";
                            }) !== undefined
                              ? true
                              : false
                          }
                        />
                        <span className="checkbox-title">Sports</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-column gap-2 mt-4 mt-lg-0">
                    <h6 className="input-label mb-0">Description</h6>
                    <textarea
                      type="text"
                      placeholder="Description"
                      className="settings-input w-100"
                      style={{ height: "100%" }}
                      rows={5}
                      value={collectionInfo.description}
                      onChange={(e) => {
                        setIsEdit(true);
                        setcollectionInfo((collectionInfo) => ({
                          ...collectionInfo,
                          description: e.target.value,
                        }));
                      }}
                      maxLength={350}
                    />
                  </div>
                </div>
              </div>
              <div className="row mx-0">
                <h6 className="input-label mb-0 mt-5 p-0">Collection images</h6>
                <span className="comment-txt p-0">
                  These images will be used for featuring your collection on the
                  homepage, category pages, or other display areas of the
                  Marketplace
                </span>
                <div className="col-12 col-lg-6 mt-4">
                  <div className="d-flex flex-column justify-content-between mt-4 mt-lg-0 h-100">
                    <div className="d-flex justify-content-between gap-2 align-items-center">
                      <div className="col-3">
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <h6 className="input-label mb-0">Logo</h6>
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
                              <img
                                src={infoIcon}
                                width={16}
                                height={16}
                                alt=""
                              />
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
                      <div className="col-8">
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <h6 className="input-label mb-0">Profile Banner</h6>
                            <HtmlTooltip
                              placement="top"
                              title={
                                <div className="d-flex flex-column gap-2">
                                  <p className="tooltip-text mb-0">
                                    Recommended: 1400px x 320px
                                  </p>
                                  <p className="tooltip-text mb-0">
                                    Max size: 500KB
                                  </p>
                                </div>
                              }
                            >
                              <img
                                src={infoIcon}
                                width={16}
                                height={16}
                                alt=""
                              />
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
                  </div>
                </div>
                <div className="col-12 col-lg-6 mt-4">
                  <div className="d-flex flex-column justify-content-between mt-4 mt-lg-0 h-100">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="col-6">
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <h6 className="input-label mb-0">
                              Featured Banner
                            </h6>
                            <HtmlTooltip
                              placement="top"
                              title={
                                <div className="d-flex flex-column gap-2">
                                  <p className="tooltip-text mb-0">
                                    Recommended: 350px x 230px
                                  </p>
                                  <p className="tooltip-text mb-0">
                                    Max size: 500KB
                                  </p>
                                </div>
                              }
                            >
                              <img
                                src={infoIcon}
                                width={16}
                                height={16}
                                alt=""
                              />
                            </HtmlTooltip>
                          </div>
                          <div className="featured-banner-placeholder">
                            <input
                              type="file"
                              accept=".png"
                              onChange={uploadFeaturedImage}
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
                            {featuredImage && (
                              <img
                                src={featuredImage}
                                className="featured-image"
                                alt=""
                              />
                            )}
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
                                  <p className="tooltip-text mb-0">
                                    Max size: 500KB
                                  </p>
                                </div>
                              }
                            >
                              <img
                                src={infoIcon}
                                width={16}
                                height={16}
                                alt=""
                              />
                            </HtmlTooltip>
                          </div>

                          <div className="collection-banner-placeholder">
                            <input
                              type="file"
                              accept=".png"
                              onChange={uploadCollectionsImage}
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
                            {collectionsImage && (
                              <img
                                src={collectionsImage}
                                className="collection-banner-image"
                                alt=""
                              />
                            )}
                            <img src={editIcon} alt="" className="edit-image" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 mt-4">
                <div className="row">
                  <div className="col-12 col-lg-6 mt-4">
                    <div className="d-flex flex-column gap-4">
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <img src={twitterIcon} alt="" />
                          <h6 className="input-label mb-0">Twitter</h6>
                        </div>
                        <div className="d-flex align-items-center justify-content-between gap-5 w-100">
                          {/* <div className="d-flex align-items-center gap-2">
                            <h6 className="mb-0 input-label">Twitter</h6>
                          </div> */}
                          <input
                            type="text"
                            placeholder="Twitter"
                            className="settings-input w-100"
                            value={collectionInfo.twitterLink}
                            onChange={(e) => {
                              setIsEdit(true);
                              setcollectionInfo((collectionInfo) => ({
                                ...collectionInfo,
                                twitterLink: e.target.value,
                              }));
                            }}
                          />
                          {/* <button className="connect-social-btn">
                            Connect
                          </button> */}
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
                          value={collectionInfo.tgLink}
                          onChange={(e) => {
                            setIsEdit(true);
                            setcollectionInfo((collectionInfo) => ({
                              ...collectionInfo,
                              tgLink: e.target.value,
                            }));
                          }}
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
                        <div className="d-flex align-items-center justify-content-between gap-5 w-100">
                          {/* <div className="d-flex align-items-center gap-2">
                            <h6 className="mb-0 input-label">Instagram</h6>
                          </div> */}
                          <input
                            type="text"
                            placeholder="Instagram"
                            className="settings-input w-100"
                            value={collectionInfo.instagramLink}
                            onChange={(e) => {
                              setIsEdit(true);
                              setcollectionInfo((collectionInfo) => ({
                                ...collectionInfo,
                                instagramLink: e.target.value,
                              }));
                            }}
                          />
                          {/* <button className="connect-social-btn">
                            Connect
                          </button> */}
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
                          value={collectionInfo.discordLink}
                          onChange={(e) => {
                            setIsEdit(true);
                            setcollectionInfo((collectionInfo) => ({
                              ...collectionInfo,
                              discordLink: e.target.value,
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-2">
                  <div className="d-flex flex-column gap-2">
                    <h6 className="input-label mb-0">Creator Earnings</h6>
                    <span className="social-connections-span">
                      A fee for earning on each NFT transaction happening for
                      this collection in marketplace.
                      <br />
                      <b>*Maximum fee is 10%.</b>
                    </span>
                  </div>
                  <div className="col-12 col-lg-3">
                    <input
                      type="text"
                      placeholder="Enter creator earning fee (e.g. 2%)"
                      className="settings-input w-100"
                      max={10}
                      value={collectionFeeRate}
                      onChange={(e) => {
                        setcollectionFeeRate(
                          Number(e.target.value) > 10 ? 10 : e.target.value
                        );
                        setIsEditFee(true);
                      }}
                      onClickCapture={() => {
                        setcollectionFeeRate(
                          collectionFeeRate != 0 ? collectionFeeRate : ""
                        );
                      }}
                    />
                  </div>
                  <button
                    className={` ${
                      !isEditFee && "disabled-save-btn"
                    } connect-social-btn px-3 py-1`}
                    style={{ fontSize: "16px" }}
                    disabled={!isEditFee}
                    onClick={() => handleUpdateCollectionFee()}
                  >
                    {status === "initial" ? (
                      "Update"
                    ) : status === "loading" ? (
                      <>
                        Updating{" "}
                        <div
                          className="spinner-border mx-1"
                          role="status"
                          style={{ width: 15, height: 15 }}
                        ></div>{" "}
                      </>
                    ) : status === "success" ? (
                      "Success"
                    ) : (
                      "Failed"
                    )}
                  </button>
                </div>
                <div className="d-flex align-items-center justify-content-center mt-4">
                  <button
                    className={` ${
                      !isEdit && "disabled-save-btn"
                    } connect-social-btn px-3 py-1`}
                    style={{ fontSize: "16px" }}
                    disabled={!isEdit}
                    onClick={() => updateCollectionData(collectionInfo)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="col-12">
              {userCollection && userCollection.length > 0 ? (
                <h6 className="input-label">My Collections</h6>
              ) : (
                <></>
              )}
              {userCollection && userCollection.length > 0 ? (
                <div className="small-cards-grid">
                  {userCollection.map((item, index) => (
                    <div
                      className="collection-card d-flex flex-column"
                      key={index}
                    >
                     {item.featuredBannerPicture ?
                     <img
                     src={`https://confluxapi.worldofdypians.com/${item.featuredBannerPicture}`}
                     className="w-100 featured-collection-pic"
                     alt=""
                   />
                   :
                   <img
                   src={require('../../components/CollectionCard/noImageCollection.png')}
                   className="w-100 featured-collection-pic"
                   alt=""
                 /> 
                    }
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
                            onSelectCollection(item._id);
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
        <Toast
          isSuccess={successUpdateCollectionProfile.success ? true : false}
          isError={
            successUpdateCollectionProfile.success === false ? true : false
          }
          message={successUpdateCollectionProfile.message}
        />
        <Toast isError={toastInfo.error} message={toastInfo.message} />
      </div>
    </>
  );
};

export default CollectionSettings;
