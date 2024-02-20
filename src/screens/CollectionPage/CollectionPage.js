import React, { useEffect, useState, useRef } from "react";
import "./_collectionpage.scss";
import CollectionBanner from "../../components/CollectionPage/CollectionBanner/CollectionBanner";
import CollectionList from "../../components/CollectionPage/CollectionList/CollectionList";
import banner from "../../components/CollectionPage/CollectionBanner/assets/bannerPlaceholder.png";
import collectionIcon from "../../components/CollectionPage/CollectionBanner/assets/cawsIcon.png";
import { useParams } from "react-router-dom";
import axios, { isCancel } from "axios";
import Web3 from "web3";
import getFormattedNumber from "../../hooks/get-formatted-number";
import moment from "moment";
import MakeOfferForCollection from "../../components/MakeOffer/MakeOfferForCollection";

const CollectionPage = ({
  coinbase,
  onFavoriteCollection,
  userCollectionFavs,
  userData,
  allCollections,
  userNftFavs,
  handleAddFavoriteNft,
  handleRemoveFavoriteNft,
  cfxPrice,
  onRefreshListings,
  isNewCollection,
  onNewCollectionFetched,
  wcfxBalance,
}) => {
  const [favorite, setFavorite] = useState(false);

  const [isVerified, setisVerified] = useState(false);
  const [currentCollection, setcurrentCollection] = useState([]);
  const [collectionSocials, setcollectionSocials] = useState([]);
  const [allNftArray, setAllNftArray] = useState([]);
  const [floorPrice, setfloorPrice] = useState();

  const [loading, setLoading] = useState(false);
  const [totalSupplyPerCollection, settotalSupplyPerCollection] = useState(0);
  const [hasListedNfts, sethasListedNfts] = useState(false);
  const [totalListedNfts, settotalListedNfts] = useState(0);
  const [collectionFeeRate, setcollectionFeeRate] = useState(0);
  const [uniqueOwners, setUniqueOwners] = useState(0);
  const [uniqueOwnersPercentage, setUniqueOwnersPercentage] = useState(0);
  const [recentlySoldNfts, setRecentlySoldNfts] = useState([]);
  const [filter, setFilter] = useState(null);
  const [next, setnext] = useState(12);
  const [nextSearch, setnextSearch] = useState(100);
  const [showOfferPopup, setshowOfferPopup] = useState(false);
  const [offerStatus, setOfferStatus] = useState("initial");

  const [offerdeleteStatus, setOfferdeleteStatus] = useState("initial");
  const [offerupdateStatus, setOfferupdateStatus] = useState("initial");
  const [offeracceptStatus, setOfferacceptStatus] = useState("initial");

  const [offerData, setofferData] = useState([]);
  const [bestOffer, setbestOffer] = useState([]);

  const { BigNumber } = window;
  const baseURL = "https://confluxapi.worldofdypians.com";
  const dataFetchedRef = useRef(false);
  const containerRef = useRef(false);

  const nftPerRow = 12;

  const { collectionAddress } = useParams();

  const collectionInfo = [
    {
      title: "Total Volume",
      value: getFormattedNumber(currentCollection.lifetimeVolume / 1e18 ?? 0),
      valueType: "WCFX",
    },
    {
      title: "Floor price",
      value: getFormattedNumber(floorPrice ?? 0),
      valueType: "WCFX",
    },
    {
      title: "Listed",
      value: getFormattedNumber(totalListedNfts ?? 0, 0),
      valueType: `${getFormattedNumber(
        totalSupplyPerCollection === 0
          ? 0
          : ((totalListedNfts ? totalListedNfts : 0) * 100) /
              totalSupplyPerCollection,
        2
      )}%`,
    },
    {
      title: "Owners (unique)",
      value: getFormattedNumber(uniqueOwners ?? 0, 0),
      valueType: `${getFormattedNumber(uniqueOwnersPercentage ?? 0, 0)}%`,
    },
  ];

  const getFilter = (val) => {
    setFilter(val);
  };

  const handleGetRecentlySoldNfts = async () => {
    const result = await axios
      .get(`${baseURL}/api/recent-sales`, {
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
      const recentlySold = await Promise.all(
        result.data
          .filter((item) => {
            return item.nftAddress.toLowerCase() == collectionAddress;
          })
          .map(async (item) => {
            let isApproved = false;
            const abiresult = await axios.get(
              `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${item.nftAddress}`
            );
            if (abiresult && abiresult.status === 200) {
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
                  ...nft_data,
                  image: `${nft_data.image}`,
                  tokenName: tokenName,
                  isApproved: isApproved,
                  seller: seller,
                  collectionName: collectionName,
                  price: item.amount,
                };
              } else
                return {
                  ...item,
                  image: undefined,
                  tokenName: tokenName,
                  seller: seller,
                  collectionName: collectionName,
                  price: item.amount,
                };
            }
          })
      );

      return recentlySold;
    }
  };

  const getCollectionTotalSupply = async () => {
    let totalSupply = 0;

    const result = await axios.get(
      `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${collectionAddress}`
    );

    if (result && result.status === 200) {
      const abi = JSON.parse(result.data.result);
      const web3 = window.confluxWeb3;
      const collection_contract = new web3.eth.Contract(abi, collectionAddress);
      if (result.data.result.includes("_totalSupply")) {
        totalSupply = await collection_contract.methods
          ._totalSupply()
          .call()
          .catch((e) => {
            console.error(e);
          });
      } else if (result.data.result.includes("totalSupply")) {
        totalSupply = await collection_contract.methods
          .totalSupply()
          .call()
          .catch((e) => {
            console.error(e);
          });
      }

      settotalSupplyPerCollection(totalSupply);
    }
  };

  const fetchSearchNftsPerCollection = async (tokenIdBySearch) => {
    console.log(tokenIdBySearch);
    // setLoading(true);

    const result = await axios.get(
      `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${collectionAddress}`
    );
    // const listednfts = await axios
    //   .get(`${baseURL}/api/collections/${collectionAddress}/listings`, {
    //     headers: {
    //       cascadestyling:
    //         "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
    //     },
    //   })
    //   .catch((e) => {
    //     console.error(e);
    //   });

    if (
      result &&
      result.status === 200 &&
      result.data.message === "OK"
      //  && listednfts &&
      //   listednfts.status === 200
    ) {
      //   let nftArray = [];
      //   let nftListedArray = [];
      let tokensArray = [];
      let totalSupply = 0;
      const abi = JSON.parse(result.data.result);
      //   const listednftsArray = listednfts.data.listings;
      const web3 = window.confluxWeb3;
      const collection_contract = new web3.eth.Contract(abi, collectionAddress);

      if (result.data.result.includes("_totalSupply")) {
        totalSupply = await collection_contract.methods
          ._totalSupply()
          .call()
          .catch((e) => {
            console.error(e);
          });
      } else if (result.data.result.includes("totalSupply")) {
        totalSupply = await collection_contract.methods
          .totalSupply()
          .call()
          .catch((e) => {
            console.error(e);
          });
      }

      if (totalSupply && totalSupply > 0) {
        const limit =
          Number(tokenIdBySearch) > nextSearch
            ? Number(tokenIdBySearch) * 2
            : nextSearch;
        await Promise.all(
          window
            .range(Number(tokenIdBySearch) - 1, limit - 1)
            .map(async (j) => {
              let tokenByIndex = 0;
              if (result.data.result.includes("tokenByIndex")) {
                tokenByIndex = await collection_contract.methods
                  .tokenByIndex(j)
                  .call()
                  .catch((e) => {
                    console.error(e);
                  });
              } else if (!result.data.result.includes("tokenByIndex")) {
                tokenByIndex = j;
              }
              if (tokenByIndex) {
                if (
                  tokenByIndex.toString().includes(tokenIdBySearch.toString())
                ) {
                  return tokensArray.push(tokenByIndex);
                }
              }
            })
        );
        console.log(tokensArray);
      }
      //     const limit = totalSupply >= 12 ? 12 : totalSupply;

      //     if (
      //       listednftsArray !== "none" &&
      //       listednftsArray &&
      //       listednftsArray.length > 0
      //     ) {
      //       // settotalListedNfts(listednftsArray.length);

      //       sethasListedNfts(true);
      //       await Promise.all(
      //         window.range(0, listednftsArray.length - 1).map(async (j) => {
      //           const nft_data_listed = await fetch(
      //             `https://cdnflux.dypius.com/collectionsmetadatas/${collectionAddress.toLowerCase()}/${
      //               listednftsArray[j].tokenId
      //             }/metadata.json`
      //           )
      //             .then((res) => res.json())
      //             .then((data) => {
      //               return data;
      //             })
      //             .catch((err) => {
      //               console.log(err.message);
      //             });

      //           const listingIndex = listednftsArray.findIndex(
      //             (object) =>
      //               object.nftAddress.toLowerCase() ===
      //                 collectionAddress.toLowerCase() &&
      //               object.tokenId === listednftsArray[j].tokenId
      //           );
      //           const isApprovedresult = await window
      //             .isApprovedBuy(listednftsArray[j].price)
      //             .catch((e) => {
      //               console.error(e);
      //             });
      //           const tokenName = await collection_contract.methods
      //             .symbol()
      //             .call()
      //             .catch((e) => {
      //               console.error(e);
      //             });

      //           const owner = await collection_contract.methods
      //             .ownerOf(listednftsArray[j].tokenId)
      //             .call()
      //             .catch((e) => {
      //               console.log(e);
      //             });

      //           const hasExpired = moment
      //             .duration(listednftsArray[j].expiresAt * 1000 - Date.now())
      //             .humanize(true)
      //             .includes("ago");

      //           if (
      //             !hasExpired &&
      //             owner?.toLowerCase() === listednftsArray[j].seller.toLowerCase()
      //           ) {
      //             if (
      //               nft_data_listed &&
      //               nft_data_listed.code !== 404 &&
      //               typeof nft_data_listed !== "string"
      //             ) {
      //               nftListedArray.push({
      //                 ...nft_data_listed,
      //                 ...listednftsArray[j],
      //                 listingIndex: listingIndex,
      //                 isApproved: isApprovedresult,
      //                 tokenName: tokenName,
      //               });
      //             }
      //           }
      //         })
      //       );
      //     }

      //     await Promise.all(
      //       window.range(0, limit - 1).map(async (i) => {
      //         let tokenByIndex = 0;
      //         if (result.data.result.includes("tokenByIndex")) {
      //           tokenByIndex = await collection_contract.methods
      //             .tokenByIndex(i)
      //             .call()
      //             .catch((e) => {
      //               console.error(e);
      //             });
      //         } else if (!result.data.result.includes("tokenByIndex")) {
      //           tokenByIndex = i;
      //         }
      //         const owner = await collection_contract.methods
      //           .ownerOf(tokenByIndex)
      //           .call()
      //           .catch((e) => {
      //             console.error(e);
      //           });

      //         const tokenName = await collection_contract.methods
      //           .symbol()
      //           .call()
      //           .catch((e) => {
      //             console.error(e);
      //           });

      //         const nft_data = await fetch(
      //           `https://cdnflux.dypius.com/collectionsmetadatas/${collectionAddress.toLowerCase()}/${tokenByIndex}/metadata.json`
      //         )
      //           .then((res) => res.json())
      //           .then((data) => {
      //             return data;
      //           })
      //           .catch((err) => {
      //             console.log(err.message);
      //           });
      //         if (
      //           nft_data &&
      //           nft_data.code !== 404 &&
      //           typeof nft_data !== "string"
      //         ) {
      //           // console.log('nft_data', nft_data);
      //           nftArray.push({
      //             ...nft_data,
      //             tokenId: Number(tokenByIndex),
      //             owner: owner,
      //             tokenName: tokenName,
      //           });
      //         } else {
      //           nftArray.push({
      //             tokenId: Number(tokenByIndex),
      //             name: `#${tokenByIndex}`,
      //             owner: owner,
      //             tokenName: tokenName,
      //             metadatas: false,
      //           });
      //         }
      //       })
      //     );

      //     const finalArray_sorted = nftArray.sort((a, b) => {
      //       return a.tokenId - b.tokenId;
      //     });

      //     const uniqueArray = finalArray_sorted.filter(
      //       ({ tokenId: id1 }) =>
      //         !nftListedArray.some(({ tokenId: id2 }) => id2 === id1.toString())
      //     );

      //     const finalArray = [...nftListedArray, ...uniqueArray];
      //     setAllNftArray(finalArray);
      //     setLoading(false);
      //   } else {
      //     setLoading(false);
      //     setAllNftArray([]);
      // }
    }
  };

  const fetchInitialNftsPerCollection = async () => {
    setLoading(true);

    const result = await axios.get(
      `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${collectionAddress}`
    );
    const listednfts = await axios
      .get(`${baseURL}/api/collections/${collectionAddress}/listings`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (
      result &&
      result.status === 200 &&
      listednfts &&
      listednfts.status === 200
    ) {
      let nftArray = [];
      let nftListedArray = [];
      let totalSupply = 0;

      const abi = JSON.parse(result.data.result);
      const listednftsArray = listednfts.data.listings;
      const web3 = window.confluxWeb3;
      const collection_contract = new web3.eth.Contract(abi, collectionAddress);

      if (result.data.result.includes("_totalSupply")) {
        totalSupply = await collection_contract.methods
          ._totalSupply()
          .call()
          .catch((e) => {
            console.error(e);
          });
      } else if (result.data.result.includes("totalSupply")) {
        totalSupply = await collection_contract.methods
          .totalSupply()
          .call()
          .catch((e) => {
            console.error(e);
          });
      }

      if (totalSupply && totalSupply > 0) {
        const limit = totalSupply >= 12 ? 12 : totalSupply;

        if (
          listednftsArray !== "none" &&
          listednftsArray &&
          listednftsArray.length > 0
        ) {
          settotalListedNfts(listednftsArray.length);
          sethasListedNfts(true);
          await Promise.all(
            window.range(0, listednftsArray.length - 1).map(async (j) => {
              let bestOfferListed = 0;
              let lastSaleListed = 0;

              const nft_data_listed = await fetch(
                `https://cdnflux.dypius.com/collectionsmetadatas/${collectionAddress.toLowerCase()}/${
                  listednftsArray[j].tokenId
                }/metadata.json`
              )
                .then((res) => res.json())
                .then((data) => {
                  return data;
                })
                .catch((err) => {
                  console.log(err.message);
                });

              const listingIndex = listednftsArray.findIndex(
                (object) =>
                  object.nftAddress.toLowerCase() ===
                    collectionAddress.toLowerCase() &&
                  object.tokenId === listednftsArray[j].tokenId
              );
              const isApprovedresult = await window
                .isApprovedBuy(listednftsArray[j].price)
                .catch((e) => {
                  console.error(e);
                });
              const tokenName = await collection_contract.methods
                .symbol()
                .call()
                .catch((e) => {
                  console.error(e);
                });

              const offersresultListed = await window
                .getAllOffers(
                  collectionAddress.toLowerCase(),
                  listednftsArray[j].tokenId
                )
                .catch((e) => {
                  console.log(e);
                });
              const finalOfferResultListed = offersresultListed[1];

              if (finalOfferResultListed && finalOfferResultListed.length > 0) {
                const maxPrice = Math.max(
                  ...finalOfferResultListed.map((o) => o.amount)
                );
                const obj = finalOfferResultListed.find(
                  (item) => item.amount == maxPrice
                );
                if (obj) {
                  bestOfferListed = obj.amount;
                }
              } else {
                bestOfferListed = 0;
              }

              const resultSale = await axios
                .get(
                  `${baseURL}/api/nft-sale-history/${collectionAddress.toLowerCase()}/${
                    listednftsArray[j].tokenId
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

              if (resultSale && resultSale.status === 200) {
                const historyArray = resultSale.data;
                const finalArray_sorted = historyArray.sort((a, b) => {
                  return b.blockTimestamp - a.blockTimestamp;
                });

                if (finalArray_sorted && finalArray_sorted.length > 0) {
                  lastSaleListed = finalArray_sorted[0].amount / 1e18;
                } else {
                  lastSaleListed = 0;
                }
              }

              const owner = await collection_contract.methods
                .ownerOf(listednftsArray[j].tokenId)
                .call()
                .catch((e) => {
                  console.log(e);
                });

              const hasExpired = moment
                .duration(listednftsArray[j].expiresAt * 1000 - Date.now())
                .humanize(true)
                .includes("ago");

              if (
                !hasExpired &&
                owner?.toLowerCase() === listednftsArray[j].seller.toLowerCase()
              ) {
                if (
                  nft_data_listed &&
                  nft_data_listed.code !== 404 &&
                  typeof nft_data_listed !== "string"
                ) {
                  nftListedArray.push({
                    ...nft_data_listed,
                    ...listednftsArray[j],
                    listingIndex: listingIndex,
                    isApproved: isApprovedresult,
                    tokenName: tokenName,
                    bestOffer: bestOfferListed,
                    lastSale: lastSaleListed,
                  });
                }
              }
            })
          );
        }

        await Promise.all(
          window.range(0, limit - 1).map(async (i) => {
            let tokenByIndex = 0;
            let bestOffer = 0;
            let lastSale = 0;
            if (result.data.result.includes("tokenByIndex")) {
              tokenByIndex = await collection_contract.methods
                .tokenByIndex(i)
                .call()
                .catch((e) => {
                  console.error(e);
                });
            } else if (!result.data.result.includes("tokenByIndex")) {
              tokenByIndex = i;
            }
            let finalOfferResult = [];
            const offersresult = await window
              .getAllOffers(collectionAddress.toLowerCase(), tokenByIndex)
              .catch((e) => {
                console.log(e);
              });
            finalOfferResult = offersresult[1];

            if (finalOfferResult && finalOfferResult.length > 0) {
              // finalArray = finalOfferResult.filter((object) => {
              //   return (
              //     object.offeror.toLowerCase() === coinbase.toLowerCase()
              //   );
              // });

              // let finalArrayIndex = finalOfferResult.findIndex((object) => {
              //   return object.offeror.toLowerCase() === coinbase.toLowerCase();
              // });

              // if (finalArray && finalArray.length > 0) {
              //   offerArray = finalArray.map((item) => {
              //     return { ...item, index: finalArrayIndex };
              //   });
              // }

              const maxPrice = Math.max(
                ...finalOfferResult.map((o) => o.amount)
              );

              const obj = finalOfferResult.find(
                (item) => item.amount == maxPrice
              );
              if (obj) {
                bestOffer = obj.amount;
              } else {
                bestOffer = 0;
              }
            } else {
              bestOffer = 0;
            }

            const resultSale = await axios
              .get(
                `${baseURL}/api/nft-sale-history/${collectionAddress.toLowerCase()}/${tokenByIndex}`,
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

            if (resultSale && resultSale.status === 200) {
              const historyArray = resultSale.data;
              const finalArray_sorted = historyArray.sort((a, b) => {
                return b.blockTimestamp - a.blockTimestamp;
              });

              if (finalArray_sorted && finalArray_sorted.length > 0) {
                lastSale = finalArray_sorted[0].amount / 1e18;
              } else {
                lastSale = 0;
              }
            }

            const owner = await collection_contract.methods
              .ownerOf(tokenByIndex)
              .call()
              .catch((e) => {
                console.error(e);
              });

            const tokenName = await collection_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });

            const nft_data = await fetch(
              `https://cdnflux.dypius.com/collectionsmetadatas/${collectionAddress.toLowerCase()}/${tokenByIndex}/metadata.json`
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
              // console.log('nft_data', nft_data);
              nftArray.push({
                ...nft_data,
                tokenId: Number(tokenByIndex),
                owner: owner,
                tokenName: tokenName,
                bestOffer: bestOffer,
                lastSale: lastSale,
              });
            } else {
              nftArray.push({
                tokenId: Number(tokenByIndex),
                name: `#${tokenByIndex}`,
                owner: owner,
                tokenName: tokenName,
                metadatas: false,
                bestOffer: bestOffer,
                lastSale: lastSale,
              });
            }
          })
        );

        const finalArray_sorted = nftArray.sort((a, b) => {
          return a.tokenId - b.tokenId;
        });

        const uniqueArray = finalArray_sorted.filter(
          ({ tokenId: id1 }) =>
            !nftListedArray.some(({ tokenId: id2 }) => id2 === id1.toString())
        );

        const finalArray = [...nftListedArray, ...uniqueArray];
        setAllNftArray(finalArray);
        setLoading(false);
      } else {
        setLoading(false);
        setAllNftArray([]);
      }
    }
  };

  const fetchSlicedNftsPerCollection = async () => {
    let nftArray = [];
    let totalSupply = 0;
    setLoading(true);

    const result = await axios.get(
      `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${collectionAddress}`
    );
    if (result && result.status === 200) {
      const abi = JSON.parse(result.data.result);
      const web3 = window.confluxWeb3;
      const collection_contract = new web3.eth.Contract(abi, collectionAddress);
      if (result.data.result.includes("_totalSupply")) {
        totalSupply = await collection_contract.methods
          ._totalSupply()
          .call()
          .catch((e) => {
            console.error(e);
          });
      } else if (result.data.result.includes("totalSupply")) {
        totalSupply = await collection_contract.methods
          .totalSupply()
          .call()
          .catch((e) => {
            console.error(e);
          });
      }

      if (totalSupply && totalSupply > 0) {
        const limit = totalSupply >= next ? next : totalSupply;
        await Promise.all(
          window.range(next - nftPerRow, limit - 1).map(async (i) => {
            let tokenByIndex = 0;
            let bestOffer = 0;
            let lastSale = 0;
            if (result.data.result.includes("tokenByIndex")) {
              tokenByIndex = await collection_contract.methods
                .tokenByIndex(i)
                .call()
                .catch((e) => {
                  console.error(e);
                });
            } else if (!result.data.result.includes("tokenByIndex")) {
              tokenByIndex = i;
            }

            let finalOfferResult = [];

            const offersresult = await window
              .getAllOffers(collectionAddress.toLowerCase(), tokenByIndex)
              .catch((e) => {
                console.log(e);
              });
            finalOfferResult = offersresult[1];

            if (finalOfferResult && finalOfferResult.length > 0) {
              // finalArray = finalOfferResult.filter((object) => {
              //   return (
              //     object.offeror.toLowerCase() === coinbase.toLowerCase()
              //   );
              // });

              // let finalArrayIndex = finalOfferResult.findIndex((object) => {
              //   return object.offeror.toLowerCase() === coinbase.toLowerCase();
              // });

              // if (finalArray && finalArray.length > 0) {
              //   offerArray = finalArray.map((item) => {
              //     return { ...item, index: finalArrayIndex };
              //   });
              // }

              const maxPrice = Math.max(
                ...finalOfferResult.map((o) => o.amount)
              );

              const obj = finalOfferResult.find(
                (item) => item.amount == maxPrice
              );
              if (obj) {
                bestOffer = obj.amount;
              } else {
                bestOffer = 0;
              }
            } else {
              bestOffer = 0;
            }

            const resultSale = await axios
              .get(
                `${baseURL}/api/nft-sale-history/${collectionAddress.toLowerCase()}/${tokenByIndex}`,
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

            if (resultSale && resultSale.status === 200) {
              const historyArray = resultSale.data;
              const finalArray_sorted = historyArray.sort((a, b) => {
                return b.blockTimestamp - a.blockTimestamp;
              });

              if (finalArray_sorted && finalArray_sorted.length > 0) {
                lastSale = finalArray_sorted[0].amount / 1e18;
              } else {
                lastSale = 0;
              }
            }

            const owner = await collection_contract.methods
              .ownerOf(tokenByIndex)
              .call()
              .catch((e) => {
                console.error(e);
              });

            const tokenName = await collection_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });

            const nft_data = await fetch(
              `https://cdnflux.dypius.com/collectionsmetadatas/${collectionAddress.toLowerCase()}/${tokenByIndex}/metadata.json`
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
              // console.log(nft_data);
              nftArray.push({
                ...nft_data,
                tokenId: Number(tokenByIndex),
                owner: owner,
                tokenName: tokenName,
                bestOffer: bestOffer,
                lastSale: lastSale,
              });
            }
          })
        );

        const finalArray_sorted = nftArray.sort((a, b) => {
          return a.tokenId - b.tokenId;
        });

        const finaldata = [...allNftArray, ...finalArray_sorted];
        setAllNftArray(finaldata);
        setLoading(false);
      }
    }
  };

  const loadMore = () => {
    setnext(next + nftPerRow);
  };

  const onScroll = () => {
    const wrappedElement = document.getElementById("header2");
    if (wrappedElement) {
      const isBottom =
        parseInt(wrappedElement.getBoundingClientRect()?.bottom) <=
        window.innerHeight;
      if (isBottom) {
        if (next <= totalSupplyPerCollection) {
          loadMore();
        }
      }
      document.removeEventListener("scroll", onScroll);
    }

    // const { clientHeight, scrollHeight, scrollTop } =
    //   document.documentElement || document.body;

    // // Adjust the threshold as needed
    // const threshold = 100;
    // console.log(scrollHeight, scrollTop, clientHeight);
    // if (scrollHeight - scrollTop - clientHeight < threshold) {
    //   // You've reached the bottom, trigger your API request here
    //   // console.log('Reached bottom, trigger API request');
    //   console.log("yes1", totalSupplyPerCollection);
    //   if (next <= totalSupplyPerCollection || next === 12) {
    //     console.log("yes2");

    //     setnext(next + nftPerRow);
    //     fetchSlicedNftsPerCollection();
    //   }

    //   // Optionally, you can remove the event listener to stop further calls
    //   window.removeEventListener("scroll", onScroll);
    // }
  };

  const fetchCurrentCollection = (collectionAddr) => {
    const result = allCollections.find((item) => {
      return item.contractAddress === collectionAddr;
    });
    if (result) {
      setcurrentCollection(result);

      const socialsObject = [
        { title: "website", link: result.websiteLink },
        { title: "twitter", link: result.twitterLink },
        { title: "instagram", link: result.instagramLink },
        { title: "discord", link: result.discordLink },
        { title: "telegram", link: result.tgLink },
        {
          title: "confluxScan",
          link: `https://evm.confluxscan.net/address/${collectionAddr}`,
        },
      ];

      setcollectionSocials(socialsObject);
    }
  };

  const checkifFavorite = () => {
    if (userCollectionFavs && userCollectionFavs.length > 0) {
      if (userCollectionFavs.find((obj) => obj === collectionAddress)) {
        setFavorite(true);
      } else {
        setFavorite(false);
      }
    }
  };

  const handleAddFavorite = async () => {
    if (coinbase && collectionAddress) {
      const data = {
        contractAddress: collectionAddress,
      };

      await axios
        .post(
          `https://confluxapi.worldofdypians.com/api/users/addCollectionFavorite/${coinbase}`,
          data,
          {
            headers: {
              cascadestyling:
                "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
            },
          }
        )
        .then(() => {
          setFavorite(true);
          onFavoriteCollection();
        })
        .catch((e) => {
          console.error(e);
          setFavorite(false);
        });
    }
  };

  const handleRemoveFavorite = async () => {
    if (coinbase && collectionAddress) {
      const data = {
        contractAddress: collectionAddress,
      };

      await axios
        .post(
          `https://confluxapi.worldofdypians.com/api/users/removeCollectionFavorite/${coinbase}`,
          data,
          {
            headers: {
              cascadestyling:
                "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
            },
          }
        )
        .then(() => {
          setFavorite(false);
          onFavoriteCollection();
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  const getCollectionFloorPrice = async () => {
    const result = await axios
      .get(`${baseURL}/api/floor-price/${collectionAddress}`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      setfloorPrice(result.data.floorPrice / 1e18);
    }
  };

  const getCollectionTotalVolume = async () => {
    const result = await axios
      .get(`${baseURL}/api/refresh-collection-volume/${collectionAddress}`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      
      // setfloorPrice(result.data.floorPrice / 1e18);
    }
  };

  const getCollectionInfo = async () => {
    const result = await axios
      .get(`${baseURL}/api/collection-info/${collectionAddress}`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      setcollectionFeeRate(result.data.collectionFeeRate / 10);
    }
  };

  const getCollectionUniqueOwners = async () => {
    const result = await axios
      .get(`${baseURL}/api/unique-owners/${collectionAddress}`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      setUniqueOwners(result.data.uniqueOwnersCount);
      setUniqueOwnersPercentage(result.data.uniqueOwnersPercentage);
    }
  };

  const getUserOffersForCollection = async () => {
    const result = await window
      .getAllCollectionOffers(collectionAddress)
      .catch((e) => {
        console.error(e);
      });
    if (result) {
      let finalArray = [];
      let offerArray = [];

      const finalResult = result[1];
      if (finalResult && finalResult.length > 0) {
        if (coinbase) {
          finalArray = finalResult.filter((object) => {
            return object.offeror.toLowerCase() === coinbase.toLowerCase();
          });

          let finalArrayIndex = finalResult.findIndex((object) => {
            return object.offeror.toLowerCase() === coinbase.toLowerCase();
          });

          if (finalArray && finalArray.length > 0) {
            offerArray = finalArray.map((item) => {
              return { ...item, index: finalArrayIndex };
            });
          }
          const maxPrice = Math.max(...finalResult.map((o) => o.amount));
          const obj = finalResult.find((item) => item.amount == maxPrice);
          setbestOffer(obj);
          if (offerArray && offerArray.length > 0) {
            const hasExpired2 = moment
              .duration(offerArray[0].expiresAt * 1000 - Date.now())
              .humanize(true)
              .includes("ago");
            if (!hasExpired2) {
              setofferData(...offerArray);
            } else setofferData([]);
          } else setofferData([]);
        }
      } else {
        setofferData([]);
      }
    }
  };
   
  const handleMakeOffer = async (price, duration) => {
    if (price !== "" && price !== 0) {
      setOfferStatus("loading");
      const newPrice = new BigNumber(price * 1e18).toFixed();
      console.log(collectionAddress, newPrice, duration);
      await window
        .makeCollectionOffer(collectionAddress, newPrice, duration)
        .then(() => {
          setOfferStatus("success");
          setTimeout(() => {
            setOfferStatus("initial");
            getUserOffersForCollection();
          }, 3000);
        })
        .catch((e) => {
          console.log(e);
          setOfferStatus("fail");
          setTimeout(() => {
            setOfferStatus("initial");
          }, 3000);
        });
    } else window.alertify.error("Please put a valid price!");
  };

  const handleUpdateOffer = async (price, offerIndex) => {
    if (price !== "" && price !== 0) {
      setOfferupdateStatus("loadingupdate");
      const newPrice = new BigNumber(price * 1e18).toFixed();
      await window
        .updateCollectionOffer(collectionAddress, offerIndex, newPrice)
        .then(() => {
          setOfferupdateStatus("successupdate");
          setTimeout(() => {
            setOfferupdateStatus("initial");
            getUserOffersForCollection();
          }, 3000);
        })
        .catch((e) => {
          console.log(e);
          setOfferupdateStatus("failupdate");
          setTimeout(() => {
            setOfferupdateStatus("initial");
          }, 3000);
        });
    } else window.alertify.error("Please put a valid price!");
  };

  const handleDeleteOffer = async (offerIndex) => {
    setOfferdeleteStatus("loadingdelete");
    await window
      .cancelCollectionOffer(collectionAddress, offerIndex)
      .then(() => {
        getUserOffersForCollection();
        setOfferdeleteStatus("successdelete");
        setTimeout(() => {
          setOfferdeleteStatus("initial");
        }, 3000);
      })
      .catch((e) => {
        console.log(e);
        setOfferdeleteStatus("faildelete");

        setTimeout(() => {
          setOfferdeleteStatus("initial");
        }, 3000);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getUserOffersForCollection();
  }, [coinbase]);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    fetchInitialNftsPerCollection();
    getCollectionFloorPrice();
    getCollectionTotalSupply();
    getCollectionInfo();
    getCollectionUniqueOwners();
    getCollectionTotalVolume();
  }, []);

  useEffect(() => {
    if (isNewCollection) {
      dataFetchedRef.current = false;
      getCollectionFloorPrice();
      getCollectionTotalSupply();
      fetchInitialNftsPerCollection().then(() => {
        onNewCollectionFetched();
      });
      getCollectionInfo();
      getCollectionTotalVolume();
      getUserOffersForCollection();
      getCollectionUniqueOwners();
    }
  }, [isNewCollection]);

  useEffect(() => {
    if (next !== 12) {
      fetchSlicedNftsPerCollection();
    }
  }, [next]);

  useEffect(() => {
    checkifFavorite();
  }, [collectionAddress, userCollectionFavs]);

  useEffect(() => {
    fetchCurrentCollection(collectionAddress);
  }, [collectionAddress, allCollections]);

  useEffect(() => {
    if (filter === null) {
      window.addEventListener("scroll", onScroll);
    }
  }, [filter]);

  return (
    <>
      <div
        className="container-fluid py-4 home-wrapper px-0"
        ref={containerRef}
        id="header2"
      >
        <CollectionBanner
        
          title={currentCollection.collectionName}
          logo={
            currentCollection.collectionProfilePic
              ? `https://confluxapi.worldofdypians.com/${currentCollection.collectionProfilePic}`
              : collectionIcon
          }
          banner={
            currentCollection.collectionBackgroundPic
              ? `https://confluxapi.worldofdypians.com/${currentCollection.collectionBackgroundPic}`
              : banner
          }
          socials={collectionSocials}
          desc={currentCollection.description ?? "No description"}
          info={collectionInfo}
          isFavorite={favorite}
          handleFavorite={() => {
            favorite ? handleRemoveFavorite() : handleAddFavorite();
          }}
          isVerified={currentCollection.verified === "yes" ? true : false}
          currentCollection={currentCollection}
          totalSupplyPerCollection={totalSupplyPerCollection}
          collectionFeeRate={collectionFeeRate}
        />
        <CollectionList
        offerData={offerData}
          currentCollection={currentCollection}
          getRecentlySold={handleGetRecentlySoldNfts}
          allNftArray={allNftArray}
          collectionAddress={collectionAddress}
          loading={loading}
          handleAddFavoriteNft={handleAddFavoriteNft}
          handleRemoveFavoriteNft={handleRemoveFavoriteNft}
          userNftFavs={userNftFavs}
          cfxPrice={cfxPrice}
          coinbase={coinbase}
          onRefreshListings={onRefreshListings}
          totalSupplyPerCollection={totalSupplyPerCollection}
          hasListedNfts={hasListedNfts}
          getFilter={getFilter}
          fetchSearchNftsPerCollection={fetchSearchNftsPerCollection}
          onShowPopup={() => {
            setshowOfferPopup(true);
          }}
        />

        {totalSupplyPerCollection &&
          next <= totalSupplyPerCollection &&
          totalSupplyPerCollection > 0 &&
          loading === false && (
            <div className="d-flex justify-content-center mt-5">
              <button className="buy-btn px-5 m-auto" onClick={loadMore}>
                Load more
              </button>
            </div>
          )}
      </div>
      {showOfferPopup === true && (
        <MakeOfferForCollection
          open={showOfferPopup}
          onclose={() => {
            setshowOfferPopup(false);
          }}
          coinbase={coinbase}
          floorPrice={floorPrice}
          nftData={currentCollection}
          cfxPrice={cfxPrice}
          wcfxBalance={wcfxBalance}
          totalSupplyPerCollection={totalSupplyPerCollection}
          uniqueOwners={uniqueOwners}
          uniqueOwnersPercentage={uniqueOwnersPercentage}
          collectionFeeRate={collectionFeeRate}
          status={offerStatus}
          handleMakeOffer={handleMakeOffer}
          handleUpdateOffer={handleUpdateOffer}
          handleDeleteOffer={handleDeleteOffer}
          offerData={offerData}
          bestOffer={bestOffer}
          deletestatus={offerdeleteStatus}
          updatestatus={offerupdateStatus}
        />
      )}
    </>
  );
};

export default CollectionPage;
