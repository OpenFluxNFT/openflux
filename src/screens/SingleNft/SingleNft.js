import React, { useEffect, useState, useRef } from "react";
import SingleNftBanner from "../../components/SingleNft/SingleNftBanner/SingleNftBanner";
import SingleNftHistory from "../../components/SingleNft/SingleNftHistory/SingleNftHistory";
import "./_singlenft.scss";
import NftTraits from "../../components/SingleNft/NftTraits/NftTraits";
import MoreFromCollection from "../../components/SingleNft/MoreFromCollection/MoreFromCollection";
import MakeOffer from "../../components/MakeOffer/MakeOffer";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const SingleNft = ({
  isConnected,
  chainId,
  coinbase,
  handleShowWalletModal,
  handleSwitchNetwork,
  handleSignup,
  recentlyListedNfts,
  cfxPrice,
  onRefreshListings,
  balance,
  handleAddFavoriteNft,
  handleRemoveFavoriteNft,
  userNftFavs,
  wcfxBalance,
  allCollections,
}) => {
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [nftData, setNftData] = useState([]);
  const [count, setCount] = useState(0);
  const [allNftArray, setAllNftArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalSupplyPerCollection, settotalSupplyPerCollection] = useState(0);

  const [offerStatus, setOfferStatus] = useState("initial");
  const [offerdeleteStatus, setOfferdeleteStatus] = useState("initial");
  const [offerupdateStatus, setOfferupdateStatus] = useState("initial");
  const [offeracceptStatus, setOfferacceptStatus] = useState("initial");
  const [bestOffer, setbestOffer] = useState([]);
  const [offerData, setofferData] = useState([]);
  const [allOffers, setallOffers] = useState([]);
  const [saleHistory, setSaleHistory] = useState([]);
  const [collectionFeeRate, setcollectionFeeRate] = useState(0);
  const [nftView, setNftView] = useState({});
  const [lowestPriceNftListed, setlowestPriceNftListed] = useState(0);
  const [floorPrice, setfloorPrice] = useState();

  const { nftId, nftAddress } = useParams();
  const dataFetchedRef = useRef(false);
  const baseURL = "https://confluxapi.worldofdypians.com";
  const { BigNumber } = window;

  const updateViewNft = () => {
    let viewedNfts = JSON.parse(localStorage.getItem("viewedNfts")) || [];

    const existingNft = viewedNfts.find(
      (nft) => nft.address === nftAddress && nft.id === nftId
    );

    if (existingNft) {
      existingNft.view_count += 1;
      setNftView(existingNft);
    } else {
      viewedNfts.push({ id: nftId, address: nftAddress, view_count: 1 });
      setNftView({ id: nftId, address: nftAddress, view_count: 1 });
    }
    localStorage.setItem("viewedNfts", JSON.stringify(viewedNfts));
  };

  const handleMakeOffer = async (nftAddress, tokenId, price, duration) => {
    if (price !== "" && price !== 0) {
      setOfferStatus("loading");
      const newPrice = new BigNumber(price * 1e18).toFixed();
      await window
        .makeOffer(nftAddress, tokenId, newPrice, duration)
        .then(() => {
          getUpdatedNftData().then(() => {
            onRefreshListings();
          });
          setOfferStatus("success");
          setTimeout(() => {
            setOfferStatus("initial");
            getOffer(nftAddress, tokenId);
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

  const handleDeleteOffer = async (offerIndex) => {
    setOfferdeleteStatus("loadingdelete");
    await window
      .cancelOffer(nftAddress, nftId, offerIndex)
      .then(() => {
        getOffer(nftAddress, nftId);
        getUpdatedNftData().then(() => {
          onRefreshListings();
        });
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

  const handleUpdateOffer = async (price, offerIndex) => {
    if (price !== "" && price !== 0) {
      setOfferupdateStatus("loadingupdate");
      const newPrice = new BigNumber(price * 1e18).toFixed();

      await window
        .updateOffer(nftAddress, nftId, offerIndex, newPrice)
        .then(() => {
          getUpdatedNftData().then(() => {
            onRefreshListings();
          });
          setOfferupdateStatus("successupdate");
          setTimeout(() => {
            setOfferupdateStatus("initial");
            getOffer(nftAddress, nftId);
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

  const acceptOfferFunc = async (offerIndex, offeror) => {
    setOfferacceptStatus("loading");
    await window
      .acceptOffer(nftAddress, nftId, offerIndex)
      .then(() => {
        refreshUserHistory(offeror);
        refreshUserHistory(coinbase);
        getUpdatedNftData().then(() => {
          refreshMetadata(nftId);
          fetchInitialNftsPerCollection(nftId);
          fetchNftSaleHistoryCache(nftAddress, nftId);
          getCollectionFloorPriceCache();
          onRefreshListings();
        });
        getOffer(nftAddress, nftId);
        setOfferacceptStatus("success");
        setTimeout(() => {
          setOfferacceptStatus("initial");
        }, 3000);
      })
      .catch((e) => {
        console.log(e);
        setOfferacceptStatus("fail");
        setTimeout(() => {
          setOfferacceptStatus("initial");
        }, 3000);
      });
  };

  const handleAcceptOffer = async (offerIndex, offeror) => {
    setOfferacceptStatus("loading");
    const isApproved = await window
      .isApprovedNFT(nftId, nftAddress, coinbase)
      .then((data) => {
        return data;
      })
      .catch((e) => {
        console.log(e);
        setOfferacceptStatus("fail");
      });

    if (isApproved) {
      acceptOfferFunc(offerIndex, offeror);
    } else {
      await window
        .approveNFT(nftAddress)
        .then((result) => {
          setOfferacceptStatus("success");
          setTimeout(() => {
            acceptOfferFunc(offerIndex, offeror);
          }, 1000);
        })
        .catch((e) => {
          setOfferacceptStatus("fail");
          setTimeout(() => {
            acceptOfferFunc(offerIndex, offeror);
          }, 1000);
          console.log(e);
        });
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

  const getOffer = async (nftAddr, nftId) => {
    let finalArray = [];
    let offerArray = [];
    let allOffersArray = [];

    const result = await window.getAllOffers(nftAddr, nftId).catch((e) => {
      console.log(e);
    });
    if (result) {
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

        const contract = new window.confluxWeb3.eth.Contract(
          window.TOKEN_ABI,
          window.config.wcfx_address
        );

        await Promise.all(
          window.range(0, finalResult.length - 1).map(async (i) => {
            const balance = await contract.methods
              .balanceOf(finalResult[i].offeror)
              .call()
              .then((data) => {
                return window.confluxWeb3.utils.fromWei(data, "ether");
              });

            const allowance = await contract.methods
              .allowance(
                finalResult[i].offeror,
                window.config.nft_marketplace_address
              )
              .call()
              .then((data) => {
                return window.confluxWeb3.utils.fromWei(data, "ether");
              });

            const priceFormatted = finalResult[i].amount / 1e18;

            const hasExpired = moment
              .duration(finalResult[i].expiresAt * 1000 - Date.now())
              .humanize(true)
              .includes("ago");
            if (!hasExpired) {
              return allOffersArray.push({
                ...finalResult[i],
                index: i,
                isAllowed:
                  balance >= priceFormatted && allowance >= priceFormatted,
              });
            }
          })
        );

        setallOffers(allOffersArray);
      }
    } else {
      setbestOffer([]);
      setofferData([]);
      setallOffers([]);
    }
  };

  const getNftData = async (nftID) => {
    const web3 = window.confluxWeb3;
    setLoading(true);
    let finalArray = [];
    let favoriteCount = 0;
    const abiresult = await axios
      .get(
        `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${nftAddress.toLowerCase()}`
      )
      .catch((e) => {
        console.error(e);
      });

    const listednfts = await axios
      .get(`${baseURL}/api/collections/${nftAddress.toLowerCase()}/listings`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.log(e);
      });

    if (
      abiresult &&
      abiresult.status === 200 &&
      listednfts &&
      listednfts.status === 200
    ) {
      const listednftsArray = listednfts.data.listings;

      const abi = abiresult.data.result
        ? JSON.parse(abiresult.data.result)
        : window.BACKUP_ABI;

      const collection_contract = new web3.eth.Contract(
        abi,
        nftAddress.toLowerCase()
      );

      const nftSymbol = await collection_contract.methods
        .symbol()
        .call()
        .catch((e) => {
          console.log(e);
        });

      const owner = await collection_contract.methods
        .ownerOf(nftID)
        .call()
        .catch((e) => {
          console.log(e);
        });
      const fav_count = await axios
        .get(
          `${baseURL}/api/nftFavoritesCount/${nftAddress.toLowerCase()}/${nftID}`,
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

      if (fav_count && fav_count.status === 200) {
        favoriteCount = fav_count.data.count;
      }

      const collectionName = await collection_contract.methods
        .name()
        .call()
        .catch((e) => {
          console.log(e);
        });
      let isListed = false;
      let price = 0;
      let expiresAt = 0;
      if (listednftsArray !== "none" && listednftsArray.length > 0) {
        const filteredResult = listednftsArray.find((item) => {
          return (
            item.tokenId === nftID &&
            item.nftAddress.toLowerCase() === nftAddress.toLowerCase()
          );
        });

        if (filteredResult) {
          const hasExpired = moment
            .duration(filteredResult.expiresAt * 1000 - Date.now())
            .humanize(true)
            .includes("ago");
          if (
            hasExpired ||
            filteredResult.seller.toLowerCase() !== owner.toLowerCase()
          ) {
            isListed = false;
            price = filteredResult.price;
            expiresAt = filteredResult.expiresAt;
          } else {
            isListed = true;
            price = filteredResult.price;
            expiresAt = filteredResult.expiresAt;
          }
        } else {
          isListed = false;
          price = 0;
          expiresAt = 0;
        }
        const listingIndex = listednftsArray.findIndex(
          (object) =>
            object.nftAddress.toLowerCase() === nftAddress.toLowerCase() &&
            object.tokenId === nftID
        );

        const nftdata = await fetch(
          `https://cdnflux.dypius.com/collectionsmetadatas/${nftAddress.toLowerCase()}/${nftID}/metadata.json`
        )
          .then((res) => res.json())
          .then((data) => {
            return data;
          })
          .catch((err) => {
            console.log(err.message);
          });
        if (nftdata && nftdata.code !== 404 && typeof nftdata !== "string") {
          finalArray.push({
            ...nftdata,
            ...filteredResult,
            owner: owner ? owner.toLowerCase() : undefined,
            collectionName: collectionName,
            isListed: isListed,
            price: price,
            listingIndex: listingIndex,
            expiresAt: expiresAt,
            favoriteCount: favoriteCount,
            nftSymbol: nftSymbol,
          });
          setNftData(...finalArray);
          setLoading(false);
        } else {
          finalArray.push({
            ...filteredResult,
            owner: owner ? owner.toLowerCase() : undefined,
            collectionName: collectionName,
            isListed: isListed,
            price: price,
            listingIndex: listingIndex,
            expiresAt: expiresAt,
            favoriteCount: favoriteCount,
            nftSymbol: nftSymbol,
            attributes: "false",
          });
          setNftData(...finalArray);
          setLoading(false);
        }
      } else {
        const nftdata = await fetch(
          `https://cdnflux.dypius.com/collectionsmetadatas/${nftAddress.toLowerCase()}/${nftID}/metadata.json`
        )
          .then((res) => res.json())
          .then((data) => {
            return data;
          })
          .catch((err) => {
            console.log(err.message);
          });

        if (nftdata && nftdata.code !== 404 && typeof nftdata !== "string") {
          finalArray.push({
            ...nftdata,
            owner: owner ? owner.toLowerCase() : undefined,
            collectionName: collectionName,
            isListed: false,
            price: 0,
            listingIndex: 0,
            expiresAt: expiresAt,
            favoriteCount: favoriteCount,
            nftSymbol: nftSymbol,
          });
          setNftData(...finalArray);
          setLoading(false);
        } else {
          finalArray.push({
            owner: owner ? owner.toLowerCase() : undefined,
            collectionName: collectionName,
            isListed: isListed,
            price: price,
            listingIndex: 0,
            expiresAt: expiresAt,
            favoriteCount: favoriteCount,
            nftSymbol: nftSymbol,
            attributes: "false",
          });
          setNftData(...finalArray);
          setLoading(false);
        }
      }
    }
  };

  const getUpdatedNftData = async () => {
    const web3 = window.confluxWeb3;
    setLoading(true);
    let finalArray = [];
    let favoriteCount = 0;

    const abiresult = await axios
      .get(
        `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${nftAddress.toLowerCase()}`
      )
      .catch((e) => {
        console.error(e);
      });

    const listednfts = await axios
      .get(
        `${baseURL}/api/collections/${nftAddress.toLowerCase()}/refresh-listings`,
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
      if (
        abiresult &&
        abiresult.status === 200 &&
        listednfts &&
        listednfts.status === 200
      ) {
        const listednftsArray = listednfts.data.listings;
        const abi = abiresult.data.result
          ? JSON.parse(abiresult.data.result)
          : window.BACKUP_ABI;
        const collection_contract = new web3.eth.Contract(abi, nftAddress);

        const nftSymbol = await collection_contract.methods
          .symbol()
          .call()
          .catch((e) => {
            console.log(e);
          });

        const owner = await collection_contract.methods
          .ownerOf(nftId)
          .call()
          .catch((e) => {
            console.log(e);
          });

        const fav_count = await axios
          .get(
            `${baseURL}/api/nftFavoritesCount/${nftAddress.toLowerCase()}/${nftId}`,
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

        if (fav_count && fav_count.status === 200) {
          favoriteCount = fav_count.data.count;
        }

        const collectionName = await collection_contract.methods
          .name()
          .call()
          .catch((e) => {
            console.log(e);
          });
        let isListed = false;
        let price = 0;
        let expiresAt = 0;
        if (listednftsArray !== "none" && listednftsArray.length > 0) {
          const filteredResult = listednftsArray.find((item) => {
            return (
              item.tokenId === nftId &&
              item.nftAddress.toLowerCase() === nftAddress.toLowerCase()
            );
          });

          if (filteredResult) {
            const hasExpired = moment
              .duration(filteredResult.expiresAt * 1000 - Date.now())
              .humanize(true)
              .includes("ago");
            if (
              hasExpired ||
              filteredResult.seller.toLowerCase() !== owner.toLowerCase()
            ) {
              isListed = false;
              price = filteredResult.price;
              expiresAt = filteredResult.expiresAt;
            } else {
              isListed = true;
              price = filteredResult.price;
              expiresAt = filteredResult.expiresAt;
            }
          } else {
            isListed = false;
            price = 0;
            expiresAt = 0;
          }
          const listingIndex = listednftsArray.findIndex(
            (object) =>
              object.nftAddress.toLowerCase() === nftAddress.toLowerCase() &&
              object.tokenId === nftId
          );
          const nftdata = await fetch(
            `https://cdnflux.dypius.com/collectionsmetadatas/${nftAddress.toLowerCase()}/${nftId}/metadata.json`
          )
            .then((res) => res.json())
            .then((data) => {
              return data;
            })
            .catch((err) => {
              console.log(err.message);
            });
          if (nftdata && nftdata.code !== 404 && typeof nftdata !== "string") {
            finalArray.push({
              ...nftdata,
              ...filteredResult,
              owner: owner,
              collectionName: collectionName,
              isListed: isListed,
              price: price,
              listingIndex: listingIndex,
              expiresAt: expiresAt,
              nftSymbol: nftSymbol,
              favoriteCount: favoriteCount,
            });

            setNftData(...finalArray);
          } else {
            finalArray.push({
              ...filteredResult,
              owner: owner.toLowerCase(),
              collectionName: collectionName,
              isListed: isListed,
              price: price,
              listingIndex: listingIndex,
              expiresAt: expiresAt,
              favoriteCount: favoriteCount,
              nftSymbol: nftSymbol,
              attributes: "false",
            });
            setNftData(...finalArray);
            setLoading(false);
          }
        } else {
          const nftdata = await fetch(
            `https://cdnflux.dypius.com/collectionsmetadatas/${nftAddress.toLowerCase()}/${nftId}/metadata.json`
          )
            .then((res) => res.json())
            .then((data) => {
              return data;
            })
            .catch((err) => {
              console.log(err.message);
            });
          if (nftdata && nftdata.code !== 404 && typeof nftdata !== "string") {
            finalArray.push({
              ...nftdata,
              owner: owner,
              collectionName: collectionName,
              isListed: isListed,
              price: price,
              listingIndex: undefined,
              expiresAt: expiresAt,
              nftSymbol: nftSymbol,
            });

            setNftData(...finalArray);
          } else {
            finalArray.push({
              owner: owner.toLowerCase(),
              collectionName: collectionName,
              isListed: isListed,
              price: price,
              listingIndex: 0,
              expiresAt: expiresAt,
              favoriteCount: favoriteCount,
              nftSymbol: nftSymbol,
              attributes: "false",
            });
            setNftData(...finalArray);
            setLoading(false);
          }
        }
      }
    }
    setLoading(false);
  };

  const getCollectionTotalSupply = async () => {
    if (allCollections && allCollections.length > 0) {
      const resultcollection = allCollections.find((item) => {
        return item.contractAddress === nftAddress;
      });

      if (resultcollection) {
        let totalSupply = parseInt(resultcollection.totalSupply);
        settotalSupplyPerCollection(totalSupply);
      }
    }
  };

  const fetchInitialNftsPerCollection = async (nftID) => {
    setLoading(true);
    const result = await axios
      .get(
        `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${nftAddress.toLowerCase()}`
      )
      .catch((e) => {
        console.error(e);
      });
    const listednfts = await axios
      .get(`${baseURL}/api/collections/${nftAddress.toLowerCase()}/listings`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.log(e);
      });

    if (
      result &&
      result.status === 200 &&
      listednfts &&
      listednfts.status === 200
    ) {
      let nftArray = [];
      let nftListedArray = [];
      let totalSupply = totalSupplyPerCollection;

      const abi = result.data.result
        ? JSON.parse(result.data.result)
        : window.BACKUP_ABI;
      const listednftsArray = listednfts.data.listings;

      const web3 = window.confluxWeb3;
      const collection_contract = new web3.eth.Contract(abi, nftAddress);

      const nftSymbol = await collection_contract.methods
        .symbol()
        .call()
        .catch((e) => {
          console.log(e);
        });
        
      if (totalSupply && totalSupply > 0) {
        const limit = totalSupply >= 12 ? 12 : totalSupply;

        if (
          listednftsArray !== "none" &&
          listednftsArray &&
          listednftsArray.length > 0
        ) {
          await Promise.all(
            window.range(0, listednftsArray.length - 1).map(async (j) => {
              const nft_data_listed = await fetch(
                `https://cdnflux.dypius.com/collectionsmetadatas/${nftAddress.toLowerCase()}/${
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
                    nftAddress.toLowerCase() &&
                  object.tokenId === listednftsArray[j].tokenId
              );

              const isApprovedresult = await window
                .isApprovedBuy(listednftsArray[j].price)
                .catch((e) => {
                  console.error(e);
                });

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
                    nftSymbol: nftSymbol,
                    listingIndex: listingIndex,
                    isApproved: isApprovedresult,
                  });
                } else {
                  nftListedArray.push({
                    ...listednftsArray[j],
                    nftSymbol: nftSymbol,
                    listingIndex: listingIndex,
                    isApproved: isApprovedresult,
                    attributes: "false",
                  });
                }
              }
            })
          );
        }

        await Promise.all(
          window.range(0, limit - 1).map(async (i) => {
            let tokenByIndex = 0;

            if (collection_contract.methods.tokenByIndex) {
              try {
                tokenByIndex = await collection_contract.methods
                  .tokenByIndex(i)
                  .call();
              } catch (e) {
                console.error(e);
                tokenByIndex = i;
              }
            } else {
              console.warn(
                "tokenByIndex method does not exist in the contract ABI"
              );
              tokenByIndex = i;
            }

            const owner = await collection_contract.methods
              .ownerOf(tokenByIndex)
              .call()
              .catch((e) => {
                console.log(e);
              });

            const nft_data = await fetch(
              `https://cdnflux.dypius.com/collectionsmetadatas/${nftAddress.toLowerCase()}/${tokenByIndex}/metadata.json`
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
              nftArray.push({
                ...nft_data,
                tokenId: Number(tokenByIndex),
                owner: owner,
                nftAddress: nftAddress,
                nftSymbol: nftSymbol,
              });
            } else {
              nftArray.push({
                tokenId: Number(tokenByIndex),
                owner: owner,
                nftAddress: nftAddress,
                nftSymbol: nftSymbol,
                attributes: "false",
              });
            }
          })
        );

        const finalArray_sorted = nftArray.sort((a, b) => {
          return a.tokenId - b.tokenId;
        });

        const uniqueArray_listed = nftListedArray.filter(
          ({ tokenId: id2 }) => nftID.toString() !== id2.toString()
        );

        const uniqueArray = finalArray_sorted.filter(
          ({ tokenId: id1 }) =>
            !nftListedArray.some(
              ({ tokenId: id2 }) =>
                nftID.toString() === id1.toString() ||
                id1.toString() === id2.toString()
            )
        );

        const finalArray = [...uniqueArray_listed, ...uniqueArray];

        setAllNftArray(finalArray);
        setLoading(false);
      } else {
        setLoading(false);
        setAllNftArray([]);
      }
    }
  };

  const fetchNftSaleHistory = async (nftAddr, nftId) => {
    const result = await axios
      .get(
        `${baseURL}/api/nft-sale-history/${nftAddr.toLowerCase()}/${nftId}`,
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
      const historyArray = result.data;
      const finalArray_sorted = historyArray.sort((a, b) => {
        return b.blockTimestamp - a.blockTimestamp;
      });

      setSaleHistory(finalArray_sorted);
    }
  };

  const fetchNftSaleHistoryCache = async (nftAddr, nftId) => {
    const result = await axios
      .get(
        `${baseURL}/api/refresh-sale-history-cache/${nftAddr.toLowerCase()}/${nftId}`,
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
      fetchNftSaleHistory(nftAddr, nftId);
    }
  };

  const getCollectionFloorPrice = async () => {
    const result = await axios
      .get(`${baseURL}/api/floor-price/${nftAddress}`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      setfloorPrice(result.data.floorPrice);
    }
  };

  const getCollectionFloorPriceCache = async () => {
    const result = await axios
      .get(`${baseURL}/api/refresh-floor-price/${nftAddress}`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      getCollectionFloorPrice();
    }
  };

  const handleRefreshNftTraits = () => {
    refreshSingleMetadata(nftAddress, nftId);
    getNftData(nftId);
  };

  const refreshSingleMetadata = async (nftAddress, nftID) => {
    const result = await fetch(
      `https://cdnflux.dypius.com/executeScript.php?contractAddress=${nftAddress}&tokenID=${nftID}`
    ).catch((e) => {
      console.error(e);
    });
  };

  const refreshMetadata = async (nftID) => {
    const result = await axios
      .get(
        `${baseURL}/api/collections/${nftAddress}/refresh-metadata/${nftID}`,
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
  };

  const getCollectionInfo = async () => {
    const result = await axios
      .get(`${baseURL}/api/collection-info/${nftAddress}`, {
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getOffer(nftAddress, nftId);
    refreshSingleMetadata(nftAddress, nftId);
  }, [coinbase, nftAddress, nftId]);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    updateViewNft();
    getCollectionFloorPrice();
    refreshMetadata(nftId);
    getCollectionInfo();
  }, []);

  useEffect(() => {
    getCollectionTotalSupply();
  }, [allCollections]);

  useEffect(() => {
    if (totalSupplyPerCollection > 0) {
      fetchInitialNftsPerCollection(nftId);
      fetchNftSaleHistory(nftAddress, nftId);
      getNftData(nftId);
    }
  }, [totalSupplyPerCollection]);
  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <SingleNftBanner
        chainId={chainId}
        onShowMakeOfferPopup={() => {
          setShowOfferPopup(true);
        }}
        views={nftView?.view_count}
        nftData={nftData}
        coinbase={coinbase}
        isConnected={isConnected}
        handleSignup={handleSignup}
        cfxPrice={cfxPrice}
        handleRefreshData={() => {
          getUpdatedNftData().then(() => {
            refreshMetadata(nftId);
            fetchInitialNftsPerCollection(nftId);
            fetchNftSaleHistoryCache(nftAddress, nftId);
            refreshUserHistory(coinbase);
            getCollectionFloorPriceCache();
            onRefreshListings();
          });
        }}
        handleRefreshData2={(seller) => {
          refreshUserHistory(seller);
        }}
        handleSwitchNetwork={handleSwitchNetwork}
        loading={loading}
        offerData={offerData}
        bestOffer={bestOffer}
        lastSale={saleHistory}
        collectionFeeRate={collectionFeeRate}
        allCollections={allCollections}
      />
      <SingleNftHistory
        allOffers={allOffers}
        cfxPrice={cfxPrice}
        nftData={nftData}
        coinbase={coinbase}
        handleAcceptOffer={handleAcceptOffer}
        offeracceptStatus={offeracceptStatus}
        lowestPriceNftListed={floorPrice}
        saleHistory={saleHistory}
      />
      <NftTraits
        nftData={nftData}
        onRefreshNftTraits={handleRefreshNftTraits}
      />
      {allNftArray && allNftArray.length > 1 && (
        <MoreFromCollection
          loading={loading}
          cfxPrice={cfxPrice}
          allNftArray={allNftArray}
          onNftClick={(value) => {
            getNftData(value);
            getOffer(nftAddress, value);
            fetchInitialNftsPerCollection(value);
            fetchNftSaleHistory(nftAddress, value);
            refreshMetadata(value);
          }}
          coinbase={coinbase}
          onRefreshListings={onRefreshListings}
          nftAddress={nftAddress}
          handleAddFavoriteNft={handleAddFavoriteNft}
          handleRemoveFavoriteNft={handleRemoveFavoriteNft}
          userNftFavs={userNftFavs}
          allCollections={allCollections}
          nftId={nftId}
        />
      )}
      {showOfferPopup && (
        <MakeOffer
          open={showOfferPopup}
          showPopup={() => setShowOfferPopup()}
          nftData={nftData}
          cfxPrice={cfxPrice}
          balance={balance}
          wcfxBalance={wcfxBalance}
          handleMakeOffer={handleMakeOffer}
          handleDeleteOffer={handleDeleteOffer}
          handleUpdateOffer={handleUpdateOffer}
          status={offerStatus}
          deletestatus={offerdeleteStatus}
          updatestatus={offerupdateStatus}
          offerData={offerData}
          bestOffer={bestOffer}
          nftAddress={nftAddress}
          nftId={nftId}
          floorPrice={floorPrice}
        />
      )}
    </div>
  );
};

export default SingleNft;
