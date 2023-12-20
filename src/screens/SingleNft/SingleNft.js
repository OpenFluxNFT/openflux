import React, { useEffect, useState } from "react";
import SingleNftBanner from "../../components/SingleNft/SingleNftBanner/SingleNftBanner";
import SingleNftHistory from "../../components/SingleNft/SingleNftHistory/SingleNftHistory";
import SingleNftTraits from "../../components/SingleNft/SingleNftTraits/SingleNftTraits";
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
  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <SingleNftBanner />
      <SingleNftHistory />
      <SingleNftTraits />
      <NftTraits />
      <MoreFromCollection />
    </div>
  );
};

export default SingleNft;
