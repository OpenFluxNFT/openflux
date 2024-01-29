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
  userNftFavsInitial,
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

  const baseURL = "https://confluxapi.worldofdypians.com";
  const [nftFinalArray, setnftFinalArray] = useState([]);

  const windowSize = useWindowSize();

  const fetchFavoriteCounts = async () => {
    if (recentlyListedNfts && recentlyListedNfts.length > 0) {
      let favoriteCount = 0;
      let nftArray = [];
      await Promise.all(
        window.range(0, recentlyListedNfts.length - 1).map(async (i) => {
          const fav_count_listed = await axios
            .get(
              `${baseURL}/api/nftFavoritesCount/${recentlyListedNfts[i].nftAddress}/${recentlyListedNfts[i].tokenId}`,
              {
                headers: {
                  cascadestyling:
                    "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
                },
              }
            )
            .catch((e) => {
              console.error(e);
            });

          if (fav_count_listed && fav_count_listed.status === 200) {
            favoriteCount = fav_count_listed.data;

            nftArray.push({
              ...favoriteCount,
            });
          }
        })
      );
      setnftFinalArray(nftArray);
    }
  };

  const handleLikeStates = (tokenid, nftAddr) => {
    const stringTokenid = tokenid.toString();

    if (
      userNftFavs &&
      userNftFavs.length > 0 &&
      userNftFavs.find((favitem) => {
        return (
          favitem.contractAddress.toLowerCase() === nftAddr.toLowerCase() &&
          favitem.tokenId.toString() === stringTokenid
        );
      })
    ) {
      handleRemoveFavoriteNft(stringTokenid, nftAddr).then(() => {
        fetchFavoriteCounts();
      });
    } else {
      handleAddFavoriteNft(stringTokenid, nftAddr).then(() => {
        fetchFavoriteCounts();
      });
    }
  };

  useEffect(() => {
    fetchFavoriteCounts();
  }, [recentlyListedNfts]);

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
                      handleLikeStates(item.tokenId, item.nftAddress);
                    }}
                  >
                    <div className="d-flex align-items-center position-relative gap-2">
                      <img
                        src={
                          userNftFavsInitial &&
                          userNftFavsInitial.length > 0 &&
                          userNftFavsInitial.find((favitem) => {
                            return (
                              favitem.contractAddress === item.nftAddress &&
                              favitem.tokenIds.find(
                                (itemTokenIds) => itemTokenIds === item.tokenId
                              )
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
                          userNftFavsInitial &&
                          userNftFavsInitial.length > 0 &&
                          userNftFavsInitial.find((favitem) => {
                            return (
                              favitem.contractAddress === item.nftAddress &&
                              favitem.tokenIds.find(
                                (itemTokenIds) => itemTokenIds === item.tokenId
                              )
                            );
                          })
                            ? "fav-count-active"
                            : "fav-count"
                        }
                      >
                        {
                          nftFinalArray.find((object) => {
                            return (
                              object.contractAddress === item.nftAddress &&
                              Number(object.tokenId) === Number(item.tokenId)
                            );
                          })?.count
                        }
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
                      handleLikeStates(item.tokenId, item.nftAddress);
                    }}
                  >
                    <div className="d-flex align-items-center position-relative gap-2">
                      <img
                        src={
                          userNftFavsInitial &&
                          userNftFavsInitial.length > 0 &&
                          userNftFavsInitial.find((favitem) => {
                            return (
                              favitem.contractAddress === item.nftAddress &&
                              favitem.tokenIds.find(
                                (itemTokenIds) => itemTokenIds === item.tokenId
                              )
                            );
                          })
                            ? redFavorite
                            : emptyFavorite
                        }
                        alt=""
                        className="fav-img"
                      />{" "}
                      <span
                        className={
                          userNftFavsInitial &&
                          userNftFavsInitial.length > 0 &&
                          userNftFavsInitial.find((favitem) => {
                            return (
                              favitem.contractAddress === item.nftAddress &&
                              favitem.tokenIds.find(
                                (itemTokenIds) => itemTokenIds === item.tokenId
                              )
                            );
                          })
                            ? "fav-count-active"
                            : "fav-count"
                        }
                      >
                        {
                          nftFinalArray.find((object) => {
                            return (
                              object.contractAddress === item.nftAddress &&
                              Number(object.tokenId) === Number(item.tokenId)
                            );
                          })?.count
                        }
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
