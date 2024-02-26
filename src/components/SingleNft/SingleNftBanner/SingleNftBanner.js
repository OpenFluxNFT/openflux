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
import { NavLink, useParams } from "react-router-dom";
import moment from "moment";
import { handleSwitchNetworkhook } from "../../../hooks/switchNetwork";

const SingleNftBanner = ({
  chainId,
  onShowMakeOfferPopup,
  nftData,
  nftOwner,
  coinbase,
  isConnected,
  handleSignup,
  cfxPrice,
  handleRefreshData,handleRefreshData2,
  handleSwitchNetwork,
  loading,
  offerData,
  bestOffer,
  lastSale,
  views,
  collectionFeeRate,
}) => {
  const [isOwner, setIsOwner] = useState(false);
  const [isListed, setIsListed] = useState(false);
  const [duration, setDuration] = useState(0);
  const [nftPrice, setNftPrice] = useState(1);
  const [IsApproveList, setIsApproveList] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState("");
  const [purchaseColor, setPurchaseColor] = useState("#00FECF");
  const [sellStatus, setsellStatus] = useState(""); //sell
  const [sellLoading, setsellLoading] = useState(false); //sell

  const [cancelStatus, setcancelStatus] = useState("cancel"); //cancel
  const [cancelLoading, setcancelLoading] = useState(false); //cancel

  const [buyStatus, setbuyStatus] = useState("buy"); //buy
  const [buyloading, setbuyLoading] = useState(false); //buy

  const [updateStatus, setupdateStatus] = useState("update"); //update
  const [updateLoading, setupdateLoading] = useState(false); //update

  const override = {
    display: "block",
    margin: "20px auto 0",
    borderColor: "#554fd8",
  };

  const { nftId, nftAddress } = useParams();
  const { BigNumber } = window;

  const checkNftApprovalForListing = async () => {
    if (chainId === 1030) {
      await window
        .isApprovedNFT(nftId, nftAddress, coinbase)
        .then((data) => {
          setsellStatus(data === true ? "sell" : "");
          setIsApproveList(data);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  const checkNftApprovalForBuying = async (amount) => {
    const result = await window.isApprovedBuy(amount).catch((e) => {
      console.error(e);
    });

    if (result === true) {
      setbuyStatus("buy");
      return true;
    } else {
      setbuyStatus("approve");
      return false;
    }
  };
 
  const handleBuyNft = async () => {
    const isApproved = await checkNftApprovalForBuying(nftData.price).then(
      (data) => {
        return data;
      }
    );

    console.log(isApproved);
    if (isApproved) {
      setPurchaseColor("#00FECF");
      setbuyLoading(true);
      setbuyStatus("buy");
      setPurchaseStatus("Buying NFT in progress..");

      await window
        .buyNFT(nftAddress, nftData.listingIndex, nftData.price)
        .then((result) => {
          setbuyLoading(false);
          setbuyStatus("success");
          setPurchaseStatus("Successfully purchased!");
          setPurchaseColor("#00FECF");
          handleRefreshData(nftData.owner);
          handleRefreshData2(nftData.owner);

          setTimeout(() => {
            setPurchaseStatus("");
            setPurchaseColor("#00FECF");
            setIsListed(false);
            setIsOwner(true);
            setbuyStatus("");
          }, 2000);
        })
        .catch((e) => {
          setbuyStatus("failed");
          setbuyLoading(false);
          setPurchaseStatus(e?.message);
          setPurchaseColor("#FF6232");
          setTimeout(() => {
            setPurchaseStatus("");
            setPurchaseColor("#00FECF");
            setbuyStatus("buy");
          }, 3000);
          console.error(e);
        });
    } else {
      setbuyStatus("approve");
      setbuyLoading(true);
      setPurchaseStatus("Approving in progress...");
      setPurchaseColor("#00FECF");

      await window
        .approveBuy(nftData.price)
        .then(() => {
          setTimeout(() => {
            setbuyStatus("buy");
            setPurchaseStatus("");
            setPurchaseColor("#00FECF");
          }, 3000);
          setbuyStatus("success");
          setbuyLoading(false);
          setPurchaseStatus("Successfully approved");
          setPurchaseColor("#00FECF");
        })
        .catch((e) => {
          console.error(e);
          setbuyStatus("failed");
          setTimeout(() => {
            setbuyStatus("approve");
            setPurchaseStatus("");
            setPurchaseColor("#00FECF");
          }, 3000);
          setbuyLoading(false);
          setPurchaseStatus(e?.message);
          setPurchaseColor("#FF6232");
        });
    }
  };

  const handleListNft = async () => {
    const isApproved = await window
      .isApprovedNFT(nftId, nftAddress, coinbase)
      .then((data) => {
        return data;
      });
    const newPrice = new BigNumber(nftPrice * 1e18).toFixed();

    if (isApproved) {
      setsellLoading(true);
      setsellStatus("sell");
      setPurchaseStatus("Listing NFT in progress...");
      setPurchaseColor("#00FECF");

      await window
        .listNFT(
          nftAddress,
          nftId,
          newPrice,
          window.config.wcfx_address,
          duration
        )
        .then((result) => {
          setsellLoading(false);
          setsellStatus("success");
          setPurchaseStatus("NFT successfully listed!");
          setPurchaseColor("#00FECF");
          setIsListed(true);
          handleRefreshData();
          setTimeout(() => {
            setPurchaseStatus("");
            setPurchaseColor("#00FECF");
            setsellStatus("sell");
          }, 3000);
        })
        .catch((e) => {
          setsellLoading(false);
          setsellStatus("failed");
          setPurchaseStatus(e?.message);
          setPurchaseColor("#FF6232");
          setTimeout(() => {
            setPurchaseStatus("");
            setPurchaseColor("#00FECF");
            setsellStatus("sell");
          }, 3000);
          console.error(e);
        });
    } else {
      setsellLoading(true);
      setsellStatus("approve");
      setPurchaseStatus("Approving NFT for listing in progress..");
      setPurchaseColor("#00FECF");

      await window
        .approveNFT(nftAddress)
        .then((result) => {
          setTimeout(() => {
            setsellStatus("sell");
            setPurchaseStatus("");
            setPurchaseColor("#00FECF");
          }, 3000);
          setIsApproveList(true);
          setsellLoading(false);
          setsellStatus("success");
          setPurchaseStatus("Successfully approved! You can list your nft");
          setPurchaseColor("#00FECF");
        })
        .catch((e) => {
          setTimeout(() => {
            setsellStatus("approve");
            setPurchaseStatus("");
            setPurchaseColor("#00FECF");
          }, 3000);

          setsellLoading(false);
          setsellStatus("failed");
          setPurchaseStatus(e?.message);
          setPurchaseColor("#FF6232");
          console.log(e);
        });
    }
  };

  const cancelListNft = async () => {
    setcancelLoading(true);
    setcancelStatus("cancel");
    setPurchaseColor("#00FECF");
    setPurchaseStatus("Unlisting your nft...");
    return window
      .cancelListNFT(nftAddress, nftData.listingIndex)
      .then(() => {
        setTimeout(() => {
          setcancelStatus("");
          setPurchaseColor("#00FECF");
          setPurchaseStatus("");
        }, 3000);
        // handleRefreshList(type, tokenId);
        handleRefreshData();
        setIsListed(false);
        setNftPrice(1);
        setDuration(0);
        setcancelLoading(false);
        setcancelStatus("success");
        setPurchaseColor("#00FECF");
        setPurchaseStatus("Nft successfully unlisted");
      })
      .catch((e) => {
        setTimeout(() => {
          setcancelStatus("");
          setPurchaseColor("");
          setPurchaseStatus("");
        }, 3000);

        setcancelLoading(false);
        setcancelStatus("failed");
        setPurchaseColor("#FF6232");
        setPurchaseStatus(e?.message);
      });
  };

  const handleUpdateListing = async () => {
    if (nftPrice !== "") {
      const newPrice = new BigNumber(nftPrice * 1e18).toFixed();

      setPurchaseColor("#00FECF");
      setPurchaseStatus("Price is being updated...");
      setupdateLoading(true);
      setupdateStatus("update");

      return await window
        .updateListingNFT(nftAddress, nftData.listingIndex, newPrice)
        .then((result) => {
          setTimeout(() => {
            setPurchaseColor("#00FECF");
            setPurchaseStatus("");
            setupdateStatus("");
          }, 3000);

          handleRefreshData();
          setPurchaseColor("#00FECF");
          setPurchaseStatus("Price updated successfully.");
          setupdateLoading(false);
          setupdateStatus("success");
        })
        .catch((e) => {
          setTimeout(() => {
            setPurchaseColor("#00FECF");
            setPurchaseStatus("");
            setupdateStatus("");
          }, 3000);

          setPurchaseColor("#FF6232");
          setPurchaseStatus(e?.message);
          setupdateLoading(false);
          setupdateStatus("failed");
        });
    }
    window.alertify.error("Listing price shouldn't be empty!");
  };

  const handleConfluxChain = async () => {
    if (window.ethereum) {
      if (!window.gatewallet) {
        await handleSwitchNetworkhook("0x406")
          .then(() => {
            handleSwitchNetwork(1030);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } else {
      window.alertify.error("No web3 detected. Please install Metamask!");
    }
  };

  useEffect(() => {
    if (nftData && nftData.owner) {
      if (coinbase && chainId === 1030) {
        checkNftApprovalForListing();
        if (coinbase.toLowerCase() === nftData.owner.toLowerCase()) {
          setIsOwner(true);
          checkNftApprovalForListing();
          if (nftData.isListed === true) {
            setNftPrice(nftData.price / 1e18);
          }
        } else {
          setIsOwner(false);
          checkNftApprovalForBuying(nftData.price);
        }
      } else setIsOwner(false);

      if (nftData.isListed === true) {
        setIsListed(true);
      } else setIsListed(false);
    }
  }, [nftData, nftId, coinbase, chainId]);
  // console.log(offerData)
  return (
    <div className="container-lg">
      <div className="nft-banner-wrapper p-3">
        <div className="row mx-0 gap-2 align-items-center justify-content-between">
          <div className="col-lg-6">
            <div className="row mx-0 justify-content-start gap-2">
              {nftData.image && loading === false ? (
                <div className="col-lg-6">
                  {!nftData.isVideo ? (
                    <img
                      src={`https://cdnflux.dypius.com/${nftData.image}`}
                      alt=""
                      className="nft-image"
                    />
                  ) : (
                    <video
                      src={`https://cdnflux.dypius.com/${nftData.image}`}
                      alt=""
                      className="nft-image"
                      controlsList="nodownload"
                      autoPlay={true}
                      loop={true}
                      muted="muted"
                      playsInline={true}
                    />
                  )}
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
                    <NavLink
                      className="collection-name"
                      to={`/collection/${nftAddress}/${nftData.nftSymbol}`}
                    >
                      {nftData.collectionName ?? "..."}
                    </NavLink>
                    <img alt="" src={checkIcon} />
                  </div>
                  <div className="collection-info-owner-wrapper">
                    <div className="d-flex flex-column gap-1 px-3 py-2">
                      <span className="nft-collection-name">
                        {nftData.nftSymbol}{" "}
                        {nftData.name
                          ? nftData.name
                          : nftData.collectionName
                          ? nftData.collectionName
                          : "..."}
                      </span>
                      <div className="d-flex align-items-center gap-2">
                        <span className="nft-info-left">Owner</span>
                        <span className="nft-info-right">
                          {nftData && nftData.owner ? (
                            <a
                              href={`https://evm.confluxscan.net/address/${nftData.owner}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-white"
                            >
                              {shortAddress(nftData.owner) ?? "..."}
                            </a>
                          ) : (
                            "Not Available"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Views</span>
                    <span className="nft-info-right">{views}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Favorites</span>
                    <span className="nft-info-right">
                      {nftData.favoriteCount ?? "..."}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Creator earning</span>
                    <span className="nft-info-right">{collectionFeeRate}%</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Last Sale</span>
                    <span className="nft-info-right">
                      {lastSale && lastSale.length > 0
                        ? getFormattedNumber(lastSale[0].amount / 1e18)
                        : 0}{" "}
                      WCFX
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Best offer</span>
                    <span className="nft-info-right">
                      {getFormattedNumber(bestOffer.amount? bestOffer.amount/ 1e18 : 0 )} WCFX
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-bottom-div">
                    <span className="nft-info-left">Chain</span>
                    <span className="nft-info-right">
                      Conflux{" "}
                      <span style={{ textTransform: "initial" }}>eSpace.</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="single-nft-right-info-wrapper d-flex flex-column p-3">
              <div
                className={`d-flex flex-column gap-2 flex-div ${
                  nftData.collectionName
                    ? "justify-content-between"
                    : "justify-content-start"
                }`}
              >
                <div className="d-flex justify-content-between gap-2 align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <span className="nft-item-name-right">
                      {" "}
                      {nftData.nftSymbol}{" "}
                      {nftData.name
                        ? nftData.name
                        : nftData.collectionName
                        ? nftData.collectionName
                        : "..."}
                    </span>
                    <img alt="" src={checkIcon} />
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <img alt="" src={websiteIcon} />
                    <img alt="" src={shareIcon} />
                  </div>
                </div>
                {loading && (
                  <div className="nft-price-wrapper w-100 p-3">
                    <FadeLoader
                      color={"#554fd8"}
                      loading={loading}
                      cssOverride={override}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </div>
                )}
                {!isListed &&
                nftData.collectionName &&
                loading === false &&
                !isOwner ? (
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
                        className="btn make-offer-btn px-3 py-1 col-lg-3 col-5"
                        onClick={onShowMakeOfferPopup}
                      >
                        {offerData && offerData.amount
                          ? "Update Offer"
                          : "Make Offer"}
                      </button>
                    ) : (
                      <button
                        className="btn connect-btn2 d-flex align-items-center justify-content-center gap-2 col-5"
                        onClick={handleSignup}
                      >
                        Connect Wallet
                      </button>
                    )}
                  </div>
                ) : !isListed &&
                  nftData.collectionName &&
                  isOwner &&
                  loading === false ? (
                  <div className="nft-price-wrapper p-3">
                    <div className="d-flex flex-column gap-2">
                      <span className="current-price-text">Current Price</span>
                      <div className="d-flex flex-column flex-lg-row flex-md-row gap-2 align-items-center">
                        <img src={cfx} alt="" />
                        <input
                          type="number"
                          className="uni-input"
                          value={nftPrice}
                          onChange={(e) => {
                            setNftPrice(e.target.value);
                          }}
                        />
                        <span className="nft-price-crypto"> WCFX</span>
                        <span className="nft-price-usd">
                          ($ {getFormattedNumber(nftPrice * cfxPrice)})
                        </span>
                      </div>
                    </div>
                  </div>
                ) : ((isListed && !isOwner) ||
                    (isListed && isOwner && nftData.collectionName)) &&
                  loading === false ? (
                  <div className="nft-price-wrapper p-3">
                    <div className="d-flex flex-column gap-2">
                      <span className="current-price-text">Current Price</span>

                      <div className="d-flex flex-column flex-lg-row flex-md-row gap-2 align-items-center">
                        <img src={cfx} alt="" />
                        {isOwner ? (
                          <input
                            type="number"
                            className="uni-input"
                            value={nftPrice}
                            onChange={(e) => {
                              setNftPrice(e.target.value);
                            }}
                          />
                        ) : (
                          <span className="nft-price-crypto">
                            {getFormattedNumber(nftData?.price / 10 ** 18)} WCFX
                          </span>
                        )}

                        <span className="nft-price-usd">
                          ($ {getFormattedNumber((nftData?.price / 10 ** 18) * cfxPrice)})
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {isOwner &&
                nftData.collectionName &&
                !isListed &&
                loading === false ? (
                  <>
                    <div className="nft-price-wrapper px-3 py-1 d-flex align-items-center justify-content-between">
                      <span className="current-price-text">
                        Listing Duration
                      </span>
                      <div className="d-flex align-items-center gap-1">
                        <div
                          className={`duration-tab ${
                            duration === 0 && "duration-tab-active"
                          } d-flex align-items-center justify-content-center`}
                          onClick={() => setDuration(0)}
                        >
                          <span>1 Day</span>
                        </div>
                        <div
                          className={`duration-tab ${
                            duration === 1 && "duration-tab-active"
                          } d-flex align-items-center justify-content-center`}
                          onClick={() => setDuration(1)}
                        >
                          <span>3 Days</span>
                        </div>
                        <div
                          className={`duration-tab ${
                            duration === 2 && "duration-tab-active"
                          } d-flex align-items-center justify-content-center`}
                          onClick={() => setDuration(2)}
                        >
                          <span>7 Days</span>
                        </div>
                        <div
                          className={`duration-tab ${
                            duration === 3 && "duration-tab-active"
                          } d-flex align-items-center justify-content-center`}
                          onClick={() => setDuration(3)}
                        >
                          <span>14 Days</span>
                        </div>
                        <div
                          className={`duration-tab ${
                            duration === 5 && "duration-tab-active"
                          } d-flex align-items-center justify-content-center`}
                          onClick={() => setDuration(5)}
                        >
                          <span>21 Days</span>
                        </div>
                        <div
                          className={`duration-tab ${
                            duration === 6 && "duration-tab-active"
                          } d-flex align-items-center justify-content-center`}
                          onClick={() => setDuration(6)}
                        >
                          <span>1 Month</span>
                        </div>
                      </div>
                    </div>
                    {/* <span
                      className="current-price-text"
                      style={{ fontSize: "10px" }}
                    >
                      There is a listing fee of 0.1% for the selected duration
                    </span> */}
                  </>
                ) :
                  nftData.collectionName &&
                  isListed &&
                  loading === false ? (
                  <div className="nft-price-wrapper px-3 py-1 d-flex align-items-center justify-content-between">
                    <span className="current-price-text">Listing ends</span>
                    <div className="duration-tab d-flex align-items-center justify-content-center">
                      <span>
                        {moment
                          .duration(nftData.expiresAt * 1000 - Date.now())
                          .humanize(true)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {chainId !== 1030 &&
                  isConnected &&
                  nftData.collectionName &&
                  loading === false && (
                    <span className="error-status-text">
                      *Unsupported network. please change the chain on your
                      wallet
                    </span>
                  )}
                {!isOwner &&
                !isListed &&
                nftData.collectionName &&
                loading === false ? (
                  <></>
                ) : !isOwner && isListed ? (
                  <div className="d-flex align-items-center gap-2 justify-content-center mt-4">
                    {isConnected && chainId === 1030 ? (
                      <>
                        <button
                          className="btn make-offer-btn px-3 py-1 col-lg-3 col-5"
                          onClick={onShowMakeOfferPopup}
                        >
                          {offerData && offerData.amount
                            ? "Update Offer"
                            : "Make Offer"}
                        </button>
                        <button
                          className="btn buy-nft-btn px-3 py-1 col-lg-3 col-5"
                          onClick={() => {
                            chainId === 1030
                              ? handleBuyNft()
                              : handleConfluxChain();
                          }}
                        >
                          {buyloading && chainId === 1030 ? (
                            <div
                              className="spinner-border spinner-border-sm text-light"
                              role="status"
                            ></div>
                          ) : !buyloading && chainId !== 1030 ? (
                            "Switch Network"
                          ) : buyStatus === "buy" ? (
                            "Buy"
                          ) : buyStatus === "approve" || buyStatus === "" ? (
                            "Approve buy"
                          ) : buyStatus === "success" ? (
                            "Success"
                          ) : (
                            "Failed"
                          )}
                        </button>
                      </>
                    ) : !isConnected && chainId === 1030 ? (
                      <button
                        className="btn connect-btn2 d-flex align-items-center gap-2 col-5 justify-content-center "
                        onClick={handleSignup}
                      >
                        Connect Wallet
                      </button>
                    ) : (
                      <button
                        onClick={handleConfluxChain}
                        className="deleteoffer-btn  px-3 py-1 col-lg-4 col-5"
                      >
                        Switch Network
                      </button>
                    )}
                  </div>
                ) : isOwner && !isListed && loading === false ? (
                  <div className="d-flex align-items-center gap-2 justify-content-center mt-4">
                    {isConnected ? (
                      <button
                        className="updateoffer-btn  px-3 py-1 col-lg-4 col-5"
                        onClick={() => {
                          chainId === 1030
                            ? handleListNft()
                            : handleConfluxChain();
                        }}
                      >
                        {sellLoading && chainId === 1030 ? (
                          <div
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : !sellLoading && chainId !== 1030 ? (
                          "Switch Network"
                        ) : sellStatus === "sell" ? (
                          "List NFT"
                        ) : sellStatus === "success" ? (
                          "Success"
                        ) : sellStatus === "approve" || sellStatus === "" ? (
                          "Approve list"
                        ) : (
                          "Failed"
                        )}
                      </button>
                    ) : (
                      <button
                        className="btn connect-btn2 d-flex align-items-center gap-2 col-5 justify-content-center "
                        onClick={handleSignup}
                      >
                        Connect Wallet
                      </button>
                    )}
                  </div>
                ) : isOwner && isListed && loading === false ? (
                  <div className="d-flex align-items-center gap-2 justify-content-center mt-4">
                    {isConnected ? (
                      <>
                        <button
                          className="updateoffer-btn px-3 py-1 col-lg-3 col-5"
                          onClick={() => {
                            chainId === 1030
                              ? handleUpdateListing()
                              : handleConfluxChain();
                          }}
                        >
                          {updateLoading && chainId === 1030 ? (
                            <div
                              className="spinner-border spinner-border-sm text-light"
                              role="status"
                            ></div>
                          ) : !updateLoading && chainId !== 1030 ? (
                            "Switch Network"
                          ) : updateStatus === "update" ||
                            updateStatus === "" ? (
                            "Update"
                          ) : updateStatus === "success" ? (
                            "Success"
                          ) : (
                            "Failed"
                          )}
                        </button>
                        <button
                          className="deleteoffer-btn  px-3 py-1 col-lg-3 col-5"
                          onClick={() => {
                            chainId === 1030
                              ? cancelListNft()
                              : handleConfluxChain();
                          }}
                        >
                          {cancelLoading && chainId === 1030 ? (
                            <div
                              className="spinner-border spinner-border-sm text-light"
                              role="status"
                            ></div>
                          ) : !cancelLoading && chainId !== 1030 ? (
                            "Switch Network"
                          ) : cancelStatus === "cancel" ||
                            cancelStatus === "" ? (
                            "Unlist"
                          ) : cancelStatus === "success" ? (
                            "Success"
                          ) : (
                            "Failed"
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn connect-btn2 d-flex align-items-center gap-2 col-5 justify-content-center "
                        onClick={handleSignup}
                      >
                        Connect Wallet
                      </button>
                    )}
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
