import React from "react";
import "./_collectionbanner.scss";
import bannerPlaceholder from "./assets/bannerPlaceholder.png";
import cawsIcon from "./assets/cawsIcon.png";
import confluxScanIcon from "./assets/confluxScanIcon.svg";
import discordIcon from "./assets/discordIcon.svg";
import favoriteIcon from "./assets/favoriteIcon.svg";
import followIcon from "./assets/followIcon.svg";
import instagramIcon from "./assets/instagramIcon.svg";
import twitterIcon from "./assets/twitterIcon.svg";
import websiteIcon from "./assets/websiteIcon.svg";
import telegramIcon from "./assets/telegramIcon.svg";
import checkIcon from "../../Collections/TopCollections/assets/checkIcon.svg";

const CollectionBanner = () => {
  return (
    <div className="container-lg py-5">
      <div className="row px-0">
        <div className="collection-banner d-flex flex-column px-0">
          <div className="collection-banner-up position-relative">
            <img src={bannerPlaceholder} className="w-100" alt="" />
            <div className="ps-5 collection-position">
              <div className="collection-banner-main-info d-flex flex-column flex-lg-row gap-3 gap-lg-0 align-items-start ps-3 py- ps-lg-5 pe-3 py-3 justify-content-between">
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-2 position-relative">
                    <img src={cawsIcon} className="collection-logo" alt="" />
                    <h6 className="collection-title mb-0">
                      Cats and Watches Society
                    </h6>
                    <img src={checkIcon} alt="" />
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center gap-1">
                      <span className="collection-info-span mb-0">Items</span>
                      <span className="collection-info mb-0">9,943</span>
                    </div>
                    <div className="info-divider"></div>
                    <div className="d-flex align-items-center gap-1">
                      <span className="collection-info-span mb-0">Created</span>
                      <span className="collection-info mb-0">Apr 2022</span>
                    </div>
                    <div className="info-divider"></div>
                    <div className="d-flex align-items-center gap-1">
                      <span className="collection-info-span mb-0">
                        Creator Earning
                      </span>
                      <span className="collection-info mb-0">5%</span>
                    </div>
                    <div className="info-divider"></div>
                    <div className="d-flex align-items-center gap-1">
                      <span className="collection-info-span mb-0">Chain</span>
                      <span className="collection-info mb-0">
                        Conflux Network
                      </span>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <a href="#" target="_blank">
                    <img src={websiteIcon} alt="" />
                  </a>
                  <a href="#" target="_blank">
                    <img src={twitterIcon} alt="" />
                  </a>
                  <a href="#" target="_blank">
                    <img src={telegramIcon} alt="" />
                  </a>
                  <a href="#" target="_blank">
                    <img src={discordIcon} alt="" />
                  </a>
                  <a href="#" target="_blank">
                    <img src={instagramIcon} alt="" />
                  </a>
                  <a href="#" target="_blank">
                    <img src={confluxScanIcon} alt="" />
                  </a>
                  <div
                    className="info-divider"
                    style={{ height: "25px" }}
                  ></div>
                  <img src={favoriteIcon} alt="" />
                  <img src={followIcon} alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="collection-banner-down py-3 ps-3 ps-lg-5">
            <div className="d-flex align-items-start flex-column flex-lg-row gap-3 gap-lg-0 justify-content-between ps-3 ps-lg-5 pe-3">
              <p className="collection-desc mb-0">
                Cats and Watches Society (CAWS) is a collection of 10,000 NFTs
                developed by Dypius, one of the most experienced and innovative
                projects in decentralized finance. Through the adoption process,
                your cat will be fitted with a cool luxury watch and will also
                grant you access to the members-only Society Benefits Zone. As a
                new cat owner, you can join the CAWS staking pool to earn 50%
                APR in ETH rewards. Cats and Watches Society is also building
                its own Metaverse with an exciting play-to-earn (P2E) game still
                in development.
              </p>
              <div className="collection-amounts-grid">
                <div className="d-flex flex-column gap-1">
                    <span className="collection-amount-span mb-0">
                        Total Volume
                    </span>
                    <div className="collection-amount-wrapper p-2 d-flex align-items-center justify-content-between">
                        <h6 className="collection-amount">
                            23.6M+
                        </h6>
                        <h6 className="collection-amount">
                            CFX
                        </h6>
                    </div>
                </div>
                <div className="d-flex flex-column gap-1">
                    <span className="collection-amount-span mb-0">
                        Floor price
                    </span>
                    <div className="collection-amount-wrapper p-2 d-flex align-items-center justify-content-between">
                        <h6 className="collection-amount">
                        128,254.8
                        </h6>
                        <h6 className="collection-amount">
                            CFX
                        </h6>
                    </div>
                </div>
                <div className="d-flex flex-column gap-1">
                    <span className="collection-amount-span mb-0">
                        Listed
                    </span>
                    <div className="collection-amount-wrapper p-2 d-flex align-items-center justify-content-between">
                        <h6 className="collection-amount">
                            1,265
                        </h6>
                        <h6 className="collection-amount">
                          (2%)
                        </h6>
                    </div>
                </div>
                <div className="d-flex flex-column gap-1">
                    <span className="collection-amount-span mb-0">
                        Owners (unique)
                    </span>
                    <div className="collection-amount-wrapper p-2 d-flex align-items-center justify-content-between">
                        <h6 className="collection-amount">
                            3,067
                        </h6>
                        <h6 className="collection-amount">
                            (31%)
                        </h6>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionBanner;
