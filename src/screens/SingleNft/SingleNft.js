import React, { useEffect, useState } from "react";
import SingleNftBanner from "../../components/SingleNft/SingleNftBanner/SingleNftBanner";
import SingleNftHistory from "../../components/SingleNft/SingleNftHistory/SingleNftHistory";
import "./_singlenft.scss";
import NftTraits from "../../components/SingleNft/NftTraits/NftTraits";
import MoreFromCollection from "../../components/SingleNft/MoreFromCollection/MoreFromCollection";

const SingleNft = ({
  isConnected,
  chainId,
  coinbase,
  handleShowWalletModal,
  handleSwitchNetwork,
}) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  
  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <SingleNftBanner />
      <SingleNftHistory />
      <NftTraits />
      <MoreFromCollection />
    </div>
  );
};

export default SingleNft;
