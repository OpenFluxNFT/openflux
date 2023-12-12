import React, { useState } from "react";
import "./_trendingcollections.scss";
import Slider from "react-slick";
import checkIcon from "../TopCollections/assets/checkIcon.svg";
import useWindowSize from "../../../hooks/useWindowSize";
import topSalesIcon from "../../Home/TrendingSales/assets/topSalesIcon.svg";
import topSalesIconActive from "../../Home/TrendingSales/assets/topSalesIconActive.svg";
import trendingIcon from "../../Home/TrendingSales/assets/trendingIcon.svg";
import trendingIconActive from "../../Home/TrendingSales/assets/trendingIconActive.svg";
import cawsPlaceholder from "./assets/cawsPlaceholder.png";
import wodPlaceholder from "./assets/wodPlaceholder.png";
import timepiecePlaceholder from "./assets/timepiecePlaceholder.png";

const TrendingCollections = () => {
  const windowSize = useWindowSize();
  const [option, setOption] = useState("trending");
  const [time, setTime] = useState("24h");

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 6000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: "button__bar",
  };

  const dummyCards = [
    {
      title: "Cats And Watches Society",
      image: cawsPlaceholder,
      floorPrice: 125254.89,
      totalVolume: "23.8M",
    },
    {
      title: "CAWS Timepiece",
      image: timepiecePlaceholder,
      floorPrice: 125254.89,
      totalVolume: "23.8M",
    },
    {
      title: "World of Dypians Land",
      image: wodPlaceholder,
      floorPrice: 125254.89,
      totalVolume: "23.8M",
    },
    {
      title: "Cats And Watches Society",
      image: cawsPlaceholder,
      floorPrice: 125254.89,
      totalVolume: "23.8M",
    },
    {
      title: "CAWS Timepiece",
      image: timepiecePlaceholder,
      floorPrice: 125254.89,
      totalVolume: "23.8M",
    },
    {
      title: "World of Dypians Land",
      image: wodPlaceholder,
      floorPrice: 125254.89,
      totalVolume: "23.8M",
    },
    {
      title: "Cats And Watches Society",
      image: cawsPlaceholder,
      floorPrice: 125254.89,
      totalVolume: "23.8M",
    },
    {
      title: "CAWS Timepiece",
      image: timepiecePlaceholder,
      floorPrice: 125254.89,
      totalVolume: "23.8M",
    },
    {
      title: "World of Dypians Land",
      image: wodPlaceholder,
      floorPrice: 125254.89,
      totalVolume: "23.8M",
    },
    {
      title: "World of Dypians Land",
      image: wodPlaceholder,
      floorPrice: 125254.89,
      totalVolume: "23.8M",
    },
  ];

  return (
    <div className="container-fluid trending-sales-wrapper pt-4 pb-5 px-0">
      <div className="container-lg">
        <div className="row">
          <div className="d-flex flex-column flex-lg-row gap-4 gap-lg-0 align-items-center justify-content-between">
            <div className="d-flex align-items center gap-3">
              <div
                className={`trending-tab ${
                  option === "trending" && "trending-tab-active"
                } p-2 d-flex align-items-center gap-2`}
                onClick={() => setOption("trending")}
              >
                <img
                  src={
                    option === "trending" ? trendingIconActive : trendingIcon
                  }
                  alt=""
                />
                <h6 className="mb-0">Trending</h6>
              </div>
              <div
                className={`trending-tab ${
                  option === "topSales" && "trending-tab-active"
                } p-2 d-flex align-items-center gap-2`}
                onClick={() => setOption("topSales")}
              >
                <img
                  src={
                    option === "topSales" ? topSalesIconActive : topSalesIcon
                  }
                  alt=""
                />
                <h6 className="mb-0">Top</h6>
              </div>
            </div>
            <div
              className="trending-tab d-flex align-items-center"
              style={{ border: "1px solid #2f80ed" }}
            >
              <div
                className={`trending-tab ${
                  time === "24h" && "trending-tab-active"
                } p-2`}
                onClick={() => setTime("24h")}
              >
                <h6 className="mb-0">24h</h6>
              </div>
              <div
                className={`trending-tab ${
                  time === "7d" && "trending-tab-active"
                } p-2`}
                onClick={() => setTime("7d")}
              >
                <h6 className="mb-0">7D</h6>
              </div>
              <div
                className={`trending-tab ${
                  time === "30d" && "trending-tab-active"
                } p-2`}
                onClick={() => setTime("30d")}
              >
                <h6 className="mb-0">30D</h6>
              </div>
            </div>
          </div>
        </div>
        <hr className="trending-divider my-4" />
        <div className="row">
          <div className="trending-collections-grid">
            {dummyCards.map((item, index) => (
                <div className="d-flex align-items-center gap-3" key={index}>
                <div className="trending-tag position-relative">
                  <span className="mb-0">{index + 1}</span>
                </div>
                <div className="trending-collection-card d-flex align-items-center gap-2">
                  <img src={item.image} alt="" />
                  <div className="d-flex flex-column gap-2 p-3">
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="trending-collection-title mb-0">
                        {item.title}
                      </h6>
                      <img src={checkIcon} alt="" />
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="d-flex flex-column">
                        <span className="trending-price-holder mb-1">Floor</span>
                        <div className="trending-price-wrapper d-flex align-items-center justify-content-center p-2">
                          <h6 className="trending-price mb-0">{item.floorPrice} CFX</h6>
                        </div>
                      </div>
                      <div className="d-flex flex-column">
                        <span className="trending-price-holder mb-1">
                          Total Volume
                        </span>
                        <div className="trending-price-wrapper d-flex align-items-center justify-content-center p-2">
                          <h6 className="trending-price mb-0">{item.totalVolume} CFX</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingCollections;
