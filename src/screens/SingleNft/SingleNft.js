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
}) => {
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [nftData, setNftData] = useState([]);
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
      .get(`${baseURL}/api/recent-active-listings`, {
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
      const abi = JSON.parse(abiresult.data.result);
      const collection_contract = new web3.eth.Contract(abi, nftAddress);
      const owner = await collection_contract.methods
        .ownerOf(nftId)
        .call()
        .catch((e) => {
          console.error(e);
        });
      let isListed = false;
      let price = 0;
      if (listednfts.data.length > 0) {
        const filteredResult = listednfts.data.find((item) => {
          return item.nftAddress === nftAddress && item.tokenId === nftId;
        });

        if (filteredResult) {
          isListed = true;
          price = filteredResult.price;
        }
      }

      const collectionName = await collection_contract.methods
        .name()
        .call()
        .catch((e) => {
          console.error(e);
        });

      const nftdata = await fetch(
        `https://cdnflux.dypius.com/collectionsmetadatas/${nftAddress}/${nftId}/metadata.json`
      )
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          return data;
        })
        .catch((err) => {
          console.log(err.message);
        });
      if (nftdata) {
        finalArray.push({
          ...nftdata,
          owner: owner,
          collectionName: collectionName,
          isListed: isListed,
          price: price,
        });
        setNftData(...finalArray);
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
      />
      <SingleNftHistory />
      <NftTraits nftData={nftData} />
      <MoreFromCollection />
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
