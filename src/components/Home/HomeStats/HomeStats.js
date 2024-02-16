import React, { useEffect, useState } from "react";
import "./_homestats.scss";
import axios from "axios";
import getFormattedNumber from "../../../hooks/get-formatted-number";

const HomeStats = ({cfxPrice}) => {

  const [totalVolume, setTotalVolume] = useState(0)
  const [soldNfts, setSoldNfts] = useState(0)


  const fetchSoldNfts = async() => {
    const response = await axios.get('https://confluxapi.worldofdypians.com/api/total-nfts-sold')

    setSoldNfts(response.data.totalNFTsSold)
  }

  const fetchTotalVolume = async () => {
    const response = await axios.get('https://confluxapi.worldofdypians.com/api/total-volume')
    setTotalVolume((response.data.totalVolume / 1e18 ) * cfxPrice)

    console.log(response.data.totalVolume, cfxPrice);


  }

  useEffect(() => {
   fetchSoldNfts();
   fetchTotalVolume();
  }, [cfxPrice])
  
console.log(totalVolume, "total");

  return (
    <div className="container-fluid  py-5 homestats-wrapper">
      <div className="container-lg px-0 d-flex flex-column flex-lg-row align-items-center justify-content-between mt-4 gap-2 gap-lg-0">
        <div className="hero-stats-item p-5 d-flex flex-column align-items-center justify-content-center gap-2">
          <h6 className="stats-item-amount mb-0">47,964</h6>
          <span className="stats-item-desc mb-0">Total transactions</span>
        </div>
        <div className="hero-stats-item p-5 d-flex flex-column align-items-center justify-content-center gap-2">
          <h6 className="stats-item-amount mb-0">${getFormattedNumber(totalVolume, 0)}</h6>
          <span className="stats-item-desc mb-0">Total Volume (USD)</span>
        </div>
        <div className="hero-stats-item p-5 d-flex flex-column align-items-center justify-content-center gap-2">
          <h6 className="stats-item-amount mb-0">{getFormattedNumber(soldNfts, 0)}</h6>
          <span className="stats-item-desc mb-0">Sold NFTs</span>
        </div>
      </div>
    </div>
  );
};

export default HomeStats;
