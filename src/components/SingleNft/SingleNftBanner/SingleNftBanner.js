import React, { useEffect, useState } from "react";
import "./_singlenftbanner.scss";
import cawsLogo from "./assets/cawsLogo.png";
import checkIcon from "./assets/checkIcon.svg";
import websiteIcon from "./assets/websiteIcon.svg";
import shareIcon from "./assets/shareIcon.svg";
import cfx from "./assets/cfx.svg";
import "../../MakeOffer/makeoffer.scss";
import { shortAddress } from "../../../hooks/shortAddress";
import { Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import getFormattedNumber from "../../../hooks/get-formatted-number";
import { FadeLoader } from "react-spinners";

const SingleNftBanner = ({
  chainId,
  onShowMakeOfferPopup,
  nftData,
  nftOwner,
  coinbase,
  isConnected,
  handleSignup,
  cfxPrice,
}) => {
  const [isOwner, setIsOwner] = useState(false);
  const [isListed, setIsListed] = useState(false);
  const [duration, setDuration] = useState(1);

  const override = {
    display: "block",
    margin: "20px auto 0",
    borderColor: "#554fd8",
  };

  useEffect(() => {
    if (nftData && nftData.owner) {
      if (coinbase) {
        if (coinbase.toLowerCase() === nftData.owner.toLowerCase()) {
          setIsOwner(true);
        }
      } else setIsOwner(false);

      if (nftData.isListed === true) {
        setIsListed(true);
      }
    }
  }, [nftData]);

  console.log(nftData);
  return (
    <div className="container-lg">
      <div className="nft-banner-wrapper p-3">
        <div className="row mx-0 gap-2 align-items-center justify-content-between">
          <div className="col-lg-6">
            <div className="row mx-0 justify-content-start gap-2">
              {nftData.image ? (
                <div className="col-lg-6">
                  <img
                    src={`https://cdnflux.dypius.com/${nftData.image}`}
                    alt=""
                    className="nft-image"
                  />
                </div>
              ) : (
                <div className="col-12 col-lg-6 mb-3 position-relative">
                  <Box sx={{ width: 290, position: "absolute" }}>
                    <Skeleton
                      animation="wave"
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.11)",
                        left: "15px",
                        top: "10px",
                      }}
                      width={250}
                    />
                    <Skeleton
                      animation="wave"
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.11)",
                        left: "15px",
                        top: "10px",
                      }}
                      width={200}
                    />
                    <Skeleton
                      animation="wave"
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.11)",
                        left: "15px",
                        top: "10px",
                      }}
                      width={120}
                    />
                  </Box>
                  <Box sx={{ width: 290, position: "absolute", top: "120px" }}>
                    <Skeleton
                      animation="wave"
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.11)",
                        left: "15px",
                        top: "10px",
                      }}
                      width={150}
                    />
                  </Box>
                  <Box sx={{ width: 290, position: "absolute", top: "220px" }}>
                    <Skeleton
                      animation="wave"
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.11)",
                        left: "15px",
                        top: "10px",
                      }}
                      width={240}
                    />
                  </Box>
                  <Skeleton
                    variant="rounded"
                    width={"100%"}
                    height={290}
                    animation="wave"
                    sx={{
                      bgcolor: "rgba(47, 128, 237, 0.05)",
                      border: "1px solid rgba(47, 128, 237, 0.2)",
                    }}
                  />
                </div>
              )}
              <div className="col-lg-5">
                <div className="d-flex flex-column gap-2 h-100 justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      alt=""
                      src={cawsLogo}
                      className="nft-collection-logo"
                    />
                    <span className="collection-name">
                      {nftData.collectionName ?? "..."}
                    </span>
                    <img alt="" src={checkIcon} />
                  </div>
                  <div className="collection-info-owner-wrapper">
                    <div className="d-flex flex-column gap-1 px-3 py-2">
                      <span className="nft-collection-name">
                        {nftData.name ?? "..."}
                      </span>
                      <div className="d-flex align-items-center gap-2">
                        <span className="nft-info-left">Owner</span>
                        <span className="nft-info-right">
                          <a
                            href={`https://evm.confluxscan.net/address/${nftData.owner}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white"
                          >
                            {shortAddress(nftData.owner) ?? "..."}
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Views</span>
                    <span className="nft-info-right">tbd</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Favorites</span>
                    <span className="nft-info-right">tbd</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Creator earning</span>
                    <span className="nft-info-right">5%</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Last Sale</span>
                    <span className="nft-info-right">tbd WCFX</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Best offer</span>
                    <span className="nft-info-right">tbd WCFX</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Chain</span>
                    <span className="nft-info-right">Conflux eSpace</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="single-nft-right-info-wrapper d-flex flex-column p-3">
              <div className={`d-flex flex-column gap-2 flex-div ${nftData.name ? 'justify-content-between' : 'justify-content-start'}`}>
                <div className="d-flex justify-content-between gap-2 align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <span className="nft-item-name-right">
                      {" "}
                      {nftData.name ?? "..."}
                    </span>
                    <img alt="" src={checkIcon} />
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <img alt="" src={websiteIcon} />
                    <img alt="" src={shareIcon} />
                  </div>
                </div>
                {!nftData.name && (
                  <div className="nft-price-wrapper w-100 p-3">
                    <FadeLoader
                      color={"#554fd8"}
                      loading={!nftData.name}
                      cssOverride={override}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </div>
                )}
                {!isListed && nftData.name && !isOwner ? (
                  <div className="d-flex flex-column gap-2 w-100 flex-div align-items-center justify-content-between">
                    <div className="nft-price-wrapper w-100 p-3">
                      <div className="d-flex flex-column gap-2">
                        <span className="current-price-text">
                          This NFT is not listed
                        </span>
                      </div>
                    </div>
                    {isConnected ? (
                      <button
                        className="btn make-offer-btn px-3 py-1 col-lg-3"
                        onClick={onShowMakeOfferPopup}
                      >
                        Make Offer
                      </button>
                    ) : (
                      <button
                        className="btn connect-btn2 d-flex align-items-center gap-2"
                        onClick={handleSignup}
                      >
                        Connect Wallet
                      </button>
                    )}
                  </div>
                ) : !isListed && nftData.name && isOwner ? (
                  <div className="nft-price-wrapper p-3">
                    <div className="d-flex flex-column gap-2">
                      <span className="current-price-text">Current Price</span>
                      <div className="d-flex flex-column flex-lg-row flex-md-row gap-2 align-items-center">
                        <img src={cfx} alt="" />
                        <input type="number" className="uni-input" />
                        <span className="nft-price-crypto"> WCFX</span>
                        <span className="nft-price-usd">($ --)</span>
                      </div>
                    </div>
                  </div>
                ) : (isListed && !isOwner) ||
                  (isListed && isOwner && nftData.name) ? (
                  <div className="nft-price-wrapper p-3">
                    <div className="d-flex flex-column gap-2">
                      <span className="current-price-text">Current Price</span>
                      <div className="d-flex flex-column flex-lg-row flex-md-row gap-2 align-items-center">
                        <img src={cfx} alt="" />
                        <span className="nft-price-crypto">
                          {getFormattedNumber(nftData?.price / 10 ** 18)} WCFX
                        </span>
                        <span className="nft-price-usd">
                          (${" "}
                          {getFormattedNumber(
                            (nftData?.price / 10 ** 18) * cfxPrice
                          )}
                          )
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {isOwner && nftData.name && !isListed ? (
                  <>
                    <div className="nft-price-wrapper px-3 py-1 d-flex align-items-center justify-content-between">
                      <span className="current-price-text">
                        Listing Duration
                      </span>
                      <div className="d-flex align-items-center gap-1">
                        <div
                          className={`duration-tab ${
                            duration === 1 && "duration-tab-active"
                          } d-flex align-items-center justify-content-center`}
                          onClick={() => setDuration(1)}
                        >
                          <span>1 Day</span>
                        </div>
                        <div
                          className={`duration-tab ${
                            duration === 3 && "duration-tab-active"
                          } d-flex align-items-center justify-content-center`}
                          onClick={() => setDuration(3)}
                        >
                          <span>3 Days</span>
                        </div>
                        <div
                          className={`duration-tab ${
                            duration === 7 && "duration-tab-active"
                          } d-flex align-items-center justify-content-center`}
                          onClick={() => setDuration(7)}
                        >
                          <span>7 Days</span>
                        </div>
                        <div
                          className={`duration-tab ${
                            duration === 14 && "duration-tab-active"
                          } d-flex align-items-center justify-content-center`}
                          onClick={() => setDuration(14)}
                        >
                          <span>14 Days</span>
                        </div>
                        <div
                          className={`duration-tab ${
                            duration === 21 && "duration-tab-active"
                          } d-flex align-items-center justify-content-center`}
                          onClick={() => setDuration(21)}
                        >
                          <span>21 Days</span>
                        </div>
                        <div
                          className={`duration-tab ${
                            duration === 30 && "duration-tab-active"
                          } d-flex align-items-center justify-content-center`}
                          onClick={() => setDuration(30)}
                        >
                          <span>1 Month</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className="current-price-text"
                      style={{ fontSize: "10px" }}
                    >
                      There is a listing fee of 0.1% for the selected duration
                    </span>
                  </>
                ) : isOwner && nftData.name && isListed ? (
                  <div className="nft-price-wrapper px-3 py-1 d-flex align-items-center justify-content-between">
                    <span className="current-price-text">Listing ends in</span>
                    <div className="duration-tab d-flex align-items-center justify-content-center">
                      <span>23 Days</span>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {chainId !== 1030 && isConnected && nftData.name && (
                  <span className="error-status-text">
                    *Unsupported network. please change the chain on your wallet
                  </span>
                )}
                {!isOwner && !isListed && nftData.name ? (
                  <></>
                ) : !isOwner && isListed ? (
                  <div className="d-flex align-items-center gap-2 justify-content-center mt-4">
                    {isConnected ? (
                      <>
                        <button
                          className="btn make-offer-btn px-3 py-1 col-lg-3"
                          onClick={onShowMakeOfferPopup}
                        >
                          Make Offer
                        </button>
                        <button className="btn buy-nft-btn px-3 py-1 col-lg-3">
                          Buy
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn connect-btn2 d-flex align-items-center gap-2"
                        onClick={handleSignup}
                      >
                        Connect Wallet
                      </button>
                    )}
                  </div>
                ) : isOwner && !isListed ? (
                  <div className="d-flex align-items-center gap-2 justify-content-center mt-4">
                    <button className="updateoffer-btn  px-3 py-1 col-lg-3">
                      List Item
                    </button>
                  </div>
                ) : isOwner && isListed ? (
                  <div className="d-flex align-items-center gap-2 justify-content-center mt-4">
                    <button className="updateoffer-btn px-3 py-1 col-lg-3">
                      Update
                    </button>
                    <button className="deleteoffer-btn  px-3 py-1 col-lg-3">
                      Unlist
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleNftBanner;
