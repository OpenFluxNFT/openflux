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
import moment, { min } from "moment";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CollectionList = ({
  offerData,
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
  getRecentlySold,
  hasListedNfts,
  getFilter,
  fetchSearchNftsPerCollection,
  onShowPopup,
  onShowAcceptPopup,
  allOffers,
  bestOffer,
  isVerified,
  onSelectCollecitonOffers,
  collectionJson,
  onClearAll,
  nftArrayFilteredBySearch,
  isSearch,
  onFilterTraits,
  ntftArrayFilteredByTraits,
  isSearchTrait, userNftsOwned
}) => {
  const windowSize = useWindowSize();
  const [openFilters, setOpenFilters] = useState(false);

  const [buyStatus, setbuyStatus] = useState("buy"); //buy
  const [buyloading, setbuyLoading] = useState(false); //buy
  const [selectedNftId, setSelectedNftId] = useState(""); //buy
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [dummyMinPrice, setDummyMinPrice] = useState(0);
  const [dummyMaxPrice, setDummyMaxPrice] = useState(0);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [generalFilter, setGeneralFilter] = useState(null);
  const [listType, setListType] = useState("");
  const [dummyTraits, setDummyTraits] = useState([
    "White",
    "Black",
    "Yellow",
    "Blue",
  ]);
  const [queryItems, setQueryItems] = useState([]);
  const [search, setSearch] = useState("");
  const [priceFilter, setpriceFilter] = useState("Filter by Price");

  const [nftList, setNftList] = useState([]);

  const navigate = useNavigate();
  const [gridView, setGridView] = useState("small-grid");
  const [nftFinalArray, setnftFinalArray] = useState([]);

  const baseURL = "https://confluxapi.worldofdypians.com";

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

  const checkIfExists = (itemToCheck) => {
    return queryItems.some(
      (item) =>
        item.type.toLowerCase() === itemToCheck.type.toLowerCase() &&
        item.value.toLowerCase() === itemToCheck.value.toLowerCase()
    );
  };

  const handleKeyPress = (val) => (event) => {
    if (event.key === "Enter") {
      fetchSearchNftsPerCollection(val.value);
      const index = queryItems.indexOf(val);
      setQueryItems(queryItems.splice(index, 1));

      if (val.value.length > 0) {
        setQueryItems([...queryItems, val]);
      } else if (val.value.length === 0) {
        setQueryItems(queryItems.splice(index, 1));
      }

      // if (val.value.length > 0) {
      //   setCollectionLoading(true);
      //   const searchItems = allNftArray.filter((item) => {
      //     return item?.name.includes(val.value);
      //   });

      //   setNftList(searchItems);
      //   setTimeout(() => {
      //     setCollectionLoading(false);
      //   }, 1500);
      // }
    }
  };

  const addOrRemove = (itemToAddOrRemove) => {
    setQueryItems((prevItems) => {
      const targetType = String(itemToAddOrRemove.type).toLowerCase();
      const targetValue = String(itemToAddOrRemove.value).toLowerCase();

      const itemExists = prevItems.some(
        (item) =>
          String(item.type).toLowerCase() === targetType &&
          String(item.value).toLowerCase() === targetValue
      );

      if (itemExists) {
        // Remove the item if it exists

        onFilterTraits(
          prevItems.filter(
            (item) =>
              String(item.type).toLowerCase() !== targetType ||
              String(item.value).toLowerCase() !== targetValue
          )
        );
        return prevItems.filter(
          (item) =>
            String(item.type).toLowerCase() !== targetType ||
            String(item.value).toLowerCase() !== targetValue
        );
      } else {
        // Add the item if it doesn't exist
        onFilterTraits([
          ...prevItems,
          { type: targetType, value: targetValue },
        ]);
        return [...prevItems, { type: targetType, value: targetValue }];
      }
    });
  };

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

  const setListed = (type) => {
    setCollectionLoading(true);
    if (listType === type) {
      setListType("");
      setNftList(allNftArray);
      setTimeout(() => {
        setCollectionLoading(false);
      }, 1500);
      return;
    }
    setListType(type);
    if (type === "listed") {
      setGeneralFilter(type);
      const filteredList = nftList.filter((item) => {
        return item.price > 0;
      });

      setNftList(filteredList);
      setTimeout(() => {
        setCollectionLoading(false);
      }, 1500);
    } else if (type === "sold") {
      setGeneralFilter(type);
      setNftList(allNftArray);
      getRecentlySold().then((result) => {
        setNftList(result);
        setCollectionLoading(false);
      });
    } else if (type === "offers") {
      const filteredList = nftList.filter((item) => {
        return Number(item.bestOffer) > 0;
      });
      setNftList(filteredList);
      setTimeout(() => {
        setCollectionLoading(false);
      }, 1500);
    } else {
      setGeneralFilter(null);

      setNftList(allNftArray);
      setTimeout(() => {
        setCollectionLoading(false);
      }, 1500);
    }
  };

  const setPrices = (min, max) => {
    setGeneralFilter(min, max);
    setCollectionLoading(true);
    setMinPrice(min);
    setMaxPrice(max);

    if (min === 0 && max === 0) {
      setNftList(nftList);
      setGeneralFilter(null);
      return;
    } else if (min === "" && max === "") {
      setNftList(nftList);
      setGeneralFilter(null);
      return;
    } else if (min === "0" && max === "0") {
      setNftList(nftList);
      setGeneralFilter(null);
      return;
    } else if (
      (Number(min) === 0 || min === "") &&
      Number(max) !== 0 &&
      max !== ""
    ) {
      const filterPrices = nftList.filter((item) => {
        if (item.price) {
          return (
            (item.price / 10 ** 18) * cfxPrice >= Number(min) ||
            (item.price / 10 ** 18) * cfxPrice <= Number(max)
          );
        }
      });

      setNftList(filterPrices);
    } else {
      const filterPrices = nftList.filter((item) => {
        if (item.price) {
          return (item.price / 10 ** 18) * cfxPrice >= Number(max);
        }
      });

      setNftList(filterPrices);
    }

    setTimeout(() => {
      setCollectionLoading(false);
    }, 1500);
  };

  const filterByPrice = (filter) => {
    setCollectionLoading(true);
    if (filter === "lth") {
      let lth = allNftArray.sort((a, b) => {
        return a.price - b.price;
      });
      setNftList(lth);
      setTimeout(() => {
        setCollectionLoading(false);
      }, 1500);
    } else if (filter === "htl") {
      let htl = allNftArray.sort((a, b) => {
        return b.price - a.price;
      });
      setNftList(htl);
      setTimeout(() => {
        setCollectionLoading(false);
      }, 1500);
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

  const refreshUserHistory = async (wallet) => {
    const result = await axios
      .get(`${baseURL}/api/refresh-user-history/${wallet.toLowerCase()}`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
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

  const buyFunc = async (nft) => {
    await window
      .buyNFT(nft.nftAddress, nft.listingIndex, nft.price)
      .then((result) => {
        setbuyLoading(false);
        refreshUserHistory(coinbase);
        refreshUserHistory(nft.owner);
        handleGetRecentlySoldNftsCache();
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
        buyFunc(nft);
      } else {
        setbuyStatus("approve");
        setbuyLoading(true);

        await window
          .approveBuy(nft.price)
          .then(() => {
            setTimeout(() => {
              setbuyStatus("buy");
              buyFunc(nft);
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
    setNftList(allNftArray);
  }, [allNftArray]);

  useEffect(() => {
    setCollectionLoading(loading);
  }, [loading]);

  useEffect(() => {
    getFilter(generalFilter);
  }, [generalFilter]);

  // useEffect(() => {
  //   if (queryItems.length === 0) {
  //     setCollectionLoading(true);
  //     setNftList(allNftArray);
  //     setTimeout(() => {
  //       setCollectionLoading(false);
  //     }, 1500);
  //   }
  // }, [queryItems]);

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
                          onChange={() => {
                            setListed("listed");
                          }}
                          control={
                            <Checkbox
                              size="small"
                              checked={listType === "listed" ? true : false}
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
                          onChange={() => {
                            setListed("sold");
                          }}
                          control={
                            <Checkbox
                              size="small"
                              checked={listType === "sold" ? true : false}
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
                          onChange={() => {
                            setListed("offers");
                          }}
                          control={
                            <Checkbox
                              checked={listType === "offers" ? true : false}
                              size="small"
                              sx={{
                                color: "white",
                                "&.Mui-checked": {
                                  color: "#3DBDA7",
                                },
                              }}
                            />
                          }
                          label="NFT Offers"
                        />

                        <FormControlLabel
                          onChange={() => {
                            setListed("collectionoffers");
                            onSelectCollecitonOffers(
                              listType === "collectionoffers" ? true : false
                            );
                          }}
                          control={
                            <Checkbox
                              checked={
                                listType === "collectionoffers" ? true : false
                              }
                              size="small"
                              sx={{
                                color: "white",
                                "&.Mui-checked": {
                                  color: "#3DBDA7",
                                },
                              }}
                            />
                          }
                          label="Collection Offers"
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
                            type="number"
                            placeholder="$ Min"
                            className="price-input"
                            onChange={(e) => setDummyMinPrice(e.target.value)}
                            min={0}
                          />
                          <span className="MuiTypography-root mb-0">to</span>
                          <input
                            type="number"
                            placeholder="$ Max"
                            className="price-input"
                            onChange={(e) => setDummyMaxPrice(e.target.value)}
                            min={dummyMinPrice}
                          />
                        </div>
                        <button
                          className="buy-btn"
                          onClick={() => {
                            setPrices(dummyMinPrice, dummyMaxPrice);
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {collectionJson &&
                  collectionJson.traits &&
                  collectionJson.traits.length > 0 && (
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
                            {collectionJson.traits &&
                              collectionJson.traits.length > 0 &&
                              collectionJson.traits.map((item, index) => {
                                return (
                                  <div className="accordion-item" key={index}>
                                    <h2
                                      className="accordion-header"
                                      id={`headingOne${item.key.replace(
                                        /\s+/g,
                                        ""
                                      )}`}
                                    >
                                      <button
                                        className="accordion-button collection-filter px-2 py-2 d-flex align-items-center gap-2 collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapseOne${item.key.replace(
                                          /\s+/g,
                                          ""
                                        )}`}
                                        aria-expanded="false"
                                        aria-controls={`collapseOne${item.key.replace(
                                          /\s+/g,
                                          ""
                                        )}`}
                                        style={{ fontSize: "10px" }}
                                      >
                                        {item.key}
                                      </button>
                                    </h2>
                                    <div
                                      id={`collapseOne${item.key.replace(
                                        /\s+/g,
                                        ""
                                      )}`}
                                      className="accordion-collapse collapse"
                                      aria-labelledby={`headingOne${item.key.replace(
                                        /\s+/g,
                                        ""
                                      )}`}
                                      data-bs-parent="#accordionExample2"
                                    >
                                      <div className="accordion-body px-2">
                                        {Object.entries(item.value).map(
                                          ([key, value]) => (
                                            <FormGroup>
                                              <FormControlLabel
                                                onChange={() => {
                                                  addOrRemove({
                                                    type: item.key,
                                                    value: key,
                                                  });
                                                }}
                                                control={
                                                  <Checkbox
                                                    checked={checkIfExists({
                                                      type: item.key,
                                                      value: key,
                                                    })}
                                                    size="small"
                                                    sx={{
                                                      color: "white",
                                                      "&.Mui-checked": {
                                                        color: "#3DBDA7",
                                                      },
                                                    }}
                                                  />
                                                }
                                                key={value}
                                                label={key}
                                              />
                                            </FormGroup>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-10">
            <div className="row gap-lg-0 gap-2">
              <div className="col-2 d-flex d-lg-none">
                <div
                  className="categories-dropdown p-3  d-flex align-items-center justify-content-center"
                  style={{ cursor: "pointer", width: "34px" }}
                  onClick={() => setOpenFilters(true)}
                >
                  <img src={filterIcon} width={20} height={20} alt="" />
                </div>
              </div>
              <div
                className={
                  (currentCollection &&
                    currentCollection.owner &&
                    coinbase &&
                    currentCollection.owner.toLowerCase() ===
                    coinbase.toLowerCase())|| (userNftsOwned && userNftsOwned.length > 0 && userNftsOwned.find((nft) => { return nft.contract.toLowerCase() === collectionAddress.toLowerCase() && nft.type === 'ERC1155' })) ||
                    totalSupplyPerCollection === 0
                    ? "col-8 col-lg-7"
                    : "col-6 col-lg-5"
                }
              >
                <div className="position-relative">
                  <img src={searchIcon} alt="" className="search-icon" />
                  <input
                    type="text"
                    className="search-input w-100"
                    placeholder="Search by token"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyPress({
                      type: "Search",
                      value: search,
                    })}
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
                      <>{priceFilter}</>
                    ) : (
                      <img src={priceIcon} width={20} height={20} alt="" />
                    )}
                  </button>
                  <ul className="dropdown-menu categories-dropdown-menu w-100">
                    <li
                      className="dropdown-item categories-dropdown-item"
                      onClick={() => {
                        setpriceFilter("Low to High");
                        filterByPrice("lth");
                      }}
                    >
                      Low to High
                    </li>
                    <li
                      className="dropdown-item categories-dropdown-item"
                      onClick={() => {
                        setpriceFilter("High to Low");
                        filterByPrice("htl");
                      }}
                    >
                      High to Low
                    </li>
                    {/* <li>
                      <a
                        className="dropdown-item categories-dropdown-item"
                        href="#"
                      >
                        Recently Listed
                      </a>
                    </li> */}
                  </ul>
                </div>
              </div>
              <div className="col-2 d-none d-lg-block">
                <div className="grid-types-wrapper d-flex align-items-center justify-content-between">
                  <div
                    className={`grid-icon-wrapper ${gridView === "small-grid" && "grid-icon-wrapper-active"
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
                    className={`grid-icon-wrapper ${gridView === "big-grid" && "grid-icon-wrapper-active"
                      } p-2 d-flex align-items-center justify-content-center`}
                    onClick={() => setGridView("big-grid")}
                  >
                    <img
                      src={gridView === "big-grid" ? bigGridActive : bigGrid}
                      alt=""
                    />
                  </div>
                  <div
                    className={`grid-icon-wrapper ${gridView === "list" && "grid-icon-wrapper-active"
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
              {(currentCollection &&
                currentCollection.owner &&
                coinbase &&
                currentCollection.owner.toLowerCase() ===
                coinbase.toLowerCase()) || (userNftsOwned && userNftsOwned.length > 0 && userNftsOwned.find((nft) => { return nft.contract.toLowerCase() === collectionAddress.toLowerCase() && nft.type === 'ERC1155' })) ||
                totalSupplyPerCollection === 0 ? (
                <></>
              ) : (
                <div className="col-lg-2">
                  <button
                    className="blue-btn py-2 border-0 w-100 h-auto"
                    onClick={onShowPopup}
                  >
                    {offerData && offerData.amount
                      ? "Update Offer"
                      : "Make Offer"}
                  </button>
                </div>
              )}
            </div>
            <div className="d-flex mt-3 align-items-center gap-2 flex-wrap">
              {queryItems.length > 0 &&
                queryItems.map((item, index) => (
                  <div
                    key={index}
                    className="collection-query p-2 d-flex gap-4 align-items-center justify-content-center"
                  >
                    <div className="d-flex align-items-center gap-1">
                      <h6 className="collection-query-type mb-0">
                        {item.type}:
                      </h6>
                      <h6 className="collection-query-value mb-0">
                        {item.value}
                      </h6>
                    </div>
                    <img
                      src={xMark}
                      width={10}
                      height={10}
                      style={{ cursor: "pointer" }}
                      alt=""
                      onClick={() => addOrRemove(item)}
                    />
                  </div>
                ))}

              {minPrice > 0 && (
                <div className="collection-query p-2 d-flex gap-4 align-items-center justify-content-center">
                  <div className="d-flex align-items-center gap-1">
                    <h6 className="collection-query-type mb-0">Min Price:</h6>
                    <h6 className="collection-query-value mb-0">
                      {getFormattedNumber(minPrice)}
                    </h6>
                  </div>
                  <img
                    src={xMark}
                    width={10}
                    height={10}
                    style={{ cursor: "pointer" }}
                    alt=""
                    onClick={() => setPrices(0, dummyMaxPrice)}
                  />
                </div>
              )}
              {maxPrice > 0 && (
                <div className="collection-query p-2 d-flex gap-4 align-items-center justify-content-center">
                  <div className="d-flex align-items-center gap-1">
                    <h6 className="collection-query-type mb-0">Max Price:</h6>
                    <h6 className="collection-query-value mb-0">
                      {getFormattedNumber(maxPrice)}
                    </h6>
                  </div>
                  <img
                    src={xMark}
                    width={10}
                    height={10}
                    style={{ cursor: "pointer" }}
                    alt=""
                    onClick={() => setPrices(dummyMinPrice, 0)}
                  />
                </div>
              )}
              {queryItems.length > 0 || minPrice > 0 || maxPrice > 0 ? (
                <button
                  className="buy-btn py-1 px-2"
                  onClick={() => {
                    setCollectionLoading(true);
                    setQueryItems([]);
                    setPrices(0, 0);
                    setGeneralFilter(null);
                    onClearAll();
                    setSearch("");
                    setTimeout(() => {
                      setCollectionLoading(false);
                    }, 1500);
                  }}
                  style={{ borderRadius: "8px" }}
                >
                  Clear All
                </button>
              ) : (
                <></>
              )}
            </div>

            {nftList &&
              nftList.length === 0 &&
              collectionLoading === false &&
              (totalSupplyPerCollection === 0 ||
                isNaN(totalSupplyPerCollection)) &&
              loading === false && (
                <span className="text-white d-flex w-100 justify-content-center mt-5">
                  This collection doesn't have any NFTs.
                </span>
              )}

            {isSearch === true &&
              nftArrayFilteredBySearch.length === 0 &&
              loading === false && (
                <span className="text-white d-flex w-100 justify-content-center mt-5">
                  There are no NFTs with this filter.
                </span>
              )}

            {isSearchTrait === true &&
              ntftArrayFilteredByTraits.length === 0 &&
              loading === false && (
                <span className="text-white d-flex w-100 justify-content-center mt-5">
                  There are no NFTs with this trait type.
                </span>
              )}

            <div
              className={`${gridView === "list" || listType === "collectionoffers"
                  ? "list-view-grid"
                  : gridView === "big-grid"
                    ? "big-cards-grid"
                    : "small-cards-grid"
                } mt-3`}
            >
              {gridView === "list" && listType !== "collectionoffers" ? (
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
                        Expires
                      </th>
                    </tr>
                  </thead>
                  {allNftArray && allNftArray.length > 0 ? (
                    <tbody>
                      {listType === ""
                        ? allNftArray.map((item, index) => (
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
                              {!item.isVideo && item.image ? (
                                <img
                                  src={`https://cdnflux.dypius.com/${item.image50}`}
                                  className="table-img nftimg2"
                                  height={36}
                                  width={36}
                                  alt=""
                                />
                              ) : item.isVideo && item.image ? (
                                <video
                                  preload="auto"
                                  height={36}
                                  width={36}
                                  className="card-img nftimg2"
                                  src={`https://cdnflux.dypius.com/${item.image}`}
                                  autoPlay={true}
                                  loop={true}
                                  muted="muted"
                                  playsInline={true}
                                  // onClick={player}
                                  controlsList="nodownload"
                                ></video>
                              ) : (
                                <img
                                  src={require(`./assets/collectionCardPlaceholder2.png`)}
                                  className="table-img nftimg2"
                                  alt=""
                                  height={36}
                                  width={36}
                                />
                              )}
                              {item.tokenName +
                                " " +
                                (item.name ? item.name : ` #${item.tokenId}`)}
                            </td>
                            <td className="table-item col-2">
                              {item.seller
                                ? getFormattedNumber(item.price / 10 ** 18)
                                : "---"}{" "}
                              WCFX
                            </td>
                            <td className="table-item col-2">
                              {getFormattedNumber(item.bestOffer / 1e18)} WCFX
                            </td>
                            <td className="table-item col-2">
                              {getFormattedNumber(item.lastSale)} WCFX
                            </td>
                            <td className="table-item col-2">
                              {shortAddress(item.owner ?? item.seller)}
                            </td>
                            <td className="table-item col-2">
                              {item.expiresAt
                                ? moment
                                  .duration(
                                    item.expiresAt * 1000 - Date.now()
                                  )
                                  .humanize(true)
                                : "N/A"}
                            </td>
                          </tr>
                        ))
                        : nftList.map((item, index) => (
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
                              {!item.isVideo && item.image ? (
                                <img
                                  src={`https://cdnflux.dypius.com/${item.image50}`}
                                  className="table-img nftimg2"
                                  height={36}
                                  width={36}
                                  alt=""
                                />
                              ) : item.isVideo && item.image ? (
                                <video
                                  preload="auto"
                                  height={36}
                                  width={36}
                                  className="card-img nftimg2"
                                  src={`https://cdnflux.dypius.com/${item.image}`}
                                  autoPlay={true}
                                  loop={true}
                                  muted="muted"
                                  playsInline={true}
                                  // onClick={player}
                                  controlsList="nodownload"
                                ></video>
                              ) : (
                                <img
                                  src={require(`./assets/collectionCardPlaceholder2.png`)}
                                  className="table-img nftimg2"
                                  alt=""
                                  height={36}
                                  width={36}
                                />
                              )}
                              {item.tokenName +
                                " " +
                                (item.name ? item.name : ` #${item.tokenId}`)}
                            </td>
                            <td className="table-item col-2">
                              {item.seller
                                ? getFormattedNumber(item.price / 10 ** 18)
                                : "---"}{" "}
                              WCFX
                            </td>
                            <td className="table-item col-2">
                              {getFormattedNumber(item.bestOffer / 1e18)} WCFX
                            </td>
                            <td className="table-item col-2">
                              {getFormattedNumber(item.lastSale)} WCFX
                            </td>
                            <td className="table-item col-2">
                              {shortAddress(item.owner ?? item.seller)}
                            </td>
                            <td className="table-item col-2">
                              {item.expiresAt
                                ? moment
                                  .duration(
                                    item.expiresAt * 1000 - Date.now()
                                  )
                                  .humanize(true)
                                : "N/A"}
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
              ) : listType === "" &&
                Number(minPrice) === 0 &&
                Number(maxPrice) === 0 ? (
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
                          {item.tokenName +
                            " " +
                            (item.name ? item.name : ` #${item.tokenId ? item.tokenId?.toString().slice(0,10) : ''}`)}
                        </h6>
                        {isVerified && <img src={checkIcon} alt="" />}
                      </div>
                      {item.seller ? (
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
                            ($--- )
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
                            Buy
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
              ) : listType === "collectionoffers" ? (
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
                        Price
                      </th>
                      <th className="table-header" scope="col">
                        Best Offer
                      </th>
                      <th className="table-header" scope="col">
                        From
                      </th>
                      <th className="table-header" scope="col">
                        Expires
                      </th>
                      <th className="table-header" scope="col">
                        Action
                      </th>
                    </tr>
                  </thead>
                  {allOffers && allOffers.length > 0 && (
                    <tbody>
                      {allOffers.map((item, index) => (
                        <tr
                          className="nft-table-row p-1"
                          key={index}
                        // onClick={() => onShowAcceptPopup(item)}
                        // style={{ cursor: "pointer" }}
                        >
                          <td
                            className="table-item col-2 d-flex align-items-center gap-1 w-100"
                            scope="row"
                          >
                            <img
                              src={
                                currentCollection.collectionProfilePic
                                  ? `https://confluxapi.worldofdypians.com/${currentCollection.collectionProfilePic}`
                                  : require(`./assets/collectionCardPlaceholder2.png`)
                              }
                              className="table-img nftimg2"
                              height={36}
                              width={36}
                              alt=""
                            />

                            {currentCollection.collectionName}
                          </td>
                          <td className="table-item col-2">
                            {getFormattedNumber(item.amount / 10 ** 18)} WCFX
                          </td>
                          <td className="table-item col-2">
                            {bestOffer && bestOffer.amount
                              ? getFormattedNumber(bestOffer.amount / 1e18)
                              : getFormattedNumber(0)}{" "}
                            WCFX
                          </td>
                          <td className="table-item col-2">
                            <a
                              href={`https://evm.confluxscan.net/address/${item.offeror}`}
                              className="greentext"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {shortAddress(item.offeror)}
                            </a>
                          </td>
                          <td className="table-item col-2">
                            {moment
                              .duration(item.expiresAt * 1000 - Date.now())
                              .humanize(true)}
                          </td>
                          <td className="table-item col-2">
                            <button
                              className="btn blue-btn py-2 border-0 w-100 h-auto"
                              onClick={(e) => {
                                item.offeror.toLowerCase() !==
                                  coinbase?.toLowerCase()
                                  ? onShowAcceptPopup(item)
                                  : onShowPopup();
                              }}
                              disabled={!coinbase?.toLowerCase() || !coinbase}
                            >
                              {item.offeror.toLowerCase() ===
                                coinbase?.toLowerCase() || !coinbase
                                ? "Update"
                                : "Accept"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              ) : collectionLoading === false &&
                ((listType !== "" && listType !== "collectionoffers") ||
                  (Number(minPrice) > 0 && Number(maxPrice) > 0)) ? (
                allNftArray &&
                nftList.length > 0 &&
                allNftArray.length > 0 &&
                nftList.map((item, index) => (
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
                          {item.tokenName +
                            " " +
                            (item.name ? item.name : ` #${item.tokenId}`)}
                        </h6>
                        {isVerified && <img src={checkIcon} alt="" />}
                      </div>
                      {item.seller ? (
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
                            ($--- )
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
                            Buy
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
              ) : (
                <></>
              )}

              {listType === "collectionoffers" &&
                allOffers &&
                allOffers.length === 0 && (
                  <span className="text-white d-flex w-100 align-items-center justify-content-center">
                    There are no offers for this collection.
                  </span>
                )}
            </div>

            {(!isSearch
              ? collectionLoading === true ||
              loading === true ||
              (collectionLoading === false &&
                loading === false &&
                allNftArray.length === 0) ||
              (loading === true &&
                (ntftArrayFilteredByTraits.length === 0 ||
                  ntftArrayFilteredByTraits.length > 0) &&
                allNftArray.length === 0 &&
                isSearchTrait)
              : loading === true &&
              (nftArrayFilteredBySearch.length === 0 ||
                nftArrayFilteredBySearch.length > 0) &&
              allNftArray.length === 0) &&
              listType !== "collectionoffers" &&
              allNftArray &&
              (gridView === "small-grid" || gridView === "big-grid") ? (
              <div
                className={`${gridView === "list"
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
            ) : (collectionLoading === true || loading === true) &&
              totalSupplyPerCollection > 0 &&
              gridView === "list" ? (
              <div
                className={`${gridView === "list"
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
        className={`mobile-filters-container ${openFilters && "filters-container-open"
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
                      onChange={() => {
                        setListed("listed");
                      }}
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
                      onChange={() => {
                        setListed("sold");
                      }}
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
                      onChange={() => {
                        setListed("offers");
                      }}
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
                      label="NFT Offers"
                    />

                    <FormControlLabel
                      onChange={() => {
                        setListed("collectionoffers");
                        onSelectCollecitonOffers(
                          listType === "collectionoffers" ? true : false
                        );
                      }}
                      control={
                        <Checkbox
                          size="small"
                          checked={
                            listType === "collectionoffers" ? true : false
                          }
                          sx={{
                            color: "white",
                            "&.Mui-checked": {
                              color: "#3DBDA7",
                            },
                          }}
                        />
                      }
                      label="Collection Offers"
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
                        onChange={(e) => setDummyMinPrice(e.target.value)}
                      />
                      <span className="MuiTypography-root mb-0">to</span>
                      <input
                        type="text"
                        placeholder="$ Max"
                        className="price-input"
                        onChange={(e) => setDummyMaxPrice(e.target.value)}
                      />
                    </div>
                    <button
                      className="buy-btn"
                      onClick={() => {
                        setPrices(dummyMinPrice, dummyMaxPrice);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {collectionJson &&
              collectionJson.traits &&
              collectionJson.traits.length > 0 && (
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
                        {collectionJson.traits &&
                          collectionJson.traits.length > 0 &&
                          collectionJson.traits.map((item, index) => {
                            return (
                              <div className="accordion-item" key={index}>
                                <h2
                                  className="accordion-header"
                                  id={`headingOne${item.key.replace(
                                    /\s+/g,
                                    ""
                                  )}`}
                                >
                                  <button
                                    className="accordion-button collection-filter px-2 py-2 d-flex align-items-center gap-2 collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapseOne${item.key.replace(
                                      /\s+/g,
                                      ""
                                    )}`}
                                    aria-expanded="false"
                                    aria-controls={`collapseOne${item.key.replace(
                                      /\s+/g,
                                      ""
                                    )}`}
                                    style={{ fontSize: "10px" }}
                                  >
                                    {item.key}
                                  </button>
                                </h2>
                                <div
                                  id={`collapseOne${item.key.replace(
                                    /\s+/g,
                                    ""
                                  )}`}
                                  className="accordion-collapse collapse"
                                  aria-labelledby={`headingOne${item.key.replace(
                                    /\s+/g,
                                    ""
                                  )}`}
                                  data-bs-parent="#accordionExample2"
                                >
                                  <div className="accordion-body px-2">
                                    {Object.entries(item.value).map(
                                      ([key, value]) => (
                                        <FormGroup>
                                          <FormControlLabel
                                            onChange={() =>
                                              addOrRemove({
                                                type: item.key,
                                                value: key,
                                              })
                                            }
                                            control={
                                              <Checkbox
                                                checked={checkIfExists({
                                                  type: item.key,
                                                  value: key,
                                                })}
                                                size="small"
                                                sx={{
                                                  color: "white",
                                                  "&.Mui-checked": {
                                                    color: "#3DBDA7",
                                                  },
                                                }}
                                              />
                                            }
                                            key={value}
                                            label={key}
                                          />
                                        </FormGroup>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
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
