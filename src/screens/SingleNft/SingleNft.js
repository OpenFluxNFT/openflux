import React, { useEffect, useState } from "react";
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
}) => {
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [nftData, setNftData] = useState([]);
  const { nftId, nftAddress } = useParams();

  const getNftData = async () => {
    const web3 = window.confluxWeb3;
    let finalArray = [];
    const abiresult = await axios.get(
      `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${nftAddress}`
    );
    if (abiresult && abiresult.status === 200) {
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

      const nftdata = await fetch(
        `https://cdnflux.dypius.com/collectionsmetadatas/${nftAddress}/${nftId}/metadata.json`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
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
        });
        setNftData(...finalArray);
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
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
