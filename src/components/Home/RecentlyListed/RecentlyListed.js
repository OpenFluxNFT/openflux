import React, { useEffect } from "react";
import "./_recentlylisted.scss";
import checkIcon from "./assets/checkIcon.svg";
import useWindowSize from "../../../hooks/useWindowSize";
import Slider from "react-slick";
import { NavLink } from "react-router-dom";

const RecentlyListed = () => {
  const settings = {
    // dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // dotsClass: "button__bar",
  };

  const dummyCards = [
    {
      title: "CAWS #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "CAWS #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "CAWS #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "Timepiece #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "Timepiece #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "Timepiece #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "Land #9999",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "Land #9999",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
  ];

  const windowSize = useWindowSize();

  return (
    <div className="container-lg mt-5">
      <div className="row">
        <h6 className="info-title my-4">
          Recently <span style={{ color: "#2F80ED" }}>Listed NFTs</span>
        </h6>
        {windowSize.width < 786 ? (
          <Slider {...settings}>
            {dummyCards.map((item, index) => (
              <div
                className="recently-listed-card p-3 d-flex flex-column"
                key={index}
              >
                <NavLink
                  to={`/nft/0/0xd06cf9e1189feab09c844c597abc3767bc12608c`}
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={require(`./assets/nftPlaceholder${index + 1}.png`)}
                    className="card-img"
                    alt=""
                  />
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <h6 className="recently-listed-title mb-0">CAWS #1125</h6>
                    <img src={checkIcon} alt="" />
                  </div>
                  <div className="d-flex align-items-center mt-2 gap-3">
                    <h6 className="cfx-price mb-0">1254.89 CFX</h6>
                    <span className="usd-price">($ 654,874.86)</span>
                  </div>
                  <div className="mt-3">
                    <button className="buy-btn w-100">Buy</button>
                  </div>
                </NavLink>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="recently-listed-grid mt-4">
            {dummyCards.map((item, index) => (
              <div
                className="recently-listed-card p-3 d-flex flex-column"
                key={index}
              >
                <NavLink
                  to={`/nft/0/0xd06cf9e1189feab09c844c597abc3767bc12608c`}
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={require(`./assets/nftPlaceholder${index + 1}.png`)}
                    className="card-img"
                    alt=""
                  />
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <h6 className="recently-listed-title mb-0">CAWS #1125</h6>
                    <img src={checkIcon} alt="" />
                  </div>
                  <div className="d-flex align-items-center mt-2 gap-3">
                    <h6 className="cfx-price mb-0">1254.89 CFX</h6>
                    <span className="usd-price">($ 654,874.86)</span>
                  </div>
                  <div className="mt-3">
                    <button className="buy-btn w-100">Buy</button>
                  </div>
                </NavLink>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyListed;
