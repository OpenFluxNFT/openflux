import React from "react";
import "./_collectioncard.scss";
import confluxLogo from "./confluxLogo.svg";
import checkIcon from "../Collections/TopCollections/assets/checkIcon.svg";
import collectionCardPlaceholder1 from "../../components/Collections/CollectionCategories/assets/collectionCardPlaceholder1.png";
import getFormattedNumber from "../../hooks/get-formatted-number";

const CollectionCard = ({ data }) => {
  return (
    <div className="d-flex flex-column collection-card ">
      <img
        src={
          data.featuredBannerPicture
            ? `https://confluxapi.worldofdypians.com/${data.featuredBannerPicture}`
            : collectionCardPlaceholder1
        }
        className="w-100 featured-collection-pic"
        alt=""
      />

      <div className="collection-card-bottom d-flex flex-column gap-3 p-3">
        <div className="d-flex align-items-center gap-2 overflow-hidden">
          <h6 className="collection-card-title mb-0">{data.collectionName}</h6>
          {data.verified === "yes" && <img src={checkIcon} alt="" />}
        </div>
        <div className="d-flex align-items-center gap-2 justify-content-between">
          <div className="d-flex flex-column">
            <span className="collection-price-holder mb-1">Floor</span>
            <div className="collection-price-wrapper d-flex align-items-center gap-2 justify-content-center p-2">
              {/* <img src={confluxLogo} alt="" /> */}
              <h6 className="collection-price mb-0">
                { getFormattedNumber(data.floorPrice)  ?? 0} WCFX
              </h6>
            </div>
          </div>
          <div className="d-flex flex-column">
            <span className="collection-price-holder mb-1">Total Volume</span>
            <div className="collection-price-wrapper gap-2 d-flex align-items-center justify-content-center p-2">
              {/* <img src={confluxLogo} alt="" /> */}
              <h6 className="collection-price mb-0">
                {data.totalVolume ?? "tbd"} WCFX
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
