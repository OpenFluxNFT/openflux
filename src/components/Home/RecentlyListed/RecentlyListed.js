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
  onFavoriteNft,
  userNftFavs,
  recentlyListedNfts,
  cfxPrice,
  handleAddFavoriteNft,
  handleRemoveFavoriteNft,
  userNftFavsInitial,
  coinbase,
  onRefreshListings,
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
  const [buyStatus, setbuyStatus] = useState("buy"); //buy
  const [buyloading, setbuyLoading] = useState(false); //buy
  const [selectedNftId, setSelectedNftId] = useState(""); //buy

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

  const handleRefreshData = async (nft) => {
    const listednfts = await axios
      .get(
        `${baseURL}/api/collections/${nft.nftAddress.toLowerCase()}/refresh-listings`,
        {
          headers: {
            cascadestyling:
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
          },
        }
      )
      .catch((e) => {
        console.log(e);
      });

    if (listednfts && listednfts.status === 200) {
      onRefreshListings();
    }
  };

  const checkNftApprovalForBuying = async (amount) => {
    const result = await window.isApprovedBuy(amount).catch((e) => {
      console.error(e);
    });

    if (result === true) {
      setbuyStatus("buy");
      return true;
    } else {
      setbuyStatus("approve");
      return false;
    }
  };

  const handleBuyNft = async (nft) => {
    setSelectedNftId(nft.tokenId);
    let listingsArray = [];

    const listednfts = await axios
      .get(
        `${baseURL}/api/collections/${nft.nftAddress.toLowerCase()}/listings`,
        {
          headers: {
            cascadestyling:
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
          },
        }
      )
      .catch((e) => {
        console.log(e);
      });

    if (listednfts && listednfts.status === 200) {
      listingsArray = listednfts.data.listings;
    }

    if (coinbase) {
      const isApproved = await checkNftApprovalForBuying(nft.price).then(
        (data) => {
          return data;
        }
      );

      const listingIndex = listingsArray.findIndex(
        (object) =>
          object.nftAddress.toLowerCase() === nft.nftAddress.toLowerCase() &&
          object.tokenId === nft.tokenId
      );

      console.log(listingIndex);

      if (isApproved) {
        setbuyLoading(true);
        setbuyStatus("buy");

        await window
          .buyNFT(nft.nftAddress, listingIndex, nft.price)
          .then((result) => {
            setbuyLoading(false);

            setbuyStatus("success");
            handleRefreshData(nft);
            setTimeout(() => {
              setbuyStatus("");
            }, 2000);
          })
          .catch((e) => {
            setbuyStatus("failed");
            setbuyLoading(false);
            setTimeout(() => {
              setbuyStatus("buy");
            }, 3000);
            console.error(e);
          });
      } else {
        setbuyStatus("approve");
        setbuyLoading(true);

        await window
          .approveBuy(nft.price)
          .then(() => {
            setTimeout(() => {
              setbuyStatus("buy");
            }, 3000);
            setbuyStatus("success");
            setbuyLoading(false);
          })
          .catch((e) => {
            console.error(e);
            setbuyStatus("failed");
            setTimeout(() => {
              setbuyStatus("approve");
            }, 3000);
            setbuyLoading(false);
          });
      }
    } else window.alertify.error("Please connect wallet first!");
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
          recentlyListedNfts && recentlyListedNfts.length > 0 ? (
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
                          ? `https://cdnflux.dypius.com/${item.image}`
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
                                  (itemTokenIds) =>
                                    itemTokenIds === item.tokenId
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
                                  (itemTokenIds) =>
                                    itemTokenIds === item.tokenId
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
                        {getFormattedNumber((item.price / 10 ** 18) * cfxPrice)}
                        )
                      </span>
                    </div>

                    <div className="mt-3">
                      {coinbase &&
                      coinbase.toLowerCase() === item.seller?.toLowerCase() ? (
                        <NavLink
                          className="buy-btn w-100 d-flex justify-content-center "
                          to={`/nft/${item.tokenId}/${item.nftAddress}`}
                          style={{ textDecoration: "none" }}
                        >
                          View Details
                        </NavLink>
                      ) : (
                        <button
                          className="buy-btn w-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleBuyNft(item);
                          }}
                        >
                          {coinbase
                            ? coinbase.toLowerCase() ===
                              item.seller?.toLowerCase()
                              ? "View Details"
                              : coinbase.toLowerCase() !==
                                  item.seller?.toLowerCase() &&
                                item.isApproved === false
                              ? "Approve Buy"
                              : "Buy"
                            : "Buy"}
                          {buyloading && selectedNftId === item.tokenId && (
                            <div
                              className="spinner-border spinner-border-sm text-light ms-1"
                              role="status"
                            ></div>
                          )}
                        </button>
                      )}
                    </div>
                  </NavLink>
                </div>
              ))}
            </Slider>
          ) : (
            <>
              <div></div>
              <div
                className="d-flex w-100 align-items-center justify-content-center"
                style={{ minHeight: "450px" }}
              >
                <h6 className="text-white">There are no recent listings</h6>
              </div>
              <div></div>
            </>
          )
        ) : recentlyListedNfts && recentlyListedNfts.length > 0 ? (
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
                  {!item.isVideo ? (
                    <img
                      src={
                        item.image
                          ? `https://cdnflux.dypius.com/${item.image}`
                          : require(`./assets/nftPlaceholder1.png`)
                      }
                      className="card-img"
                      alt=""
                    />
                  ) : (
                    <video
                      preload="auto"
                      className="card-img"
                      src={`https://cdnflux.dypius.com/${item.image}`}
                      autoPlay={true}
                      loop={true}
                      muted="muted"
                      playsInline={true}
                      // onClick={player}
                      controlsList="nodownload"
                    ></video>
                  )}

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
                    {coinbase &&
                    coinbase.toLowerCase() === item.seller?.toLowerCase() ? (
                      <NavLink
                        className="buy-btn w-100 d-flex justify-content-center "
                        to={`/nft/${item.tokenId}/${item.nftAddress}`}
                        style={{ textDecoration: "none" }}
                      >
                        View Details
                      </NavLink>
                    ) : (
                      <button
                        className="buy-btn w-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleBuyNft(item);
                        }}
                      >
                        {coinbase
                          ? coinbase.toLowerCase() ===
                            item.seller?.toLowerCase()
                            ? "View Details"
                            : coinbase.toLowerCase() !==
                                item.seller?.toLowerCase() &&
                              item.isApproved === false
                            ? "Approve Buy"
                            : "Buy"
                          : "Buy"}
                        {buyloading && selectedNftId === item.tokenId && (
                          <div
                            className="spinner-border spinner-border-sm text-light ms-1"
                            role="status"
                          ></div>
                        )}
                      </button>
                    )}
                  </div>
                </NavLink>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div></div>
            <div
              className="d-flex w-100 align-items-center justify-content-center"
              style={{ minHeight: "450px" }}
            >
              <h6 className="text-white">There are no recent listings</h6>
            </div>
            <div></div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecentlyListed;
