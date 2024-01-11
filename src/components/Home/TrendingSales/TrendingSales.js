import React, { useState, useEffect } from "react";
import "./_trendingsales.scss";
import cawsPlaceholder from "./assets/cawsPlaceholder.png";
import timepiecePlaceholder from "./assets/timepiecePlaceholder.png";
import wodPlaceholder from "./assets/wodPlaceholder.png";
import checkIcon from "./assets/checkIcon.svg";
import fireIcon from "./assets/fireIcon.svg";
import mintIcon from "./assets/mintIcon.svg";
import mintIconActive from "./assets/mintIconActive.svg";
import topSalesIcon from "./assets/topSalesIcon.svg";
import topSalesIconActive from "./assets/topSalesIconActive.svg";
import recentSalesIconInactive from "./assets/recentSalesIconInactive.svg";
import recentSalesIconActive from "./assets/recentSalesIconActive.svg";
import trendingIcon from "./assets/trendingIcon.svg";
import trendingIconActive from "./assets/trendingIconActive.svg";
import useWindowSize from "../../../hooks/useWindowSize";
import Slider from "react-slick";
import { NavLink } from "react-router-dom";

const TrendingSales = () => {
  const [chunkedArray, setChunkedArray] = useState([]);
  const [option, setOption] = useState("trending");
  const [time, setTime] = useState("24h");
  const windowSize = useWindowSize();

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
      title: "CAWS #1125",
      image: cawsPlaceholder,
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "CAWS #1125",
      image: cawsPlaceholder,
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "CAWS #1125",
      image: cawsPlaceholder,
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "Timepiece #1125",
      image: timepiecePlaceholder,
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "Timepiece #1125",
      image: timepiecePlaceholder,
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "Timepiece #1125",
      image: timepiecePlaceholder,
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "Land #9999",
      image: wodPlaceholder,
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "Land #9999",
      image: wodPlaceholder,
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "Land #9999",
      image: wodPlaceholder,
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
  ];

  const chunkArray = (arr, size) => {
    var myArray = [];
    for (var i = 0; i < arr.length; i += size) {
      myArray.push(arr.slice(i, i + size));
    }

    setChunkedArray(myArray);
  };

  useEffect(() => {
    chunkArray(dummyCards, 3);
  }, []);

  return (
    <>
      <div className="container-lg">
        <div className="row">
          <h6 className="info-title mb-4">
            Data <span style={{ color: "#2F80ED" }}>Tracking</span>
          </h6>
        </div>
      </div>
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
                  <h6 className="mb-0">Top Sales</h6>
                </div>
                <div
                  className={`trending-tab ${
                    option === "recentSales" && "trending-tab-active"
                  } p-2 d-flex align-items-center gap-2`}
                  onClick={() => setOption("recentSales")}
                >
                  <img
                    src={
                      option === "recentSales" ? recentSalesIconActive : recentSalesIconInactive
                    }
                    alt=""
                  />
                  <h6 className="mb-0">Recent Sales</h6>
                </div>
                
                {/* <div
                  className={`trending-tab ${
                    option === "mints" && "trending-tab-active"
                  } p-2 d-flex align-items-center gap-2`}
                  onClick={() => setOption("mints")}
                >
                  <img
                    src={option === "mints" ? mintIconActive : mintIcon}
                    alt=""
                  />
                  <h6 className="mb-0">Mints</h6>
                </div> */}
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
            {windowSize.width > 786 ? (
              <div className="trending-cards-grid">
                {dummyCards.map((item, index) => (
                  <div
                    className="trending-card p-3 d-flex align-items-center position-relative gap-2"
                    key={index}
                  >
                    <NavLink
                      to={`/nft/0/0xd06cf9e1189feab09c844c597abc3767bc12608c`}
                      className="w-100 d-flex align-items-center position-relative gap-2"
                      key={index}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="trending-tag">
                        <span className="mb-0">{index + 1}</span>
                      </div>
                      <img src={item.image} width={100} height={100} alt="" />
                      <div className="d-flex flex-column">
                        <div className="d-flex align-items-center gap-1">
                          <h6 className="trending-card-title mb-0">
                            {item.title}
                          </h6>
                          <img src={checkIcon} alt="" />
                        </div>
                        <div className="d-flex flex-column">
                          <h6 className="trending-card-cfx-price mb-0">
                            {item.cfxPrice} CFX
                          </h6>
                          <span className="trending-card-usd-price mb-0">
                            ($ {item.usdPrice})
                          </span>
                        </div>
                      </div>
                      <div className="sale-tag d-flex align-items-center gap-1">
                        <span className="mb-0">On Sale</span>
                        <img src={fireIcon} alt="" />
                      </div>
                    </NavLink>
                    <span className="list-date">Listed 2 hours ago</span>
                  </div>
                ))}
              </div>
            ) : (
              <Slider {...settings}>
                <div className="trending-cards-grid">
                  {dummyCards.slice(0, 3).map((item, index) => (
                    <div
                      className="trending-card p-3 d-flex align-items-center position-relative gap-2"
                      key={index}
                    >
                      <NavLink
                        to={`/nft/0/0xd06cf9e1189feab09c844c597abc3767bc12608c`}
                        className="w-100 d-flex align-items-center position-relative gap-2"
                        style={{ textDecoration: "none" }}
                      >
                        <div className="trending-tag">
                          <span className="mb-0">{index + 1}</span>
                        </div>
                        <img src={item.image} width={100} height={100} alt="" />
                        <div className="d-flex flex-column">
                          <div className="d-flex align-items-center gap-1">
                            <h6 className="trending-card-title mb-0">
                              {item.title}
                            </h6>
                            <img src={checkIcon} alt="" />
                          </div>
                          <div className="d-flex flex-column">
                            <h6 className="trending-card-cfx-price mb-0">
                              {item.cfxPrice} CFX
                            </h6>
                            <span className="trending-card-usd-price mb-0">
                              ($ {item.usdPrice})
                            </span>
                          </div>
                        </div>
                        <div className="sale-tag d-flex align-items-center gap-1">
                          <span className="mb-0">On Sale</span>
                          <img src={fireIcon} alt="" />
                        </div>
                      </NavLink>
                      <span className="list-date">Listed 2 hours ago</span>
                    </div>
                  ))}
                </div>

                <div className="trending-cards-grid">
                  {dummyCards.slice(3, 6).map((item, index) => (
                    <div
                      className="trending-card p-3 d-flex align-items-center position-relative gap-2"
                      key={index}
                    >
                      <NavLink
                        to={`/nft/0/0xd06cf9e1189feab09c844c597abc3767bc12608c`}
                        className="w-100 d-flex align-items-center position-relative gap-2"
                        style={{ textDecoration: "none" }}
                      >
                        <div className="trending-tag">
                          <span className="mb-0">{index + 1}</span>
                        </div>
                        <img src={item.image} width={100} height={100} alt="" />
                        <div className="d-flex flex-column">
                          <div className="d-flex align-items-center gap-1">
                            <h6 className="trending-card-title mb-0">
                              {item.title}
                            </h6>
                            <img src={checkIcon} alt="" />
                          </div>
                          <div className="d-flex flex-column">
                            <h6 className="trending-card-cfx-price mb-0">
                              {item.cfxPrice} CFX
                            </h6>
                            <span className="trending-card-usd-price mb-0">
                              ($ {item.usdPrice})
                            </span>
                          </div>
                        </div>
                        <div className="sale-tag d-flex align-items-center gap-1">
                          <span className="mb-0">On Sale</span>
                          <img src={fireIcon} alt="" />
                        </div>
                      </NavLink>
                      <span className="list-date">Listed 2 hours ago</span>
                    </div>
                  ))}
                </div>

                <div className="trending-cards-grid">
                  {dummyCards.slice(6, 9).map((item, index) => (
                    <div
                      className="trending-card p-3 d-flex align-items-center position-relative gap-2"
                      key={index}
                    >
                      <NavLink
                        to={`/nft/0/0xd06cf9e1189feab09c844c597abc3767bc12608c`}
                        className=" w-100 d-flex align-items-center position-relative gap-2"
                        style={{ textDecoration: "none" }}
                      >
                        <div className="trending-tag">
                          <span className="mb-0">{index + 1}</span>
                        </div>
                        <img src={item.image} width={100} height={100} alt="" />
                        <div className="d-flex flex-column">
                          <div className="d-flex align-items-center gap-1">
                            <h6 className="trending-card-title mb-0">
                              {item.title}
                            </h6>
                            <img src={checkIcon} alt="" />
                          </div>
                          <div className="d-flex flex-column">
                            <h6 className="trending-card-cfx-price mb-0">
                              {item.cfxPrice} CFX
                            </h6>
                            <span className="trending-card-usd-price mb-0">
                              ($ {item.usdPrice})
                            </span>
                          </div>
                        </div>
                        <div className="sale-tag d-flex align-items-center gap-1">
                          <span className="mb-0">On Sale</span>
                          <img src={fireIcon} alt="" />
                        </div>
                      </NavLink>
                      <span className="list-date">Listed 2 hours ago</span>
                    </div>
                  ))}
                </div>
              </Slider>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TrendingSales;
