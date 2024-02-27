import React, { useEffect, useState } from "react";
import "./_trendingcollections.scss";
import Slider from "react-slick";
import checkIcon from "../TopCollections/assets/checkIcon.svg";
import useWindowSize from "../../../hooks/useWindowSize";
import topSalesIcon from "../../Home/TrendingSales/assets/topSalesIcon.svg";
import topSalesIconActive from "../../Home/TrendingSales/assets/topSalesIconActive.svg";
import recentSalesIconInactive from "../../Home/TrendingSales/assets/recentSalesIconInactive.svg";
import recentSalesIconActive from "../../Home/TrendingSales/assets/recentSalesIconActive.svg";
import newIcon from "../../Home/TrendingSales/assets/newIcon.svg";
import newIconActive from "../../Home/TrendingSales/assets/newIconActive.svg";
import trendingIcon from "../../Home/TrendingSales/assets/trendingIcon.svg";
import trendingIconActive from "../../Home/TrendingSales/assets/trendingIconActive.svg";
import cawsPlaceholder from "./assets/cawsPlaceholder.png";
import wodPlaceholder from "./assets/wodPlaceholder.png";
import timepiecePlaceholder from "./assets/timepiecePlaceholder.png";
import { NavLink } from "react-router-dom";
import getFormattedNumber from "../../../hooks/get-formatted-number";
import { Skeleton } from "@mui/material";
import collectionCardPlaceholder1 from "../CollectionCategories/assets/collectionCardPlaceholder1.png";
import moment from "moment";

import axios from "axios";

