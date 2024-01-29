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
}) => {
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [nftData, setNftData] = useState([]);
  const [count, setCount] = useState(0);
  const [allNftArray, setAllNftArray] = useState([]);
  const [loading, setLoading] = useState(false);

  const { nftId, nftAddress } = useParams();
  const dataFetchedRef = useRef(false);
  const baseURL = "https://confluxapi.worldofdypians.com";

  // console.log(nftId, nftAddress);

  const getNftData = async (nftID) => {
    const web3 = window.confluxWeb3;
    setLoading(true);
    let finalArray = [];
    let favoriteCount = 0;
    const abiresult = await axios.get(
      `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${nftAddress}`
    );

    const listednfts = await axios
      .get(`${baseURL}/api/collections/${nftAddress}/listings`, {
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
      const collection_contract = new web3.eth.Contract(abi, nftAddress);

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
        .get(`${baseURL}/api/nftFavoritesCount/${nftAddress}/${nftID}`, {
          headers: {
            cascadestyling:
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
          },
        })
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
            object.tokenId === (nftID)
        );

        const nftdata = await fetch(
          `https://cdnflux.dypius.com/collectionsmetadatas/${nftAddress}/${nftID}/metadata.json`
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
            owner: (owner).toLowerCase(),
            collectionName: collectionName,
            isListed: isListed,
            price: price,
            listingIndex: listingIndex,
            expiresAt: expiresAt,
            favoriteCount: favoriteCount,
            nftSymbol: nftSymbol
          });
          setNftData(...finalArray);
          setLoading(false);
        }
      } else {
        const nftdata = await fetch(
          `https://cdnflux.dypius.com/collectionsmetadatas/${nftAddress}/${nftID}/metadata.json`
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
            owner: (owner).toLowerCase(),
            collectionName: collectionName,
            isListed: false,
            price: 0,
            listingIndex: 0,
            expiresAt: expiresAt,
            favoriteCount: favoriteCount,
            nftSymbol: nftSymbol
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
      `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${nftAddress}`
    );

    const listednfts = await axios
      .get(`${baseURL}/api/collections/${nftAddress}/refresh-listings`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
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
            `https://cdnflux.dypius.com/collectionsmetadatas/${nftAddress}/${nftId}/metadata.json`
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
              nftSymbol: nftSymbol
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
      `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${nftAddress}`
    );
    const listednfts = await axios
      .get(`${baseURL}/api/collections/${nftAddress}/listings`, {
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
                `https://cdnflux.dypius.com/collectionsmetadatas/${nftAddress}/${listednftsArray[j].tokenId}/metadata.json`
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
                nftSymbol: nftSymbol

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
              `https://cdnflux.dypius.com/collectionsmetadatas/${nftAddress}/${tokenByIndex}/metadata.json`
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
                nftSymbol: nftSymbol
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
          getUpdatedNftData().then(()=>{
            onRefreshListings();  
          })
        
        }}
        handleSwitchNetwork={handleSwitchNetwork}
        loading={loading}
      />
      <SingleNftHistory />
      <NftTraits nftData={nftData} />
      <MoreFromCollection
        loading={loading}
        cfxPrice={cfxPrice}
        allNftArray={allNftArray}
        onNftClick={(value) => {
          console.log(value);
          getNftData(value)
        }}
      />
      {showOfferPopup && (
        <MakeOffer
          open={showOfferPopup}
          showPopup={() => setShowOfferPopup()}
        />
      )}
    </div>
  );
};

export default SingleNft;
