import React, { useEffect, useState, useRef } from "react";
import "./_collectionpage.scss";
import CollectionBanner from "../../components/CollectionPage/CollectionBanner/CollectionBanner";
import CollectionList from "../../components/CollectionPage/CollectionList/CollectionList";
import banner from "../../components/CollectionPage/CollectionBanner/assets/bannerPlaceholder.png";
import collectionIcon from "../../components/CollectionPage/CollectionBanner/assets/dummyProfileIcon.png";
import { useParams } from "react-router-dom";
import axios, { isCancel } from "axios";
import Web3 from "web3";
import getFormattedNumber from "../../hooks/get-formatted-number";
import moment from "moment";
import MakeOfferForCollection from "../../components/MakeOffer/MakeOfferForCollection";
import AcceptOfferForCollection from "../../components/MakeOffer/AcceptOfferForCollection";
import { useLocation } from "react-router-dom";

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
  userNftsOwnedArray,
  userNftsOwned,
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
  const [next, setnext] = useState(0);
  const [nextSearch, setnextSearch] = useState(40);
  const [nextSearchTraits, setnextSearchTraits] = useState(40);

  const [isSearch, setisSearch] = useState(false);
  const [isSearchTrait, setisSearchTrait] = useState(false);

  const [tokenToSearch, settokenToSearch] = useState("");
  const [traitToSearch, settraitToSearch] = useState([]);

  const [nftArrayFilteredBySearch, setnftArrayFilteredBySearch] = useState([]);
  const [ntftArrayFilteredByTraits, setNtftArrayFilteredByTraits] = useState(
    []
  );

  const [showOfferPopup, setshowOfferPopup] = useState(false);
  const [showOfferAcceptPopup, setshowOfferAcceptPopup] = useState(false);
  const [selectedOffer, setselectedOffer] = useState([]);

  const [offerStatus, setOfferStatus] = useState("initial");

  const [offerdeleteStatus, setOfferdeleteStatus] = useState("initial");
  const [offerupdateStatus, setOfferupdateStatus] = useState("initial");
  const [offeracceptStatus, setOfferacceptStatus] = useState("initial");
  const [allOffers, setallOffers] = useState([]);

  const [offerData, setofferData] = useState([]);
  const [bestOffer, setbestOffer] = useState([]);
  const [showBtn, setshowBtn] = useState(true);
  const [collectionJson, setcollectionJson] = useState([]);

  const [userownedNftFilteredArray, setuserownedNftFilteredArray] = useState(
    []
  );

  const { BigNumber } = window;
  const baseURL = "https://confluxapi.worldofdypians.com";
  const dataFetchedRef = useRef(false);
  const containerRef = useRef(false);

  const nftPerRow = 12;

  const { collectionAddress } = useParams();
  
  const collectionInfo = [
    {
      title: "Total Volume",
      value: getFormattedNumber(
        currentCollection.lifetimeVolume
          ? currentCollection.lifetimeVolume / 1e18
          : 0
      ),
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
              parseInt(totalSupplyPerCollection),
        2
      )}%`,
    },
    {
      title: "Owners (unique)",
      value: getFormattedNumber(uniqueOwners ?? 0, 0),
      valueType: `${getFormattedNumber(uniqueOwnersPercentage ?? 0, 0)}%`,
    },
  ];

  const isEmptyObject = (obj) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  const transformData = (data) => {
    const hasValidTraits =
      data.traits &&
      !isEmptyObject(data.traits) &&
      !(data.traits.undefined && data.traits.undefined.undefined !== undefined);
    const hasValidSingleTokenTraits =
      data.singleTokenTraits && !isEmptyObject(data.singleTokenTraits);
    const transformedSingleTokenTraits = hasValidSingleTokenTraits
      ? Object.entries(data.singleTokenTraits).map(([key, value]) => ({
          key,
          value,
        }))
      : [];

    const transformedTraits = hasValidTraits
      ? Object.entries(data.traits).map(([key, value]) => ({ key, value }))
      : [];

    return {
      tokenIDs: data.tokenIDs || [],
      traits: transformedTraits,
      singleTokenTraits: data.singleTokenTraits,
    };
  };

  const fetchCollectionJson = async () => {
    const collection_data = await fetch(
      `https://cdnflux.dypius.com/collectionsmetadatas/${collectionAddress.toLowerCase()}/main/main.json`
    )
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.error(err.message);
      });

    if (collection_data && collection_data.tokenIDs) {
      const transformedData = transformData(collection_data);

      setcollectionJson(transformedData);
    }
  };

  const filterUserArray = () => {
    const final = userNftsOwnedArray.filter((obj) => {
      return obj.nftAddress.toLowerCase() === collectionAddress.toLowerCase();
    });
    if (final) {
      setuserownedNftFilteredArray(final);
    }
  };
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
    const wallet = await window.getCoinbase().then((data) => {
      return data;
    });

    if (result && result.status === 200) {
      const recentlySold = await Promise.all(
        result.data
          .filter((item) => {
            return (
              item.nftAddress.toLowerCase() == collectionAddress.toLowerCase()
            );
          })
          .map(async (item) => {
            let isApproved = false;

            const abi_1155 = new window.confluxWeb3.eth.Contract(
              window.BACKUP_ABI,
              item.nftAddress
            );
            const abi_721 = new window.confluxWeb3.eth.Contract(
              window.ERC721_ABI,
              item.nftAddress
            );

            const is721 = await abi_721.methods
              .supportsInterface(window.config.erc721_id)
              .call()
              .catch((e) => {
                console.error(e);
                return false;
              });
            const is1155 = await abi_1155.methods
              .supportsInterface(window.config.erc1155_id)
              .call()
              .catch((e) => {
                console.error(e);
                return false;
              });

            const abi_final = is1155
              ? window.BACKUP_ABI
              : is721
              ? window.ERC721_ABI
              : window.ERC721_ABI;

            if (abi_final) {
              const abi = abi_final;
              const collection_contract = new web3.eth.Contract(
                abi,
                item.nftAddress
              );
              const tokenName = currentCollection.symbol;

              let seller;
              let userBalance = 0;

              if (is721) {
                seller = await collection_contract.methods
                  .ownerOf(item.tokenId)
                  .call()
                  .catch((e) => {
                    console.log(e);
                  });
              } else if (is1155) {
                if (wallet) {
                  userBalance = await collection_contract.methods
                    .balanceOf(wallet, item.tokenId)
                    .call()
                    .catch((e) => {
                      console.log(e);
                    });

                  if (userBalance > 0) {
                    seller = wallet;
                  }
                }
              }
              const collectionName = await currentCollection.collectionName;

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
    let totalSupply = parseInt(currentCollection.totalSupply);
    settotalSupplyPerCollection(totalSupply);
  };

  const fetchSearchNftsPerCollection = async (tokenIdBySearch) => {
    setLoading(true);
    setAllNftArray([]);
    setisSearch(true);
    const wallet = await window.getCoinbase().then((data) => {
      return data;
    });

    if (collectionJson.tokenIDs && collectionJson.tokenIDs.length > 0) {
      const allNftsArrayFiltered = collectionJson.tokenIDs.filter((item) => {
        return item.toString().includes(tokenIdBySearch);
      });

      if (allNftsArrayFiltered && allNftsArrayFiltered.length > 0) {
        setnftArrayFilteredBySearch(allNftsArrayFiltered);

        const abi_1155 = new window.confluxWeb3.eth.Contract(
          window.BACKUP_ABI,
          collectionAddress
        );
        const abi_721 = new window.confluxWeb3.eth.Contract(
          window.ERC721_ABI,
          collectionAddress
        );

        const is721 = await abi_721.methods
          .supportsInterface(window.config.erc721_id)
          .call()
          .catch((e) => {
            console.error(e);
            return false;
          });
        const is1155 = await abi_1155.methods
          .supportsInterface(window.config.erc1155_id)
          .call()
          .catch((e) => {
            console.error(e);
            return false;
          });

        const abi_final = is1155
          ? window.BACKUP_ABI
          : is721
          ? window.ERC721_ABI
          : window.ERC721_ABI;

        const listednfts = await axios
          .get(
            `${baseURL}/api/collections/${collectionAddress.toLowerCase()}/listings`,
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

        if (abi_final && listednfts && listednfts.status === 200) {
          let nftArray = [];
          let nftListedArray = [];

          const abi = abi_final;
          const listednftsArray = listednfts.data.listings;
          const web3 = window.confluxWeb3;
          const collection_contract = new web3.eth.Contract(
            abi,
            collectionAddress
          );

          const limit =
            allNftsArrayFiltered.length > nextSearch
              ? nextSearch
              : allNftsArrayFiltered.length;
          console.log("limit", limit, allNftsArrayFiltered.length);
          if (
            listednftsArray !== "none" &&
            listednftsArray &&
            listednftsArray.length > 0
          ) {
            // settotalListedNfts(listednftsArray.length);

            sethasListedNfts(true);
            await Promise.all(
              window.range(0, listednftsArray.length - 1).map(async (j) => {
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
                const tokenName = currentCollection.symbol;

                let owner;
                let userBalance = 0;

                if (is721) {
                  owner = await collection_contract.methods
                    .ownerOf(listednftsArray[j].tokenId)
                    .call()
                    .catch((e) => {
                      console.log(e);
                    });
                } else if (is1155) {
                  if (wallet) {
                    userBalance = await collection_contract.methods
                      .balanceOf(wallet, listednftsArray[j].tokenId)
                      .call()
                      .catch((e) => {
                        console.log(e);
                      });

                    if (userBalance > 0) {
                      owner = wallet;
                    }
                  }
                }

                const hasExpired = moment
                  .duration(listednftsArray[j].expiresAt * 1000 - Date.now())
                  .humanize(true)
                  .includes("ago");

                if (
                  !hasExpired &&
                  owner?.toLowerCase() ===
                    listednftsArray[j].seller.toLowerCase()
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
                    });
                  }
                }
              })
            );
          }

          await Promise.all(
            window.range(0, limit - 1).map(async (i) => {
              let owner;
              let userBalance = 0;

              if (is721) {
                owner = await collection_contract.methods
                  .ownerOf(allNftsArrayFiltered[i])
                  .call()
                  .catch((e) => {
                    console.log(e);
                  });
              } else if (is1155) {
                owner = await collection_contract.methods
                  .balanceOf(wallet, allNftsArrayFiltered[i])
                  .call()
                  .catch((e) => {
                    console.log(e);
                  });

                if (userBalance > 0) {
                  owner = wallet;
                }
              }

              const tokenName = currentCollection?.symbol;

              const nft_data = await fetch(
                `https://cdnflux.dypius.com/collectionsmetadatas/${collectionAddress.toLowerCase()}/${
                  allNftsArrayFiltered[i]
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
                nftArray.push({
                  ...nft_data,
                  tokenId: allNftsArrayFiltered[i],
                  owner: owner,
                  tokenName: tokenName,
                });
              } else {
                nftArray.push({
                  tokenId: allNftsArrayFiltered[i],
                  name: `#${allNftsArrayFiltered[i]}`,
                  owner: owner,
                  tokenName: tokenName,
                  metadatas: false,
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
      } else {
        setnftArrayFilteredBySearch([]);
        setLoading(false);
        setAllNftArray([]);
      }
    } else {
      setnftArrayFilteredBySearch([]);
      setLoading(false);
      // setAllNftArray([]);
    }
  };

  const filterItemsByTraits = async (selectedTraits) => {
    setLoading(true);
    setisSearchTrait(true);
    setAllNftArray([]);
    const tokenIds = [];
    for (const tokenId in collectionJson.singleTokenTraits) {
      for (const type in selectedTraits) {
        const traitValue = selectedTraits[type];

        if (
          Object.keys(
            collectionJson.singleTokenTraits[tokenId][traitValue.type]
          )[0].toLowerCase() === traitValue.value.toLowerCase() &&
          Object.values(
            collectionJson.singleTokenTraits[tokenId][traitValue.type]
          )[0] == 1
        ) {
          tokenIds.push(tokenId);
        }
      }
    }

    if (tokenIds && tokenIds.length > 0) {
      setNtftArrayFilteredByTraits(tokenIds);

      const abi_1155 = new window.confluxWeb3.eth.Contract(
        window.BACKUP_ABI,
        collectionAddress
      );
      const abi_721 = new window.confluxWeb3.eth.Contract(
        window.ERC721_ABI,
        collectionAddress
      );

      const is721 = await abi_721.methods
        .supportsInterface(window.config.erc721_id)
        .call()
        .catch((e) => {
          console.error(e);
          return false;
        });
      const is1155 = await abi_1155.methods
        .supportsInterface(window.config.erc1155_id)
        .call()
        .catch((e) => {
          console.error(e);
          return false;
        });

      const abi_final = is1155
        ? window.BACKUP_ABI
        : is721
        ? window.ERC721_ABI
        : window.ERC721_ABI;

      const listednfts = await axios
        .get(
          `${baseURL}/api/collections/${collectionAddress.toLowerCase()}/listings`,
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

      if (abi_final && listednfts && listednfts.status === 200) {
        let nftArray = [];
        let nftListedArray = [];

        const abi = abi_final;
        const listednftsArray = listednfts.data.listings;
        const web3 = window.confluxWeb3;
        const collection_contract = new web3.eth.Contract(
          abi,
          collectionAddress
        );

        const limit =
          tokenIds.length > nextSearchTraits
            ? nextSearchTraits
            : tokenIds.length;
        const wallet = await window.getCoinbase().then((data) => {
          return data;
        });
        if (
          listednftsArray !== "none" &&
          listednftsArray &&
          listednftsArray.length > 0
        ) {
          // settotalListedNfts(listednftsArray.length);

          sethasListedNfts(true);
          await Promise.all(
            window.range(0, listednftsArray.length - 1).map(async (j) => {
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
              const tokenName = currentCollection.symbol;

              let owner;
              let userBalance = 0;

              if (is721) {
                owner = await collection_contract.methods
                  .ownerOf(listednftsArray[j].tokenId)
                  .call()
                  .catch((e) => {
                    console.log(e);
                  });
              } else if (is1155) {
                if (wallet) {
                  userBalance = await collection_contract.methods
                    .balanceOf(wallet, listednftsArray[j].tokenId)
                    .call()
                    .catch((e) => {
                      console.log(e);
                    });

                  if (userBalance > 0) {
                    owner = wallet;
                  }
                }
              }

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
                  });
                }
              }
            })
          );
        }

        await Promise.all(
          window.range(0, limit - 1).map(async (i) => {
            let owner;
            let userBalance = 0;

            if (is721) {
              owner = await collection_contract.methods
                .ownerOf(tokenIds[i])
                .call()
                .catch((e) => {
                  console.log(e);
                });
            } else if (is1155) {
              if (wallet) {
                userBalance = await collection_contract.methods
                  .balanceOf(wallet, tokenIds[i])
                  .call()
                  .catch((e) => {
                    console.log(e);
                  });

                if (userBalance > 0) {
                  owner = wallet;
                }
              }
            }

            const tokenName = currentCollection?.symbol;

            const nft_data = await fetch(
              `https://cdnflux.dypius.com/collectionsmetadatas/${collectionAddress.toLowerCase()}/${
                tokenIds[i]
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
              nftArray.push({
                ...nft_data,
                tokenId: tokenIds[i],
                owner: owner,
                tokenName: tokenName,
              });
            } else {
              nftArray.push({
                tokenId: tokenIds[i],
                name: `#${tokenIds[i]}`,
                owner: owner,
                tokenName: tokenName,
                metadatas: false,
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
      }
    } else {
      setNtftArrayFilteredByTraits([]);
      setLoading(false);
      setAllNftArray([]);
    }
  };

  const fetchInitialNftsPerCollection = async () => {
    setLoading(true);

    const abi_1155 = new window.confluxWeb3.eth.Contract(
      window.BACKUP_ABI,
      collectionAddress
    );
    const abi_721 = new window.confluxWeb3.eth.Contract(
      window.ERC721_ABI,
      collectionAddress
    );

    const is721 = await abi_721.methods
      .supportsInterface(window.config.erc721_id)
      .call()
      .catch((e) => {
        console.error(e);
        return false;
      });
    const is1155 = await abi_1155.methods
      .supportsInterface(window.config.erc1155_id)
      .call()
      .catch((e) => {
        console.error(e);
        return false;
      });

    const abi_final = is1155
      ? window.BACKUP_ABI
      : is721
      ? window.ERC721_ABI
      : window.ERC721_ABI;

    const listednfts = await axios
      .get(
        `${baseURL}/api/collections/${collectionAddress.toLowerCase()}/listings`,
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

    if (abi_final && listednfts && listednfts.status === 200) {
      let nftArray = [];
      let nftListedArray = [];
      let totalSupply = parseInt(currentCollection.totalSupply);

      const abi = abi_final;
      const listednftsArray = listednfts.data.listings;
      const web3 = window.confluxWeb3;
      const collection_contract = new web3.eth.Contract(abi, collectionAddress);
      const wallet = await window.getCoinbase().then((data) => {
        return data;
      });

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
              const tokenName = currentCollection.symbol;

              const offersresultListed = await window
                .getAllOffers(
                  collectionAddress.toLowerCase(),
                  listednftsArray[j].tokenId
                )
                .catch((e) => {
                  console.log(e);
                });
              if (offersresultListed) {
                const finalOfferResultListed = offersresultListed[1];

                if (
                  finalOfferResultListed &&
                  finalOfferResultListed.length > 0
                ) {
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

              let owner;
              let userBalance = 0;

              if (is721) {
                owner = await collection_contract.methods
                  .ownerOf(listednftsArray[j].tokenId)
                  .call()
                  .catch((e) => {
                    console.log(e);
                  });
              } else if (is1155) {
                if (wallet) {
                  userBalance = await collection_contract.methods
                    .balanceOf(wallet, listednftsArray[j].tokenId)
                    .call()
                    .catch((e) => {
                      console.log(e);
                    });

                  if (userBalance > 0) {
                    owner = wallet;
                  }
                }
              }

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
                    owner: owner,
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
            // let price= 0;
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

            let finalOfferResult = [];
            const offersresult = await window
              .getAllOffers(collectionAddress.toLowerCase(), tokenByIndex)
              .catch((e) => {
                console.log(e);
              });
            if (offersresult) {
              finalOfferResult = offersresult[1];
            }

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

            let owner;
            let userBalance = 0;

            if (is721) {
              owner = await collection_contract.methods
                .ownerOf(tokenByIndex)
                .call()
                .catch((e) => {
                  console.log(e);
                });
            } else if (is1155) {
              if (wallet) {
                userBalance = await collection_contract.methods
                  .balanceOf(wallet, tokenByIndex)
                  .call()
                  .catch((e) => {
                    console.log(e);
                  });

                if (userBalance > 0) {
                  owner = wallet;
                }
              }
            }

            const tokenName = currentCollection.symbol;

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
              nftArray.push({
                ...nft_data,
                tokenId: tokenByIndex,
                owner: owner,
                tokenName: tokenName,
                bestOffer: bestOffer,
                lastSale: lastSale,
              });
            } else {
              nftArray.push({
                tokenId: tokenByIndex,
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
        const uniqueArrayListed = nftListedArray.filter(
          (value, index, self) =>
            self.findIndex((v) => v.tokenId === value.tokenId) === index
        );

        const uniqueArray = finalArray_sorted.filter(
          ({ tokenId: id1 }) =>
            !uniqueArrayListed.some(
              ({ tokenId: id2 }) => id2.toString() === id1.toString()
            )
        );

        const finalArray = [...uniqueArrayListed, ...uniqueArray];
        setAllNftArray(finalArray);
        setLoading(false);
      } else {
        setLoading(false);
        setAllNftArray([]);
      }
    }
  };

  const fetchSlicedNftsPerCollection = async (slice) => {
    let nftArray = [];
    let totalSupply = parseInt(currentCollection.totalSupply);
    setLoading(true);

    const abi_1155 = new window.confluxWeb3.eth.Contract(
      window.BACKUP_ABI,
      collectionAddress
    );
    const abi_721 = new window.confluxWeb3.eth.Contract(
      window.ERC721_ABI,
      collectionAddress
    );

    const is721 = await abi_721.methods
      .supportsInterface(window.config.erc721_id)
      .call()
      .catch((e) => {
        console.error(e);
        return false;
      });
    const is1155 = await abi_1155.methods
      .supportsInterface(window.config.erc1155_id)
      .call()
      .catch((e) => {
        console.error(e);
        return false;
      });

    const abi_final = is1155
      ? window.BACKUP_ABI
      : is721
      ? window.ERC721_ABI
      : window.ERC721_ABI;

    if (abi_final) {
      const abi = abi_final;
      const web3 = window.confluxWeb3;
      const collection_contract = new web3.eth.Contract(abi, collectionAddress);

      if (
        totalSupply &&
        totalSupply > 0 &&
        next !== 0 &&
        Number(totalSupply) >= 12
      ) {
        const limit = totalSupply >= next ? next : totalSupply;
        const wallet = await window.getCoinbase().then((data) => {
          return data;
        });

        await Promise.all(
          window.range(next, limit + nftPerRow - 1).map(async (i) => {
            let tokenByIndex = 0;
            let bestOffer = 0;
            let lastSale = 0;

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

            let finalOfferResult = [];

            const offersresult = await window
              .getAllOffers(collectionAddress.toLowerCase(), tokenByIndex)
              .catch((e) => {
                console.log(e);
              });
            if (offersresult) {
              finalOfferResult = offersresult[1];
            }

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

            let owner;
            let userBalance = 0;

            if (is721) {
              owner = await collection_contract.methods
                .ownerOf(tokenByIndex)
                .call()
                .catch((e) => {
                  console.log(e);
                });
            } else if (is1155) {
              if (wallet) {
                userBalance = await collection_contract.methods
                  .balanceOf(wallet, tokenByIndex)
                  .call()
                  .catch((e) => {
                    console.log(e);
                  });

                if (userBalance > 0) {
                  owner = wallet;
                }
              }
            }

            const tokenName = currentCollection.symbol;

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
              nftArray.push({
                ...nft_data,
                tokenId: tokenByIndex,
                owner: owner,
                tokenName: tokenName,
                bestOffer: bestOffer,
                lastSale: lastSale,
              });
            } else {
              nftArray.push({
                tokenId: tokenByIndex,
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

  const loadMoreSearch = () => {
    setnextSearch(nextSearch + nftPerRow);
  };

  const loadMoreTraits = () => {
    setnextSearchTraits(nextSearchTraits + nftPerRow);
  };

  // const onScroll = () => {
  //   if (filter === null && showBtn) {
  //     const wrappedElement = document.getElementById("header2");
  //     if (wrappedElement) {
  //       const isBottom =
  //         parseInt(wrappedElement.getBoundingClientRect()?.bottom) <=
  //         window.innerHeight;
  //       if (isBottom && allNftArray.length > 0) {
  //         if (next <= totalSupplyPerCollection && totalSupplyPerCollection>12) {
  //           loadMore();
  //           document.removeEventListener("scroll", onScroll);
  //         }
  //       }
  //     }
  //   }
  // };

  const checkIfImageisValid = async (image) => {
    const result = await fetch(
      `https://confluxapi.worldofdypians.com/${image}`
    ).catch((e) => {
      console.error(e);
    });
    if (result && result.status === 200) {
      return `https://confluxapi.worldofdypians.com/${image}`;
    } else return undefined;
  };

  const fetchCurrentCollection = async (collectionAddr) => {
    const result = allCollections.filter((item) => {
      return (
        item.contractAddress.toLowerCase() === collectionAddr.toLowerCase()
      );
    });
    console.log("result", result);
    if (result && result.length > 0) {
      const result2 = await Promise.all(
        result.map(async (item) => {
          return {
            ...item,
            coll_banner: await checkIfImageisValid(
              item.collectionBackgroundPic
            ),
            coll_logo: await checkIfImageisValid(item.collectionProfilePic),
          };
        })
      );

      setcurrentCollection(...result2);
      let totalSupply = parseInt(result[0].totalSupply);
      settotalSupplyPerCollection(totalSupply);
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
      if (
        userCollectionFavs.find(
          (obj) => obj === collectionAddress.toLowerCase()
        )
      ) {
        setFavorite(true);
      } else {
        setFavorite(false);
      }
    }
  };

  const handleAddFavorite = async () => {
    if (coinbase && collectionAddress) {
      const data = {
        contractAddress: collectionAddress.toLowerCase(),
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
        contractAddress: collectionAddress.toLowerCase(),
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
      .get(
        `${baseURL}/api/refresh-floor-price/${collectionAddress.toLowerCase()}`,
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
      setfloorPrice(result.data.floorPrice / 1e18);
    }
  };

  const getCollectionTotalVolume = async () => {
    const result = await axios
      .get(
        `${baseURL}/api/refresh-collection-volume/${collectionAddress.toLowerCase()}`,
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
      // setfloorPrice(result.data.floorPrice / 1e18);
    }
  };

  const getCollectionInfo = async () => {
    const result = await axios
      .get(
        `${baseURL}/api/collection-info/${collectionAddress.toLowerCase()}`,
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
      setcollectionFeeRate(result.data.collectionFeeRate / 10);
    }
  };

  const getCollectionUniqueOwners = async () => {
    const result = await axios
      .get(`${baseURL}/api/unique-owners/${collectionAddress.toLowerCase()}`, {
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
      .getAllCollectionOffers(collectionAddress.toLowerCase())
      .catch((e) => {
        console.log(e);
      });

    if (result) {
      let finalArray = [];
      let offerArray = [];
      let allOffersArray = [];
      const web3 = window.confluxWeb3;
      const finalResult = result[1];

      if (finalResult && finalResult.length > 0) {
        await Promise.all(
          window.range(0, finalResult.length - 1).map(async (i) => {
            const hasExpired = moment
              .duration(finalResult[i].expiresAt * 1000 - Date.now())
              .humanize(true)
              .includes("ago");

            if (!hasExpired) {
              return allOffersArray.push({
                ...finalResult[i],
                index: i,
              });
            }
          })
        );
        setallOffers(allOffersArray);
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
        setallOffers([]);
      }
    }
  };
  const handleMakeOffer = async (price, duration) => {
    if (price !== "" && price !== 0) {
      setOfferStatus("loading");
      const newPrice = new BigNumber(price * 1e18).toFixed();
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

  const handleShowAcceptPopup = async (offerObj) => {
    setshowOfferAcceptPopup(true);
    setselectedOffer(offerObj);
  };

  const getUpdatedNftData = async () => {
    await axios
      .get(
        `${baseURL}/api/collections/${collectionAddress.toLowerCase()}/refresh-listings`,
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
  };

  const refreshListingsNftData = async () => {
    if (window.location.pathname.includes("/collection")) {
      const result = await axios
        .get(
          `${baseURL}/api/collections/${collectionAddress.toLowerCase()}/refresh-listings`,
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

      if (
        result &&
        result.status === 200 &&
        allNftArray &&
        allNftArray.length > 0
      ) {
        const listednfts = result.data.listings;
        if (listednfts !== "none" && listednfts && listednfts.length > 0) {
          const uniqueArray_listed = listednfts.filter(
            ({ tokenId: id1 }) =>
              !allNftArray.some(
                ({ tokenId: id2 }) => id1.toString() == id2.toString()
              )
          );

          if (uniqueArray_listed && uniqueArray_listed.length > 0) {
            fetchInitialNftsPerCollection();
          }
        }
      }
    }
  };

  const refreshUserHistory = async (wallet, nftId) => {
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

  const fetchNftSaleHistory = async (nftAddr, nftId) => {
    await axios
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

  const acceptOfferFunc = async (
    contractAddress,
    selectedId,
    offerIndex,
    offeror
  ) => {
    setOfferacceptStatus("loading");
    await window
      .acceptCollectionOffer(contractAddress, selectedId, offerIndex)
      .then(() => {
        refreshUserHistory(coinbase, selectedId);
        refreshUserHistory(offeror, selectedId);
        getUserOffersForCollection();
        getCollectionTotalVolume();
        getUpdatedNftData().then(() => {
          fetchInitialNftsPerCollection();
          fetchNftSaleHistoryCache(contractAddress, selectedId);
          getCollectionFloorPrice();
          onRefreshListings();
        });
        setOfferacceptStatus("success");
        setTimeout(() => {
          setOfferacceptStatus("initial");
          setshowOfferAcceptPopup(false);
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

  const handleAcceptOffer = async (offerIndex, selectedId, offeror) => {
    setOfferacceptStatus("loading");
    const isApproved = await window
      .isApprovedNFT(collectionAddress, coinbase)
      .then((data) => {
        return data;
      })
      .catch((e) => {
        console.log(e);
        setOfferacceptStatus("fail");
        setTimeout(() => {
          setOfferacceptStatus("initial");
        }, 4000);
      });

    if (isApproved) {
      acceptOfferFunc(collectionAddress, selectedId, offerIndex, offeror);
    } else {
      await window
        .approveNFT(collectionAddress)
        .then(() => {
          setOfferacceptStatus("success");
          setTimeout(() => {
            acceptOfferFunc(collectionAddress, selectedId, offerIndex, offeror);
          }, 1000);
        })
        .catch((e) => {
          setOfferacceptStatus("fail");
          setTimeout(() => {
            setOfferacceptStatus("initial");
          }, 4000);
          console.log(e);
        });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (userNftsOwnedArray && userNftsOwnedArray.length > 0) {
      filterUserArray();
    }
  }, [userNftsOwnedArray]);

  useEffect(() => {
    getUserOffersForCollection();
  }, [coinbase]);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getCollectionFloorPrice();
    fetchCollectionJson();
    getCollectionTotalSupply();
    getCollectionInfo();
    getCollectionUniqueOwners();
    getCollectionTotalVolume();
  }, []);
  useEffect(() => {
    if (isNewCollection) {
      dataFetchedRef.current = false;
      getCollectionFloorPrice();
      fetchInitialNftsPerCollection().then(() => {
        onNewCollectionFetched();
      });
      getCollectionInfo();
      fetchCollectionJson();
      getCollectionTotalVolume();
      getUserOffersForCollection();
      getCollectionUniqueOwners();
    }
  }, [isNewCollection]);

  useEffect(() => {
    if (next !== 0) {
      fetchSlicedNftsPerCollection();
    }
  }, [next]);

  useEffect(() => {
    if (nextSearch !== 40) {
      fetchSearchNftsPerCollection(tokenToSearch);
    }
  }, [nextSearch]);

  useEffect(() => {
    if (nextSearchTraits !== 40) {
      filterItemsByTraits(traitToSearch);
    }
  }, [nextSearchTraits]);

  useEffect(() => {
    checkifFavorite();
  }, [collectionAddress, userCollectionFavs]);

  useEffect(() => {
    if (allCollections && allCollections.length > 0) {
      fetchCurrentCollection(collectionAddress);
    }
  }, [collectionAddress, allCollections]);

  useEffect(() => {
    const interval = setInterval(async () => {
      refreshListingsNftData();
      return () => clearInterval(interval);
    }, 10000);
  }, [allNftArray.length, window.location]);

  useEffect(() => {
    if (!isNaN(totalSupplyPerCollection)) fetchInitialNftsPerCollection();
  }, [totalSupplyPerCollection]);

  // useEffect(() => {
  //   if (filter === null) {
  //     window.addEventListener("scroll", onScroll);
  //   }
  // }, [filter,next,totalSupplyPerCollection]);

  // useEffect(() => {
  // if (filter === null) {
  // window.addEventListener("scroll", onScroll);
  // return () => window.removeEventListener("scroll", onScroll);
  // }
  // });

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
            currentCollection.coll_logo
              ? `${currentCollection.coll_logo}`
              : collectionIcon
          }
          banner={
            currentCollection.coll_banner
              ? `${currentCollection.coll_banner}`
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
          onFilterTraits={(val) => {
            filterItemsByTraits(val);
            settraitToSearch(val);
          }}
          offerData={offerData}
          collectionJson={collectionJson}
          currentCollection={currentCollection}
          getRecentlySold={handleGetRecentlySoldNfts}
          allNftArray={allNftArray}
          nftArrayFilteredBySearch={nftArrayFilteredBySearch}
          ntftArrayFilteredByTraits={ntftArrayFilteredByTraits}
          isSearch={isSearch}
          isSearchTrait={isSearchTrait}
          collectionAddress={collectionAddress}
          loading={loading}
          handleAddFavoriteNft={handleAddFavoriteNft}
          handleRemoveFavoriteNft={handleRemoveFavoriteNft}
          userNftFavs={userNftFavs}
          cfxPrice={cfxPrice}
          coinbase={coinbase}
          onRefreshListings={() => {
            fetchInitialNftsPerCollection();
            onRefreshListings();
          }}
          totalSupplyPerCollection={totalSupplyPerCollection}
          hasListedNfts={hasListedNfts}
          getFilter={getFilter}
          fetchSearchNftsPerCollection={(value) => {
            fetchSearchNftsPerCollection(value);
            settokenToSearch(value);
          }}
          onClearAll={() => {
            setAllNftArray([]);
            setLoading(true);
            setisSearch(false);
            setisSearchTrait(false);
            setnftArrayFilteredBySearch([]);
            setTimeout(() => {
              fetchInitialNftsPerCollection();
            }, 1000);
          }}
          onShowPopup={() => {
            setshowOfferPopup(true);
          }}
          allOffers={allOffers}
          bestOffer={bestOffer}
          onShowAcceptPopup={handleShowAcceptPopup}
          isVerified={currentCollection.verified === "yes" ? true : false}
          onSelectCollecitonOffers={(value) => {
            setshowBtn(value);
          }}
          userNftsOwned={userNftsOwned}
        />

        {totalSupplyPerCollection &&
          next <= totalSupplyPerCollection &&
          totalSupplyPerCollection > 0 &&
          loading === false &&
          totalSupplyPerCollection > 12 &&
          isSearch === false &&
          isSearchTrait === false &&
          showBtn && (
            <div className="d-flex justify-content-center mt-5">
              <button className="buy-btn px-5 m-auto" onClick={loadMore}>
                Load more
              </button>
            </div>
          )}

        {nftArrayFilteredBySearch &&
          nextSearch < nftArrayFilteredBySearch.length &&
          loading === false &&
          totalSupplyPerCollection > 12 &&
          isSearch === true && (
            <div className="d-flex justify-content-center mt-5">
              <button className="buy-btn px-5 m-auto" onClick={loadMoreSearch}>
                Load more
              </button>
            </div>
          )}

        {ntftArrayFilteredByTraits &&
          nextSearchTraits < ntftArrayFilteredByTraits.length &&
          loading === false &&
          totalSupplyPerCollection > 12 &&
          isSearchTrait === true && (
            <div className="d-flex justify-content-center mt-5">
              <button className="buy-btn px-5 m-auto" onClick={loadMoreTraits}>
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
          floorPrice={currentCollection.floorPrice}
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

      {showOfferAcceptPopup === true && (
        <AcceptOfferForCollection
          open={showOfferAcceptPopup}
          onclose={() => {
            setshowOfferAcceptPopup(false);
          }}
          coinbase={coinbase}
          floorPrice={floorPrice}
          nftData={selectedOffer}
          currentCollection={currentCollection}
          cfxPrice={cfxPrice}
          wcfxBalance={wcfxBalance}
          totalSupplyPerCollection={totalSupplyPerCollection}
          uniqueOwners={uniqueOwners}
          uniqueOwnersPercentage={uniqueOwnersPercentage}
          collectionFeeRate={collectionFeeRate}
          status={offerStatus}
          offerData={offerData}
          bestOffer={bestOffer}
          userNftsOwnedArray={userownedNftFilteredArray}
          handleAcceptOffer={handleAcceptOffer}
          offeracceptStatus={offeracceptStatus}
        />
      )}
    </>
  );
};

export default CollectionPage;
