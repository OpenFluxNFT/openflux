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
  handleAddFavoriteNft,
  handleRemoveFavoriteNft,
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

  const [favorite, setFavorite] = useState(false);

  const windowSize = useWindowSize();

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
                      userNftFavs &&
                      userNftFavs.length > 0 &&
                      userNftFavs.find((favitem) => {
                        return (
                          favitem.contractAddress === item.nftAddress &&
                          favitem.tokenIds.find((id) => {
                            return id === item.tokenId.toString();
                          })
                        );
                      })
                        ? handleRemoveFavoriteNft(
                            item.tokenId,
                            item.nftAddress
                          )
                        : handleAddFavoriteNft(item.tokenId, item.nftAddress);
                    }}
                  >
                    <div className="d-flex align-items-center position-relative gap-2">
                      <img
                        src={
                          userNftFavs &&
                          userNftFavs.length > 0 &&
                          userNftFavs.find((favitem) => {
                            return (
                              favitem.contractAddress === item.nftAddress &&
                              favitem.tokenIds.find((id) => {
                                return id === item.tokenId.toString();
                              })
                            );
                          })
                            ? redFavorite
                            : emptyFavorite
                        }
                        alt=""
                        className="fav-img"
                      />
                      <span
                        className={
                          userNftFavs &&
                          userNftFavs.length > 0 &&
                          userNftFavs.find((favitem) => {
                            return (
                              favitem.contractAddress === item.nftAddress &&
                              favitem.tokenIds.find((id) => {
                                return id === item.tokenId.toString();
                              })
                            );
                          })
                            ? "fav-count-active"
                            : "fav-count"
                        }
                      >
                        222
                      </span>
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
                      userNftFavs &&
                      userNftFavs.length > 0 &&
                      userNftFavs.find((favitem) => {
                        return (
                          favitem.contractAddress === item.nftAddress &&
                          favitem.tokenIds.find((id) => {
                            return id === item.tokenId.toString();
                          })
                        );
                      })
                        ? handleRemoveFavoriteNft(
                            item.tokenId,
                            item.nftAddress
                          )
                        : handleAddFavoriteNft(item.tokenId, item.nftAddress);
                    }}
                  >
                    <div className="d-flex align-items-center position-relative gap-2">
                      <img
                        src={ userNftFavs &&
                          userNftFavs.length > 0 &&
                          userNftFavs.find((favitem) => {
                            return (
                              favitem.contractAddress === item.nftAddress &&
                              favitem.tokenIds.find((id) => {
                                return id === item.tokenId.toString();
                              })
                            );
                          })
                            ? redFavorite
                            : emptyFavorite}
                        alt=""
                        className="fav-img"
                      />{" "}
                      <span className={
                          userNftFavs &&
                          userNftFavs.length > 0 &&
                          userNftFavs.find((favitem) => {
                            return (
                              favitem.contractAddress === item.nftAddress &&
                              favitem.tokenIds.find((id) => {
                                return id === item.tokenId.toString();
                              })
                            );
                          })
                            ? "fav-count-active"
                            : "fav-count"
                        }>222</span>
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
