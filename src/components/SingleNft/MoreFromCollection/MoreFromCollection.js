import React, { useState, useEffect } from "react";
import "./_morefromcollection.scss";
import Slider from "react-slick";
import checkIcon from "../../Collections/TopCollections/assets/checkIcon.svg";
import { NavLink } from "react-router-dom";
import { Skeleton } from "@mui/material";
import getFormattedNumber from "../../../hooks/get-formatted-number";
import axios from "axios";
import emptyFavorite from "../../Home/RecentlyListed/assets/emptyFavorite.svg";
import redFavorite from "../../Home/RecentlyListed/assets/redFavorite.svg";

const MoreFromCollection = ({
  loading,
  allNftArray,
  cfxPrice,
  onNftClick,
  coinbase,
  onRefreshListings,
  handleRemoveFavoriteNft,
  handleAddFavoriteNft,
  userNftFavs,
  nftAddress,allCollections
}) => {
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

  const [buyStatus, setbuyStatus] = useState("buy"); //buy
  const [buyloading, setbuyLoading] = useState(false); //buy
  const [selectedNftId, setSelectedNftId] = useState(""); //buy
  const [nftFinalArray, setnftFinalArray] = useState([]);
  const baseURL = "https://confluxapi.worldofdypians.com";

  const fetchFavoriteCounts = async () => {
    if (allNftArray && allNftArray.length > 0) {
      let favoriteCount = 0;
      let nftArray = [];
      await Promise.all(
        window.range(0, allNftArray.length - 1).map(async (i) => {
          const fav_count_listed = await axios
            .get(
              `${baseURL}/api/nftFavoritesCount/${nftAddress}/${allNftArray[i].tokenId}`,
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
            // console.log(favoriteCount);
            nftArray.push({
              ...favoriteCount,
            });
          }
        })
      );
      setnftFinalArray(nftArray);
    }
  };

  const handleLikeStates = (tokenid) => {
    const stringTokenid = tokenid.toString();
    if (
      userNftFavs &&
      userNftFavs.length > 0 &&
      userNftFavs.find((favitem) => {
        return (
          favitem.contractAddress === nftAddress &&
          favitem.tokenIds.find(
            (itemTokenIds) => itemTokenIds === stringTokenid
          )
        );
      })
    ) {
      handleRemoveFavoriteNft(stringTokenid, nftAddress).then(() => {
        fetchFavoriteCounts();
      });
    } else {
      handleAddFavoriteNft(stringTokenid, nftAddress).then(() => {
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

  const refreshUserHistory = async (wallet) => {
    const result = await axios
      .get(
        `${baseURL}/api/refresh-user-history/${wallet.toLowerCase()}`,
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

    if (result && result.status === 200) {
      console.log(result.data);
    }
  };

  const handleGetRecentlySoldNftsCache = async () => {
    await axios
      .get(`${baseURL}/api/refresh-recent-sales`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });
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

  const buyFunc = async(nft)=>{
    await window
    .buyNFT(nft.nftAddress, nft.listingIndex, nft.price)
    .then(() => {
      setbuyLoading(false);
      refreshUserHistory(coinbase);
      refreshUserHistory(nft.owner)
      handleGetRecentlySoldNftsCache()
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
  }



  const handleBuyNft = async (nft) => {
    setSelectedNftId(nft.tokenId);

    if (coinbase) {
      const isApproved = await checkNftApprovalForBuying(nft.price).then(
        (data) => {
          return data;
        }
      );

      if (isApproved) {
        setbuyLoading(true);
        setbuyStatus("buy");
        buyFunc(nft)
     
      } else {
        setbuyStatus("approve");
        setbuyLoading(true);

        await window
          .approveBuy(nft.price)
          .then(() => {
            setTimeout(() => {
              setbuyStatus("buy");
              buyFunc(nft)
            }, 1000);
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
  }, [allNftArray]);
  return (
    <div className="container-lg py-3">
      <div className="row mx-0">
        <div className="more-collection-wrapper p-3">
          <h6 className="more-collection-title">More From This Collection</h6>

          <Slider {...settings}>
            {allNftArray && allNftArray.length > 0
              ? allNftArray.map((item, index) => (
                  <div
                    className="recently-listed-card p-3 d-flex flex-column"
                    key={index}
                  >
                    <NavLink
                      to={`/nft/${
                        item.tokenId
                      }/${item.nftAddress?.toLowerCase()}`}
                      style={{ textDecoration: "none" }}
                      onClick={() => {
                        window.scrollTo(0, 0);
                        onNftClick(item.tokenId);
                      }}
                      className={"position-relative"}
                    >
                      {!item.isVideo ? (
                        <img
                          src={`https://cdnflux.dypius.com/${item.image}`}
                          className="card-img"
                          alt=""
                        />
                      ) : (
                        <video
                          src={`https://cdnflux.dypius.com/${item.image}`}
                          alt=""
                          className="card-img"
                          controlsList="nodownload"
                          autoPlay={true}
                          loop={true}
                          muted="muted"
                          playsInline={true}
                        />
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
                              userNftFavs &&
                              userNftFavs.length > 0 &&
                              userNftFavs.find((favitem) => {
                                return (
                                  favitem.contractAddress === item.nftAddress &&
                                  favitem.tokenIds.find(
                                    (itemTokenIds) =>
                                      Number(itemTokenIds) ===
                                      Number(item.tokenId)
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
                              userNftFavs &&
                              userNftFavs.length > 0 &&
                              userNftFavs.find((favitem) => {
                                return (
                                  favitem.contractAddress === item.nftAddress &&
                                  favitem.tokenIds.find(
                                    (itemTokenIds) =>
                                      Number(itemTokenIds) ===
                                      Number(item.tokenId)
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
                                  Number(object.tokenId) ===
                                    Number(item.tokenId)
                                );
                              })?.count
                            }
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <h6
                          className="recently-listed-title mb-0"
                          style={{ fontSize: "12px" }}
                        >
                          {item.nftSymbol} {item.name}
                        </h6>
                        {allCollections &&
                      allCollections.length > 0 &&
                      allCollections.find((obj) => {
                        return (
                          obj.contractAddress.toLowerCase() ===
                          item.nftAddress.toLowerCase()
                        );
                      }) ? (
                        allCollections.find((obj) => {
                          return (
                            obj.contractAddress.toLowerCase() ===
                            item.nftAddress.toLowerCase()
                          );
                        }).verified === "yes" ? (
                          <img src={checkIcon} alt="" />
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )}
                      </div>
                      {item?.price ? (
                        <div className="d-flex align-items-center mt-2 gap-3">
                          <h6
                            className="cfx-price mb-0"
                            style={{ fontSize: "10px" }}
                          >
                            {getFormattedNumber(item?.price / 10 ** 18)} WCFX
                          </h6>
                          <span
                            className="usd-price"
                            style={{ fontSize: "9px" }}
                          >
                            (${" "}
                            {getFormattedNumber(
                              (item?.price / 10 ** 18) * cfxPrice
                            )}
                            )
                          </span>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center mt-2 gap-3">
                          <h6
                            className="cfx-price mb-0"
                            style={{ fontSize: "10px" }}
                          >
                            --- WCFX
                          </h6>
                          <span
                            className="usd-price"
                            style={{ fontSize: "9px" }}
                          >
                            ($ ---)
                          </span>
                        </div>
                      )}
                      <div className="mt-3">
                        {item.seller &&
                        item.seller.toLowerCase() !==
                          coinbase?.toLowerCase() ? (
                          <button
                            className="buy-btn w-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleBuyNft(item);
                            }}
                          >
                            {item.isApproved ? "Buy" : "Approve Buy"}
                            {buyloading && selectedNftId === item.tokenId && (
                              <div
                                className="spinner-border spinner-border-sm text-light ms-1"
                                role="status"
                              ></div>
                            )}
                          </button>
                        ) : (
                          <NavLink
                            className="buy-btn w-100 d-flex justify-content-center "
                            to={`/nft/${item.tokenId}/${item.nftAddress}`}
                            style={{ textDecoration: "none" }}
                          >
                            View Details
                          </NavLink>
                        )}
                      </div>
                    </NavLink>
                  </div>
                ))
              : dummyCards.map((item, index) => (
                  <Skeleton
                    variant="rounded"
                    height={240}
                    width={"100%"}
                    key={index}
                  />
                ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default MoreFromCollection;
