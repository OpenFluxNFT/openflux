import React, { useEffect, useState } from "react";
import "./_profilenftlist.scss";
import bigGrid from "./assets/bigGrid.svg";
import bigGridActive from "./assets/bigGridActive.svg";
import listView from "./assets/listView.svg";
import listViewActive from "./assets/listViewActive.svg";
import smallGrid from "./assets/smallGrid.svg";
import smallGridActive from "./assets/smallGridActive.svg";
import liveIcon from "./assets/liveIcon.svg";
import priceIcon from "./assets/priceIcon.svg";
import star from "./assets/star.svg";
import statusIcon from "./assets/statusIcon.svg";
import traitsIcon from "./assets/traitsIcon.svg";
import collectionsIcon from "./assets/collectionsIcon.svg";
import searchIcon from "../Header/assets/searchIcon.svg";
import checkIcon from "../Home/RecentlyListed/assets/checkIcon.svg";
import emptyFavorite from "../Home/RecentlyListed/assets/emptyFavorite.svg";
import redFavorite from "../Home/RecentlyListed/assets/redFavorite.svg";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { NavLink } from "react-router-dom";

const ProfileNFTList = ({ option, userCollectionFavs, allCollections }) => {
  const [favoritesOption, setfavoritesOption] = useState("items");

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

  const dummyFavorites = [
    {
      title: "Cats And Watches Society",
      image: "favoritesPlaceholder1",
    },
    {
      title: "CAWS Timepiece",
      image: "favoritesPlaceholder2",
    },
    {
      title: "World of Dypians Land",
      image: "favoritesPlaceholder3",
    },
    {
      title: "Cats And Watches Society",
      image: "favoritesPlaceholder4",
    },
    {
      title: "CAWS Timepiece",
      image: "favoritesPlaceholder1",
    },
    {
      title: "World of Dypians Land",
      image: "favoritesPlaceholder2",
    },
    {
      title: "Cats And Watches Society",
      image: "favoritesPlaceholder3",
    },
    {
      title: "CAWS Timepiece",
      image: "favoritesPlaceholder4",
    },
  ];

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

  console.log(userCollectionFavs);

  const [gridView, setGridView] = useState("small-grid");

  return (
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
              <span className="collection-info mb-0">9,943</span>
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
                    <img src={collectionsIcon} alt="" />
                    Collections
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
                        label="Cats And Watches Society"
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
                        label="CAWS Timepiece"
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
                        label="Disabled"
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
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-10">
          <div className="row">
            <div className="col-7">
              <div className="position-relative">
                <img src={searchIcon} alt="" className="search-icon" />
                <input
                  type="text"
                  className="search-input w-100"
                  placeholder="Search anything"
                />
              </div>
            </div>
            <div className="col-3">
              <div className="dropdown">
                <button
                  className="btn btn-secondary categories-dropdown p-3 dropdown-toggle w-100 d-flex align-items-center justify-content-between"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Price: Low to High
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
            <div className="col-2">
              {option === "favorites" ? (
                <div className="grid-types-wrapper d-flex align-items-center justify-content-between">
                  <div
                    className={`grid-icon-wrapper ${
                      favoritesOption === "items" && "grid-icon-wrapper-active"
                    } p-2 d-flex align-items-center justify-content-center`}
                    onClick={() => setfavoritesOption("items")}
                    style={{ width: "50%" }}
                  >
                    Items
                  </div>
                  <div
                    className={`grid-icon-wrapper ${
                      favoritesOption === "collections" &&
                      "grid-icon-wrapper-active"
                    } p-2 d-flex align-items-center justify-content-center`}
                    onClick={() => setfavoritesOption("collections")}
                    style={{ width: "50%" }}
                  >
                    Collections
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </div>
          {option === "favorites" ? (
            <div
              className={`small-cards-grid mt-3 ${
                favoritesOption === "collections" &&
                userCollectionFavs.length === 0 &&
                "d-flex align-items-center justify-content-center h-100"
              } `}
            >
              {favoritesOption === "items" ? (
                dummyCards.map((item, index) => (
                  <div
                    className="recently-listed-card p-3 d-flex flex-column"
                    key={index}
                  >
                    <NavLink
                      to={`/nft/0/0xd06cf9e1189feab09c844c597abc3767bc12608c`}
                      style={{ textDecoration: "none" }}
                      className={"position-relative"}
                    >
                      <img
                        src={require(`./assets/nftPlaceholder${index + 1}.png`)}
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
                          <img src={redFavorite} alt="" className="fav-img" />
                          <span className="fav-count-active">222</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <h6
                          className="recently-listed-title mb-0"
                          style={{ fontSize: "12px" }}
                        >
                          CAWS #1125
                        </h6>
                        <img src={checkIcon} alt="" />
                      </div>
                      <div className="d-flex align-items-center mt-2 gap-3">
                        <h6
                          className="cfx-price mb-0"
                          style={{ fontSize: "10px" }}
                        >
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
                ))
              ) : userCollectionFavs && userCollectionFavs.length > 0 ? (
                userCollectionFavs.map((item, index) => (
                  <div
                    className="collection-card d-flex flex-column"
                    key={index}
                  >
                    <NavLink
                      to={`/collection/${item}/${
                        allCollections.find((collection) => {
                          return collection.contractAddress === item;
                        })?.symbol
                      }`}
                      style={{ textDecoration: "none" }}
                      className={"position-relative"}
                    >
                      <img
                        src={
                          item.collectionBannerPicture
                            ? `https://confluxapi.worldofdypians.com/${item.collectionBannerPicture}`
                            : require(`./assets/favoritesPlaceholder1.png`)
                        }
                        className="w-100"
                        alt=""
                      />

                      <div className="p-3 collection-lower d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="mb-0">
                            {
                              allCollections.find((collection) => {
                                return collection.contractAddress === item;
                              })?.collectionName
                            }
                          </h6>
                          <img src={checkIcon} alt="" />
                        </div>
                        <img src={star} alt="" />
                      </div>
                    </NavLink>
                  </div>
                ))
              ) : (
                <span className="text-white">
                  You don't have any favorite collection
                </span>
              )}
            </div>
          ) : (
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
                  <tbody>
                    {dummyCards.map((item, index) => (
                      <tr className="nft-table-row p-1" key={index}>
                        <td
                          className="table-item col-2 d-flex align-items-center gap-1 w-100"
                          scope="row"
                        >
                          <img
                            src={require(`./assets/nftPlaceholder${
                              index + 1
                            }.png`)}
                            className="table-img"
                            height={36}
                            width={36}
                            alt=""
                          />
                          {item.title}
                        </td>
                        <td className="table-item col-2">
                          {item.cfxPrice} CFX
                        </td>
                        <td className="table-item col-2">
                          {item.bestOffer} CFX
                        </td>
                        <td className="table-item col-2">
                          {item.lastSale} CFX{" "}
                        </td>
                        <td className="table-item col-2">{item.owner}</td>
                        <td className="table-item col-2">{item.timeListed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                dummyCards.map((item, index) => (
                  <div
                    className="recently-listed-card p-3 d-flex flex-column"
                    key={index}
                  >
                    <NavLink
                      to={`/nft/0/0xd06cf9e1189feab09c844c597abc3767bc12608c`}
                      style={{ textDecoration: "none" }}
                      className={"position-relative"}
                    >
                      <img
                        src={require(`./assets/nftPlaceholder${index + 1}.png`)}
                        className="card-img card-img2"
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
                          <img src={emptyFavorite} alt="" className="fav-img" />
                          <span className="fav-count">222</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <h6
                          className="recently-listed-title mb-0"
                          style={{ fontSize: "12px" }}
                        >
                          CAWS #1125
                        </h6>
                        <img src={checkIcon} alt="" />
                      </div>
                      <div className="d-flex align-items-center mt-2 gap-3">
                        <h6
                          className="cfx-price mb-0"
                          style={{ fontSize: "10px" }}
                        >
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
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileNFTList;
