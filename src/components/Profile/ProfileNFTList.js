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
import { Skeleton } from "@mui/material";
import getFormattedNumber from "../../hooks/get-formatted-number";
import { shortAddress } from "../../hooks/shortAddress";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import saleIcon from "../SingleNft/SingleNftHistory/assets/saleIcon.svg";
import listIcon from "../SingleNft/SingleNftHistory/assets/listIcon.svg";

const ProfileNFTList = ({
  option,
  userCollectionFavs,
  allCollections,
  userNftFavs,
  handleAddFavoriteNft,
  handleRemoveFavoriteNft,
  userNftFavsInitial,
  nftFinalArray,
  fetchFavoriteCounts,
  userNftsOwnedArray,
  cfxPrice,
  allOffers,
  bestOffer,
  userCollectionArray,
  allOffersMade,
  allNFTSOffer,
  recentlyListedNfts,
  saleHistory,
  collectionOffers,
  handleAcceptOffer,
  offeracceptStatus,
  userCollection,
  usersNftOffers,
  usersCollectionOffers,
}) => {
  const [favoritesOption, setfavoritesOption] = useState("items");
  const [gridView, setGridView] = useState("small-grid");
  const [loading, setLoading] = useState(false);
  const [userCollectionArrayFinal, setuserCollectionArrayFinal] = useState([]);
  const [userCollectionArrayFinal2, setuserCollectionArrayFinal2] = useState(
    []
  );

  const [favoriteOptions, setFavoriteOptions] = useState([]);
  const [collectedOptions, setcollectedOptions] = useState([]);
  const [listedOptions, setlistedOptions] = useState([]);
  const [saleHistoryOptions, setsaleHistoryOptions] = useState([]);
  const [userOffersMadeNftOptions, setuserOffersMadeNftOptions] = useState([]);
  const [userOffersMadeCollectionOptions, setuserOffersMadeCollectionOptions] =
    useState([]);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [dummyMinPrice, setDummyMinPrice] = useState(0);
  const [dummyMaxPrice, setDummyMaxPrice] = useState(0);
  const [nftList, setNftList] = useState([]);
  const [generalFilter, setGeneralFilter] = useState(null);
  const [search, setSearch] = useState("");
  const [queryItems, setQueryItems] = useState([]);

  const [selectedNftId, setSelectedNftId] = useState(""); //buy

  const handleKeyPress = (val) => (event) => {
    if (option !== "favorites") {
      if (event.key === "Enter") {
        const index = queryItems.indexOf(val);
        setQueryItems(queryItems.splice(index, 1));

        if (val.value.length > 0) {
          setQueryItems([...queryItems, val]);
        } else if (val.value.length === 0) {
          setQueryItems(queryItems.splice(index, 1));
        }

        if (val.value.length > 0) {
          setLoading(true);
          const searchItems = userNftsOwnedArray.filter((item) => {
            return (
              item?.tokenId.includes(val.value) ||
              item?.tokenName.toLowerCase().includes(val.value.toLowerCase()) ||
              item?.collectionName
                .toLowerCase()
                .includes(val.value.toLowerCase())
            );
          });

          setNftList(searchItems);
          setTimeout(() => {
            setLoading(false);
          }, 1500);
        }
      }
    }
  };

  const handleSetNftList = (value) => {
    if (value === "" && option !== "favorites") {
      setNftList(userNftsOwnedArray);
    }
  };

  // console.log(userNftsOwnedArray)
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

  const setPrices = (min, max) => {
    setGeneralFilter(min, max);
    setLoading(true);
    setMinPrice(min);
    setMaxPrice(max);
    if (option === "activity") {
      setuserCollectionArrayFinal2(saleHistory);
      if (min === 0 && max === 0) {
        setNftList(saleHistory);
        setGeneralFilter(null);
        return;
      } else if (min === "" && max === "") {
        setNftList(saleHistory);
        setGeneralFilter(null);

        return;
      } else if (min === "0" && max === "0") {
        setNftList(saleHistory);
        setGeneralFilter(null);
        return;
      } else if (
        (Number(min) === 0 || min === "") &&
        Number(max) !== 0 &&
        max !== ""
      ) {
        if (favoritesOption === "sales") {
          const filterPrices = saleHistory.filter((item) => {
            if (item.amount && item.type !== "list") {
              return (
                (item.amount / 10 ** 18) * cfxPrice >= Number(min) ||
                (item.amount / 10 ** 18) * cfxPrice <= Number(max)
              );
            }
          });

          setNftList(filterPrices);
        } else if (favoritesOption === "listings") {
          const filterPrices = saleHistory.filter((item) => {
            if (item.amount && item.type === "list") {
              return (
                (item.amount / 10 ** 18) * cfxPrice >= Number(min) ||
                (item.amount / 10 ** 18) * cfxPrice <= Number(max)
              );
            }
          });

          setNftList(filterPrices);
        }
      } else if (
        (Number(min) === 0 || min === "") &&
        (Number(max) === 0 || max === "")
      ) {
        if (favoritesOption === "sales") {
          const filterPrices = saleHistory.filter((item) => {
            if (item.amount && item.type !== "list") {
              return (
                (item.amount / 10 ** 18) * cfxPrice >= Number(min) ||
                (item.amount / 10 ** 18) * cfxPrice <= Number(max)
              );
            }
          });

          setNftList(filterPrices);
        } else if (favoritesOption === "listings") {
          const filterPrices = saleHistory.filter((item) => {
            if (item.amount && item.type === "list") {
              return (
                (item.amount / 10 ** 18) * cfxPrice >= Number(min) ||
                (item.amount / 10 ** 18) * cfxPrice <= Number(max)
              );
            }
          });

          setNftList(filterPrices);
        }
      } else {
        if (favoritesOption === "sales") {
          const filterPrices = saleHistory.filter((item) => {
            if (item.amount && item.type !== "list") {
              return (
                (item.amount / 10 ** 18) * cfxPrice >= Number(min) &&
                (item.amount / 10 ** 18) * cfxPrice <= Number(max)
              );
            }
          });

          setNftList(filterPrices);
        } else if (favoritesOption === "listings") {
          const filterPrices = saleHistory.filter((item) => {
            if (item.amount && item.type === "list") {
              return (
                (item.amount / 10 ** 18) * cfxPrice >= Number(min) &&
                (item.amount / 10 ** 18) * cfxPrice <= Number(max)
              );
            }
          });

          setNftList(filterPrices);
        }
      }
    } else {
      if (min === 0 && max === 0) {
        setNftList(userNftsOwnedArray);
        setGeneralFilter(null);
        return;
      } else if (min === "" && max === "") {
        setNftList(userNftsOwnedArray);
        setGeneralFilter(null);
        return;
      } else if (min === "0" && max === "0") {
        setNftList(userNftsOwnedArray);
        setGeneralFilter(null);
        return;
      } else if (
        (Number(min) === 0 || min === "") &&
        Number(max) !== 0 &&
        max !== ""
      ) {
        const filterPrices = userNftsOwnedArray.filter((item) => {
          if (item.price) {
            return (
              (item.price / 10 ** 18) * cfxPrice >= Number(min) ||
              (item.price / 10 ** 18) * cfxPrice <= Number(max)
            );
          }
        });

        setNftList(filterPrices);
      } else {
        const filterPrices = userNftsOwnedArray.filter((item) => {
          if (item.price) {
            return (item.price / 10 ** 18) * cfxPrice >= Number(max);
          }
        });

        setNftList(filterPrices);
      }
    }

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const handleLikeStates = (tokenid, contractAddress) => {
    const stringTokenid = tokenid.toString();
    setLoading(true);
    handleRemoveFavoriteNft(stringTokenid, contractAddress).then(() => {
      fetchFavoriteCounts();
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    });
  };

  const handleAddCollections = (collection) => {
    if (userCollectionArrayFinal.includes(collection)) {
      const index = userCollectionArrayFinal.indexOf(collection);
      userCollectionArrayFinal.splice(index, 1);
    } else {
      userCollectionArrayFinal.push(collection);
    }

    setuserCollectionArrayFinal([...userCollectionArrayFinal]);
  };

  useEffect(() => {
    setuserCollectionArrayFinal([]);
  }, [option, favoritesOption]);

  const testFunc = () => {
    let uniqueObjects = [];
    let seenNames = new Set();

    userNftFavs.forEach((obj) => {
      let lowercaseName = obj.collectionName?.toLowerCase();
      if (!seenNames.has(lowercaseName)) {
        seenNames.add(lowercaseName);
        uniqueObjects.push(obj);
      }
    });

    setFavoriteOptions(uniqueObjects);
  };

  const testFuncCollected = () => {
    let uniqueObjects = [];
    let seenNames = new Set();
    if (userNftsOwnedArray && userNftsOwnedArray.length > 0) {
      userNftsOwnedArray.forEach((obj) => {
        let lowercaseName = obj.collectionName?.toLowerCase();
        if (!seenNames.has(lowercaseName)) {
          seenNames.add(lowercaseName);
          uniqueObjects.push(obj);
        }
      });

      setcollectedOptions(uniqueObjects);
    }
  };

  const testFuncListed = () => {
    let uniqueObjects = [];
    let seenNames = new Set();
    if (userNftsOwnedArray && userNftsOwnedArray.length > 0) {
      userNftsOwnedArray
        .filter((item) => {
          return item.price !== undefined;
        })
        .forEach((obj) => {
          let lowercaseName = obj.collectionName?.toLowerCase();
          if (!seenNames.has(lowercaseName)) {
            seenNames.add(lowercaseName);
            uniqueObjects.push(obj);
          }
        });

      setlistedOptions(uniqueObjects);
    }
  };

  const testFuncSaleHistory = () => {
    let uniqueObjects = [];
    let seenNames = new Set();
    if (saleHistory && saleHistory.length > 0) {
      saleHistory.forEach((obj) => {
        let lowercaseName = obj.collectionName?.toLowerCase();
        if (!seenNames.has(lowercaseName)) {
          seenNames.add(lowercaseName);
          uniqueObjects.push(obj);
        }
      });

      setsaleHistoryOptions(uniqueObjects);
    }
  };

  const testFuncOffersMadeNft = () => {
    let uniqueObjects = [];
    let seenNames = new Set();
    console.log(usersNftOffers);
    if (usersNftOffers && usersNftOffers.length > 0) {
      usersNftOffers.forEach((obj) => {
        let lowercaseName = obj.nftAddress?.toLowerCase();
        if (!seenNames.has(lowercaseName)) {
          seenNames.add(lowercaseName);
          uniqueObjects.push(obj);
        }
      });

      setuserOffersMadeNftOptions(uniqueObjects);
    }
  };

  const testFuncOffersMadeCollection = () => {
    let uniqueObjects = [];
    let seenNames = new Set();
    if (usersCollectionOffers && usersCollectionOffers.length > 0) {
      usersCollectionOffers.forEach((obj) => {
        let lowercaseName = obj.nftAddress?.toLowerCase();
        if (!seenNames.has(lowercaseName)) {
          seenNames.add(lowercaseName);
          uniqueObjects.push(obj);
        }
      });

      setuserOffersMadeCollectionOptions(uniqueObjects);
    }
  };

  useEffect(() => {
    testFuncOffersMadeCollection();
  }, [usersCollectionOffers, option, loading]);

  useEffect(() => {
    testFuncOffersMadeNft();
  }, [usersNftOffers, option, loading]);

  useEffect(() => {
    testFunc();
  }, [userNftFavs, option, loading]);

  useEffect(() => {
    testFuncCollected();
    testFuncListed();
  }, [userNftsOwnedArray, option, loading]);

  useEffect(() => {
    testFuncSaleHistory();
  }, [saleHistory, option, loading]);

  useEffect(() => {
    if (option !== "favorites") {
      setNftList(userNftsOwnedArray);
    }
  }, [option, userNftsOwnedArray]);

  useEffect(() => {
    if (option === "activity") {
      setfavoritesOption("listings");
    }
  }, [option]);

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
              <span className="collection-info mb-0">
                {option === "collected"
                  ? getFormattedNumber(userNftsOwnedArray.length, 0)
                  : option === "favorites" && favoritesOption === "items"
                  ? userNftFavs.length
                  : option === "favorites" && favoritesOption === "collections"
                  ? userCollectionFavs.length
                  : option === "listed"
                  ? nftList.filter((obj) => {
                      return obj.price !== undefined;
                    }).length
                  : option === "hasOffers"
                  ? nftList.filter(({ tokenId: id1, nftAddress: nftAddr1 }) =>
                      allOffers.some(
                        ({ tokenId: id2, nftAddress: nftAddr2 }) =>
                          id1.toString() === id2.toString() &&
                          nftAddr1.toLowerCase() === nftAddr2.toLowerCase()
                      )
                    ).length
                  : option === "activity"
                  ? saleHistory.length
                  : option === "offersMade" && favoritesOption === "items"
                  ? usersNftOffers.length
                  : option === "offersMade" && favoritesOption === "collections"
                  ? usersCollectionOffers.length
                  : 0}
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
                    <img src={collectionsIcon} alt="" />
                    Collections
                  </button>
                </h2>
                {option === "listed" && (
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      {userNftsOwnedArray &&
                        userNftsOwnedArray.length > 0 &&
                        listedOptions.map((item, index) => {
                          return (
                            <FormGroup
                              key={index}
                              sx={{ display: "block !important" }}
                            >
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
                                    onChange={() => {
                                      handleAddCollections(item.nftAddress);
                                    }}
                                  />
                                }
                                label={item.collectionName}
                              />
                            </FormGroup>
                          );
                        })}
                    </div>
                  </div>
                )}

                {option === "activity" && (
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      {saleHistory &&
                        saleHistory.length > 0 &&
                        saleHistoryOptions.map((item, index) => {
                          return (
                            <FormGroup
                              key={index}
                              sx={{ display: "block !important" }}
                            >
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
                                    onChange={() => {
                                      handleAddCollections(item.nftAddress);
                                    }}
                                  />
                                }
                                label={item.collectionName}
                              />
                            </FormGroup>
                          );
                        })}
                    </div>
                  </div>
                )}

                {option === "collected" && (
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      {userCollectionArray &&
                        userCollectionArray.length > 0 &&
                        collectedOptions.map((item, index) => {
                          return (
                            <FormGroup key={index}>
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
                                    onChange={() => {
                                      handleAddCollections(item.nftAddress);
                                    }}
                                  />
                                }
                                label={item.collectionName}
                              />
                            </FormGroup>
                          );
                        })}
                    </div>
                  </div>
                )}
                {option === "favorites" && favoritesOption === "items" && (
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      {userNftFavs &&
                        userNftFavs.length > 0 &&
                        favoriteOptions.map((item, index) => {
                          return (
                            <FormGroup
                              sx={{ display: "block !important" }}
                              key={index}
                            >
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
                                    onChange={() => {
                                      handleAddCollections(
                                        item.contractAddress
                                      );
                                    }}
                                  />
                                }
                                label={item.collectionName}
                              />
                            </FormGroup>
                          );
                        })}
                    </div>
                  </div>
                )}
                {option === "favorites" &&
                  favoritesOption === "collections" && (
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        {userCollectionFavs &&
                          userCollectionFavs.length > 0 &&
                          userCollectionFavs.map((item, index) => {
                            return (
                              <FormGroup
                                sx={{ display: "block !important" }}
                                key={index}
                              >
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
                                      onChange={() => {
                                        handleAddCollections(item);
                                      }}
                                    />
                                  }
                                  label={
                                    allCollections.find((collection) => {
                                      return (
                                        collection.contractAddress.toLowerCase() ===
                                        item.toLowerCase()
                                      );
                                    })?.collectionName
                                  }
                                />
                              </FormGroup>
                            );
                          })}
                      </div>
                    </div>
                  )}

                {option === "offersMade" && favoritesOption === "items" && (
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      {usersNftOffers &&
                        usersNftOffers.length > 0 &&
                        userOffersMadeNftOptions.map((item, index) => {
                          return (
                            <FormGroup
                              key={index}
                              sx={{ display: "block !important" }}
                            >
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
                                    onChange={() => {
                                      handleAddCollections(item.nftAddress);
                                    }}
                                  />
                                }
                                label={item.collectionName}
                              />
                            </FormGroup>
                          );
                        })}
                    </div>
                  </div>
                )}

                {option === "offersMade" &&
                  favoritesOption === "collections" && (
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        {usersCollectionOffers &&
                          usersCollectionOffers.length > 0 &&
                          userOffersMadeCollectionOptions.map((item, index) => {
                            return (
                              <FormGroup
                                key={index}
                                sx={{ display: "block !important" }}
                              >
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
                                      onChange={() => {
                                        handleAddCollections(item.nftAddress);
                                      }}
                                    />
                                  }
                                  label={
                                    allCollections.find((obj) => {
                                      return (
                                        obj.contractAddress.toLowerCase() ===
                                        item.nftAddress.toLowerCase()
                                      );
                                    }).collectionName
                                  }
                                />
                              </FormGroup>
                            );
                          })}
                      </div>
                    </div>
                  )}

                {option === "hasOffers" && (
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      {allOffers &&
                        allOffers.length > 0 &&
                        userNftsOwnedArray &&
                        userNftsOwnedArray.length > 0 &&
                        userNftsOwnedArray
                          .filter(({ tokenId: id1, nftAddress: nftAddr1 }) =>
                            allOffers.some(
                              ({ tokenId: id2, nftAddress: nftAddr2 }) =>
                                id1.toString() === id2.toString() &&
                                nftAddr1.toLowerCase() ===
                                  nftAddr2.toLowerCase()
                            )
                          )
                          .map((item, index) => {
                            return (
                              <FormGroup
                                key={index}
                                sx={{ display: "block !important" }}
                              >
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
                                      onChange={() => {
                                        handleAddCollections(item.nftAddress);
                                      }}
                                    />
                                  }
                                  label={item.collectionName}
                                />
                              </FormGroup>
                            );
                          })}
                      {/* <button>test</button> */}
                    </div>
                  </div>
                )}
              </div>
              {(option !== "favorites" || option !== "offersMade") && (
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
                            min={0}
                          />
                          <span className="MuiTypography-root mb-0">to</span>
                          <input
                            type="text"
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
              )}
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-10">
          <div className="row">
            <div className=" col-lg-10 col-md-10 col-6">
              <div className="position-relative">
                <img src={searchIcon} alt="" className="search-icon" />
                <input
                  type="text"
                  className="search-input w-100"
                  placeholder="Search by name"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    handleSetNftList(e.target.value);
                  }}
                  onKeyDown={handleKeyPress({
                    type: "Search",
                    value: search,
                  })}
                />
              </div>
            </div>
            {/* <div className="col-3">
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
            </div>*/}
            <div className=" col-lg-2 col-md-2 col-6">
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
              ) : option === "offersMade" ? (
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
              ) : option === "activity" ? (
                <div className="grid-types-wrapper d-flex align-items-center justify-content-between">
                  <div
                    className={`grid-icon-wrapper ${
                      favoritesOption === "listings" &&
                      "grid-icon-wrapper-active"
                    } p-2 d-flex align-items-center justify-content-center`}
                    onClick={() => setfavoritesOption("listings")}
                    style={{ width: "50%" }}
                  >
                    Listings
                  </div>
                  <div
                    className={`grid-icon-wrapper ${
                      favoritesOption === "sales" && "grid-icon-wrapper-active"
                    } p-2 d-flex align-items-center justify-content-center`}
                    onClick={() => setfavoritesOption("sales")}
                    style={{ width: "50%" }}
                  >
                    Sales
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
              className={`small-cards-grid  mt-3 ${
                ((favoritesOption === "collections" &&
                  userCollectionFavs.length === 0) ||
                  (favoritesOption === "items" &&
                    userNftFavs.length === 0 &&
                    loading === false)) &&
                "d-flex align-items-center justify-content-center h-100"
              } `}
            >
              {favoritesOption === "items" ? (
                loading === true ? (
                  dummyCards.map((item, index) => (
                    <Skeleton
                      key={index}
                      variant="rounded"
                      width={"100%"}
                      height={250}
                    />
                  ))
                ) : favoritesOption === "items" &&
                  loading === false &&
                  userNftFavs &&
                  userNftFavs.length > 0 &&
                  userCollectionArrayFinal.length === 0 ? (
                  userNftFavs.map((item, index) => (
                    <div
                      className="recently-listed-card p-3 d-flex flex-column"
                      key={index}
                    >
                      <NavLink
                        to={`/nft/${item.tokenId}/${item.contractAddress}`}
                        style={{ textDecoration: "none" }}
                        className={"position-relative"}
                      >
                        {!item.isVideo && item.image ? (
                          <img
                            src={`https://cdnflux.dypius.com/${item.image}`}
                            className="card-img"
                            alt=""
                          />
                        ) : item.isVideo && item.image ? (
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
                          <img
                            src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                            className="card-img"
                            alt=""
                          />
                        )}

                        <div
                          className="position-absolute favorite-container"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleLikeStates(
                              item.tokenId,
                              item.contractAddress
                            );
                          }}
                        >
                          <div className="d-flex align-items-center position-relative gap-2">
                            <img src={redFavorite} alt="" className="fav-img" />
                            <span className="fav-count-active">
                              {
                                nftFinalArray.find((object) => {
                                  return (
                                    object.contractAddress ===
                                      item.contractAddress &&
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
                          {allCollections &&
                          allCollections.length > 0 &&
                          allCollections.find((obj) => {
                            return (
                              obj.contractAddress.toLowerCase() ===
                              item.contractAddress.toLowerCase()
                            );
                          }) ? (
                            allCollections.find((obj) => {
                              return (
                                obj.contractAddress.toLowerCase() ===
                                item.contractAddress.toLowerCase()
                              );
                            }).verified === "yes" ? (
                              <img src={checkIcon} alt="" className="ms-2" />
                            ) : (
                              <></>
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="d-flex align-items-center mt-2 gap-3">
                          <h6
                            className="cfx-price mb-0"
                            style={{ fontSize: "10px" }}
                          >
                            {recentlyListedNfts.find(
                              ({ tokenId: id1, nftAddress: nftAddr1 }) =>
                                id1?.toString() === item.tokenId?.toString() &&
                                nftAddr1?.toLowerCase() ===
                                  item.contractAddress?.toLowerCase()
                            )
                              ? getFormattedNumber(
                                  recentlyListedNfts.find(
                                    ({ tokenId: id1, nftAddress: nftAddr1 }) =>
                                      id1?.toString() ===
                                        item.tokenId?.toString() &&
                                      nftAddr1?.toLowerCase() ===
                                        item.contractAddress?.toLowerCase()
                                  ).price / 1e18
                                )
                              : "---"}{" "}
                            WCFX
                          </h6>
                          <span
                            className="usd-price"
                            style={{ fontSize: "9px" }}
                          >
                            (${" "}
                            {recentlyListedNfts.find(
                              ({ tokenId: id1, nftAddress: nftAddr1 }) =>
                                id1?.toString() === item.tokenId?.toString() &&
                                nftAddr1?.toLowerCase() ===
                                  item.contractAddress?.toLowerCase()
                            )
                              ? getFormattedNumber(
                                  (recentlyListedNfts.find(
                                    ({ tokenId: id1, nftAddress: nftAddr1 }) =>
                                      id1?.toString() ===
                                        item.tokenId?.toString() &&
                                      nftAddr1?.toLowerCase() ===
                                        item.contractAddress?.toLowerCase()
                                  ).price /
                                    1e18) *
                                    cfxPrice
                                )
                              : "---"}
                            )
                          </span>
                        </div>
                        <div className="mt-3">
                          <button className="buy-btn w-100">
                            View Details
                          </button>
                        </div>
                      </NavLink>
                    </div>
                  ))
                ) : favoritesOption === "items" &&
                  loading === false &&
                  userNftFavs &&
                  userNftFavs.length > 0 &&
                  userCollectionArrayFinal.length > 0 ? (
                  userNftFavs
                    .filter(({ contractAddress: nftAddr1 }) =>
                      userCollectionArrayFinal.some(
                        (obj) => nftAddr1.toLowerCase() === obj.toLowerCase()
                      )
                    )
                    .map((item, index) => (
                      <div
                        className="recently-listed-card p-3 d-flex flex-column"
                        key={index}
                      >
                        <NavLink
                          to={`/nft/${item.tokenId}/${item.contractAddress}`}
                          style={{ textDecoration: "none" }}
                          className={"position-relative"}
                        >
                          {!item.isVideo && item.image ? (
                            <img
                              src={`https://cdnflux.dypius.com/${item.image}`}
                              className="card-img"
                              alt=""
                            />
                          ) : item.isVideo && item.image ? (
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
                            <img
                              src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                              className="card-img"
                              alt=""
                            />
                          )}

                          <div
                            className="position-absolute favorite-container"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleLikeStates(
                                item.tokenId,
                                item.contractAddress
                              );
                            }}
                          >
                            <div className="d-flex align-items-center position-relative gap-2">
                              <img
                                src={redFavorite}
                                alt=""
                                className="fav-img"
                              />
                              <span className="fav-count-active">
                                {
                                  nftFinalArray.find((object) => {
                                    return (
                                      object.contractAddress ===
                                        item.contractAddress &&
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
                            {allCollections &&
                            allCollections.length > 0 &&
                            allCollections.find((obj) => {
                              return (
                                obj.contractAddress.toLowerCase() ===
                                item.contractAddress.toLowerCase()
                              );
                            }) ? (
                              allCollections.find((obj) => {
                                return (
                                  obj.contractAddress.toLowerCase() ===
                                  item.contractAddress.toLowerCase()
                                );
                              }).verified === "yes" ? (
                                <img src={checkIcon} alt="" className="ms-2" />
                              ) : (
                                <></>
                              )
                            ) : (
                              <></>
                            )}
                          </div>
                          <div className="d-flex align-items-center mt-2 gap-3">
                            <h6
                              className="cfx-price mb-0"
                              style={{ fontSize: "10px" }}
                            >
                              {recentlyListedNfts.find(
                                ({ tokenId: id1, nftAddress: nftAddr1 }) =>
                                  id1.toString() === item.tokenId.toString() &&
                                  nftAddr1.toLowerCase() ===
                                    item.contractAddress.toLowerCase()
                              )
                                ? getFormattedNumber(
                                    recentlyListedNfts.find(
                                      ({
                                        tokenId: id1,
                                        nftAddress: nftAddr1,
                                      }) =>
                                        id1.toString() ===
                                          item.tokenId.toString() &&
                                        nftAddr1.toLowerCase() ===
                                          item.contractAddress.toLowerCase()
                                    ).price / 1e18
                                  )
                                : "---"}{" "}
                              WCFX
                            </h6>
                            <span
                              className="usd-price"
                              style={{ fontSize: "9px" }}
                            >
                              (${" "}
                              {recentlyListedNfts.find(
                                ({ tokenId: id1, nftAddress: nftAddr1 }) =>
                                  id1.toString() === item.tokenId.toString() &&
                                  nftAddr1.toLowerCase() ===
                                    item.contractAddress.toLowerCase()
                              )
                                ? getFormattedNumber(
                                    (recentlyListedNfts.find(
                                      ({
                                        tokenId: id1,
                                        nftAddress: nftAddr1,
                                      }) =>
                                        id1.toString() ===
                                          item.tokenId.toString() &&
                                        nftAddr1.toLowerCase() ===
                                          item.contractAddress.toLowerCase()
                                    ).price /
                                      1e18) *
                                      cfxPrice
                                  )
                                : "---"}
                              )
                            </span>
                          </div>
                          <div className="mt-3">
                            <button className="buy-btn w-100">
                              View Details
                            </button>
                          </div>
                        </NavLink>
                      </div>
                    ))
                ) : (
                  <span className="text-white">
                    You haven't marked any NFT as a favorite
                  </span>
                )
              ) : userCollectionFavs &&
                userCollectionFavs.length > 0 &&
                userCollectionArrayFinal.length === 0 ? (
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
                          allCollections.find((collection) => {
                            return collection.contractAddress === item;
                          })?.featuredBannerPicture
                            ? `https://confluxapi.worldofdypians.com/${
                                allCollections.find((collection) => {
                                  return collection.contractAddress === item;
                                })?.featuredBannerPicture
                              }`
                            : require(`./assets/favoritesPlaceholder1.png`)
                        }
                        className="w-100 featured-collection-pic"
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
                          {allCollections &&
                          allCollections.length > 0 &&
                          allCollections.find((obj) => {
                            return (
                              obj.contractAddress.toLowerCase() ===
                              item.contractAddress.toLowerCase()
                            );
                          }) ? (
                            allCollections.find((obj) => {
                              return (
                                obj.contractAddress.toLowerCase() ===
                                item.contractAddress.toLowerCase()
                              );
                            }).verified === "yes" ? (
                              <img src={checkIcon} alt="" className="ms-2" />
                            ) : (
                              <></>
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                        <img src={star} alt="" />
                      </div>
                    </NavLink>
                  </div>
                ))
              ) : userCollectionFavs &&
                userCollectionFavs.length > 0 &&
                userCollectionArrayFinal.length > 0 ? (
                userCollectionFavs
                  .filter((obj2) =>
                    userCollectionArrayFinal.some(
                      (obj) => obj2.toLowerCase() === obj.toLowerCase()
                    )
                  )
                  .map((item, index) => (
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
                            allCollections.find((collection) => {
                              return collection.contractAddress === item;
                            })?.featuredBannerPicture
                              ? `https://confluxapi.worldofdypians.com/${
                                  allCollections.find((collection) => {
                                    return collection.contractAddress === item;
                                  })?.featuredBannerPicture
                                }`
                              : require(`./assets/favoritesPlaceholder1.png`)
                          }
                          className="w-100 featured-collection-pic"
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
                            {allCollections &&
                            allCollections.length > 0 &&
                            allCollections.find((obj) => {
                              return (
                                obj.contractAddress.toLowerCase() ===
                                item.contractAddress.toLowerCase()
                              );
                            }) ? (
                              allCollections.find((obj) => {
                                return (
                                  obj.contractAddress.toLowerCase() ===
                                  item.contractAddress.toLowerCase()
                                );
                              }).verified === "yes" ? (
                                <img src={checkIcon} alt="" className="ms-2" />
                              ) : (
                                <></>
                              )
                            ) : (
                              <></>
                            )}
                          </div>
                          <img src={star} alt="" />
                        </div>
                      </NavLink>
                    </div>
                  ))
              ) : (
                <span className="text-white">
                  This user hasn't marked any NFT collection as a favorite
                </span>
              )}
            </div>
          ) : option === "activity" &&
            userCollectionArrayFinal.length === 0 &&
            userCollectionArrayFinal2.length === 0 ? (
            <div className="nft-history-wrapper w-100 bg-transparent p-3">
              <div className="d-flex flex-column gap-2">
                {/* <span className="item-history-text"></span> */}
                <div className="single-nft-table-wrapper h-100">
                  {saleHistory && saleHistory.length > 0 && (
                    <table className="table item-history-table">
                      <thead className="item-history-table-thead">
                        <th className="item-history-table-th text-center">
                          Item
                        </th>
                        <th className="item-history-table-th text-center">
                          Event
                        </th>
                        <th className="item-history-table-th text-center">
                          Price
                        </th>
                        <th className="item-history-table-th text-center">
                          Seller
                        </th>
                        <th className="item-history-table-th text-center">
                          Buyer
                        </th>
                        <th className="item-history-table-th text-center">
                          Date
                        </th>
                      </thead>
                      <tbody>
                        {favoritesOption === "listings" &&
                          saleHistory
                            .filter((items) => {
                              return items.type !== "sale";
                            })
                            .map((item, index) => {
                              return (
                                <tr
                                  key={index}
                                  onClick={() =>
                                    navigate(
                                      `/nft/${item.tokenId}/${item.nftAddress}`
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <td className="item-history-table-td left-border">
                                    {!item.isVideo && item.image ? (
                                      <img
                                        src={`https://cdnflux.dypius.com/${item.image}`}
                                        className="table-img nftimg2"
                                        height={36}
                                        width={36}
                                        alt=""
                                      />
                                    ) : item.image && item.isVideo ? (
                                      <video
                                        src={`https://cdnflux.dypius.com/${item.image}`}
                                        alt=""
                                        className="table-img nftimg2"
                                        height={36}
                                        width={36}
                                        controlsList="nodownload"
                                        autoPlay={true}
                                        loop={true}
                                        muted="muted"
                                        playsInline={true}
                                      />
                                    ) : (
                                      <img
                                        src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                                        className="table-img nftimg2"
                                        alt=""
                                        height={36}
                                        width={36}
                                      />
                                    )}{" "}
                                    {item.tokenName} #{item.tokenId}
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
                                        <img
                                          src={checkIcon}
                                          alt=""
                                          className="ms-2"
                                        />
                                      ) : (
                                        <></>
                                      )
                                    ) : (
                                      <></>
                                    )}
                                  </td>
                                  <td className="item-history-table-td text-center">
                                    <img
                                      src={
                                        item.type === "sale"
                                          ? saleIcon
                                          : listIcon
                                      }
                                      alt=""
                                    />{" "}
                                    {item.type}
                                  </td>
                                  <td className="item-history-table-td text-center">
                                    {getFormattedNumber(item.amount / 1e18)}{" "}
                                    WCFX
                                  </td>
                                  <td className="item-history-table-td greentext text-center">
                                    <a
                                      href={`https://evm.confluxscan.net/address/${
                                        item.seller ?? item.owner
                                      }`}
                                      className="greentext"
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {shortAddress(item.seller ?? item.owner)}
                                    </a>
                                  </td>
                                  <td className="item-history-table-td greentext text-center">
                                    {item.buyer ? (
                                      <a
                                        href={`https://evm.confluxscan.net/address/${item.buyer}`}
                                        className="greentext"
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {shortAddress(item.buyer)}
                                      </a>
                                    ) : (
                                      "N/A"
                                    )}
                                  </td>
                                  <td className="item-history-table-td right-border text-center">
                                    {moment
                                      .duration(
                                        item.blockTimestamp * 1000 - Date.now()
                                      )
                                      .humanize(true)}
                                  </td>
                                </tr>
                              );
                            })}
                        {favoritesOption === "sales" &&
                          saleHistory
                            .filter((items) => {
                              return items.type === "sale";
                            })
                            .map((item, index) => {
                              return (
                                <tr
                                  key={index}
                                  onClick={() =>
                                    navigate(
                                      `/nft/${item.tokenId}/${item.nftAddress}`
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <td className="item-history-table-td left-border">
                                    {!item.isVideo && item.image ? (
                                      <img
                                        src={`https://cdnflux.dypius.com/${item.image}`}
                                        className="table-img nftimg2"
                                        height={36}
                                        width={36}
                                        alt=""
                                      />
                                    ) : item.image && item.isVideo ? (
                                      <video
                                        src={`https://cdnflux.dypius.com/${item.image}`}
                                        alt=""
                                        className="table-img nftimg2"
                                        height={36}
                                        width={36}
                                        controlsList="nodownload"
                                        autoPlay={true}
                                        loop={true}
                                        muted="muted"
                                        playsInline={true}
                                      />
                                    ) : (
                                      <img
                                        src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                                        className="table-img nftimg2"
                                        alt=""
                                        height={36}
                                        width={36}
                                      />
                                    )}{" "}
                                    {item.tokenName} #{item.tokenId}
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
                                        <img
                                          src={checkIcon}
                                          alt=""
                                          className="ms-2"
                                        />
                                      ) : (
                                        <></>
                                      )
                                    ) : (
                                      <></>
                                    )}
                                  </td>
                                  <td className="item-history-table-td text-center">
                                    <img
                                      src={
                                        item.type === "sale"
                                          ? saleIcon
                                          : listIcon
                                      }
                                      alt=""
                                    />{" "}
                                    {item.type}
                                  </td>
                                  <td className="item-history-table-td text-center">
                                    {getFormattedNumber(item.amount / 1e18)}{" "}
                                    WCFX
                                  </td>
                                  <td className="item-history-table-td greentext text-center">
                                    <a
                                      href={`https://evm.confluxscan.net/address/${
                                        item.seller ?? item.owner
                                      }`}
                                      className="greentext"
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {shortAddress(item.seller ?? item.owner)}
                                    </a>
                                  </td>
                                  <td className="item-history-table-td greentext text-center">
                                    {item.buyer ? (
                                      <a
                                        href={`https://evm.confluxscan.net/address/${item.buyer}`}
                                        className="greentext"
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {shortAddress(item.buyer)}
                                      </a>
                                    ) : (
                                      "N/A"
                                    )}
                                  </td>
                                  <td className="item-history-table-td right-border text-center">
                                    {moment
                                      .duration(
                                        item.blockTimestamp * 1000 - Date.now()
                                      )
                                      .humanize(true)}
                                  </td>
                                </tr>
                              );
                            })}
                      </tbody>
                    </table>
                  )}
                  {saleHistory && saleHistory.length === 0 && (
                    <span className="text-white d-flex justify-content-center w-100 h-100 align-items-center">
                      No activity yet
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : option === "activity" && userCollectionArrayFinal.length > 0 ? (
            <div className="nft-history-wrapper w-100 bg-transparent p-3">
              <div className="d-flex flex-column gap-2">
                {/* <span className="item-history-text"></span> */}
                <div className="single-nft-table-wrapper h-100">
                  {saleHistory && saleHistory.length > 0 && (
                    <table className="table item-history-table">
                      <thead className="item-history-table-thead">
                        <th className="item-history-table-th text-center">
                          Item
                        </th>
                        <th className="item-history-table-th text-center">
                          Event
                        </th>
                        <th className="item-history-table-th text-center">
                          Price
                        </th>
                        <th className="item-history-table-th text-center">
                          Seller
                        </th>
                        <th className="item-history-table-th text-center">
                          Buyer
                        </th>
                        <th className="item-history-table-th text-center">
                          Date
                        </th>
                      </thead>
                      <tbody>
                        {favoritesOption === "listings" &&
                          saleHistory
                            .filter((items) => {
                              return items.type !== "sale";
                            })
                            .filter(({ nftAddress: nftAddr1 }) =>
                              userCollectionArrayFinal.some(
                                (obj) =>
                                  nftAddr1.toLowerCase() === obj.toLowerCase()
                              )
                            )
                            .map((item, index) => {
                              return (
                                <tr
                                  key={index}
                                  onClick={() =>
                                    navigate(
                                      `/nft/${item.tokenId}/${item.nftAddress}`
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <td className="item-history-table-td left-border">
                                    {!item.isVideo && item.image ? (
                                      <img
                                        src={`https://cdnflux.dypius.com/${item.image}`}
                                        className="table-img nftimg2"
                                        height={36}
                                        width={36}
                                        alt=""
                                      />
                                    ) : item.image && item.isVideo ? (
                                      <video
                                        src={`https://cdnflux.dypius.com/${item.image}`}
                                        alt=""
                                        className="table-img nftimg2"
                                        height={36}
                                        width={36}
                                        controlsList="nodownload"
                                        autoPlay={true}
                                        loop={true}
                                        muted="muted"
                                        playsInline={true}
                                      />
                                    ) : (
                                      <img
                                        src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                                        className="table-img nftimg2"
                                        alt=""
                                        height={36}
                                        width={36}
                                      />
                                    )}{" "}
                                    {item.tokenName} #{item.tokenId}
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
                                        <img
                                          src={checkIcon}
                                          alt=""
                                          className="ms-2"
                                        />
                                      ) : (
                                        <></>
                                      )
                                    ) : (
                                      <></>
                                    )}
                                  </td>
                                  <td className="item-history-table-td text-center">
                                    <img
                                      src={
                                        item.type === "sale"
                                          ? saleIcon
                                          : listIcon
                                      }
                                      alt=""
                                    />{" "}
                                    {item.type}
                                  </td>
                                  <td className="item-history-table-td text-center">
                                    {getFormattedNumber(item.amount / 1e18)}{" "}
                                    WCFX
                                  </td>
                                  <td className="item-history-table-td greentext text-center">
                                    <a
                                      href={`https://evm.confluxscan.net/address/${
                                        item.seller ?? item.owner
                                      }`}
                                      className="greentext"
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {shortAddress(item.seller ?? item.owner)}
                                    </a>
                                  </td>
                                  <td className="item-history-table-td greentext text-center">
                                    {item.buyer ? (
                                      <a
                                        href={`https://evm.confluxscan.net/address/${item.buyer}`}
                                        className="greentext"
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {shortAddress(item.buyer)}
                                      </a>
                                    ) : (
                                      "N/A"
                                    )}
                                  </td>
                                  <td className="item-history-table-td right-border text-center">
                                    {moment
                                      .duration(
                                        item.blockTimestamp * 1000 - Date.now()
                                      )
                                      .humanize(true)}
                                  </td>
                                </tr>
                              );
                            })}
                        {favoritesOption === "sales" &&
                          saleHistory
                            .filter((items) => {
                              return items.type === "sale";
                            })
                            .filter(({ nftAddress: nftAddr1 }) =>
                              userCollectionArrayFinal.some(
                                (obj) =>
                                  nftAddr1.toLowerCase() === obj.toLowerCase()
                              )
                            )
                            .map((item, index) => {
                              return (
                                <tr
                                  key={index}
                                  onClick={() =>
                                    navigate(
                                      `/nft/${item.tokenId}/${item.nftAddress}`
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <td className="item-history-table-td left-border">
                                    {!item.isVideo && item.image ? (
                                      <img
                                        src={`https://cdnflux.dypius.com/${item.image}`}
                                        className="table-img nftimg2"
                                        height={36}
                                        width={36}
                                        alt=""
                                      />
                                    ) : item.image && item.isVideo ? (
                                      <video
                                        src={`https://cdnflux.dypius.com/${item.image}`}
                                        alt=""
                                        className="table-img nftimg2"
                                        height={36}
                                        width={36}
                                        controlsList="nodownload"
                                        autoPlay={true}
                                        loop={true}
                                        muted="muted"
                                        playsInline={true}
                                      />
                                    ) : (
                                      <img
                                        src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                                        className="table-img nftimg2"
                                        alt=""
                                        height={36}
                                        width={36}
                                      />
                                    )}{" "}
                                    {item.tokenName} #{item.tokenId}
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
                                        <img
                                          src={checkIcon}
                                          alt=""
                                          className="ms-2"
                                        />
                                      ) : (
                                        <></>
                                      )
                                    ) : (
                                      <></>
                                    )}
                                  </td>
                                  <td className="item-history-table-td text-center">
                                    <img
                                      src={
                                        item.type === "sale"
                                          ? saleIcon
                                          : listIcon
                                      }
                                      alt=""
                                    />{" "}
                                    {item.type}
                                  </td>
                                  <td className="item-history-table-td text-center">
                                    {getFormattedNumber(item.amount / 1e18)}{" "}
                                    WCFX
                                  </td>
                                  <td className="item-history-table-td greentext text-center">
                                    <a
                                      href={`https://evm.confluxscan.net/address/${
                                        item.seller ?? item.owner
                                      }`}
                                      className="greentext"
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {shortAddress(item.seller ?? item.owner)}
                                    </a>
                                  </td>
                                  <td className="item-history-table-td greentext text-center">
                                    {item.buyer ? (
                                      <a
                                        href={`https://evm.confluxscan.net/address/${item.buyer}`}
                                        className="greentext"
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {shortAddress(item.buyer)}
                                      </a>
                                    ) : (
                                      "N/A"
                                    )}
                                  </td>
                                  <td className="item-history-table-td right-border text-center">
                                    {moment
                                      .duration(
                                        item.blockTimestamp * 1000 - Date.now()
                                      )
                                      .humanize(true)}
                                  </td>
                                </tr>
                              );
                            })}
                      </tbody>
                    </table>
                  )}
                  {saleHistory && saleHistory.length === 0 && (
                    <span className="text-secondary d-flex justify-content-center w-100 h-100 align-items-center">
                      No activity yet
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : option === "activity" && userCollectionArrayFinal2.length > 0 ? (
            <div className="nft-history-wrapper w-100 bg-transparent p-3">
              <div className="d-flex flex-column gap-2">
                {/* <span className="item-history-text"></span> */}
                <div className="single-nft-table-wrapper h-100">
                  {saleHistory &&
                    saleHistory.length > 0 &&
                    nftList &&
                    nftList.length > 0 && (
                      <table className="table item-history-table">
                        <thead className="item-history-table-thead">
                          <th className="item-history-table-th text-center">
                            Item
                          </th>
                          <th className="item-history-table-th text-center">
                            Event
                          </th>
                          <th className="item-history-table-th text-center">
                            Price
                          </th>
                          <th className="item-history-table-th text-center">
                            Seller
                          </th>
                          <th className="item-history-table-th text-center">
                            Buyer
                          </th>
                          <th className="item-history-table-th text-center">
                            Date
                          </th>
                        </thead>
                        <tbody>
                          {favoritesOption === "listings" &&
                          nftList
                            .filter((items) => {
                              return items.type !== "sale";
                            }).map((item, index) => {
                            return (
                              <tr
                                key={index}
                                onClick={() =>
                                  navigate(
                                    `/nft/${item.tokenId}/${item.nftAddress}`
                                  )
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <td className="item-history-table-td left-border">
                                  {!item.isVideo && item.image ? (
                                    <img
                                      src={`https://cdnflux.dypius.com/${item.image}`}
                                      className="table-img nftimg2"
                                      height={36}
                                      width={36}
                                      alt=""
                                    />
                                  ) : item.image && item.isVideo ? (
                                    <video
                                      src={`https://cdnflux.dypius.com/${item.image}`}
                                      alt=""
                                      className="table-img nftimg2"
                                      height={36}
                                      width={36}
                                      controlsList="nodownload"
                                      autoPlay={true}
                                      loop={true}
                                      muted="muted"
                                      playsInline={true}
                                    />
                                  ) : (
                                    <img
                                      src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                                      className="table-img nftimg2"
                                      alt=""
                                      height={36}
                                      width={36}
                                    />
                                  )}{" "}
                                  {item.tokenName} #{item.tokenId}
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
                                      <img
                                        src={checkIcon}
                                        alt=""
                                        className="ms-2"
                                      />
                                    ) : (
                                      <></>
                                    )
                                  ) : (
                                    <></>
                                  )}
                                </td>
                                <td className="item-history-table-td text-center">
                                  <img
                                    src={
                                      item.type === "sale" ? saleIcon : listIcon
                                    }
                                    alt=""
                                  />{" "}
                                  {item.type}
                                </td>
                                <td className="item-history-table-td text-center">
                                  {getFormattedNumber(item.amount / 1e18)} WCFX
                                </td>
                                <td className="item-history-table-td greentext text-center">
                                  <a
                                    href={`https://evm.confluxscan.net/address/${
                                      item.seller ?? item.owner
                                    }`}
                                    className="greentext"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {shortAddress(item.seller ?? item.owner)}
                                  </a>
                                </td>
                                <td className="item-history-table-td greentext text-center">
                                  {item.buyer ? (
                                    <a
                                      href={`https://evm.confluxscan.net/address/${item.buyer}`}
                                      className="greentext"
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {shortAddress(item.buyer)}
                                    </a>
                                  ) : (
                                    "N/A"
                                  )}
                                </td>
                                <td className="item-history-table-td right-border text-center">
                                  {moment
                                    .duration(
                                      item.blockTimestamp * 1000 - Date.now()
                                    )
                                    .humanize(true)}
                                </td>
                              </tr>
                            );
                          })}
                          {favoritesOption === "sales" &&
                          nftList
                            .filter((items) => {
                              return items.type === "sale";
                            }).map((item, index) => {
                            return (
                              <tr
                                key={index}
                                onClick={() =>
                                  navigate(
                                    `/nft/${item.tokenId}/${item.nftAddress}`
                                  )
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <td className="item-history-table-td left-border">
                                  {!item.isVideo && item.image ? (
                                    <img
                                      src={`https://cdnflux.dypius.com/${item.image}`}
                                      className="table-img nftimg2"
                                      height={36}
                                      width={36}
                                      alt=""
                                    />
                                  ) : item.image && item.isVideo ? (
                                    <video
                                      src={`https://cdnflux.dypius.com/${item.image}`}
                                      alt=""
                                      className="table-img nftimg2"
                                      height={36}
                                      width={36}
                                      controlsList="nodownload"
                                      autoPlay={true}
                                      loop={true}
                                      muted="muted"
                                      playsInline={true}
                                    />
                                  ) : (
                                    <img
                                      src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                                      className="table-img nftimg2"
                                      alt=""
                                      height={36}
                                      width={36}
                                    />
                                  )}{" "}
                                  {item.tokenName} #{item.tokenId}
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
                                      <img
                                        src={checkIcon}
                                        alt=""
                                        className="ms-2"
                                      />
                                    ) : (
                                      <></>
                                    )
                                  ) : (
                                    <></>
                                  )}
                                </td>
                                <td className="item-history-table-td text-center">
                                  <img
                                    src={
                                      item.type === "sale" ? saleIcon : listIcon
                                    }
                                    alt=""
                                  />{" "}
                                  {item.type}
                                </td>
                                <td className="item-history-table-td text-center">
                                  {getFormattedNumber(item.amount / 1e18)} WCFX
                                </td>
                                <td className="item-history-table-td greentext text-center">
                                  <a
                                    href={`https://evm.confluxscan.net/address/${
                                      item.seller ?? item.owner
                                    }`}
                                    className="greentext"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {shortAddress(item.seller ?? item.owner)}
                                  </a>
                                </td>
                                <td className="item-history-table-td greentext text-center">
                                  {item.buyer ? (
                                    <a
                                      href={`https://evm.confluxscan.net/address/${item.buyer}`}
                                      className="greentext"
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {shortAddress(item.buyer)}
                                    </a>
                                  ) : (
                                    "N/A"
                                  )}
                                </td>
                                <td className="item-history-table-td right-border text-center">
                                  {moment
                                    .duration(
                                      item.blockTimestamp * 1000 - Date.now()
                                    )
                                    .humanize(true)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  {saleHistory &&
                    saleHistory.length > 0 &&
                    nftList &&
                    nftList.length === 0 && (
                      <span className="text-white d-flex justify-content-center w-100 h-100 align-items-center">
                        There are no items avaliable with this filter
                      </span>
                    )}
                </div>
              </div>
            </div>
          ) : option === "offersMade" &&
            userCollectionArrayFinal.length === 0 &&
            favoritesOption === "collections" ? (
            <div className="nft-history-wrapper w-100 bg-transparent p-3">
              <div className="d-flex flex-column gap-2">
                {/* <span className="item-history-text"></span> */}
                <div className="single-nft-table-wrapper h-100">
                  {usersCollectionOffers &&
                    usersCollectionOffers.length > 0 && (
                      <table className="table item-history-table">
                        <thead className="item-history-table-thead">
                          <th className="item-history-table-th text-center">
                            Item
                          </th>

                          <th className="item-history-table-th text-center">
                            Price
                          </th>
                          <th className="item-history-table-th text-center">
                            Best Offer
                          </th>
                          <th className="item-history-table-th text-center">
                            Floor Price
                          </th>
                          <th className="item-history-table-th text-center">
                            Expiration
                          </th>

                          <th className="item-history-table-th text-center">
                            Action
                          </th>
                        </thead>
                        <tbody>
                          {usersCollectionOffers.map((item, index) => {
                            return (
                              <tr
                                key={index}
                                onClick={() =>
                                  navigate(
                                    `/collection/${item.nftAddress.toLowerCase()}/${
                                      item.symbol
                                    }`
                                  )
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <td className="item-history-table-td left-border">
                                  <img
                                    src={
                                      allCollections.find((obj) => {
                                        return (
                                          obj.contractAddress.toLowerCase() ===
                                          item.nftAddress.toLowerCase()
                                        );
                                      }).collectionProfilePic
                                        ? `https://confluxapi.worldofdypians.com/${
                                            allCollections.find((obj) => {
                                              return (
                                                obj.contractAddress.toLowerCase() ===
                                                item.nftAddress.toLowerCase()
                                              );
                                            }).collectionProfilePic
                                          }`
                                        : require(`./assets/favoritesPlaceholder1.png`)
                                    }
                                    className="table-img nftimg2 me-2"
                                    height={36}
                                    width={36}
                                    alt=""
                                  />

                                  {allCollections.find((obj) => {
                                    return (
                                      obj.contractAddress.toLowerCase() ===
                                      item.nftAddress.toLowerCase()
                                    );
                                  }).collectionName ?? "Collection name"}
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
                                      <img
                                        src={checkIcon}
                                        alt=""
                                        className="ms-2"
                                      />
                                    ) : (
                                      <></>
                                    )
                                  ) : (
                                    <></>
                                  )}
                                </td>
                                <td className="item-history-table-td text-center">
                                  {getFormattedNumber(item.amount / 1e18)} WCFX
                                </td>
                                <td className="item-history-table-td text-center">
                                  {getFormattedNumber(item.bestOffer / 1e18)}{" "}
                                  WCFX
                                </td>
                                <td className="item-history-table-td text-center">
                                  {getFormattedNumber(
                                    allCollections.find((obj) => {
                                      return (
                                        obj.contractAddress.toLowerCase() ===
                                        item.nftAddress.toLowerCase()
                                      );
                                    }).floorPrice ?? 0 / 1e18
                                  )}{" "}
                                  WCFX
                                </td>

                                <td className="item-history-table-td greentext text-center">
                                  {moment
                                    .duration(
                                      item.expiresAt * 1000 - Date.now()
                                    )
                                    .humanize(true)}
                                </td>
                                <td className="item-history-table-td right-border text-center">
                                  <button
                                    className={` px-3 py-1 
                                    active-accept-btn
                                   `}
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                </div>
              </div>
            </div>
          ) : option === "offersMade" &&
            userCollectionArrayFinal.length > 0 &&
            favoritesOption === "collections" ? (
            <div className="nft-history-wrapper w-100 bg-transparent p-3">
              <div className="d-flex flex-column gap-2">
                {/* <span className="item-history-text"></span> */}
                <div className="single-nft-table-wrapper h-100">
                  {usersCollectionOffers &&
                    usersCollectionOffers.length > 0 && (
                      <table className="table item-history-table">
                        <thead className="item-history-table-thead">
                          <th className="item-history-table-th text-center">
                            Item
                          </th>

                          <th className="item-history-table-th text-center">
                            Price
                          </th>
                          <th className="item-history-table-th text-center">
                            Best Offer
                          </th>
                          <th className="item-history-table-th text-center">
                            Floor Price
                          </th>
                          <th className="item-history-table-th text-center">
                            Expiration
                          </th>

                          <th className="item-history-table-th text-center">
                            Action
                          </th>
                        </thead>
                        <tbody>
                          {usersCollectionOffers
                            .filter(({ nftAddress: nftAddr1 }) =>
                              userCollectionArrayFinal.some(
                                (obj) =>
                                  nftAddr1.toLowerCase() === obj.toLowerCase()
                              )
                            )
                            .map((item, index) => {
                              return (
                                <tr
                                  key={index}
                                  onClick={() =>
                                    navigate(
                                      `/collection/${item.nftAddress.toLowerCase()}/${
                                        item.symbol
                                      }`
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <td className="item-history-table-td left-border">
                                    <img
                                      src={
                                        allCollections.find((obj) => {
                                          return (
                                            obj.contractAddress.toLowerCase() ===
                                            item.nftAddress.toLowerCase()
                                          );
                                        }).collectionProfilePic
                                          ? `https://confluxapi.worldofdypians.com/${
                                              allCollections.find((obj) => {
                                                return (
                                                  obj.contractAddress.toLowerCase() ===
                                                  item.nftAddress.toLowerCase()
                                                );
                                              }).collectionProfilePic
                                            }`
                                          : require(`./assets/favoritesPlaceholder1.png`)
                                      }
                                      className="table-img nftimg2 me-2"
                                      height={36}
                                      width={36}
                                      alt=""
                                    />

                                    {allCollections.find((obj) => {
                                      return (
                                        obj.contractAddress.toLowerCase() ===
                                        item.nftAddress.toLowerCase()
                                      );
                                    }).collectionName ?? "Collection name"}
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
                                        <img
                                          src={checkIcon}
                                          alt=""
                                          className="ms-2"
                                        />
                                      ) : (
                                        <></>
                                      )
                                    ) : (
                                      <></>
                                    )}
                                  </td>
                                  <td className="item-history-table-td text-center">
                                    {getFormattedNumber(item.amount / 1e18)}{" "}
                                    WCFX
                                  </td>
                                  <td className="item-history-table-td text-center">
                                    {getFormattedNumber(item.bestOffer / 1e18)}{" "}
                                    WCFX
                                  </td>
                                  <td className="item-history-table-td text-center">
                                    {getFormattedNumber(
                                      allCollections.find((obj) => {
                                        return (
                                          obj.contractAddress.toLowerCase() ===
                                          item.nftAddress.toLowerCase()
                                        );
                                      }).floorPrice ?? 0 / 1e18
                                    )}{" "}
                                    WCFX
                                  </td>

                                  <td className="item-history-table-td greentext text-center">
                                    {moment
                                      .duration(
                                        item.expiresAt * 1000 - Date.now()
                                      )
                                      .humanize(true)}
                                  </td>
                                  <td className="item-history-table-td right-border text-center">
                                    <button
                                      className={` px-3 py-1 
                                      active-accept-btn
                                     `}
                                    >
                                      View
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    )}
                  {usersCollectionOffers &&
                    usersCollectionOffers.length === 0 && (
                      <span className="text-secondary d-flex justify-content-center w-100 h-100 align-items-center">
                        No activity yet
                      </span>
                    )}
                </div>
              </div>
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
                    {option === "collected" &&
                      userNftsOwnedArray &&
                      userCollectionArrayFinal.length === 0 &&
                      userNftsOwnedArray.length > 0 &&
                      nftList.map((item, index) => (
                        <tr
                          className="nft-table-row p-1"
                          key={index}
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate(`/nft/${item.tokenId}/${item.nftAddress}`)
                          }
                        >
                          <td
                            className="table-item col-2 d-flex align-items-center gap-1 w-100"
                            // scope="row"
                          >
                            {!item.isVideo && item.image ? (
                              <img
                                src={`https://cdnflux.dypius.com/${item.image}`}
                                className="table-img nftimg2"
                                height={36}
                                width={36}
                                alt=""
                              />
                            ) : item.image && item.isVideo ? (
                              <video
                                src={`https://cdnflux.dypius.com/${item.image}`}
                                alt=""
                                className="table-img nftimg2"
                                height={36}
                                width={36}
                                controlsList="nodownload"
                                autoPlay={true}
                                loop={true}
                                muted="muted"
                                playsInline={true}
                              />
                            ) : (
                              <img
                                src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                                className="table-img nftimg2"
                                alt=""
                                height={36}
                                width={36}
                              />
                            )}
                            {item.tokenName} #{item.tokenId}
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
                                <img src={checkIcon} alt="" className="ms-2" />
                              ) : (
                                <></>
                              )
                            ) : (
                              <></>
                            )}
                          </td>
                          <td className="table-item col-2">
                            {item.price
                              ? getFormattedNumber(item.price / 1e18)
                              : "---"}{" "}
                            WCFX
                          </td>
                          <td className="table-item col-2">
                            {getFormattedNumber(
                              allNFTSOffer.find((obj) => {
                                return (
                                  obj.nftAddress === item.nftAddress &&
                                  item.tokenId === obj.tokenId
                                );
                              })
                                ? allNFTSOffer.find((obj) => {
                                    return (
                                      obj.nftAddress === item.nftAddress &&
                                      item.tokenId === obj.tokenId
                                    );
                                  }).bestOffer / 1e18
                                : 0
                            )}{" "}
                            WCFX
                          </td>
                          <td className="table-item col-2">
                            {item.lastSale === 0
                              ? getFormattedNumber(0)
                              : getFormattedNumber(
                                  item.lastSale.amount / 1e18
                                )}{" "}
                            WCFX{" "}
                          </td>
                          <td className="table-item col-2">
                            <a
                              href={`https://evm.confluxscan.net/address/${
                                item.owner ?? item.seller
                              }`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-white"
                            >
                              {shortAddress(item.owner ?? item.seller)}
                            </a>
                          </td>
                          <td className="table-item col-2">
                            {item.blockTimestamp
                              ? moment
                                  .duration(
                                    item.blockTimestamp * 1000 - Date.now()
                                  )
                                  .humanize(true)
                              : "N/A"}
                          </td>
                        </tr>
                      ))}

                    {option === "collected" &&
                      userNftsOwnedArray &&
                      userCollectionArrayFinal.length > 0 &&
                      userNftsOwnedArray.length > 0 &&
                      nftList
                        .filter(({ nftAddress: nftAddr1 }) =>
                          userCollectionArrayFinal.some(
                            (obj) =>
                              nftAddr1.toLowerCase() === obj.toLowerCase()
                          )
                        )
                        .map((item, index) => (
                          <tr
                            className="nft-table-row p-1"
                            key={index}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(
                                `/nft/${item.tokenId}/${item.nftAddress}`
                              )
                            }
                          >
                            <td
                              className="table-item col-2 d-flex align-items-center gap-1 w-100"
                              // scope="row"
                            >
                              {!item.isVideo && item.image ? (
                                <img
                                  src={`https://cdnflux.dypius.com/${item.image}`}
                                  className="table-img nftimg2"
                                  height={36}
                                  width={36}
                                  alt=""
                                />
                              ) : item.image && item.isVideo ? (
                                <video
                                  src={`https://cdnflux.dypius.com/${item.image}`}
                                  alt=""
                                  className="table-img nftimg2"
                                  height={36}
                                  width={36}
                                  controlsList="nodownload"
                                  autoPlay={true}
                                  loop={true}
                                  muted="muted"
                                  playsInline={true}
                                />
                              ) : (
                                <img
                                  src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                                  className="table-img nftimg2"
                                  alt=""
                                  height={36}
                                  width={36}
                                />
                              )}
                              {item.tokenName} #{item.tokenId}
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
                                  <img
                                    src={checkIcon}
                                    alt=""
                                    className="ms-2"
                                  />
                                ) : (
                                  <></>
                                )
                              ) : (
                                <></>
                              )}
                            </td>
                            <td className="table-item col-2">
                              {item.price
                                ? getFormattedNumber(item.price / 1e18)
                                : "---"}{" "}
                              WCFX
                            </td>
                            <td className="table-item col-2">
                              {" "}
                              {getFormattedNumber(
                                allNFTSOffer.find((obj) => {
                                  return (
                                    obj.nftAddress === item.nftAddress &&
                                    item.tokenId === obj.tokenId
                                  );
                                })
                                  ? allNFTSOffer.find((obj) => {
                                      return (
                                        obj.nftAddress === item.nftAddress &&
                                        item.tokenId === obj.tokenId
                                      );
                                    }).bestOffer / 1e18
                                  : 0
                              )}
                              WCFX
                            </td>
                            <td className="table-item col-2">
                              {item.lastSale === 0
                                ? getFormattedNumber(0)
                                : getFormattedNumber(
                                    item.lastSale.amount / 1e18
                                  )}{" "}
                              WCFX{" "}
                            </td>
                            <td className="table-item col-2">
                              <a
                                href={`https://evm.confluxscan.net/address/${
                                  item.owner ?? item.seller
                                }`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-white"
                              >
                                {shortAddress(item.owner ?? item.seller)}
                              </a>
                            </td>
                            <td className="table-item col-2">
                              {item.blockTimestamp
                                ? moment
                                    .duration(
                                      item.blockTimestamp * 1000 - Date.now()
                                    )
                                    .humanize(true)
                                : "N/A"}
                            </td>
                          </tr>
                        ))}

                    {option === "listed" &&
                      userCollectionArrayFinal.length > 0 &&
                      userNftsOwnedArray &&
                      userNftsOwnedArray.length > 0 &&
                      userNftsOwnedArray.find((obj) => {
                        return obj.price !== undefined;
                      }) &&
                      nftList
                        .filter(({ nftAddress: nftAddr1 }) =>
                          userCollectionArrayFinal.some(
                            (obj) =>
                              nftAddr1.toLowerCase() === obj.toLowerCase()
                          )
                        )
                        .filter((obj) => {
                          return obj.price !== undefined;
                        })
                        .map((item, index) => (
                          <tr
                            className="nft-table-row p-1"
                            key={index}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(
                                `/nft/${item.tokenId}/${item.nftAddress}`
                              )
                            }
                          >
                            <td
                              className="table-item col-2 d-flex align-items-center gap-1 w-100"
                              // scope="row"
                            >
                              {!item.isVideo && item.image ? (
                                <img
                                  src={`https://cdnflux.dypius.com/${item.image}`}
                                  className="table-img nftimg2"
                                  height={36}
                                  width={36}
                                  alt=""
                                />
                              ) : item.isVideo && item.image ? (
                                <video
                                  src={`https://cdnflux.dypius.com/${item.image}`}
                                  alt=""
                                  className="table-img nftimg2"
                                  height={36}
                                  width={36}
                                  controlsList="nodownload"
                                  autoPlay={true}
                                  loop={true}
                                  muted="muted"
                                  playsInline={true}
                                />
                              ) : (
                                <img
                                  src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                                  className="table-img nftimg2"
                                  width={36}
                                  height={36}
                                  alt=""
                                />
                              )}
                              {item.tokenName} #{item.tokenId}
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
                                  <img
                                    src={checkIcon}
                                    alt=""
                                    className="ms-2"
                                  />
                                ) : (
                                  <></>
                                )
                              ) : (
                                <></>
                              )}
                            </td>
                            <td className="table-item col-2">
                              {item.price
                                ? getFormattedNumber(item.price / 1e18)
                                : "---"}{" "}
                              WCFX
                            </td>
                            <td className="table-item col-2">
                              {getFormattedNumber(
                                allNFTSOffer.find((obj) => {
                                  return (
                                    obj.nftAddress === item.nftAddress &&
                                    item.tokenId === obj.tokenId
                                  );
                                })
                                  ? allNFTSOffer.find((obj) => {
                                      return (
                                        obj.nftAddress === item.nftAddress &&
                                        item.tokenId === obj.tokenId
                                      );
                                    }).bestOffer / 1e18
                                  : 0
                              )}{" "}
                              WCFX
                            </td>
                            <td className="table-item col-2">
                              {item.lastSale === 0
                                ? getFormattedNumber(0)
                                : getFormattedNumber(
                                    item.lastSale.amount / 1e18
                                  )}{" "}
                              WCFX{" "}
                            </td>
                            <td className="table-item col-2">
                              <a
                                href={`https://evm.confluxscan.net/address/${
                                  item.owner ?? item.seller
                                }`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-white"
                              >
                                {shortAddress(item.owner ?? item.seller)}
                              </a>
                            </td>
                            <td className="table-item col-2">
                              {item.blockTimestamp
                                ? moment
                                    .duration(
                                      item.blockTimestamp * 1000 - Date.now()
                                    )
                                    .humanize(true)
                                : "N/A"}
                            </td>
                          </tr>
                        ))}

                    {option === "listed" &&
                      userCollectionArrayFinal.length === 0 &&
                      userNftsOwnedArray &&
                      userNftsOwnedArray.length > 0 &&
                      nftList.find((obj) => {
                        return obj.price !== undefined;
                      }) &&
                      nftList
                        .filter((obj) => {
                          return obj.price !== undefined;
                        })
                        .map((item, index) => (
                          <tr
                            className="nft-table-row p-1"
                            key={index}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(
                                `/nft/${item.tokenId}/${item.nftAddress}`
                              )
                            }
                          >
                            <td
                              className="table-item col-2 d-flex align-items-center gap-1 w-100"
                              // scope="row"
                            >
                              {!item.isVideo && item.image ? (
                                <img
                                  src={`https://cdnflux.dypius.com/${item.image}`}
                                  className="table-img nftimg2"
                                  height={36}
                                  width={36}
                                  alt=""
                                />
                              ) : item.isVideo && item.image ? (
                                <video
                                  src={`https://cdnflux.dypius.com/${item.image}`}
                                  alt=""
                                  className="table-img nftimg2"
                                  height={36}
                                  width={36}
                                  controlsList="nodownload"
                                  autoPlay={true}
                                  loop={true}
                                  muted="muted"
                                  playsInline={true}
                                />
                              ) : (
                                <img
                                  src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                                  className="table-img nftimg2"
                                  width={36}
                                  height={36}
                                  alt=""
                                />
                              )}
                              {item.tokenName} #{item.tokenId}
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
                                  <img
                                    src={checkIcon}
                                    alt=""
                                    className="ms-2"
                                  />
                                ) : (
                                  <></>
                                )
                              ) : (
                                <></>
                              )}
                            </td>
                            <td className="table-item col-2">
                              {item.price
                                ? getFormattedNumber(item.price / 1e18)
                                : "---"}{" "}
                              WCFX
                            </td>
                            <td className="table-item col-2">
                              {getFormattedNumber(
                                allNFTSOffer.find((obj) => {
                                  return (
                                    obj.nftAddress === item.nftAddress &&
                                    item.tokenId === obj.tokenId
                                  );
                                })
                                  ? allNFTSOffer.find((obj) => {
                                      return (
                                        obj.nftAddress === item.nftAddress &&
                                        item.tokenId === obj.tokenId
                                      );
                                    }).bestOffer / 1e18
                                  : 0
                              )}{" "}
                              WCFX
                            </td>
                            <td className="table-item col-2">
                              {item.lastSale === 0
                                ? getFormattedNumber(0)
                                : getFormattedNumber(
                                    item.lastSale.amount / 1e18
                                  )}{" "}
                              WCFX{" "}
                            </td>
                            <td className="table-item col-2">
                              <a
                                href={`https://evm.confluxscan.net/address/${
                                  item.owner ?? item.seller
                                }`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-white"
                              >
                                {shortAddress(item.owner ?? item.seller)}
                              </a>
                            </td>
                            <td className="table-item col-2">
                              {item.blockTimestamp
                                ? moment
                                    .duration(
                                      item.blockTimestamp * 1000 - Date.now()
                                    )
                                    .humanize(true)
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                    {option === "hasOffers" &&
                      allOffers &&
                      userCollectionArrayFinal.length === 0 &&
                      allOffers.length > 0 &&
                      nftList
                        .filter(({ tokenId: id1, nftAddress: nftAddr1 }) =>
                          allOffers.some(
                            ({ tokenId: id2, nftAddress: nftAddr2 }) =>
                              id1.toString() === id2.toString() &&
                              nftAddr1.toLowerCase() === nftAddr2.toLowerCase()
                          )
                        )

                        .map((item, index) => (
                          <tr
                            className="nft-table-row p-1"
                            key={index}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(
                                `/nft/${item.tokenId}/${item.nftAddress}`
                              )
                            }
                          >
                            <td
                              className="table-item col-2 d-flex align-items-center gap-1 w-100"
                              // scope="row"
                            >
                              {!item.isVideo && item.image ? (
                                <img
                                  src={`https://cdnflux.dypius.com/${item.image}`}
                                  className="table-img nftimg2"
                                  height={36}
                                  width={36}
                                  alt=""
                                />
                              ) : item.isVideo && item.image ? (
                                <video
                                  src={`https://cdnflux.dypius.com/${item.image}`}
                                  alt=""
                                  className="table-img nftimg2"
                                  height={36}
                                  width={36}
                                  controlsList="nodownload"
                                  autoPlay={true}
                                  loop={true}
                                  muted="muted"
                                  playsInline={true}
                                />
                              ) : (
                                <img
                                  src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                                  className="table-img nftimg2"
                                  width={36}
                                  height={36}
                                  alt=""
                                />
                              )}
                              {item.tokenName} #{item.tokenId}
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
                                  <img
                                    src={checkIcon}
                                    alt=""
                                    className="ms-2"
                                  />
                                ) : (
                                  <></>
                                )
                              ) : (
                                <></>
                              )}
                            </td>
                            <td className="table-item col-2">
                              {item.price
                                ? getFormattedNumber(item.price / 1e18)
                                : "---"}{" "}
                              WCFX
                            </td>
                            <td className="table-item col-2">
                              {getFormattedNumber(bestOffer.amount / 1e18)} WCFX
                            </td>
                            <td className="table-item col-2">
                              {item.lastSale === 0
                                ? getFormattedNumber(0)
                                : getFormattedNumber(
                                    item.lastSale.amount / 1e18
                                  )}{" "}
                              WCFX{" "}
                            </td>
                            <td className="table-item col-2">
                              <a
                                href={`https://evm.confluxscan.net/address/${
                                  item.owner ?? item.seller
                                }`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-white"
                              >
                                {shortAddress(item.owner ?? item.seller)}
                              </a>
                            </td>
                            <td className="table-item col-2">
                              {item.blockTimestamp
                                ? moment
                                    .duration(
                                      item.blockTimestamp * 1000 - Date.now()
                                    )
                                    .humanize(true)
                                : "--"}
                            </td>
                          </tr>
                        ))}

                    {option === "hasOffers" &&
                      allOffers &&
                      userCollectionArrayFinal.length > 0 &&
                      allOffers.length > 0 &&
                      nftList
                        .filter(({ tokenId: id1, nftAddress: nftAddr1 }) =>
                          allOffers.some(
                            ({ tokenId: id2, nftAddress: nftAddr2 }) =>
                              id1.toString() === id2.toString() &&
                              nftAddr1.toLowerCase() === nftAddr2.toLowerCase()
                          )
                        )
                        .filter(({ nftAddress: nftAddr1 }) =>
                          userCollectionArrayFinal.some(
                            (obj) =>
                              nftAddr1.toLowerCase() === obj.toLowerCase()
                          )
                        )
                        .map((item, index) => (
                          <tr
                            className="nft-table-row p-1"
                            key={index}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(
                                `/nft/${item.tokenId}/${item.nftAddress}`
                              )
                            }
                          >
                            <td
                              className="table-item col-2 d-flex align-items-center gap-1 w-100"
                              // scope="row"
                            >
                              {!item.isVideo && item.image ? (
                                <img
                                  src={`https://cdnflux.dypius.com/${item.image}`}
                                  className="table-img nftimg2"
                                  height={36}
                                  width={36}
                                  alt=""
                                />
                              ) : item.isVideo && item.image ? (
                                <video
                                  src={`https://cdnflux.dypius.com/${item.image}`}
                                  alt=""
                                  className="table-img nftimg2"
                                  height={36}
                                  width={36}
                                  controlsList="nodownload"
                                  autoPlay={true}
                                  loop={true}
                                  muted="muted"
                                  playsInline={true}
                                />
                              ) : (
                                <img
                                  src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                                  className="table-img nftimg2"
                                  width={36}
                                  height={36}
                                  alt=""
                                />
                              )}
                              {item.tokenName} #{item.tokenId}
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
                                  <img
                                    src={checkIcon}
                                    alt=""
                                    className="ms-2"
                                  />
                                ) : (
                                  <></>
                                )
                              ) : (
                                <></>
                              )}
                            </td>
                            <td className="table-item col-2">
                              {item.price
                                ? getFormattedNumber(item.price / 1e18)
                                : "---"}{" "}
                              WCFX
                            </td>
                            <td className="table-item col-2">
                              {getFormattedNumber(bestOffer.amount / 1e18)} WCFX
                            </td>
                            <td className="table-item col-2">
                              {item.lastSale === 0
                                ? getFormattedNumber(0)
                                : getFormattedNumber(
                                    item.lastSale.amount / 1e18
                                  )}{" "}
                              WCFX{" "}
                            </td>
                            <td className="table-item col-2">
                              <a
                                href={`https://evm.confluxscan.net/address/${
                                  item.owner ?? item.seller
                                }`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-white"
                              >
                                {shortAddress(item.owner ?? item.seller)}
                              </a>
                            </td>
                            <td className="table-item col-2">
                              {item.blockTimestamp
                                ? moment
                                    .duration(
                                      item.blockTimestamp * 1000 - Date.now()
                                    )
                                    .humanize(true)
                                : "--"}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              ) : option === "collected" &&
                userNftsOwnedArray &&
                userCollectionArrayFinal.length === 0 &&
                userNftsOwnedArray.length > 0 ? (
                nftList.map((item, index) => (
                  <div
                    className="recently-listed-card p-3 d-flex flex-column test"
                    key={index}
                  >
                    <NavLink
                      to={`/nft/${item.tokenId}/${item.nftAddress}`}
                      style={{ textDecoration: "none" }}
                      className={"position-relative"}
                    >
                      {!item.isVideo && item.image ? (
                        <img
                          src={`https://cdnflux.dypius.com/${item.image}`}
                          className="card-img card-img2"
                          alt=""
                        />
                      ) : item.isVideo && item.image ? (
                        <video
                          src={`https://cdnflux.dypius.com/${item.image}`}
                          alt=""
                          className="card-img card-img2"
                          controlsList="nodownload"
                          autoPlay={true}
                          loop={true}
                          muted="muted"
                          playsInline={true}
                        />
                      ) : (
                        <img
                          src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                          className="card-img card-img2"
                          alt=""
                        />
                      )}
                      {/* <div
                          className="position-absolute favorite-container"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleLikeStates(
                              item.tokenId,
                              item.contractAddress
                            );
                          }}
                        >
                          <div className="d-flex align-items-center position-relative gap-2">
                            <img
                              src={emptyFavorite}
                              alt=""
                              className="fav-img"
                            />
                            <span className="fav-count">222</span>
                          </div>
                        </div> */}
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <h6
                          className="recently-listed-title mb-0"
                          style={{ fontSize: "12px" }}
                        >
                          {item.tokenName} #{item.tokenId}
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
                            <img src={checkIcon} alt="" className="ms-2" />
                          ) : (
                            <></>
                          )
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="d-flex align-items-center mt-2 gap-3">
                        <h6
                          className="cfx-price mb-0"
                          style={{ fontSize: "10px" }}
                        >
                          {item.price
                            ? getFormattedNumber(item.price / 1e18)
                            : "---"}{" "}
                          WCFX
                        </h6>
                        <span className="usd-price" style={{ fontSize: "9px" }}>
                          {" "}
                          $(
                          {item.price
                            ? getFormattedNumber((item.price / 1e18) * cfxPrice)
                            : "---"}
                          )
                        </span>
                      </div>
                      <div className="mt-3">
                        <button className="buy-btn w-100">View Details</button>
                      </div>
                    </NavLink>
                  </div>
                ))
              ) : option === "collected" &&
                userNftsOwnedArray &&
                userCollectionArrayFinal.length > 0 &&
                userNftsOwnedArray.length > 0 ? (
                nftList
                  .filter(({ nftAddress: nftAddr1 }) =>
                    userCollectionArrayFinal.some(
                      (obj) => nftAddr1.toLowerCase() === obj.toLowerCase()
                    )
                  )
                  .map((item, index) => (
                    <div
                      className="recently-listed-card p-3 d-flex flex-column test"
                      key={index}
                    >
                      <NavLink
                        to={`/nft/${item.tokenId}/${item.nftAddress}`}
                        style={{ textDecoration: "none" }}
                        className={"position-relative"}
                      >
                        {!item.isVideo && item.image ? (
                          <img
                            src={`https://cdnflux.dypius.com/${item.image}`}
                            className="card-img card-img2"
                            alt=""
                          />
                        ) : item.isVideo && item.image ? (
                          <video
                            src={`https://cdnflux.dypius.com/${item.image}`}
                            alt=""
                            className="card-img card-img2"
                            controlsList="nodownload"
                            autoPlay={true}
                            loop={true}
                            muted="muted"
                            playsInline={true}
                          />
                        ) : (
                          <img
                            src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                            className="card-img card-img2"
                            alt=""
                          />
                        )}
                        {/* <div
                        className="position-absolute favorite-container"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleLikeStates(
                            item.tokenId,
                            item.contractAddress
                          );
                        }}
                      >
                        <div className="d-flex align-items-center position-relative gap-2">
                          <img
                            src={emptyFavorite}
                            alt=""
                            className="fav-img"
                          />
                          <span className="fav-count">222</span>
                        </div>
                      </div> */}
                        <div className="d-flex align-items-center gap-2 mt-2">
                          <h6
                            className="recently-listed-title mb-0"
                            style={{ fontSize: "12px" }}
                          >
                            {item.tokenName} #{item.tokenId}
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
                              <img src={checkIcon} alt="" className="ms-2" />
                            ) : (
                              <></>
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="d-flex align-items-center mt-2 gap-3">
                          <h6
                            className="cfx-price mb-0"
                            style={{ fontSize: "10px" }}
                          >
                            {item.price
                              ? getFormattedNumber(item.price / 1e18)
                              : "---"}{" "}
                            WCFX
                          </h6>
                          <span
                            className="usd-price"
                            style={{ fontSize: "9px" }}
                          >
                            {" "}
                            $(
                            {item.price
                              ? getFormattedNumber(
                                  (item.price / 1e18) * cfxPrice
                                )
                              : "---"}
                            )
                          </span>
                        </div>
                        <div className="mt-3">
                          <button className="buy-btn w-100">
                            View Details
                          </button>
                        </div>
                      </NavLink>
                    </div>
                  ))
              ) : option === "hasOffers" &&
                allOffers &&
                allOffers.length > 0 &&
                userCollectionArrayFinal.length === 0 ? (
                nftList
                  .filter(({ tokenId: id1, nftAddress: nftAddr1 }) =>
                    allOffers.some(
                      ({ tokenId: id2, nftAddress: nftAddr2 }) =>
                        id1.toString() === id2.toString() &&
                        nftAddr1.toLowerCase() === nftAddr2.toLowerCase()
                    )
                  )
                  .map((item, index) => (
                    <div
                      className="recently-listed-card p-3 d-flex flex-column test"
                      key={index}
                    >
                      <NavLink
                        to={`/nft/${item.tokenId}/${item.nftAddress}`}
                        style={{ textDecoration: "none" }}
                        className={"position-relative"}
                      >
                        {!item.isVideo && item.image ? (
                          <img
                            src={`https://cdnflux.dypius.com/${item.image}`}
                            className="card-img card-img2"
                            alt=""
                          />
                        ) : item.isVideo && item.image ? (
                          <video
                            src={`https://cdnflux.dypius.com/${item.image}`}
                            alt=""
                            className="card-img card-img2"
                            controlsList="nodownload"
                            autoPlay={true}
                            loop={true}
                            muted="muted"
                            playsInline={true}
                          />
                        ) : (
                          <img
                            src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                            className="card-img card-img2"
                            alt=""
                          />
                        )}
                        {/* <div
                          className="position-absolute favorite-container"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleLikeStates(
                              item.tokenId,
                              item.contractAddress
                            );
                          }}
                        >
                          <div className="d-flex align-items-center position-relative gap-2">
                            <img
                              src={emptyFavorite}
                              alt=""
                              className="fav-img"
                            />
                            <span className="fav-count">222</span>
                          </div>
                        </div> */}
                        <div className="d-flex align-items-center gap-2 mt-2">
                          <h6
                            className="recently-listed-title mb-0"
                            style={{ fontSize: "12px" }}
                          >
                            {item.tokenName} #{item.tokenId}
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
                              <img src={checkIcon} alt="" className="ms-2" />
                            ) : (
                              <></>
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="d-flex align-items-center mt-2 gap-3">
                          <h6
                            className="cfx-price mb-0"
                            style={{ fontSize: "10px" }}
                          >
                            {item.price
                              ? getFormattedNumber(item.price / 1e18)
                              : "---"}{" "}
                            WCFX
                          </h6>
                          <span
                            className="usd-price"
                            style={{ fontSize: "9px" }}
                          >
                            {" "}
                            $(
                            {item.price
                              ? getFormattedNumber(
                                  (item.price / 1e18) * cfxPrice
                                )
                              : "---"}
                            )
                          </span>
                        </div>
                        <div className="mt-3">
                          <button className="buy-btn w-100">
                            View Details
                          </button>
                        </div>
                      </NavLink>
                    </div>
                  ))
              ) : option === "hasOffers" &&
                allOffers &&
                allOffers.length > 0 &&
                userCollectionArrayFinal.length > 0 ? (
                nftList
                  .filter(({ tokenId: id1, nftAddress: nftAddr1 }) =>
                    allOffers.some(
                      ({ tokenId: id2, nftAddress: nftAddr2 }) =>
                        id1.toString() === id2.toString() &&
                        nftAddr1.toLowerCase() === nftAddr2.toLowerCase()
                    )
                  )
                  .filter(({ nftAddress: nftAddr1 }) =>
                    userCollectionArrayFinal.some(
                      (obj) => nftAddr1.toLowerCase() === obj.toLowerCase()
                    )
                  )
                  .map((item, index) => (
                    <div
                      className="recently-listed-card p-3 d-flex flex-column test"
                      key={index}
                    >
                      <NavLink
                        to={`/nft/${item.tokenId}/${item.nftAddress}`}
                        style={{ textDecoration: "none" }}
                        className={"position-relative"}
                      >
                        {!item.isVideo && item.image ? (
                          <img
                            src={`https://cdnflux.dypius.com/${item.image}`}
                            className="card-img card-img2"
                            alt=""
                          />
                        ) : item.isVideo && item.image ? (
                          <video
                            src={`https://cdnflux.dypius.com/${item.image}`}
                            alt=""
                            className="card-img card-img2"
                            controlsList="nodownload"
                            autoPlay={true}
                            loop={true}
                            muted="muted"
                            playsInline={true}
                          />
                        ) : (
                          <img
                            src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                            className="card-img card-img2"
                            alt=""
                          />
                        )}
                        {/* <div
                          className="position-absolute favorite-container"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleLikeStates(
                              item.tokenId,
                              item.contractAddress
                            );
                          }}
                        >
                          <div className="d-flex align-items-center position-relative gap-2">
                            <img
                              src={emptyFavorite}
                              alt=""
                              className="fav-img"
                            />
                            <span className="fav-count">222</span>
                          </div>
                        </div> */}
                        <div className="d-flex align-items-center gap-2 mt-2">
                          <h6
                            className="recently-listed-title mb-0"
                            style={{ fontSize: "12px" }}
                          >
                            {item.tokenName} #{item.tokenId}
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
                              <img src={checkIcon} alt="" className="ms-2" />
                            ) : (
                              <></>
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="d-flex align-items-center mt-2 gap-3">
                          <h6
                            className="cfx-price mb-0"
                            style={{ fontSize: "10px" }}
                          >
                            {item.price
                              ? getFormattedNumber(item.price / 1e18)
                              : "---"}{" "}
                            WCFX
                          </h6>
                          <span
                            className="usd-price"
                            style={{ fontSize: "9px" }}
                          >
                            {" "}
                            $(
                            {item.price
                              ? getFormattedNumber(
                                  (item.price / 1e18) * cfxPrice
                                )
                              : "---"}
                            )
                          </span>
                        </div>
                        <div className="mt-3">
                          <button className="buy-btn w-100">
                            View Details
                          </button>
                        </div>
                      </NavLink>
                    </div>
                  ))
              ) : option === "listed" &&
                userNftsOwnedArray &&
                userCollectionArrayFinal.length === 0 &&
                userNftsOwnedArray.length > 0 &&
                nftList.find((obj) => {
                  return obj.price !== undefined;
                }) ? (
                nftList
                  .filter((obj) => {
                    return obj.price !== undefined;
                  })
                  .map((item, index) => (
                    <div
                      className="recently-listed-card p-3 d-flex flex-column test"
                      key={index}
                    >
                      <NavLink
                        to={`/nft/${item.tokenId}/${item.nftAddress}`}
                        style={{ textDecoration: "none" }}
                        className={"position-relative"}
                      >
                        {!item.isVideo && item.image ? (
                          <img
                            src={`https://cdnflux.dypius.com/${item.image}`}
                            className="card-img card-img2"
                            alt=""
                          />
                        ) : item.isVideo && item.image ? (
                          <video
                            src={`https://cdnflux.dypius.com/${item.image}`}
                            alt=""
                            className="card-img card-img2"
                            controlsList="nodownload"
                            autoPlay={true}
                            loop={true}
                            muted="muted"
                            playsInline={true}
                          />
                        ) : (
                          <img
                            src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                            className="card-img card-img2"
                            alt=""
                          />
                        )}
                        {/* <div
                          className="position-absolute favorite-container"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleLikeStates(
                              item.tokenId,
                              item.contractAddress
                            );
                          }}
                        >
                          <div className="d-flex align-items-center position-relative gap-2">
                            <img
                              src={emptyFavorite}
                              alt=""
                              className="fav-img"
                            />
                            <span className="fav-count">222</span>
                          </div>
                        </div> */}
                        <div className="d-flex align-items-center gap-2 mt-2">
                          <h6
                            className="recently-listed-title mb-0"
                            style={{ fontSize: "12px" }}
                          >
                            {item.tokenName} #{item.tokenId}
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
                              <img src={checkIcon} alt="" className="ms-2" />
                            ) : (
                              <></>
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="d-flex align-items-center mt-2 gap-3">
                          <h6
                            className="cfx-price mb-0"
                            style={{ fontSize: "10px" }}
                          >
                            {item.price
                              ? getFormattedNumber(item.price / 1e18)
                              : "---"}{" "}
                            WCFX
                          </h6>
                          <span
                            className="usd-price"
                            style={{ fontSize: "9px" }}
                          >
                            {" "}
                            $(
                            {item.price
                              ? getFormattedNumber(
                                  (item.price / 1e18) * cfxPrice
                                )
                              : "---"}
                            )
                          </span>
                        </div>
                        <div className="mt-3">
                          <button className="buy-btn w-100">
                            View Details
                          </button>
                        </div>
                      </NavLink>
                    </div>
                  ))
              ) : option === "listed" &&
                userNftsOwnedArray &&
                userCollectionArrayFinal.length > 0 &&
                userNftsOwnedArray.length > 0 &&
                nftList.find((obj) => {
                  return obj.price !== undefined;
                }) ? (
                nftList
                  .filter(({ nftAddress: nftAddr1 }) =>
                    userCollectionArrayFinal.some(
                      (obj) => nftAddr1.toLowerCase() === obj.toLowerCase()
                    )
                  )
                  .filter((obj) => {
                    return obj.price !== undefined;
                  })
                  .map((item, index) => (
                    <div
                      className="recently-listed-card p-3 d-flex flex-column test"
                      key={index}
                    >
                      <NavLink
                        to={`/nft/${item.tokenId}/${item.nftAddress}`}
                        style={{ textDecoration: "none" }}
                        className={"position-relative"}
                      >
                        {!item.isVideo && item.image ? (
                          <img
                            src={`https://cdnflux.dypius.com/${item.image}`}
                            className="card-img card-img2"
                            alt=""
                          />
                        ) : item.isVideo && item.image ? (
                          <video
                            src={`https://cdnflux.dypius.com/${item.image}`}
                            alt=""
                            className="card-img card-img2"
                            controlsList="nodownload"
                            autoPlay={true}
                            loop={true}
                            muted="muted"
                            playsInline={true}
                          />
                        ) : (
                          <img
                            src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                            className="card-img card-img2"
                            alt=""
                          />
                        )}
                        {/* <div
                            className="position-absolute favorite-container"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleLikeStates(
                                item.tokenId,
                                item.contractAddress
                              );
                            }}
                          >
                            <div className="d-flex align-items-center position-relative gap-2">
                              <img
                                src={emptyFavorite}
                                alt=""
                                className="fav-img"
                              />
                              <span className="fav-count">222</span>
                            </div>
                          </div> */}
                        <div className="d-flex align-items-center gap-2 mt-2">
                          <h6
                            className="recently-listed-title mb-0"
                            style={{ fontSize: "12px" }}
                          >
                            {item.tokenName} #{item.tokenId}
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
                              <img src={checkIcon} alt="" className="ms-2" />
                            ) : (
                              <></>
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="d-flex align-items-center mt-2 gap-3">
                          <h6
                            className="cfx-price mb-0"
                            style={{ fontSize: "10px" }}
                          >
                            {item.price
                              ? getFormattedNumber(item.price / 1e18)
                              : "---"}{" "}
                            WCFX
                          </h6>
                          <span
                            className="usd-price"
                            style={{ fontSize: "9px" }}
                          >
                            {" "}
                            $(
                            {item.price
                              ? getFormattedNumber(
                                  (item.price / 1e18) * cfxPrice
                                )
                              : "---"}
                            )
                          </span>
                        </div>
                        <div className="mt-3">
                          <button className="buy-btn w-100">
                            View Details
                          </button>
                        </div>
                      </NavLink>
                    </div>
                  ))
              ) : option === "offersMade" &&
                favoritesOption === "items" &&
                userCollectionArrayFinal.length === 0 &&
                usersNftOffers.length > 0 ? (
                usersNftOffers.map((item, index) => (
                  <div
                    className="recently-listed-card p-3 d-flex flex-column test"
                    key={index}
                  >
                    <NavLink
                      to={`/nft/${item.tokenId}/${item.nftAddress}`}
                      style={{ textDecoration: "none" }}
                      className={"position-relative"}
                    >
                      {!item.isVideo && item.image ? (
                        <img
                          src={`https://cdnflux.dypius.com/${item.image}`}
                          className="card-img card-img2"
                          alt=""
                        />
                      ) : item.isVideo && item.image ? (
                        <video
                          src={`https://cdnflux.dypius.com/${item.image}`}
                          alt=""
                          className="card-img card-img2"
                          controlsList="nodownload"
                          autoPlay={true}
                          loop={true}
                          muted="muted"
                          playsInline={true}
                        />
                      ) : (
                        <img
                          src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                          className="card-img card-img2"
                          alt=""
                        />
                      )}

                      <div className="d-flex align-items-center gap-2 mt-2">
                        <h6
                          className="recently-listed-title mb-0"
                          style={{ fontSize: "12px" }}
                        >
                          {item.tokenName} #{item.tokenId}
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
                            <img src={checkIcon} alt="" className="ms-2" />
                          ) : (
                            <></>
                          )
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="d-flex align-items-center mt-2 gap-3">
                        <h6
                          className="cfx-price mb-0"
                          style={{ fontSize: "10px" }}
                        >
                          My Offer:{" "}
                          {item.amount
                            ? getFormattedNumber(item.amount / 1e18)
                            : "---"}{" "}
                          WCFX
                        </h6>
                        <span className="usd-price" style={{ fontSize: "9px" }}>
                          {" "}
                          $(
                          {item.amount
                            ? getFormattedNumber(
                                (item.amount / 1e18) * cfxPrice
                              )
                            : "---"}
                          )
                        </span>
                      </div>
                      <div className="mt-3">
                        <button className="buy-btn w-100">View Details</button>
                      </div>
                    </NavLink>
                  </div>
                ))
              ) : option === "offersMade" &&
                favoritesOption === "items" &&
                userCollectionArrayFinal.length > 0 &&
                usersNftOffers.length > 0 ? (
                usersNftOffers
                  .filter(({ nftAddress: nftAddr1 }) =>
                    userCollectionArrayFinal.some(
                      (obj) => nftAddr1.toLowerCase() === obj.toLowerCase()
                    )
                  )
                  .map((item, index) => (
                    <div
                      className="recently-listed-card p-3 d-flex flex-column test"
                      key={index}
                    >
                      <NavLink
                        to={`/nft/${item.tokenId}/${item.nftAddress}`}
                        style={{ textDecoration: "none" }}
                        className={"position-relative"}
                      >
                        {!item.isVideo && item.image ? (
                          <img
                            src={`https://cdnflux.dypius.com/${item.image}`}
                            className="card-img card-img2"
                            alt=""
                          />
                        ) : item.isVideo && item.image ? (
                          <video
                            src={`https://cdnflux.dypius.com/${item.image}`}
                            alt=""
                            className="card-img card-img2"
                            controlsList="nodownload"
                            autoPlay={true}
                            loop={true}
                            muted="muted"
                            playsInline={true}
                          />
                        ) : (
                          <img
                            src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                            className="card-img card-img2"
                            alt=""
                          />
                        )}
                        {/* <div
                          className="position-absolute favorite-container"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleLikeStates(
                              item.tokenId,
                              item.contractAddress
                            );
                          }}
                        >
                          <div className="d-flex align-items-center position-relative gap-2">
                            <img
                              src={emptyFavorite}
                              alt=""
                              className="fav-img"
                            />
                            <span className="fav-count">222</span>
                          </div>
                        </div> */}
                        <div className="d-flex align-items-center gap-2 mt-2">
                          <h6
                            className="recently-listed-title mb-0"
                            style={{ fontSize: "12px" }}
                          >
                            {item.tokenName} #{item.tokenId}
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
                              <img src={checkIcon} alt="" className="ms-2" />
                            ) : (
                              <></>
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="d-flex align-items-center mt-2 gap-3">
                          <h6
                            className="cfx-price mb-0"
                            style={{ fontSize: "10px" }}
                          >
                            My Offer:{" "}
                            {item.amount
                              ? getFormattedNumber(item.amount / 1e18)
                              : "---"}{" "}
                            WCFX
                          </h6>
                          <span
                            className="usd-price"
                            style={{ fontSize: "9px" }}
                          >
                            {" "}
                            $(
                            {item.amount
                              ? getFormattedNumber(
                                  (item.amount / 1e18) * cfxPrice
                                )
                              : "---"}
                            )
                          </span>
                        </div>
                        <div className="mt-3">
                          <button className="buy-btn w-100">
                            View Details
                          </button>
                        </div>
                      </NavLink>
                    </div>
                  ))
              ) : (
                // dummyCards.map((item, index) => (
                //   <div
                //     className="recently-listed-card p-3 d-flex flex-column test"
                //     key={index}
                //   >
                //     <NavLink
                //       to={`/nft/0/0xd06cf9e1189feab09c844c597abc3767bc12608c`}
                //       style={{ textDecoration: "none" }}
                //       className={"position-relative"}
                //     >
                //       <img
                //         src={require(`./assets/nftPlaceholder${index + 1}.png`)}
                //         className="card-img card-img2"
                //         alt=""
                //       />
                //       <div
                //         className="position-absolute favorite-container"
                //         onClick={(e) => {
                //           e.stopPropagation();
                //           e.preventDefault();
                //           handleLikeStates(item.tokenId, item.contractAddress);
                //         }}
                //       >
                //         <div className="d-flex align-items-center position-relative gap-2">
                //           <img src={emptyFavorite} alt="" className="fav-img" />
                //           <span className="fav-count">222</span>
                //         </div>
                //       </div>
                //       <div className="d-flex align-items-center gap-2 mt-2">
                //         <h6
                //           className="recently-listed-title mb-0"
                //           style={{ fontSize: "12px" }}
                //         >
                //           CAWS #1125
                //         </h6>
                //         <img src={checkIcon} alt=""  className="ms-2"/>
                //       </div>
                //       <div className="d-flex align-items-center mt-2 gap-3">
                //         <h6
                //           className="cfx-price mb-0"
                //           style={{ fontSize: "10px" }}
                //         >
                //           1254.89 CFX
                //         </h6>
                //         <span className="usd-price" style={{ fontSize: "9px" }}>
                //           ($ 654,874.86)
                //         </span>
                //       </div>
                //       <div className="mt-3">
                //         <button className="buy-btn w-100">Buy</button>
                //       </div>
                //     </NavLink>
                //   </div>
                // ))
                <></>
              )}
            </div>
          )}
          {option === "collected" &&
            userNftsOwnedArray &&
            userNftsOwnedArray.length === 0 && (
              <span className="text-white d-flex w-100 align-items-center justify-content-center h-100">
                There are currently no NFTs in your wallet
              </span>
            )}
          {option === "collected" &&
            nftList &&
            nftList.length === 0 &&
            userCollectionArrayFinal.length > 0 && (
              <span className="text-white d-flex w-100 align-items-center justify-content-center h-100">
                There are no items avaliable with this filter
              </span>
            )}
          {option === "collected" && nftList && nftList.length === 0 && (
            <span className="text-white d-flex w-100 align-items-center justify-content-center h-100">
              There are no items avaliable with this filter
            </span>
          )}

          {option === "listed" &&
            userNftsOwnedArray &&
            !userNftsOwnedArray.find((obj) => {
              return obj.price !== undefined;
            }) && (
              <span className="text-white d-flex w-100 align-items-center justify-content-center h-100">
                There are currently no listed NFTs
              </span>
            )}
          {option === "listed" &&
            nftList &&
            nftList.length === 0 &&
            userCollectionArrayFinal.length > 0 && (
              <span className="text-white d-flex w-100 align-items-center justify-content-center h-100">
                There are no items avaliable with this filter
              </span>
            )}
          {option === "hasOffers" &&
            ((allOffers &&
              allOffers.length > 0 &&
              !userNftsOwnedArray.filter(
                ({ tokenId: id1, nftAddress: nftAddr1 }) =>
                  allOffers.some(
                    ({ tokenId: id2, nftAddress: nftAddr2 }) =>
                      id1.toString() === id2.toString() &&
                      nftAddr1.toLowerCase() === nftAddr2.toLowerCase()
                  )
              )) ||
              (allOffers && allOffers.length === 0)) && (
              <span className="text-white d-flex w-100 align-items-center justify-content-center h-100">
                There are currently no offers for your NFTs at the moment
              </span>
            )}
          {option === "hasOffers" &&
            userCollectionArrayFinal.length > 0 &&
            nftList &&
            nftList.length === 0 && (
              <span className="text-white d-flex w-100 align-items-center justify-content-center h-100">
                There are no items avaliable with this filter
              </span>
            )}

          {option === "offersMade" &&
            favoritesOption === "items" &&
            nftList &&
            nftList.length === 0 &&
            userCollectionArrayFinal.length > 0 && (
              <span className="text-white d-flex w-100 align-items-center justify-content-center h-100">
                There are no items avaliable with this filter
              </span>
            )}

          {option === "offersMade" &&
            favoritesOption === "items" &&
            usersNftOffers &&
            usersNftOffers.length === 0 && (
              <span className="text-white d-flex w-100 align-items-center justify-content-center h-100">
                You have not made any offers for any NFTs
              </span>
            )}
          {option === "offersMade" &&
            favoritesOption === "items" &&
            nftList &&
            nftList.length === 0 &&
            userCollectionArrayFinal.length > 0 && (
              <span className="text-white d-flex w-100 align-items-center justify-content-center h-100">
                There are no items avaliable with this filter
              </span>
            )}

          {option === "offersMade" &&
            favoritesOption === "collections" &&
            nftList &&
            nftList.length === 0 &&
            userCollectionArrayFinal.length > 0 && (
              <span className="text-white d-flex w-100 align-items-center justify-content-center h-100">
                There are no items avaliable with this filter
              </span>
            )}

          {option === "offersMade" &&
            favoritesOption === "collections" &&
            usersCollectionOffers &&
            usersCollectionOffers.length === 0 && (
              <span className="text-white d-flex w-100 align-items-center justify-content-center h-100">
                You have not made any collection offers
              </span>
            )}
          {option === "offersMade" &&
            favoritesOption === "collections" &&
            nftList &&
            nftList.length === 0 &&
            userCollectionArrayFinal.length > 0 && (
              <span className="text-white d-flex w-100 align-items-center justify-content-center h-100">
                There are no items avaliable with this filter
              </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfileNFTList;
