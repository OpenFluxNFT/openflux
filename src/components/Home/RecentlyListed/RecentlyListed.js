import React from "react";
import "./_recentlylisted.scss";
import checkIcon from './assets/checkIcon.svg'

const RecentlyListed = () => {
  const dummyCards = [
    {
      title: "CAWS #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "CAWS #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "CAWS #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "Timepiece #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "Timepiece #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "Timepiece #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "Land #9999",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
    {
      title: "Land #9999",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
    },
  ];

  return (
    <div className="container-lg mt-5">
      <div className="row">
        <h6 className="info-title mb-0">
          Recently <span style={{ color: "#2F80ED" }}>Listed NFTs</span>
        </h6>
        <div className="recently-listed-grid mt-4">
         {dummyCards.map((item, index) => (
           <div className="recently-listed-card p-3 d-flex flex-column">
           <img src={require(`./assets/nftPlaceholder${index + 1}.png`)} className="card-img" alt="" />
           <div className="d-flex align-items-center gap-2 mt-2">
             <h6 className="recently-listed-title mb-0">
                 CAWS #1125
             </h6>
             <img src={checkIcon} alt="" />
           </div>
           <div className="d-flex align-items-center mt-2 gap-3">
             <h6 className="cfx-price mb-0">1254.89 CFX</h6>
             <span className="usd-price">($ 654,874.86)</span>
           </div>
           <div className="mt-3">
            <button className="buy-btn w-100">Buy</button>
           </div>
         </div>
         ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyListed;
