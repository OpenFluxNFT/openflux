import React, { useEffect, useState, useRef } from "react";
import SingleNftBanner from "../../components/SingleNft/SingleNftBanner/SingleNftBanner";
import SingleNftHistory from "../../components/SingleNft/SingleNftHistory/SingleNftHistory";
import "./_singlenft.scss";
import NftTraits from "../../components/SingleNft/NftTraits/NftTraits";
import MoreFromCollection from "../../components/SingleNft/MoreFromCollection/MoreFromCollection";
import MakeOffer from "../../components/MakeOffer/MakeOffer";
import { useParams } from "react-router-dom";
import axios from "axios";

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
}) => {
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [nftData, setNftData] = useState([]);
  const [count, setCount] = useState(0);
  const [allNftArray, setAllNftArray] = useState([]);
  const [loading, setLoading] = useState(false);

  const [offerStatus, setOfferStatus] = useState("initial");
  const [offerdeleteStatus, setOfferdeleteStatus] = useState("initial");
  const [offerupdateStatus, setOfferupdateStatus] = useState("initial");
  const [offeracceptStatus, setOfferacceptStatus] = useState("initial");
  const [bestOffer, setbestOffer] = useState([]);
  const [offerData, setofferData] = useState([]);
  const [allOffers, setallOffers] = useState([]);
  const [lowestPriceNftListed, setlowestPriceNftListed] = useState(0);

  const { nftId, nftAddress } = useParams();
  const dataFetchedRef = useRef(false);
  const baseURL = "https://confluxapi.worldofdypians.com";
  const { BigNumber } = window;

  // console.log(nftId, nftAddress);

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
          console.error(e);
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
        console.error(e);
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
          console.error(e);
          setOfferupdateStatus("failupdate");

          setTimeout(() => {
            setOfferupdateStatus("initial");
          }, 3000);
        });
    } else window.alertify.error("Please put a valid price!");
  };

  const handleAcceptOffer = async (offerIndex) => {
    setOfferacceptStatus("loading");

    await window
      .acceptOffer(nftAddress, nftId, offerIndex)
      .then(() => {
        getUpdatedNftData().then(() => {
          onRefreshListings();
        });
        getOffer(nftAddress, nftId);
        setOfferacceptStatus("success");
        setTimeout(() => {
          setOfferacceptStatus("initial");
        }, 3000);
      })
      .catch((e) => {
        console.error(e);
        setOfferacceptStatus("fail");
        setTimeout(() => {
          setOfferacceptStatus("initial");
        }, 3000);
      });
  };

  const getOffer = async (nftAddr, nftId) => {
    let finalArray = [];
    let offerArray = [];
    let allOffersArray = [];

    const result = await window.getAllOffers(nftAddr, nftId).catch((e) => {
      console.error(e);
    });

    const finalResult = result[1];
    if (finalResult && finalResult.length > 0) {
      if (coinbase) {
        finalArray = finalResult.filter((object) => {
          return object.offeror.toLowerCase() === coinbase.toLowerCase();
        });

        let finalArrayIndex = finalResult.findIndex((object) => {
          return object.offeror.toLowerCase() === coinbase.toLowerCase();
        });
        offerArray = finalArray.map((item) => {
          return { ...item, index: finalArrayIndex };
        });

        const maxPrice = Math.max(...finalResult.map((o) => o.amount));
        const obj = finalResult.find((item) => item.amount == maxPrice);
        setbestOffer(obj);
        setofferData(...offerArray);
      }

      const contract = new window.confluxWeb3.eth.Contract(
        window.TOKEN_ABI,
        window.config.wcfx_address
      );

      await Promise.all(
        window.range(0, finalResult.length - 1).map(async (i) => {
          const balance = await window.ethereum
            .request({
              method: "eth_getBalance",
              params: [finalResult[i].offeror, "latest"],
            })
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
          return allOffersArray.push({
            ...finalResult[i],
            index: i,
            isAllowed: balance >= priceFormatted && allowance >= priceFormatted,
          });
        })
      );

      setallOffers(allOffersArray);
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
    const abiresult = await axios.get(
      `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${nftAddress.toLowerCase()}`
    );

    const listednfts = await axios
      .get(`${baseURL}/api/collections/${nftAddress.toLowerCase()}/listings`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (
      abiresult &&
      abiresult.status === 200 &&
      listednfts &&
      listednfts.status === 200
    ) {
      const listednftsArray = listednfts.data.listings;

      const abi = JSON.parse(abiresult.data.result);
      const collection_contract = new web3.eth.Contract(
        abi,
        nftAddress.toLowerCase()
      );

      const nftSymbol = await collection_contract.methods
        .symbol()
        .call()
        .catch((e) => {
          console.error(e);
        });

      const owner = await collection_contract.methods
        .ownerOf(nftID)
        .call()
        .catch((e) => {
          console.error(e);
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
          console.error(e);
        });

      if (fav_count && fav_count.status === 200) {
        favoriteCount = fav_count.data.count;
      }

      const collectionName = await collection_contract.methods
        .name()
        .call()
        .catch((e) => {
          console.error(e);
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
        let ethNftsAscArray = listednftsArray.sort((a, b) => {
          return a.price - b.price;
        });

        let ethNftsAscItem = ethNftsAscArray[0].price;
        setlowestPriceNftListed(ethNftsAscItem);

        if (filteredResult) {
          isListed = true;
          price = filteredResult.price;
          expiresAt = filteredResult.expiresAt;
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
        if (nftdata) {
          finalArray.push({
            ...nftdata,
            ...filteredResult,
            owner: owner.toLowerCase(),
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

        if (nftdata) {
          finalArray.push({
            ...nftdata,
            owner: owner.toLowerCase(),
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
        }
      }
    }
  };

  const getUpdatedNftData = async () => {
    const web3 = window.confluxWeb3;
    let finalArray = [];
    const abiresult = await axios.get(
      `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${nftAddress.toLowerCase()}`
    );

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
        console.error(e);
      });
    if (listednfts && listednfts.status === 200) {
      if (
        abiresult &&
        abiresult.status === 200 &&
        listednfts &&
        listednfts.status === 200
      ) {
        const listednftsArray = listednfts.data.listings;
        const abi = JSON.parse(abiresult.data.result);
        const collection_contract = new web3.eth.Contract(abi, nftAddress);

        const nftSymbol = await collection_contract.methods
          .symbol()
          .call()
          .catch((e) => {
            console.error(e);
          });

        const owner = await collection_contract.methods
          .ownerOf(nftId)
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
        let isListed = false;
        let price = 0;
        let expiresAt = 0;
        if (listednftsArray.length > 0) {
          const filteredResult = listednftsArray.find((item) => {
            return (
              item.tokenId === nftId &&
              item.nftAddress.toLowerCase() === nftAddress.toLowerCase()
            );
          });

          if (filteredResult) {
            isListed = true;
            price = filteredResult.price;
            expiresAt = filteredResult.expiresAt;
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
          if (nftdata) {
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
            });

            setNftData(...finalArray);
          }
        }
      }
    }
  };

  const fetchInitialNftsPerCollection = async () => {
    setLoading(true);
    const result = await axios.get(
      `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${nftAddress.toLowerCase()}`
    );
    const listednfts = await axios
      .get(`${baseURL}/api/collections/${nftAddress.toLowerCase()}/listings`, {
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
      const collection_contract = new web3.eth.Contract(abi, nftAddress);

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

      const nftSymbol = await collection_contract.methods
        .symbol()
        .call()
        .catch((e) => {
          console.error(e);
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

              if (nft_data_listed) {
                nftListedArray.push({
                  ...nft_data_listed,
                  ...listednftsArray[j],
                  nftSymbol: nftSymbol,
                });
              }
            })
          );
        }

        await Promise.all(
          window.range(0, limit - 1).map(async (i) => {
            let tokenByIndex = 0;
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
            const owner = await collection_contract.methods
              .ownerOf(tokenByIndex)
              .call()
              .catch((e) => {
                console.error(e);
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

            if (nft_data) {
              // console.log('nft_data', nft_data);
              nftArray.push({
                ...nft_data,
                tokenId: Number(tokenByIndex),
                owner: owner,
                nftAddress: nftAddress,
                nftSymbol: nftSymbol,
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getOffer(nftAddress, nftId);
  }, [coinbase, nftAddress, nftId]);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getNftData(nftId);

    fetchInitialNftsPerCollection();
  }, []);

  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <SingleNftBanner
        chainId={chainId}
        onShowMakeOfferPopup={() => {
          setShowOfferPopup(true);
        }}
        nftData={nftData}
        coinbase={coinbase}
        isConnected={isConnected}
        handleSignup={handleSignup}
        cfxPrice={cfxPrice}
        handleRefreshData={() => {
          getUpdatedNftData().then(() => {
            onRefreshListings();
          });
        }}
        handleSwitchNetwork={handleSwitchNetwork}
        loading={loading}
        offerData={offerData}
      />
      <SingleNftHistory
        allOffers={allOffers}
        cfxPrice={cfxPrice}
        nftData={nftData}
        coinbase={coinbase}
        handleAcceptOffer={handleAcceptOffer}
        offeracceptStatus={offeracceptStatus}
        lowestPriceNftListed={lowestPriceNftListed}
      />
      <NftTraits nftData={nftData} />
      <MoreFromCollection
        loading={loading}
        cfxPrice={cfxPrice}
        allNftArray={allNftArray}
        onNftClick={(value) => {
          getNftData(value);
          getOffer(nftAddress, value);
        }}
      />
      {showOfferPopup && (
        <MakeOffer
          open={showOfferPopup}
          showPopup={() => setShowOfferPopup()}
          nftData={nftData}
          cfxPrice={cfxPrice}
          balance={balance}
          handleMakeOffer={handleMakeOffer}
          handleDeleteOffer={handleDeleteOffer}
          handleUpdateOffer={handleUpdateOffer}
          status={offerStatus}
          deletestatus={offerdeleteStatus}
          updatestatus={offerupdateStatus}
          offerData={offerData}
          bestOffer={bestOffer}
        />
      )}
    </div>
  );
};

export default SingleNft;
