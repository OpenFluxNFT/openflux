import React from "react";
import "./_trendingsales.scss";
import cawsPlaceholder from './assets/cawsPlaceholder.png'
import timepiecePlaceholder from './assets/timepiecePlaceholder.png'
import wodPlaceholder from './assets/wodPlaceholder.png'
import checkIcon from './assets/checkIcon.svg'
import fireIcon from './assets/fireIcon.svg'
import mintIcon from './assets/mintIcon.svg'
import mintIconActive from './assets/mintIconActive.svg'
import topSalesIcon from './assets/topSalesIcon.svg'
import topSalesIconActive from './assets/topSalesIconActive.svg'
import trendingIcon from './assets/trendingIcon.svg'
import trendingIconActive from './assets/trendingIconActive.svg'



const TrendingSales = () => {
  return (
    <>
      <div className="container-lg">
        <div className="row">
        <h6 className="info-title mb-0">
        Data <span style={{ color: "#2F80ED" }}>Tracking</span>
      </h6>
        </div>
      </div>
      <div className="container-fluid trending-sales-wrapper py-4 px-0">
        <div className="container-lg">
          <div className="row">
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items center gap-3">
                    <div className="trending-tab trending-tab-active p-2 d-flex align-items-center gap-2">
                        <img src={trendingIconActive} alt="" />
                        <h6 className="mb-0">Trending</h6>
                    </div>
                    <div className="trending-tab p-2 d-flex align-items-center gap-2">
                        <img src={topSalesIcon} alt="" />
                        <h6 className="mb-0">Top Sales</h6>
                    </div>
                    <div className="trending-tab p-2 d-flex align-items-center gap-2">
                        <img src={mintIcon} alt="" />
                        <h6 className="mb-0">Mints</h6>
                    </div>
                </div>
                <div className="trending-tab d-flex align-items-center" style={{border: "1px solid #2f80ed"}}>
                  <div className="trending-tab  p-2">
                    <h6 className="mb-0">24h</h6>
                  </div>
                  <div className="trending-tab p-2">
                    <h6 className="mb-0">7D</h6>
                  </div>
                  <div className="trending-tab p-2">
                    <h6 className="mb-0">30D</h6>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrendingSales;
