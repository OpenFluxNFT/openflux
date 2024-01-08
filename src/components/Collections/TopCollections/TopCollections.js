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

const TopCollections = () => {
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

  const dummyCollections = [
    {
      title: "Cats and Watches Society",
      img: collectionPlaceholder1,
      floorPrice: 122.8,
      collectionName: "catsandwatchessocietycaws",
    },
    {
      title: "World of Dypians Land",
      img: collectionPlaceholder2,
      floorPrice: 142.7,
      collectionName: "worldofdypians",
    },
    {
      title: "CAWS Timepiece",
      img: collectionPlaceholder3,
      floorPrice: "--",
      collectionName: "cawstimepiece",
    },
    {
      title: "Cats and Watches Society",
      img: collectionPlaceholder4,
      floorPrice: "--",
      collectionName: "catsandwatchessocietycaws",
    },
  ];

  return (
    <div className="container-lg pt-0 pb-5 pt-lg-5">
      <div className="row">
        <h6 className="main-hero-title mb-3">Top Collections</h6>
        {windowSize.width > 786 ? (
          <div className="top-collections-grid pe-0">
            {dummyCollections.map((item, index) => (
              <div
                className="position-relative"
                key={index}
                style={{ width: "fit-content" }}
              >
                <NavLink to={`/collection/${item.collectionName}`}>
                  <img src={item.img} className="top-collection-image" alt="" />
                  <div className="top-collection-info d-flex flex-column p-3 gap-2">
                    <div className="d-flex align-items-center gap-1">
                      <h6 className="top-collection-title mb-0">
                        {item.title}
                      </h6>
                      <img src={checkIcon} alt="" />
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <span className="mb-0 floor-placeholder">Floor:</span>
                      <span className="floor-price mb-0">
                        {item.floorPrice} CFX
                      </span>
                    </div>
                  </div>
                </NavLink>
              </div>
            ))}
          </div>
        ) : (
          <Slider {...settings}>
            {dummyCollections.map((item, index) => (
              <div
                className="position-relative"
                key={index}
                // style={{ width: "fit-content" }}
              >
                <NavLink to={`/collection/${item.collectionName}`}>
                  <img src={item.img} className="top-collection-image" alt="" />
                  <div className="top-collection-info d-flex flex-column p-3 gap-2">
                    <div className="d-flex align-items-center gap-1">
                      <h6 className="top-collection-title mb-0">
                        {item.title}
                      </h6>
                      <img src={checkIcon} alt="" />
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <span className="mb-0 floor-placeholder">Floor:</span>
                      <span className="floor-price mb-0">
                        {item.floorPrice} CFX
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
