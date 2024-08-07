import React from "react";
import "./_topcollections.scss";
import collectionPlaceholder1 from "./assets/collectionPlaceholder1.png";
import collectionPlaceholder2 from "./assets/collectionPlaceholder2.png";
import collectionPlaceholder3 from "./assets/collectionPlaceholder3.png";
import collectionPlaceholder4 from "./assets/collectionPlaceholder4.png";
import checkIcon from "./assets/checkIcon.svg";
import useWindowSize from "../../../hooks/useWindowSize";
import Slider from "react-slick";
import { NavLink } from "react-router-dom";
import getFormattedNumber from "../../../hooks/get-formatted-number";

const TopCollections = ({
  allCollections,
  allCollectionsOrdered,
  newestCollections,
}) => {
  const windowSize = useWindowSize();
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: "button__bar",
  };

  return (
    <div className="container-lg pt-0 pb-5 pt-lg-5">
      <div className="row">
        <h6 className="main-hero-title mb-3">New Collections</h6>
        {windowSize.width > 786 ? (
          <div className="top-collections-grid pe-0">
            {newestCollections.slice(0, 4).map((item, index) => (
              <div
                className="position-relative top-collection-wrapper"
                key={index}
              >
                <NavLink
                  to={`/collection/${item.contractAddress}/${item.symbol}`}
                >
                  <img
                    src={item.image ? `${item.image}` : collectionPlaceholder2}
                    className="top-collection-image new-collection-img"
                    alt=""
                  />
                  <div className="top-collection-info d-flex flex-column p-3 gap-2">
                    <div className="d-flex align-items-center gap-1">
                      <h6 className="top-collection-title mb-0">
                        {item.collectionName}
                      </h6>

                      {item.verified === "yes" && (
                        <img src={checkIcon} alt="" />
                      )}
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <span className="mb-0 floor-placeholder">Floor:</span>
                      <span className="floor-price mb-0">
                        {allCollectionsOrdered &&
                        allCollectionsOrdered.length > 0
                          ? allCollectionsOrdered.find((obj) => {
                              return (
                                obj.contractAddress.toLowerCase() ===
                                item.contractAddress.toLowerCase()
                              );
                            })
                            ? getFormattedNumber(
                                allCollectionsOrdered.find((obj) => {
                                  return (
                                    obj.contractAddress.toLowerCase() ===
                                    item.contractAddress.toLowerCase()
                                  );
                                }).floorPrice
                              )
                            : 0
                          : 0}{" "}
                        WCFX
                      </span>
                    </div>
                  </div>
                </NavLink>
              </div>
            ))}
          </div>
        ) : (
          <Slider {...settings}>
            {newestCollections.slice(0, 4).map((item, index) => (
              <div
                className="position-relative top-collection-wrapper"
                key={index}
                // style={{ width: "fit-content" }}
              >
                <NavLink
                  to={`/collection/${item.contractAddress}/${item.symbol}`}
                >
                  <img
                    src={item.image ? `${item.image}` : collectionPlaceholder2}
                    className="top-collection-image"
                    alt=""
                  />
                  <div className="top-collection-info d-flex flex-column p-3 gap-2">
                    <div className="d-flex align-items-center gap-1">
                      <h6 className="top-collection-title mb-0">
                        {item.collectionName}
                      </h6>
                      {item.verified === "yes" && (
                        <img src={checkIcon} alt="" />
                      )}
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <span className="mb-0 floor-placeholder">Floor:</span>
                      <span className="floor-price mb-0">
                        {allCollectionsOrdered &&
                        allCollectionsOrdered.length > 0
                          ? allCollectionsOrdered.find((obj) => {
                              return (
                                obj.contractAddress.toLowerCase() ===
                                item.contractAddress.toLowerCase()
                              );
                            })
                            ? getFormattedNumber(
                                allCollectionsOrdered.find((obj) => {
                                  return (
                                    obj.contractAddress.toLowerCase() ===
                                    item.contractAddress.toLowerCase()
                                  );
                                }).floorPrice
                              )
                            : 0
                          : 0}{" "}
                        WCFX
                      </span>
                    </div>
                  </div>
                </NavLink>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default TopCollections;
