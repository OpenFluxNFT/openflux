import React from "react";
import "./_singlenftbanner.scss";
import cawsLogo from "./assets/cawsLogo.png";
import checkIcon from "./assets/checkIcon.svg";
import websiteIcon from "./assets/websiteIcon.svg";
import shareIcon from "./assets/shareIcon.svg";
import cfx from "./assets/cfx.svg";

const SingleNftBanner = ({ chainId, onShowMakeOfferPopup }) => {
  return (
    <div className="container-lg">
      <div className="nft-banner-wrapper p-3">
        <div className="row mx-0 gap-2 align-items-center justify-content-between">
          <div className="col-lg-6">
            <div className="row mx-0 justify-content-start gap-2">
              <div className="col-lg-6">
                <img
                  src="https://dypmeta.s3.us-east-2.amazonaws.com/caws_400x400/2.png"
                  alt=""
                  className="nft-image"
                />
              </div>
              <div className="col-lg-5">
                <div className="d-flex flex-column gap-2 h-100 justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      alt=""
                      src={cawsLogo}
                      className="nft-collection-logo"
                    />
                    <span className="collection-name">
                      Cats and watches society
                    </span>
                    <img alt="" src={checkIcon} />
                  </div>
                  <div className="collection-info-owner-wrapper">
                    <div className="d-flex flex-column gap-1 px-3 py-2">
                      <span className="nft-collection-name">CAWS #1264</span>
                      <div className="d-flex align-items-center gap-2">
                        <span className="nft-info-left">Owner</span>
                        <span className="nft-info-right">0x9100...b38f</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Views</span>
                    <span className="nft-info-right">1,243</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Favorites</span>
                    <span className="nft-info-right">341</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Creator earning</span>
                    <span className="nft-info-right">5%</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Last Sale</span>
                    <span className="nft-info-right">128,210 CFX</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Best offer</span>
                    <span className="nft-info-right">100,000 CFX</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Chain</span>
                    <span className="nft-info-right">Conflux Network</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="single-nft-right-info-wrapper p-3">
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between gap-2 align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <span className="nft-item-name-right">CAWS #1264</span>
                    <img alt="" src={checkIcon} />
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <img alt="" src={websiteIcon} />
                    <img alt="" src={shareIcon} />
                  </div>
                </div>
                <div className="nft-price-wrapper p-3">
                  <div className="d-flex flex-column gap-2">
                    <span className="current-price-text">Current Price</span>
                    <div className="d-flex flex-column flex-lg-row flex-md-row gap-2 align-items-center">
                      <img src={cfx} alt="" />
                      <span className="nft-price-crypto">1,254.89 CFX</span>
                      <span className="nft-price-usd">($ 654,874.86)</span>
                    </div>
                  </div>
                </div>
                {chainId !== 1030 && (
                  <span className="error-status-text">
                    *Unsupported network. please change the chain on your wallet
                  </span>
                )}
                <div className="d-flex align-items-center gap-2 justify-content-center mt-4">
                  <button
                    className="btn make-offer-btn px-3 py-1 col-lg-3"
                    onClick={onShowMakeOfferPopup}
                  >
                    Make Offer
                  </button>
                  <button className="btn buy-nft-btn px-3 py-1 col-lg-3">
                    Buy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleNftBanner;
