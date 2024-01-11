import React from "react";
import "./_morefromcollection.scss";
import Slider from "react-slick";
import checkIcon from "../../Collections/TopCollections/assets/checkIcon.svg";
import { NavLink } from "react-router-dom";

const MoreFromCollection = () => {
  const settings = {
    // dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    // dotsClass: "button__bar",
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 786,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const dummyCards = [
    {
      title: "CAWS #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
      bestOffer: 100.0,
      lastSale: 120.0,
      owner: "0x50c4",
      timeListed: "11d Ago",
    },
    {
      title: "CAWS #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
      bestOffer: 100.0,
      lastSale: 120.0,
      owner: "0x50c4",
      timeListed: "11d Ago",
    },
    {
      title: "CAWS #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
      bestOffer: 100.0,
      lastSale: 120.0,
      owner: "0x50c4",
      timeListed: "11d Ago",
    },
    {
      title: "Timepiece #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
      bestOffer: 100.0,
      lastSale: 120.0,
      owner: "0x50c4",
      timeListed: "11d Ago",
    },
    {
      title: "Timepiece #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
      bestOffer: 100.0,
      lastSale: 120.0,
      owner: "0x50c4",
      timeListed: "11d Ago",
    },
    {
      title: "Timepiece #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
      bestOffer: 100.0,
      lastSale: 120.0,
      owner: "0x50c4",
      timeListed: "11d Ago",
    },
    {
      title: "Land #9999",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
      bestOffer: 100.0,
      lastSale: 120.0,
      owner: "0x50c4",
      timeListed: "11d Ago",
    },
    {
      title: "Land #9999",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
      bestOffer: 100.0,
      lastSale: 120.0,
      owner: "0x50c4",
      timeListed: "11d Ago",
    },
  ];
  return (
    <div className="container-lg py-3">
      <div className="row mx-0">
        <div className="more-collection-wrapper p-3">
          <h6 className="more-collection-title">More From This Collection</h6>
          <Slider {...settings}>
            {dummyCards.map((item, index) => (
              <div
                className="recently-listed-card p-3 d-flex flex-column"
                key={index}
              >
                <NavLink
                  to={`/nft/0/0xd06cf9e1189feab09c844c597abc3767bc12608c`}
                  style={{ textDecoration: "none" }}
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                >
                  <img
                    src={require(`./assets/nftPlaceholder${index + 1}.png`)}
                    className="card-img"
                    alt=""
                  />
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <h6
                      className="recently-listed-title mb-0"
                      style={{ fontSize: "12px" }}
                    >
                      {item.title}
                    </h6>
                    <img src={checkIcon} alt="" />
                  </div>
                  <div className="d-flex align-items-center mt-2 gap-3">
                    <h6 className="cfx-price mb-0" style={{ fontSize: "10px" }}>
                      1254.89 CFX
                    </h6>
                    <span className="usd-price" style={{ fontSize: "9px" }}>
                      ($ 654,874.86)
                    </span>
                  </div>
                  <div className="mt-3">
                    <button className="buy-btn w-100">Buy</button>
                  </div>
                </NavLink>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default MoreFromCollection;
