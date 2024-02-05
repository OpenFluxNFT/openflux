import React, { useState, useEffect } from "react";
import "./_collectionlist.scss";
import bigGrid from "./assets/bigGrid.svg";
import bigGridActive from "./assets/bigGridActive.svg";
import listView from "./assets/listView.svg";
import listViewActive from "./assets/listViewActive.svg";
import smallGrid from "./assets/smallGrid.svg";
import smallGridActive from "./assets/smallGridActive.svg";
import liveIcon from "./assets/liveIcon.svg";
import priceIcon from "./assets/priceIcon.svg";
import statusIcon from "./assets/statusIcon.svg";
import traitsIcon from "./assets/traitsIcon.svg";
import searchIcon from "../../Header/assets/searchIcon.svg";
import checkIcon from "../../Home/RecentlyListed/assets/checkIcon.svg";
import useWindowSize from "../../../hooks/useWindowSize";
import filterIcon from "./assets/filterIcon.svg";
import xMark from "./assets/xMark.svg";
import { Checkbox, FormControlLabel, FormGroup, Skeleton } from "@mui/material";
import { NavLink } from "react-router-dom";
import emptyFavorite from "../../Home/RecentlyListed/assets/emptyFavorite.svg";
import redFavorite from "../../Home/RecentlyListed/assets/redFavorite.svg";
import { shortAddress } from "../../../hooks/shortAddress";
import getFormattedNumber from "../../../hooks/get-formatted-number";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CollectionList = ({
  currentCollection,
  allNftArray,
  collectionAddress,
  loading,
  handleAddFavoriteNft,
  userNftFavs,
  handleRemoveFavoriteNft,
  cfxPrice,
  coinbase,
  onRefreshListings,
  totalSupplyPerCollection,
}) => {
  const windowSize = useWindowSize();
  const [openFilters, setOpenFilters] = useState(false);
  const [buyStatus, setbuyStatus] = useState("buy"); //buy
  const [buyloading, setbuyLoading] = useState(false); //buy
  const [selectedNftId, setSelectedNftId] = useState(""); //buy

  const dummyTraits = [
    {
      title: "Background",
      traits: ["Peach", "Gray", "Blue", "Purple", "White", "Brown"],
    },
    {
      title: "Body",
      traits: ["Fat", "Skinny", "Short", "Tall"],
    },
    {
      title: "Ears",
      traits: ["Pointy", "Straight", "Crooked", "Dark", "Light", "Brown"],
    },
  ];

  const navigate = useNavigate();

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

  const [gridView, setGridView] = useState("small-grid");
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
              `${baseURL}/api/nftFavoritesCount/${collectionAddress}/${allNftArray[i].tokenId}`,
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
          favitem.contractAddress === collectionAddress &&
          favitem.tokenIds.find(
            (itemTokenIds) => itemTokenIds === stringTokenid
          )
        );
      })
    ) {
      handleRemoveFavoriteNft(stringTokenid, collectionAddress).then(() => {
        fetchFavoriteCounts();
      });
    } else {
      handleAddFavoriteNft(stringTokenid, collectionAddress).then(() => {
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

    if (coinbase) {
      const isApproved = await checkNftApprovalForBuying(nft.price).then(
        (data) => {
          return data;
        }
      );

      if (isApproved) {
        setbuyLoading(true);
        setbuyStatus("buy");

        await window
          .buyNFT(nft.nftAddress, nft.listingIndex, nft.price)
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
  }, [allNftArray]);

  return (
    <>
      <div className="container-lg">
        <div className="row collection-list-wrapper py-4 px-2">
          <div
            className="col-2 mt-2 d-none d-lg-block"
            style={{ overflow: "hidden" }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-1">
                <img src={liveIcon} alt="" />
                <span className="collection-info mb-0">Live</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <span className="collection-info mb-0">
                  {getFormattedNumber(totalSupplyPerCollection, 0)}
                </span>
                <span className="collection-info-span mb-0">Results</span>
              </div>
            </div>
            <div className="filters-wrapper mt-4 p-3 h-100 d-flex flex-column gap-3">
              <div className="" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button collection-filter py-3 d-flex align-items-center gap-2 collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="false"
                      aria-controls="collapseOne"
                    >
                      <img src={statusIcon} alt="" />
                      Status
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              sx={{
                                color: "white",
                                "&.Mui-checked": {
                                  color: "#3DBDA7",
                                },
                              }}
                            />
                          }
                          label="Recently Listed"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              sx={{
                                color: "white",
                                "&.Mui-checked": {
                                  color: "#3DBDA7",
                                },
                              }}
                            />
                          }
                          label="Recently Sold"
                          sx={{
                            color: "#FFF",
                            fontSize: "10px",
                            fontStyle: "normal",
                            fontWeight: "500",
                            lineHeight: "normal",
                          }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              sx={{
                                color: "white",
                                "&.Mui-checked": {
                                  color: "#3DBDA7",
                                },
                              }}
                            />
                          }
                          label="Has Offers"
                        />
                      </FormGroup>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button collection-filter py-3  d-flex align-items-center gap-2 collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      <img src={priceIcon} alt="" />
                      Price
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="text"
                            placeholder="$ Min"
                            className="price-input"
                          />
                          <span className="MuiTypography-root mb-0">to</span>
                          <input
                            type="text"
                            placeholder="$ Max"
                            className="price-input"
                          />
                        </div>
                        <button className="buy-btn">Apply</button>
                      </div>
                    </div>
                  </div>
                </div>
                {allNftArray.length > 0 &&
                  allNftArray[0]?.metadatas !== false &&
                  allNftArray[0]?.attributes !== "false" && (
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingThree">
                        <button
                          className="accordion-button collection-filter py-3 d-flex align-items-center gap-2 collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseThree"
                          aria-expanded="false"
                          aria-controls="collapseThree"
                        >
                          <img src={traitsIcon} alt="" />
                          Traits
                        </button>
                      </h2>
                      <div
                        id="collapseThree"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingThree"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div className="" id="accordionExample2">
                            {allNftArray.length > 0 &&
                              allNftArray[0]?.attributes &&
                              allNftArray[0]?.metadatas !== false &&
                              allNftArray[0]?.attributes !== "false" &&
                              allNftArray[0]?.attributes.map((item, index) => (
                                <div className="accordion-item" key={index}>
                                  <h2
                                    className="accordion-header"
                                    id={`headingOne${item.trait_type}`}
                                  >
                                    <button
                                      className="accordion-button collection-filter px-2 py-2 d-flex align-items-center gap-2 collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target={`#collapseOne${item.trait_type}`}
                                      aria-expanded="false"
                                      aria-controls={`collapseOne${item.trait_type}`}
                                      style={{ fontSize: "10px" }}
                                    >
                                      {item.trait_type}
                                    </button>
                                  </h2>
                                  <div
                                    id={`collapseOne${item.trait_type}`}
                                    className="accordion-collapse collapse"
                                    aria-labelledby={`headingOne${item.trait_type}`}
                                    data-bs-parent="#accordionExample2"
                                  >
                                    <div className="accordion-body px-2">
                                      <FormGroup>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              size="small"
                                              sx={{
                                                color: "white",
                                                "&.Mui-checked": {
                                                  color: "#3DBDA7",
                                                },
                                              }}
                                            />
                                          }
                                          key={index}
                                          label={item.value}
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-10">
            <div className="row">
              <div className="col-2 d-flex d-lg-none">
                <div
                  className="categories-dropdown p-3  d-flex align-items-center justify-content-center"
                  style={{ cursor: "pointer", width: "34px" }}
                  onClick={() => setOpenFilters(true)}
                >
                  <img src={filterIcon} width={20} height={20} alt="" />
                </div>
              </div>
              <div className="col-8 col-lg-7">
                <div className="position-relative">
                  <img src={searchIcon} alt="" className="search-icon" />
                  <input
                    type="text"
                    className="search-input w-100"
                    placeholder="Search anything"
                  />
                </div>
              </div>
              <div className="col-2 col-lg-3">
                <div className="dropdown">
                  <button
                    className="btn btn-secondary categories-dropdown p-3 dropdown-toggle  d-flex align-items-center justify-content-center justify-content-lg-between"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ width: windowSize.width > 786 ? "100%" : "34px" }}
                  >
                    {windowSize.width > 786 ? (
                      "Price: Low to High"
                    ) : (
                      <img src={priceIcon} width={20} height={20} alt="" />
                    )}
                  </button>
                  <ul className="dropdown-menu categories-dropdown-menu w-100">
                    <li>
                      <a
                        className="dropdown-item categories-dropdown-item"
                        href="#"
                      >
                        Low to High
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item categories-dropdown-item"
                        href="#"
                      >
                        High to Low
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item categories-dropdown-item"
                        href="#"
                      >
                        Recently Listed
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-2 d-none d-lg-block">
                <div className="grid-types-wrapper d-flex align-items-center justify-content-between">
                  <div
                    className={`grid-icon-wrapper ${
                      gridView === "small-grid" && "grid-icon-wrapper-active"
                    } p-2 d-flex align-items-center justify-content-center`}
                    onClick={() => setGridView("small-grid")}
                  >
                    <img
                      src={
                        gridView === "small-grid" ? smallGridActive : smallGrid
                      }
                      alt=""
                    />
                  </div>
                  <div
                    className={`grid-icon-wrapper ${
                      gridView === "big-grid" && "grid-icon-wrapper-active"
                    } p-2 d-flex align-items-center justify-content-center`}
                    onClick={() => setGridView("big-grid")}
                  >
                    <img
                      src={gridView === "big-grid" ? bigGridActive : bigGrid}
                      alt=""
                    />
                  </div>
                  <div
                    className={`grid-icon-wrapper ${
                      gridView === "list" && "grid-icon-wrapper-active"
                    } p-2 d-flex align-items-center justify-content-center`}
                    onClick={() => setGridView("list")}
                  >
                    <img
                      src={gridView === "list" ? listViewActive : listView}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
            {allNftArray && allNftArray.length === 0 && loading === false && (
              <span className="text-white d-flex w-100 justify-content-center mt-5">
                This collection doesn't have any NFTs.
              </span>
            )}

            <div
              className={`${
                gridView === "list"
                  ? "list-view-grid"
                  : gridView === "big-grid"
                  ? "big-cards-grid"
                  : "small-cards-grid"
              } mt-3`}
            >
              {gridView === "list" ? (
                <table className="table nft-table">
                  <thead>
                    <tr style={{ borderBottom: "2px solid #828FBB" }}>
                      <th
                        className="table-header"
                        style={{ textAlign: "left" }}
                        scope="col"
                      >
                        Item
                      </th>
                      <th className="table-header" scope="col">
                        Current Price
                      </th>
                      <th className="table-header" scope="col">
                        Best Offer
                      </th>
                      <th className="table-header" scope="col">
                        Last Sale
                      </th>
                      <th className="table-header" scope="col">
                        Owner
                      </th>
                      <th className="table-header" scope="col">
                        Time Listed
                      </th>
                    </tr>
                  </thead>
                  {allNftArray && allNftArray.length > 0 ? (
                    <tbody>
                      {allNftArray.map((item, index) => (
                        <tr
                          className="nft-table-row p-1"
                          key={index}
                          onClick={() =>
                            navigate(
                              `/nft/${item.tokenId}/${collectionAddress}`
                            )
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td
                            className="table-item col-2 d-flex align-items-center gap-1 w-100"
                            scope="row"
                          >
                            {!item.isVideo ? (
                              <img
                                src={`https://cdnflux.dypius.com/${item.image50}`}
                                className="table-img"
                                height={36}
                                width={36}
                                alt=""
                              />
                            ) : (
                              <video
                                preload="auto"
                                height={36}
                                width={36}
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
                            {item.name}
                          </td>
                          <td className="table-item col-2">
                            {item.seller &&
                              getFormattedNumber(item.price / 10 ** 18)}
                          </td>
                          <td className="table-item col-2">
                            {item.seller && " TBD CFX"}
                          </td>
                          <td className="table-item col-2">
                            {item.seller && " TBD CFX"}{" "}
                          </td>
                          <td className="table-item col-2">
                            {shortAddress(item.owner ?? item.seller)}
                          </td>
                          <td className="table-item col-2">
                            {" "}
                            {moment
                              .duration(item.blockTimestamp * 1000 - Date.now())
                              .humanize(true)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    dummyCards.map((item, index) => (
                      <>
                        <tr></tr>
                        <td>
                          <Skeleton
                            key={index}
                            variant="rounded"
                            width={"100%"}
                            height={40}
                            sx={{ bgcolor: "rgba(47, 128, 237, 0.05)" }}
                          />
                        </td>
                        <td>
                          <Skeleton
                            key={index}
                            variant="rounded"
                            width={"100%"}
                            height={40}
                          />
                        </td>
                        <td>
                          <Skeleton
                            key={index}
                            variant="rounded"
                            width={"100%"}
                            height={40}
                            sx={{ bgcolor: "rgba(47, 128, 237, 0.05)" }}
                          />
                        </td>
                        <td>
                          <Skeleton
                            key={index}
                            variant="rounded"
                            width={"100%"}
                            height={40}
                            sx={{ bgcolor: "rgba(47, 128, 237, 0.05)" }}
                          />
                        </td>
                        <td>
                          <Skeleton
                            key={index}
                            variant="rounded"
                            width={"100%"}
                            height={40}
                            sx={{ bgcolor: "rgba(47, 128, 237, 0.05)" }}
                          />
                        </td>
                        <td>
                          <Skeleton
                            key={index}
                            variant="rounded"
                            width={"100%"}
                            height={40}
                            sx={{ bgcolor: "rgba(47, 128, 237, 0.05)" }}
                          />
                        </td>
                      </>
                    ))
                  )}
                </table>
              ) : (
                allNftArray &&
                allNftArray.length > 0 &&
                allNftArray.map((item, index) => (
                  <div
                    className="recently-listed-card p-3 d-flex flex-column"
                    key={index}
                  >
                    <NavLink
                      to={`/nft/${item.tokenId}/${collectionAddress}`}
                      style={{ textDecoration: "none" }}
                      className={"position-relative"}
                    >
                      {item.image &&
                      !item.isVideo &&
                      gridView === "small-grid" ? (
                        <img
                          src={`https://cdnflux.dypius.com/${item.image}`}
                          className="card-img"
                          alt=""
                        />
                      ) : item.image &&
                        item.isVideo &&
                        gridView === "small-grid" ? (
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
                      ) : (
                        <></>
                      )}
                      {item.image &&
                      !item.isVideo &&
                      gridView === "big-grid" ? (
                        <img
                          src={`https://cdnflux.dypius.com/${item.image170}`}
                          className="card-img"
                          alt=""
                        />
                      ) : item.image &&
                        item.isVideo &&
                        gridView === "big-grid" ? (
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
                      ) : (
                        <></>
                      )}
                      {!item.image && (
                        <img
                          src={require(`./assets/collectionCardPlaceholder2.png`)}
                          className="card-img"
                          alt=""
                        />
                      )}
                      <div
                        className="position-absolute favorite-container"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleLikeStates(item.tokenId);
                        }}
                      >
                        <div className="d-flex align-items-center position-relative gap-2">
                          <img
                            src={
                              userNftFavs &&
                              userNftFavs.length > 0 &&
                              userNftFavs.find((favitem) => {
                                return (
                                  favitem.contractAddress ===
                                    collectionAddress &&
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
                                  favitem.contractAddress ===
                                    collectionAddress &&
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
                                  object.contractAddress ===
                                    collectionAddress &&
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
                          {item.name ?? `#${item.tokenId}`}
                        </h6>
                        <img src={checkIcon} alt="" />
                      </div>
                      {item.seller && (
                        <div className="d-flex align-items-center mt-2 gap-3">
                          <h6
                            className="cfx-price mb-0"
                            style={{ fontSize: "10px" }}
                          >
                            {getFormattedNumber(item.price / 10 ** 18)} WCFX
                          </h6>
                          <span
                            className="usd-price"
                            style={{ fontSize: "9px" }}
                          >
                            (${" "}
                            {getFormattedNumber(
                              (item.price / 10 ** 18) * cfxPrice
                            )}
                            )
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
                            to={`/nft/${item.tokenId}/${collectionAddress}`}
                            style={{ textDecoration: "none" }}
                          >
                            View Details
                          </NavLink>
                        )}
                      </div>
                    </NavLink>
                  </div>
                ))
              )}
            </div>
            {loading === true &&
            (gridView === "small-grid" || gridView === "big-grid") ? (
              <div
                className={`${
                  gridView === "list"
                    ? "list-view-grid"
                    : gridView === "big-grid"
                    ? "big-cards-grid"
                    : "small-cards-grid"
                } mt-3`}
              >
                {dummyCards.map((item, index) => (
                  <Skeleton
                    key={index}
                    variant="rounded"
                    width={"100%"}
                    height={250}
                  />
                ))}
              </div>
            ) : loading === true && gridView === "list" ? (
              <div
                className={`${
                  gridView === "list"
                    ? "list-view-grid"
                    : gridView === "big-grid"
                    ? "big-cards-grid"
                    : "small-cards-grid"
                } mt-3`}
              >
                {dummyCards.map((item, index) => (
                  <Skeleton
                    key={index}
                    variant="rounded"
                    width={"100%"}
                    height={40}
                  />
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div
        className={`mobile-filters-container ${
          openFilters && "filters-container-open"
        } d-block d-lg-none`}
      >
        <div className="filters-wrapper mt-4 p-3 h-100 d-flex flex-column gap-3">
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="filter-popup-title mb-0">Filters</h6>
            <img
              src={xMark}
              width={24}
              height={24}
              alt=""
              style={{ cursor: "pointer" }}
              onClick={() => setOpenFilters(false)}
            />
          </div>
          <div className="" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button collection-filter py-3 d-flex align-items-center gap-2 collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="false"
                  aria-controls="collapseOne"
                >
                  <img src={statusIcon} alt="" />
                  Status
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          sx={{
                            color: "white",
                            "&.Mui-checked": {
                              color: "#3DBDA7",
                            },
                          }}
                        />
                      }
                      label="Recently Listed"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          sx={{
                            color: "white",
                            "&.Mui-checked": {
                              color: "#3DBDA7",
                            },
                          }}
                        />
                      }
                      label="Recently Sold"
                      sx={{
                        color: "#FFF",
                        fontSize: "10px",
                        fontStyle: "normal",
                        fontWeight: "500",
                        lineHeight: "normal",
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          sx={{
                            color: "white",
                            "&.Mui-checked": {
                              color: "#3DBDA7",
                            },
                          }}
                        />
                      }
                      label="Has Offers"
                    />
                  </FormGroup>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collection-filter py-3  d-flex align-items-center gap-2 collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  <img src={priceIcon} alt="" />
                  Price
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="text"
                        placeholder="$ Min"
                        className="price-input"
                      />
                      <span className="MuiTypography-root mb-0">to</span>
                      <input
                        type="text"
                        placeholder="$ Max"
                        className="price-input"
                      />
                    </div>
                    <button className="buy-btn">Apply</button>
                  </div>
                </div>
              </div>
            </div>
            {allNftArray.length > 0 &&
              allNftArray[0]?.metadatas !== false &&
              allNftArray[0]?.attributes !== "false" && (
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button
                      className="accordion-button collection-filter py-3 d-flex align-items-center gap-2 collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      <img src={traitsIcon} alt="" />
                      Traits
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <div className="" id="accordionExample2">
                        {allNftArray.length > 0 &&
                          allNftArray[0]?.attributes &&
                          allNftArray[0]?.attributes !== "false" &&
                          allNftArray[0]?.attributes !== false &&
                          allNftArray[0]?.attributes.map((item, index) => (
                            <div className="accordion-item" key={index}>
                              <h2
                                className="accordion-header"
                                id={`headingOne${item.trait_type}`}
                              >
                                <button
                                  className="accordion-button collection-filter px-2 py-2 d-flex align-items-center gap-2 collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#collapseOne${item.trait_type}`}
                                  aria-expanded="false"
                                  aria-controls={`collapseOne${item.trait_type}`}
                                  style={{ fontSize: "10px" }}
                                >
                                  {item.trait_type}
                                </button>
                              </h2>
                              <div
                                id={`collapseOne${item.trait_type}`}
                                className="accordion-collapse collapse"
                                aria-labelledby={`headingOne${item.trait_type}`}
                                data-bs-parent="#accordionExample2"
                              >
                                <div className="accordion-body px-2">
                                  <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          size="small"
                                          sx={{
                                            color: "white",
                                            "&.Mui-checked": {
                                              color: "#3DBDA7",
                                            },
                                          }}
                                        />
                                      }
                                      key={index}
                                      label={item.value}
                                    />
                                  </FormGroup>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionList;
