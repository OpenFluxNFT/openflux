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
import getFormattedNumber from "../../../hooks/get-formatted-number";
import moment from "moment";
import { Skeleton } from "@mui/material";
import axios from "axios";

const TrendingSales = ({ recentlySoldNfts, cfxPrice }) => {
  const [recents, setRecents] = useState([]);
  const [chunkedArray, setChunkedArray] = useState([]);
  const [option, setOption] = useState("trending");
  const [time, setTime] = useState("30d");
  const windowSize = useWindowSize();
  const [loading, setLoading] = useState(true);
  const [topSales, setTopSales] = useState([])
  const baseURL = "https://confluxapi.worldofdypians.com";


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
  // console.log(recentlySoldNfts)

  const categorizeItems = (val) => {
    setLoading(true);
    setTime(val);
    const currentTime = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
    const oneDayInSeconds = 24 * 60 * 60;
    const sevenDaysInSeconds = 7 * oneDayInSeconds;
    const thirtyDaysInSeconds = 30 * oneDayInSeconds;
    if (recentlySoldNfts && recentlySoldNfts.length > 0) {
      const items24HoursAgo = recentlySoldNfts.filter(
        (item) =>
          currentTime - parseInt(item.blockTimestamp, 10) <= oneDayInSeconds
      );
      const items7DaysAgo = recentlySoldNfts.filter(
        (item) =>
          currentTime - parseInt(item.blockTimestamp, 10) <= sevenDaysInSeconds
      );
      const items30DaysAgo = recentlySoldNfts.filter(
        (item) =>
          currentTime - parseInt(item.blockTimestamp, 10) <= thirtyDaysInSeconds
      );

      if (val === "24h") {
        setRecents(items24HoursAgo);
      } else if (val === "7d") {
        setRecents(items7DaysAgo);
      } else {
        setRecents(items30DaysAgo);
      }

      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };


  const getTopSales = async () => {
    setLoading(true)
    const result = await axios
      .get(`${baseURL}/api/top-purchased-nfts`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });
    const web3 = window.confluxWeb3;
    if (result && result.status === 200) {
      // console.log(result.data);
      const topSold = await Promise.all(
        result.data.map(async (item) => {
          let isApproved = false;
          const abiresult = await axios.get(
            `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${item.nftAddress}`
          );
          if (abiresult && abiresult.status === 200) {
            let lastSale = 0;
            const abi = JSON.parse(abiresult.data.result);
            const collection_contract = new web3.eth.Contract(
              abi,
              item.nftAddress
            );
            const tokenName = await collection_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });

            const seller = await collection_contract.methods
              .ownerOf(item.tokenId)
              .call()
              .catch((e) => {
                console.error(e);
              });

            const collectionName = await collection_contract.methods
              .name()
              .call()
              .catch((e) => {
                console.error(e);
              });

            const isApprovedresult = await window
              .isApprovedBuy(item.price)
              .catch((e) => {
                console.error(e);
              });

            if (isApprovedresult) {
              isApproved = isApprovedresult;
            }

            const lastSaleResult = await axios
              .get(
                `${baseURL}/api/nft-sale-history/${item.nftAddress.toLowerCase()}/${
                  item.tokenId
                }`,
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

            if (lastSaleResult && lastSaleResult.status === 200) {
              const historyArray = lastSaleResult.data;
              if (historyArray && historyArray.length > 0) {
                const finalArray_sorted = historyArray.sort((a, b) => {
                  return b.blockTimestamp - a.blockTimestamp;
                });
                lastSale = finalArray_sorted[0];
              }
            }

            const nft_data = await fetch(
              `https://cdnflux.dypius.com/collectionsmetadatas/${item.nftAddress.toLowerCase()}/${
                item.tokenId
              }/metadata.json`
            )
              .then((res) => res.json())
              .then((data) => {
                return data;
              })
              .catch((err) => {
                console.log(err.message);
              });

            if (
              nft_data &&
              nft_data.code !== 404 &&
              typeof nft_data !== "string"
            ) {
              return {
                ...item,
                image: `${nft_data.image}`,
                tokenName: tokenName,
                isApproved: isApproved,
                seller: seller,
                collectionName: collectionName,
                lastSale: lastSale,
              };
            } else
              return {
                ...item,
                image: undefined,
                tokenName: tokenName,
                seller: seller,
                collectionName: collectionName,
                lastSale: lastSale,
              };
          }
        })
      );

      setTopSales(topSold);
    }
    setTimeout(() => {
      setLoading(false)
    }, 1500);
  };

  useEffect(() => {
    chunkArray(dummyCards, 3);
    getTopSales();
  }, []);

  useEffect(() => {
    categorizeItems("30d");
    setLoading(false);
  }, [recentlySoldNfts]);

  return (
    <>
      <div className="container-lg mt-5">
        <div className="row">
          <h6 className="info-title mb-4">
            Data <span style={{ color: "#2F80ED" }}>Tracking</span>
          </h6>
        </div>
      </div>
      <div className="container-fluid trending-sales-wrapper pt-4 pb-5 px-0">
        <div className="container-lg">
          <div className="row">
            <div className="d-flex flex-column flex-lg-row gap-4 gap-lg-0 align-items-end align-items-lg-center justify-content-between">
              <div className="d-flex  align-items-center gap-1 gap-lg-3">
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
                      option === "recentSales"
                        ? recentSalesIconActive
                        : recentSalesIconInactive
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
                  onClick={() => categorizeItems("24h")}
                >
                  <h6 className="mb-0">24h</h6>
                </div>
                <div
                  className={`trending-tab ${
                    time === "7d" && "trending-tab-active"
                  } p-2`}
                  onClick={() => categorizeItems("7d")}
                >
                  <h6 className="mb-0">7D</h6>
                </div>
                <div
                  className={`trending-tab ${
                    time === "30d" && "trending-tab-active"
                  } p-2`}
                  onClick={() => categorizeItems("30d")}
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
                {loading === false &&
                option === "recentSales" &&
                recentlySoldNfts &&
                recentlySoldNfts.length > 0 ? (
                  recents.slice(0, 9).map((item, index) => {
                    return (
                      <div
                        className="trending-card p-3 d-flex align-items-center position-relative gap-2"
                        key={index}
                      >
                        <NavLink
                          to={`/nft/${item.tokenId}/${item.nftAddress}`}
                          className="w-100 d-flex align-items-center position-relative gap-2"
                          key={index}
                          style={{ textDecoration: "none" }}
                        >
                          <div className="trending-tag">
                            <span className="mb-0">{index + 1}</span>
                          </div>

                          {!item.isVideo ? (
                            <img
                              src={
                                item.image
                                  ? `https://cdnflux.dypius.com/${item.image}`
                                  : require(`../RecentlyListed/assets/nftPlaceholder1.png`)
                              }
                              className="card-img2"
                              width={100}
                              height={100}
                              alt=""
                            />
                          ) : (
                            <video
                              preload="auto"
                              className="card-img2"
                              width={100}
                              height={100}
                              src={`https://cdnflux.dypius.com/${item.image}`}
                              autoPlay={true}
                              loop={true}
                              muted="muted"
                              playsInline={true}
                              // onClick={player}
                              controlsList="nodownload"
                            ></video>
                          )}
                          <div className="d-flex flex-column">
                            <div className="d-flex align-items-center gap-1">
                              <h6 className="trending-card-title mb-0">
                                {item.tokenName} {item.name}
                              </h6>
                              <img src={checkIcon} alt="" />
                            </div>
                            <div className="d-flex flex-column">
                              <h6 className="trending-card-cfx-price mb-0">
                                {getFormattedNumber(item.amount / 1e18)} WCFX
                              </h6>
                              <span className="trending-card-usd-price mb-0">
                                (${" "}
                                {getFormattedNumber(
                                  (item.amount / 1e18) * cfxPrice
                                )}
                                )
                              </span>
                            </div>
                          </div>
                        </NavLink>
                        <span className="list-date">
                          Sold{" "}
                          {moment
                            .duration(item.blockTimestamp * 1000 - Date.now())
                            .humanize(true)}
                        </span>
                      </div>
                    );
                  })
                ) : loading === false && option === "topSales" && topSales && topSales.length > 0 ?
                topSales.slice(0, 9).map((item, index) => {
                  return (
                    <div
                      className="trending-card p-3 d-flex align-items-center position-relative gap-2"
                      key={index}
                    >
                      <NavLink
                        to={`/nft/${item.tokenId}/${item.nftAddress}`}
                        className="w-100 d-flex align-items-center position-relative gap-2"
                        key={index}
                        style={{ textDecoration: "none" }}
                      >
                        <div className="trending-tag">
                          <span className="mb-0">{index + 1}</span>
                        </div>

                        {!item.isVideo ? (
                          <img
                            src={
                              item.image
                                ? `https://cdnflux.dypius.com/${item.image}`
                                : require(`../RecentlyListed/assets/nftPlaceholder1.png`)
                            }
                            className="card-img2"
                            width={100}
                            height={100}
                            alt=""
                          />
                        ) : (
                          <video
                            preload="auto"
                            className="card-img2"
                            width={100}
                            height={100}
                            src={`https://cdnflux.dypius.com/${item.image}`}
                            autoPlay={true}
                            loop={true}
                            muted="muted"
                            playsInline={true}
                            // onClick={player}
                            controlsList="nodownload"
                          ></video>
                        )}
                        <div className="d-flex flex-column">
                          <div className="d-flex align-items-center gap-1">
                            <h6 className="trending-card-title mb-0">
                              {item.tokenName} {item.name}
                            </h6>
                            <img src={checkIcon} alt="" />
                          </div>
                          <div className="d-flex flex-column">
                            <h6 className="trending-card-cfx-price mb-0">
                              {getFormattedNumber(item.amount / 1e18)} WCFX
                            </h6>
                            <span className="trending-card-usd-price mb-0">
                              (${" "}
                              {getFormattedNumber(
                                (item.amount / 1e18) * cfxPrice
                              )}
                              )
                            </span>
                          </div>
                        </div>
                      </NavLink>
                      <span className="list-date">
                        Sold{" "}
                        {moment
                          .duration(item.lastSale.blockTimestamp * 1000 - Date.now())
                          .humanize(true)}
                      </span>
                    </div>
                  );
                }) :
               option === "recentSales" && recents.length === 0 ? (
                  <>
                    <div></div>
                    <div
                      className="d-flex w-100 align-items-center justify-content-center"
                      style={{ minHeight: "450px" }}
                    >
                      <h6 className="text-white">
                        There are no recently listed NFT's
                      </h6>
                    </div>
                    <div></div>
                  </>
                ) :  option === "trending" && recents.length === 0 ? (
                  <>
                    <div></div>
                    <div
                      className="d-flex w-100 align-items-center justify-content-center"
                      style={{ minHeight: "450px" }}
                    >
                      <h6 className="text-white">
                        There are no trending NFT's
                      </h6>
                    </div>
                    <div></div>
                  </>
                ) :  option === "topSales" && topSales.length === 0 ? (
                  <>
                    <div></div>
                    <div
                      className="d-flex w-100 align-items-center justify-content-center"
                      style={{ minHeight: "450px" }}
                    >
                      <h6 className="text-white">
                        There are no top sold NFT's
                      </h6>
                    </div>
                    <div></div>
                  </>
                ) : loading === true ? (
                  <>
                    <Skeleton variant="rounded" width={"100%"} height={135} />
                    <Skeleton variant="rounded" width={"100%"} height={135} />
                    <Skeleton variant="rounded" width={"100%"} height={135} />
                    <Skeleton variant="rounded" width={"100%"} height={135} />
                    <Skeleton variant="rounded" width={"100%"} height={135} />
                    <Skeleton variant="rounded" width={"100%"} height={135} />
                    <Skeleton variant="rounded" width={"100%"} height={135} />
                    <Skeleton variant="rounded" width={"100%"} height={135} />
                    <Skeleton variant="rounded" width={"100%"} height={135} />
                  </>
                ) : (
                  dummyCards.map((item, index) => (
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
                              {item.cfxPrice} WCFX
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
                  ))
                )}
              </div>
            ) : (
              <Slider {...settings}>
                <div className="trending-cards-grid">
                  {option === "recentSales" &&
                  recentlySoldNfts &&
                  recentlySoldNfts.length > 0
                    ? recentlySoldNfts.slice(0, 3).map((item, index) => {
                        return (
                          <div
                            className="trending-card p-3 d-flex align-items-center position-relative gap-2"
                            key={index}
                          >
                            <NavLink
                              to={`/nft/${item.tokenId}/${item.nftAddress}`}
                              className="w-100 d-flex align-items-center position-relative gap-2"
                              key={index}
                              style={{ textDecoration: "none" }}
                            >
                              <div className="trending-tag">
                                <span className="mb-0">{index + 1}</span>
                              </div>

                              {!item.isVideo ? (
                                <img
                                  src={
                                    item.image
                                      ? `https://cdnflux.dypius.com/${item.image}`
                                      : require(`../RecentlyListed/assets/nftPlaceholder1.png`)
                                  }
                                  className="card-img2"
                                  width={100}
                                  height={100}
                                  alt=""
                                />
                              ) : (
                                <video
                                  preload="auto"
                                  className="card-img2"
                                  width={100}
                                  height={100}
                                  src={`https://cdnflux.dypius.com/${item.image}`}
                                  autoPlay={true}
                                  loop={true}
                                  muted="muted"
                                  playsInline={true}
                                  // onClick={player}
                                  controlsList="nodownload"
                                ></video>
                              )}
                              <div className="d-flex flex-column">
                                <div className="d-flex align-items-center gap-1">
                                  <h6 className="trending-card-title mb-0">
                                    {item.tokenName} {item.name}
                                  </h6>
                                  <img src={checkIcon} alt="" />
                                </div>
                                <div className="d-flex flex-column">
                                  <h6 className="trending-card-cfx-price mb-0">
                                    {getFormattedNumber(item.amount / 1e18)}{" "}
                                    WCFX
                                  </h6>
                                  <span className="trending-card-usd-price mb-0">
                                    (${" "}
                                    {getFormattedNumber(
                                      (item.amount / 1e18) * cfxPrice
                                    )}
                                    )
                                  </span>
                                </div>
                              </div>
                            </NavLink>
                            <span className="list-date">
                              Sold{" "}
                              {moment
                                .duration(
                                  item.blockTimestamp * 1000 - Date.now()
                                )
                                .humanize(true)}
                            </span>
                          </div>
                        );
                      })
                    : dummyCards.slice(0, 3).map((item, index) => (
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
                            <img
                              src={item.image}
                              width={100}
                              height={100}
                              alt=""
                            />
                            <div className="d-flex flex-column">
                              <div className="d-flex align-items-center gap-1">
                                <h6 className="trending-card-title mb-0">
                                  {item.title}
                                </h6>
                                <img src={checkIcon} alt="" />
                              </div>
                              <div className="d-flex flex-column">
                                <h6 className="trending-card-cfx-price mb-0">
                                  {item.cfxPrice} WCFX
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
                  {option === "recentSales" &&
                  recentlySoldNfts &&
                  recentlySoldNfts.length > 0
                    ? recentlySoldNfts.slice(3, 6).map((item, index) => {
                        return (
                          <div
                            className="trending-card p-3 d-flex align-items-center position-relative gap-2"
                            key={index}
                          >
                            <NavLink
                              to={`/nft/${item.tokenId}/${item.nftAddress}`}
                              className="w-100 d-flex align-items-center position-relative gap-2"
                              key={index}
                              style={{ textDecoration: "none" }}
                            >
                              <div className="trending-tag">
                                <span className="mb-0">{index + 4}</span>
                              </div>

                              {!item.isVideo ? (
                                <img
                                  src={
                                    item.image
                                      ? `https://cdnflux.dypius.com/${item.image}`
                                      : require(`../RecentlyListed/assets/nftPlaceholder1.png`)
                                  }
                                  className="card-img2"
                                  width={100}
                                  height={100}
                                  alt=""
                                />
                              ) : (
                                <video
                                  preload="auto"
                                  className="card-img2"
                                  width={100}
                                  height={100}
                                  src={`https://cdnflux.dypius.com/${item.image}`}
                                  autoPlay={true}
                                  loop={true}
                                  muted="muted"
                                  playsInline={true}
                                  // onClick={player}
                                  controlsList="nodownload"
                                ></video>
                              )}
                              <div className="d-flex flex-column">
                                <div className="d-flex align-items-center gap-1">
                                  <h6 className="trending-card-title mb-0">
                                    {item.tokenName} {item.name}
                                  </h6>
                                  <img src={checkIcon} alt="" />
                                </div>
                                <div className="d-flex flex-column">
                                  <h6 className="trending-card-cfx-price mb-0">
                                    {getFormattedNumber(item.amount / 1e18)}{" "}
                                    WCFX
                                  </h6>
                                  <span className="trending-card-usd-price mb-0">
                                    (${" "}
                                    {getFormattedNumber(
                                      (item.amount / 1e18) * cfxPrice
                                    )}
                                    )
                                  </span>
                                </div>
                              </div>
                            </NavLink>
                            <span className="list-date">
                              Sold{" "}
                              {moment
                                .duration(
                                  item.blockTimestamp * 1000 - Date.now()
                                )
                                .humanize(true)}
                            </span>
                          </div>
                        );
                      })
                    : dummyCards.slice(3, 6).map((item, index) => (
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
                              <span className="mb-0">{index + 4}</span>
                            </div>
                            <img
                              src={item.image}
                              width={100}
                              height={100}
                              alt=""
                            />
                            <div className="d-flex flex-column">
                              <div className="d-flex align-items-center gap-1">
                                <h6 className="trending-card-title mb-0">
                                  {item.title}
                                </h6>
                                <img src={checkIcon} alt="" />
                              </div>
                              <div className="d-flex flex-column">
                                <h6 className="trending-card-cfx-price mb-0">
                                  {item.cfxPrice} WCFX
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
                  {option === "recentSales" &&
                  recentlySoldNfts &&
                  recentlySoldNfts.length > 0
                    ? recentlySoldNfts.slice(6, 9).map((item, index) => {
                        return (
                          <div
                            className="trending-card p-3 d-flex align-items-center position-relative gap-2"
                            key={index}
                          >
                            <NavLink
                              to={`/nft/${item.tokenId}/${item.nftAddress}`}
                              className="w-100 d-flex align-items-center position-relative gap-2"
                              key={index}
                              style={{ textDecoration: "none" }}
                            >
                              <div className="trending-tag">
                                <span className="mb-0">{index + 7}</span>
                              </div>

                              {!item.isVideo ? (
                                <img
                                  src={
                                    item.image
                                      ? `https://cdnflux.dypius.com/${item.image}`
                                      : require(`../RecentlyListed/assets/nftPlaceholder1.png`)
                                  }
                                  className="card-img2"
                                  width={100}
                                  height={100}
                                  alt=""
                                />
                              ) : (
                                <video
                                  preload="auto"
                                  className="card-img2"
                                  width={100}
                                  height={100}
                                  src={`https://cdnflux.dypius.com/${item.image}`}
                                  autoPlay={true}
                                  loop={true}
                                  muted="muted"
                                  playsInline={true}
                                  // onClick={player}
                                  controlsList="nodownload"
                                ></video>
                              )}
                              <div className="d-flex flex-column">
                                <div className="d-flex align-items-center gap-1">
                                  <h6 className="trending-card-title mb-0">
                                    {item.tokenName} {item.name}
                                  </h6>
                                  <img src={checkIcon} alt="" />
                                </div>
                                <div className="d-flex flex-column">
                                  <h6 className="trending-card-cfx-price mb-0">
                                    {getFormattedNumber(item.amount / 1e18)}{" "}
                                    WCFX
                                  </h6>
                                  <span className="trending-card-usd-price mb-0">
                                    (${" "}
                                    {getFormattedNumber(
                                      (item.amount / 1e18) * cfxPrice
                                    )}
                                    )
                                  </span>
                                </div>
                              </div>
                            </NavLink>
                            <span className="list-date">
                              Sold{" "}
                              {moment
                                .duration(
                                  item.blockTimestamp * 1000 - Date.now()
                                )
                                .humanize(true)}
                            </span>
                          </div>
                        );
                      })
                    : dummyCards.slice(6, 9).map((item, index) => (
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
                              <span className="mb-0">{index + 7}</span>
                            </div>
                            <img
                              src={item.image}
                              width={100}
                              height={100}
                              alt=""
                            />
                            <div className="d-flex flex-column">
                              <div className="d-flex align-items-center gap-1">
                                <h6 className="trending-card-title mb-0">
                                  {item.title}
                                </h6>
                                <img src={checkIcon} alt="" />
                              </div>
                              <div className="d-flex flex-column">
                                <h6 className="trending-card-cfx-price mb-0">
                                  {item.cfxPrice} WCFX
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