const TrendingCollections = ({
  allCollections,
  cfxPrice,
  recentlySoldNfts,
}) => {
  const windowSize = useWindowSize();
  const [option, setOption] = useState("trending");
  const [time, setTime] = useState("30d");
  const [recents, setRecents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topCollections, setTopCollections] = useState([]);
  const [newestCollections, setNewestCollections] = useState([]);
  const [trendingCollections, setTrendingCollections] = useState([]);

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

  const fetchNewestCollections = async () => {
    setLoading(true);

    let initialArr;
    const response = await axios.get(
      "https://confluxapi.worldofdypians.com/api/newest-collections"
    );

    if (time === "24h") {
      initialArr = response.data.sort((a, b) => {
        return b.volume24h > a.volume24h;
      });
      setNewestCollections(initialArr);
    } else if (time === "7d") {
      initialArr = response.data.sort((a, b) => {
        return b.volume7d > a.volume7d;
      });
      setNewestCollections(initialArr);
    } else if (time === "30d") {
      initialArr = response.data.sort((a, b) => {
        return b.volume30d > a.volume30d;
      });
      setNewestCollections(initialArr);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  const fetchTrendingCollections = async () => {
    setLoading(true);

    let initialArr;
    const response = await axios.get(
      "https://confluxapi.worldofdypians.com/api/top-collections/lifetime-volume"
    );

    if (time === "24h") {
      initialArr = response.data.sort((a, b) => {
        return b.volume24h > a.volume24h;
      });
      setTrendingCollections(initialArr);
    } else if (time === "7d") {
      initialArr = response.data.sort((a, b) => {
        return b.volume7d > a.volume7d;
      });
      setTrendingCollections(initialArr);
    } else if (time === "30d") {
      initialArr = response.data.sort((a, b) => {
        return b.volume30d > a.volume30d;
      });
      setTrendingCollections(initialArr);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const fetchTop24h = async () => {
    setLoading(true);
    const response = await axios.get(
      "https://confluxapi.worldofdypians.com/api/top-collections/24h-volume"
    );
    setTopCollections(response.data);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  const fetchTop7d = async () => {
    setLoading(true);
    const response = await axios.get(
      "https://confluxapi.worldofdypians.com/api/top-collections/7d-volume"
    );
    setTopCollections(response.data);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  const fetchTop30d = async () => {
    setLoading(true);
    const response = await axios.get(
      "https://confluxapi.worldofdypians.com/api/top-collections/30d-volume"
    );
    setTopCollections(response.data);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const handleTopCollections = () => {
    if (option == "topSales") {
      if (time === "30d") {
        fetchTop30d();
      } else if (time === "7d") {
        fetchTop7d();
      } else if (time === "24h") {
        fetchTop24h();
      }
    }
  };

  const categorizeItems = (val) => {
    setLoading(true);
    setTime(val);
    const currentTime = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
    const oneDayInSeconds = 24 * 60 * 60;
    const sevenDaysInSeconds = 7 * oneDayInSeconds;
    const thirtyDaysInSeconds = 30 * oneDayInSeconds;

    if (option === "recentSales") {
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
    } else if (option === "trending") {
      if (trendingCollections.length > 0) {
        if (val === "24h") {
          const newestCollections = trendingCollections.sort((a, b) => {
            const volA = a.volume24h;
            const volB = b.volume24h;
            return volB - volA;
          });

          setTrendingCollections(newestCollections);
        } else if (val === "7d") {
          const newestCollections = trendingCollections.sort((a, b) => {
            const volA = a.volume7d;
            const volB = b.volume7d;
            return volB - volA;
          });

          setTrendingCollections(newestCollections);
        } else {
          const newestCollections = trendingCollections.sort((a, b) => {
            const volA = a.volume30d;
            const volB = b.volume30d;
            return volB - volA;
          });

          setTrendingCollections(newestCollections);
        }
      }
    } else if (option === "new") {
      if (newestCollections.length > 0) {
        if (val === "24h") {
          const finalCollections = newestCollections.sort((a, b) => {
            const volA = a.volume24h;
            const volB = b.volume24h;
            return volB - volA;
          });

          setNewestCollections(finalCollections);
        } else if (val === "7d") {
          const finalCollections = newestCollections.sort((a, b) => {
            const volA = a.volume7d;
            const volB = b.volume7d;
            return volB - volA;
          });

          setNewestCollections(finalCollections);
        } else {
          const finalCollections = newestCollections.sort((a, b) => {
            const volA = a.volume30d;
            const volB = b.volume30d;
            return volB - volA;
          });

          setNewestCollections(finalCollections);
        }
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    categorizeItems("30d");
    setLoading(false);
  }, [recentlySoldNfts, option]);

  useEffect(() => {
    if (window.location.hash === `#recent-sales`) {
      setOption("recentSales");
    }
  }, []);

  useEffect(() => {
    handleTopCollections();
    fetchNewestCollections();
    fetchTrendingCollections();
  }, [time, option]);

  return (
    <div
      className="container-fluid trending-sales-wrapper pt-4 pb-5 px-0"
      id="recentSales"
    >
      <div className="container-lg">
        <div className="row">
          <div className="d-flex flex-column flex-lg-row gap-4 gap-lg-0 align-items-center justify-content-between">
            <div className="d-flex align-items center gap-0 gap-lg-3">
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
              <div
                className={`trending-tab ${
                  option === "new" && "trending-tab-active"
                } p-2 d-flex align-items-center gap-2`}
                onClick={() => setOption("new")}
              >
                <img src={option === "new" ? newIconActive : newIcon} alt="" />
                <h6 className="mb-0">New</h6>
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
                <h6 className="mb-0">Recent sales</h6>
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
          <div className="trending-collections-grid">
            {loading === false &&
            option === "recentSales" &&
            recentlySoldNfts &&
            recentlySoldNfts.length > 0 ? (
              recents.slice(0, 10).map((item, index) => {
                return (
                  <div className="d-flex align-items-center gap-3" key={index}>
                    <div className="trending-tag d-none d-lg-flex position-relative">
                      <span className="mb-0">{index + 1}</span>
                    </div>
                    <NavLink
                      to={`/nft/${item.tokenId}/${item.nftAddress}`}
                      className={"w-100"}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="trending-collection-card d-flex align-items-center gap-2">
                        {!item.isVideo ? (
                          <img
                            src={
                              item.image
                                ? `https://cdnflux.dypius.com/${item.image170}`
                                : require(`./assets/cawsPlaceholder.png`)
                            }
                            className="trending-collections-nft-img"
                            width={120}
                            height={120}
                            alt=""
                          />
                        ) : (
                          <video
                            preload="auto"
                            className="trending-collections-nft-img"
                            width={120}
                            height={120}
                            src={`https://cdnflux.dypius.com/${item.image170}`}
                            autoPlay={true}
                            loop={true}
                            muted="muted"
                            playsInline={true}
                            // onClick={player}
                            controlsList="nodownload"
                          ></video>
                        )}
                        <div className="d-flex flex-column gap-2 p-3">
                          <div className="d-flex align-items-center gap-2">
                            <h6 className="trending-collection-title mb-0">
                              {item.tokenName} {item.name}
                            </h6>
                            {item.verified === "yes" && (
                              <img src={checkIcon} alt="" />
                            )}
                          </div>
                          <div className="d-flex align-items-center gap-3">
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
                        </div>
                      </div>
                    </NavLink>
                  </div>
                );
              })
            ) : loading === false &&
              option === "topSales" &&
              topCollections.length > 0 ? (
              topCollections.map((item, index) => (
                <div className="d-flex align-items-center gap-3" key={index}>
                  <div className="trending-tag d-none d-lg-flex position-relative">
                    <span className="mb-0">{index + 1}</span>
                  </div>
                  <NavLink
                    to={`/collection/${item.contractAddress}/${item.symbol}`}
                    className={"w-100"}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="trending-collection-card d-flex align-items-center gap-2">
                      <img
                        src={
                          item.collectionProfilePic
                            ? `https://confluxapi.worldofdypians.com/${item.collectionProfilePic}`
                            : collectionCardPlaceholder1
                        }
                        style={{
                          height: "120px",
                          width: "120px",
                          borderRadius: "12px",
                        }}
                        alt=""
                      />
                      <div className="d-flex flex-column gap-2 p-3">
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="trending-collection-title mb-0">
                            {item.collectionName}
                          </h6>
                          {item.verified === "yes" && (
                            <img src={checkIcon} alt="" />
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <div className="d-flex flex-column">
                            <span className="trending-price-holder mb-1">
                              Floor
                            </span>
                            <div className="trending-price-wrapper d-flex align-items-center justify-content-center p-2">
                              <h6 className="trending-price mb-0">
                                {allCollections.find((obj) => {
                                  return (
                                    obj.contractAddress.toLowerCase() ===
                                    item.contractAddress.toLowerCase()
                                  );
                                })
                                  ? getFormattedNumber(
                                      allCollections.find((obj) => {
                                        return (
                                          obj.contractAddress.toLowerCase() ===
                                          item.contractAddress.toLowerCase()
                                        );
                                      }).floorPrice
                                    )
                                  : 0}{" "}
                                WCFX
                              </h6>
                            </div>
                          </div>
                          <div className="d-flex flex-column">
                            <span className="trending-price-holder mb-1">
                              Total Volume
                            </span>
                            <div className="trending-price-wrapper d-flex align-items-center justify-content-center p-2">
                              <h6 className="trending-price mb-0">
                                {item.lifetimeVolume
                                  ? getFormattedNumber(
                                      item.lifetimeVolume / 1e18,
                                      0
                                    )
                                  : "0"}{" "}
                                WCFX
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                </div>
              ))
            ) : loading === false &&
              option === "new" &&
              newestCollections.length > 0 ? (
              newestCollections.map((item, index) => (
                <div className="d-flex align-items-center gap-3" key={index}>
                  <div className="trending-tag d-none d-lg-flex position-relative">
                    <span className="mb-0">{index + 1}</span>
                  </div>
                  <NavLink
                    to={`/collection/${item.contractAddress}/${item.symbol}`}
                    className={"w-100"}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="trending-collection-card d-flex align-items-center gap-2">
                      <img
                        src={
                          item.collectionProfilePic
                            ? `https://confluxapi.worldofdypians.com/${item.collectionProfilePic}`
                            : collectionCardPlaceholder1
                        }
                        style={{
                          height: "120px",
                          width: "120px",
                          borderRadius: "12px",
                        }}
                        alt=""
                      />
                      <div className="d-flex flex-column gap-2 p-3">
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="trending-collection-title mb-0">
                            {item.collectionName}
                          </h6>
                          {item.verified === "yes" && (
                            <img src={checkIcon} alt="" />
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <div className="d-flex flex-column">
                            <span className="trending-price-holder mb-1">
                              Floor
                            </span>
                            <div className="trending-price-wrapper d-flex align-items-center justify-content-center p-2">
                              <h6 className="trending-price mb-0">
                                {allCollections.find((obj) => {
                                  return (
                                    obj.contractAddress.toLowerCase() ===
                                    item.contractAddress.toLowerCase()
                                  );
                                })
                                  ? getFormattedNumber(
                                      allCollections.find((obj) => {
                                        return (
                                          obj.contractAddress.toLowerCase() ===
                                          item.contractAddress.toLowerCase()
                                        );
                                      }).floorPrice
                                    )
                                  : 0}{" "}
                                WCFX
                              </h6>
                            </div>
                          </div>
                          <div className="d-flex flex-column">
                            <span className="trending-price-holder mb-1">
                              Total Volume
                            </span>
                            <div className="trending-price-wrapper d-flex align-items-center justify-content-center p-2">
                              <h6 className="trending-price mb-0">
                                {item.lifetimeVolume
                                  ? getFormattedNumber(
                                      item.lifetimeVolume / 1e18,
                                      0
                                    )
                                  : "0"}{" "}
                                WCFX
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                </div>
              ))
            ) : loading === false &&
              option === "trending" &&
              trendingCollections.length > 0 ? (
              trendingCollections.map((item, index) => (
                <div className="d-flex align-items-center gap-3" key={index}>
                  <div className="trending-tag d-none d-lg-flex position-relative">
                    <span className="mb-0">{index + 1}</span>
                  </div>
                  <NavLink
                    to={`/collection/${item.contractAddress}/${item.symbol}`}
                    className={"w-100"}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="trending-collection-card d-flex align-items-center gap-2">
                      <img
                        src={
                          item.collectionProfilePic
                            ? `https://confluxapi.worldofdypians.com/${item.collectionProfilePic}`
                            : collectionCardPlaceholder1
                        }
                        style={{
                          height: "120px",
                          width: "120px",
                          borderRadius: "12px",
                        }}
                        alt=""
                      />
                      <div className="d-flex flex-column gap-2 p-3">
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="trending-collection-title mb-0">
                            {item.collectionName}
                          </h6>
                          {item.verified === "yes" && (
                            <img src={checkIcon} alt="" />
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <div className="d-flex flex-column">
                            <span className="trending-price-holder mb-1">
                              Floor
                            </span>
                            <div className="trending-price-wrapper d-flex align-items-center justify-content-center p-2">
                              <h6 className="trending-price mb-0">
                                {allCollections.find((obj) => {
                                  return (
                                    obj.contractAddress.toLowerCase() ===
                                    item.contractAddress.toLowerCase()
                                  );
                                })
                                  ? getFormattedNumber(
                                      allCollections.find((obj) => {
                                        return (
                                          obj.contractAddress.toLowerCase() ===
                                          item.contractAddress.toLowerCase()
                                        );
                                      }).floorPrice
                                    )
                                  : 0}{" "}
                                WCFX
                              </h6>
                            </div>
                          </div>
                          <div className="d-flex flex-column">
                            <span className="trending-price-holder mb-1">
                              Total Volume
                            </span>
                            <div className="trending-price-wrapper d-flex align-items-center justify-content-center p-2">
                              <h6 className="trending-price mb-0">
                                {getFormattedNumber(
                                  item.lifetimeVolume / 1e18
                                ) ?? "0.00"}{" "}
                                WCFX
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                </div>
              ))
            ) : loading === true ? (
              <>
                <Skeleton variant="rounded" width={"100%"} height={122} />
                <Skeleton variant="rounded" width={"100%"} height={122} />
                <Skeleton variant="rounded" width={"100%"} height={122} />
                <Skeleton variant="rounded" width={"100%"} height={122} />
                <Skeleton variant="rounded" width={"100%"} height={122} />
                <Skeleton variant="rounded" width={"100%"} height={122} />
                <Skeleton variant="rounded" width={"100%"} height={122} />
                <Skeleton variant="rounded" width={"100%"} height={122} />
                <Skeleton variant="rounded" width={"100%"} height={122} />
                <Skeleton variant="rounded" width={"100%"} height={122} />
              </>
            ) : (
              <></>
            )}
          </div>
          {option === "topSales" && topCollections.length === 0 ? (
            <>
              <div></div>
              <div
                className="d-flex w-100 align-items-center justify-content-center"
                style={{ minHeight: "450px" }}
              >
                <h6 className="text-white">
                  There are no top sold collections
                </h6>
              </div>
              <div></div>
            </>
          ) : option === "new" && newestCollections.length === 0 ? (
            <>
              <div></div>
              <div
                className="d-flex w-100 align-items-center justify-content-center"
                style={{ minHeight: "450px" }}
              >
                <h6 className="text-white">There are no new collecitons</h6>
              </div>
              <div></div>
            </>
          ) : option === "trending" && trendingCollections.length === 0 ? (
            <>
              <div></div>
              <div
                className="d-flex w-100 align-items-center justify-content-center"
                style={{ minHeight: "450px" }}
              >
                <h6 className="text-white">
                  There are no trending collecitons.
                </h6>
              </div>
              <div></div>
            </>
          ) : option === "recentSales" && recentlySoldNfts.length === 0 ? (
            <>
              <div></div>
              <div
                className="d-flex w-100 align-items-center justify-content-center"
                style={{ minHeight: "450px" }}
              >
                <h6 className="text-white">There are no recent sales.</h6>
              </div>
              <div></div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingCollections;
