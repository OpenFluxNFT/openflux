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

  const getNftData = async () => {
    const web3 = window.confluxWeb3;
    let finalArray = [];
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
          });
          setNftData(...finalArray);
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
            });

            setNftData(...finalArray);
          }
        }
        onRefreshListings();
      }
    }
  };


  const fetchInitialNftsPerCollection = async () => {
    setLoading(true);
    const test = window.getCoinbase();

    const result = await axios.get(
      `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${nftAddress}`
    );
    if (result && result.status === 200) {
      let nftArray = [];
      let totalSupply = 0;
      let favorite = false;
      const abi = JSON.parse(result.data.result);
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

      if (totalSupply && totalSupply > 0) {
        const limit = totalSupply >= 30 ? 30 : totalSupply;
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
              // console.log(nft_data);
              nftArray.push({
                ...nft_data,
                tokenId: Number(tokenByIndex),
                owner: owner,
              });
            }
          })
        );
        const finalArray = nftArray.sort((a, b) => {
          return a.tokenId - b.tokenId;
        });
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
    getNftData();
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
          getUpdatedNftData();
        }}
        handleSwitchNetwork={handleSwitchNetwork}
      />
      <SingleNftHistory />
      <NftTraits nftData={nftData} />
      <MoreFromCollection loading={loading} allNftArray={allNftArray} />
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
