import React from "react";
import "./_homestats.scss";

const HomeStats = () => {
  return (
    <div className="container-fluid  py-5 homestats-wrapper">
      <div className="container-lg px-0 d-flex flex-column flex-lg-row align-items-center justify-content-between mt-4 gap-2 gap-lg-0">
        <div className="hero-stats-item p-5 d-flex flex-column align-items-center justify-content-center gap-2">
          <h6 className="stats-item-amount mb-0">47,964</h6>
          <span className="stats-item-desc mb-0">Total transactions</span>
        </div>
        <div className="hero-stats-item p-5 d-flex flex-column align-items-center justify-content-center gap-2">
          <h6 className="stats-item-amount mb-0">$4,106,755</h6>
          <span className="stats-item-desc mb-0">Total Volume (USD)</span>
        </div>
        <div className="hero-stats-item p-5 d-flex flex-column align-items-center justify-content-center gap-2">
          <h6 className="stats-item-amount mb-0">12,568</h6>
          <span className="stats-item-desc mb-0">Sold NFTs</span>
        </div>
      </div>
    </div>
  );
};

export default HomeStats;
