import React, { useEffect, useState } from "react";
import "./_recentlylisted.scss";
import checkIcon from "./assets/checkIcon.svg";
import useWindowSize from "../../../hooks/useWindowSize";
import Slider from "react-slick";
import { NavLink } from "react-router-dom";
import emptyFavorite from "./assets/emptyFavorite.svg";
import redFavorite from "./assets/redFavorite.svg";
import axios from "axios";
import getFormattedNumber from "../../../hooks/get-formatted-number";

const RecentlyListed = ({
  coinbase,
  onFavoriteNft,
  userNftFavs,
  recentlyListedNfts,
  cfxPrice,
}) => {
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
  const [favorite, setFavorite] = useState(false);

  const windowSize = useWindowSize();

  const checkifFavorite = (collectionAddress) => {
    if (userNftFavs && userNftFavs.length > 0) {
      if (userNftFavs.find((obj) => obj === collectionAddress)) {
        setFavorite(true);
      } else {
        setFavorite(false);
      }
    }
  };

  const handleAddFavorite = async (collectionAddress) => {
    if (coinbase && collectionAddress) {
      const data = {
        contractAddress: collectionAddress,
      };

      await axios
        .post(
          `https://confluxapi.worldofdypians.com/api/users/addNftFavorite/${coinbase}`,
          data,
          {
            headers: {
              cascadestyling:
                "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
            },
          }
        )
        .then(() => {
          setFavorite(true);
          onFavoriteNft();
        })
        .catch((e) => {
          console.error(e);
          setFavorite(false);
        });
    }
  };

  const handleRemoveFavorite = async (collectionAddress) => {
    if (coinbase && collectionAddress) {
      const data = {
        contractAddress: collectionAddress,
      };

      await axios
        .post(
          `https://confluxapi.worldofdypians.com/api/users/removeNftFavorite/${coinbase}`,
          data,
          {
            headers: {
              cascadestyling:
                "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
            },
          }
        )
        .then(() => {
          setFavorite(false);
          onFavoriteNft();
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  return (
    <div className="container-lg mt-5">
      <div className="row">
        <h6 className="info-title my-4">
          Recently <span style={{ color: "#2F80ED" }}>Listed NFTs</span>
        </h6>
        {windowSize.width < 786 ? (
          <Slider {...settings}>
            {recentlyListedNfts.map((item, index) => (
              <div
                className="recently-listed-card p-3 d-flex flex-column"
                key={index}
              >
                <NavLink
                  to={`/nft/${item.tokenId}/${item.nftAddress}`}
                  style={{ textDecoration: "none" }}
                  className={"position-relative"}
                >
                  <img
                    src={
                      item.image
                        ? item.image
                        : require(`./assets/nftPlaceholder${index + 1}.png`)
                    }
                    className="card-img"
                    alt=""
                  />
                  <div
                    className="position-absolute favorite-container"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <div className="d-flex align-items-center position-relative gap-2">
                      <img
                        src={favorite ? redFavorite : emptyFavorite}
                        alt=""
                        className="fav-img"
                      />
                      <span className="fav-count">222</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <h6 className="recently-listed-title mb-0">
                      {item.tokenName} #{item.tokenId}
                    </h6>
                    <img src={checkIcon} alt="" />
                  </div>
                  <div className="d-flex align-items-center mt-2 gap-3">
                    <h6 className="cfx-price mb-0">
                      {getFormattedNumber(item.price / 10 ** 18)} WCFX
                    </h6>
                    <span className="usd-price">
                      (${" "}
                      {getFormattedNumber((item.price / 10 ** 18) * cfxPrice)})
                    </span>
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
            {recentlyListedNfts.map((item, index) => (
              <div
                className="recently-listed-card p-3 d-flex flex-column"
                key={index}
              >
                <NavLink
                  to={`/nft/${item.tokenId}/${item.nftAddress}`}
                  style={{ textDecoration: "none" }}
                  className={"position-relative"}
                >
                  <img
                    src={
                      item.image
                        ? item.image
                        : require(`./assets/nftPlaceholder${index + 1}.png`)
                    }
                    className="card-img"
                    alt=""
                  />
                  <div
                    className="position-absolute favorite-container"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <div className="d-flex align-items-center position-relative gap-2">
                      <img
                        src={favorite ? redFavorite : emptyFavorite}
                        alt=""
                        className="fav-img"
                      />{" "}
                      <span className="fav-count">222</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <h6 className="recently-listed-title mb-0">
                      {item.tokenName} #{item.tokenId}
                    </h6>
                    <img src={checkIcon} alt="" />
                  </div>
                  <div className="d-flex align-items-center mt-2 gap-3">
                    <h6 className="cfx-price mb-0">
                      {getFormattedNumber(item.price / 10 ** 18)} WCFX
                    </h6>
                    <span className="usd-price">
                      {" "}
                      (${" "}
                      {getFormattedNumber((item.price / 10 ** 18) * cfxPrice)})
                    </span>
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
