import React, { useState, useEffect } from "react";
import "./_collectionbanner.scss";
import bannerPlaceholder from "./assets/bannerPlaceholder.png";
import cawsIcon from "./assets/cawsIcon.png";
import confluxScanIcon from "./assets/confluxScanIcon.svg";
import discordIcon from "./assets/discordIcon.svg";
import favoriteIcon from "./assets/favoriteIcon.svg";
import favoriteIconActive from "./assets/favoriteIconActive.svg";

import followIcon from "./assets/followIcon.svg";
import followIconActive from "./assets/followIconActive.svg";

import instagramIcon from "./assets/instagramIcon.svg";
import twitterIcon from "./assets/twitterIcon.svg";
import websiteIcon from "./assets/websiteIcon.svg";
import telegramIcon from "./assets/telegramIcon.svg";
import checkIcon from "../../Collections/TopCollections/assets/checkIcon.svg";
import getFormattedNumber from "../../../hooks/get-formatted-number";
import dummyCollectionIcon from "./assets/dummyCollectionIcon.png";
import OutsideClickHandler from "react-outside-click-handler";
import { shortAddress } from "../../../hooks/shortAddress";
import arrowRight from "./assets/arrowRight.svg";
import { NavLink } from "react-router-dom";

const CollectionBanner = ({
  title,
  logo,
  banner,
  socials,
  bannerActions,
  desc,
  info,
  handleFavorite,
  isFavorite,
  isVerified,
  currentCollection,
  totalSupplyPerCollection,
  collectionFeeRate,
}) => {
  const [showCreatorTooltip, setshowCreatorTooltip] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="container-lg py-0 py-lg-5">
      <div className="row px-0">
        <div className="collection-banner d-flex flex-column px-0">
          <div className="collection-banner-up position-relative">
            <img
              src={banner}
              className="w-100  d-lg-flex collection-banner-img"
              alt=""
            />
            <div className="ps-0 ps-lg-5 collection-position">
              <div className="collection-banner-main-info d-flex flex-column flex-lg-row gap-3 gap-lg-0 align-items-start ps-3 ps-lg-5 pe-3 py-3 justify-content-between">
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-2 position-relative">
                    <img src={logo} className="collection-logo" alt="" />
                    <h6 className="collection-title mb-0">{title}</h6>
                    {isVerified && <img src={checkIcon} alt="" />}
                  </div>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <div className="d-flex align-items-center gap-1">
                      <span className="collection-info-span mb-0">Items</span>
                      <span className="collection-info mb-0">
                        {getFormattedNumber(totalSupplyPerCollection, 0)}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <span className="collection-info-span mb-0">Created</span>
                      <span className="collection-info mb-0">
                        {new Date(
                          currentCollection.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <span className="collection-info-span mb-0">
                        Creator Earning
                      </span>
                      <span className="collection-info mb-0">
                        {collectionFeeRate}%
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <span className="collection-info-span mb-0">Chain</span>
                      <span className="collection-info mb-0">
                        Conflux{" "}
                        <span style={{ textTransform: "initial" }}>eSpace</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 position-relative">
                  {socials.map(
                    (item, index) =>
                      item?.link?.length > 0 && (
                        <a
                          href={item.link === "" ? "#" : item.link}
                          target="_blank"
                          key={index}
                        >
                          <img
                            src={require(`./assets/${item.title}Icon.svg`)}
                            alt=""
                          />
                        </a>
                      )
                  )}

                  <div
                    className="info-divider"
                    style={{ height: "25px" }}
                  ></div>
                  <img
                    src={isFavorite ? favoriteIconActive : favoriteIcon}
                    alt=""
                    className="favorite-icon"
                    onClick={handleFavorite}
                  />
                  <img
                    src={isVerified ? followIconActive : followIcon}
                    alt=""
                    className="favorite-icon"
                    onClick={() => {
                      setshowCreatorTooltip(true);
                    }}
                  />
                  {showCreatorTooltip && (
                    <OutsideClickHandler
                      onOutsideClick={() => setshowCreatorTooltip(false)}
                    >
                      <div className="upload-dropdown w-100 p-3 d-flex flex-column gap-2">
                        <div className="d-flex align-items-center gap-2 position-relative">
                          <img
                            src={logo}
                            className="collection-logo"
                            alt=""
                            style={{ width: 20, height: 20 }}
                          />
                          <h6 className="collection-title2 mb-0">{title}</h6>
                          {isVerified && <img src={checkIcon} alt="" />}
                        </div>
                        <div className="d-flex flex-wrap align-items-center gap-2">
                          <span className="collection-info-span mb-0">
                            Owner
                          </span>
                          <a
                            className="collection-info mb-0"
                            href={`https://evm.confluxscan.net/address/${currentCollection.owner}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {shortAddress(currentCollection.owner)}
                          </a>
                        </div>
                        <div className="d-flex justify-content-end mt-2">
                          <NavLink
                            className="view-profile-text d-flex align-items-center gap-2"
                            to={`/profile/${currentCollection.owner}`}
                          >
                            View profile <img src={arrowRight} alt="" />{" "}
                          </NavLink>
                        </div>
                      </div>
                    </OutsideClickHandler>
                  )}
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
  );
};

export default CollectionBanner;
