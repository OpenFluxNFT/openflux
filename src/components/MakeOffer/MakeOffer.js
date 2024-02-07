import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import closeX from "./assets/closeX.svg";
import getFormattedNumber from "../../hooks/get-formatted-number";
import useWindowSize from "../../hooks/useWindowSize";
import whiteTag from "./assets/whiteTag.svg";
import confluxIcon from "./assets/confluxIcon.svg";
import "./makeoffer.scss";
import moment from "moment";

const MakeOffer = ({
  open,
  onclose,
  nft,
  ethTokenData,
  dypTokenData,
  dyptokenData_old,
  handleMakeOffer,
  handleUpdateOffer,
  handleDeleteOffer,
  nftCount,
  coinbase,
  status,
  nftAddr,
  nftId,
  deletestatus,
  updatestatus,
  showPopup,
  nftData,
  cfxPrice,
  balance,
  wcfxBalance,
  offerData,
  bestOffer,
  nftAddress,
  floorPrice,
}) => {
  const windowSize = useWindowSize();
  const [filter1, setFilter1] = useState("1 day");
  const [filter2, setFilter2] = useState(0);

  const [price, setprice] = useState(0);
  const [isApprove, setisApprove] = useState(false);
  const [approvestatus, setapprovestatus] = useState("initial");

  const [lowestPriceNftListed, setlowestPriceNftListed] = useState([]);
  const [lowestPriceNftListedDYP, setlowestPriceNftListedDYP] = useState([]);

  const { BigNumber } = window;

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width:
      windowSize.width > 1400 ? "30%" : windowSize.width > 786 ? "50%" : "90%",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
    minHeight: 200,
    overflowX: "hidden",
    borderRadius: "10px",
    background: "#1A1C39",
    height: windowSize.width < 500 ? "480px" : "auto",
    padding: "20px",
  };

  const approveMakeOffer = async (price) => {
    if (price !== "" && price !== 0) {
      const newPrice = new BigNumber(price * 1e18).toFixed();
      setapprovestatus("loading");
      await window
        .approveOffer(newPrice)
        .then(() => {
          setisApprove(true);
          setapprovestatus("success");

          setTimeout(() => {
            setapprovestatus("initial");
          }, 3000);
        })
        .catch((e) => {
          console.error(e);
          setapprovestatus("fail");

          setTimeout(() => {
            setapprovestatus("initial");
          }, 3000);
        });
    } else window.alertify.error("Please put a valid price!");
  };

  const isapprovedMakeOffer = async (price) => {
    const newPrice = new BigNumber(price * 1e18).toFixed();
    const result = await window.isApprovedOffer(newPrice).catch((e) => {
      console.error(e);
    });
    setisApprove(result);
    return result;
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="d-flex flex-column gap-3 h-100 justify-content-between">
          <div className="d-flex justify-content-between gap-1  position-relative">
            <h6 className="text-white summarytitle">Make an offer</h6>
            <img
              src={closeX}
              alt=""
              onClick={() => {
                showPopup(false);
              }}
              style={{
                bottom: "17px",
                right: "-22px",
                width: "auto",
                cursor: "pointer",
              }}
            />
          </div>
          <div className="summarywrapper">
            <div className="d-flex flex-column flex-column flex-xxl-row flex-lg-row align-items-start align-items-lg-center gap-2 gap-lg-0 justify-content-between">
              <div className="d-flex flex-row w-100 flex-xxl-row flex-lg-row  align-items-center gap-2">
                {!nftData.isVideo ? (
                  <img
                    src={`https://cdnflux.dypius.com/${nftData.image50}`}
                    className="p-0 nft-img nftimg2"
                    alt=""
                    style={{ width: 50, height: 50 }}
                  />
                ) : (
                  <video
                    preload="auto"
                    height={36}
                    width={36}
                    className="p-0 nft-img nftimg2"
                    src={`https://cdnflux.dypius.com/${nftData.image}`}
                    autoPlay={true}
                    loop={true}
                    muted="muted"
                    playsInline={true}
                    style={{ width: 50, height: 50 }}
                    controlsList="nodownload"
                  ></video>
                )}

                <div className="d-flex flex-column gap-2">
                  <div className="d-flex flex-column">
                    <h6 className="itemname mb-0">
                      {nftData.nftSymbol}{" "}
                      {nftData.name
                        ? nftData.name
                        : nftData.collectionName
                        ? nftData.collectionName
                        : "..."}
                    </h6>
                    <span className="collection-name">
                      {nftData.collectionName}
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-1">
                    <span className="collection-name">Chain:</span>
                    <span
                      className="collection-name"
                      style={{ color: "white" }}
                    >
                      Conflux{" "}
                      <span style={{ textTransform: "initial" }}>eSpace.</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-row flex-lg-column flex-xxl-column gap-2 gap-lg-0 gap-xxl-0 align-items-xxl-end align-items-lg-end align-items-center">
                <span className="itemname" style={{ whiteSpace: "nowrap" }}>
                  {getFormattedNumber(nftData.price / 10 ** 18)} WCFX
                </span>
                <span className="itemcollectionName">
                  ($ {getFormattedNumber((nftData.price / 10 ** 18) * cfxPrice)}
                  )
                </span>
              </div>
            </div>
          </div>
          <div className="summarywrapper">
            <div className="d-flex flex-column align-items-center justify-content-between">
              <div className="d-flex w-100 align-items-center gap-3 justify-content-between">
                <span className="itemchain">Balance</span>
                <span className="itemvalue">
                  {getFormattedNumber(balance, 2)} CFX
                </span>
              </div>
              <div className="d-flex w-100 align-items-center gap-3 justify-content-between">
                <span className="itemchain">WCFX Balance</span>
                <span className="itemvalue">
                  {getFormattedNumber(wcfxBalance, 2)} WCFX
                </span>
              </div>
              <div className="d-flex w-100 align-items-center gap-3 justify-content-between">
                <span className="itemchain">Floor price</span>
                <span className="itemvalue">
                  {getFormattedNumber(floorPrice / 1e18)} WCFX
                </span>
              </div>
              {offerData && offerData.amount && (
                <div className="d-flex  w-100 align-items-center gap-3 justify-content-between">
                  <span className="itemchain">Best offer</span>
                  <span className="itemvalue">
                    {getFormattedNumber(bestOffer.amount / 1e18)} WCFX
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="summaryseparator"></div>
          {offerData && offerData.amount && (
            <div className="d-flex flex-column gap-2">
              <div className="summaryblue p-2">
                <div className="d-flex align-items-center gap-2 justify-content-between w-100">
                  <span className="myoffer-title">
                    <img src={whiteTag} alt="" /> My offer
                  </span>
                  <div className="d-flex flex-row flex-lg-column flex-xxl-column gap-2 gap-lg-0 gap-xxl-0 align-items-end">
                    <span className="itemname" style={{ whiteSpace: "nowrap" }}>
                      {getFormattedNumber(offerData.amount / 10 ** 18)} WCFX
                    </span>
                    <span className="itemcollectionName">
                      ${" "}
                      {getFormattedNumber(
                        (offerData.amount / 10 ** 18) * cfxPrice
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="summaryblue p-2">
                <div className="d-flex align-items-center gap-2 justify-content-between w-100">
                  <span className="myoffer-title">Offer expires:</span>
                  <span className="myoffer-title">
                    {moment
                      .duration(offerData.expiresAt * 1000 - Date.now())
                      .humanize(true)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="row">
            <div
              className={`col-12 ${
                offerData && offerData.length === 0 ? "col-lg-6" : "col-lg-9"
              } mb-3 mb-lg-0`}
            >
              <div className="position-relative d-flex align-items-center">
                <input
                  type="number"
                  min={0}
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  placeholder="Price"
                  className="px-3 py-2 offerInput categories-dropdown bg-transparent"
                  value={price}
                  onClickCapture={() => {
                    setprice(price != 0 ? price : "");
                  }}
                  onChange={(e) => {
                    setprice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    );
                    isapprovedMakeOffer(Number(e.target.value));
                  }}
                />
                <div className="usd-price-wrapper d-flex align-items-center position-absolute">
                  <span className="nft-price-usd">
                    (${getFormattedNumber(price * cfxPrice)})
                  </span>
                </div>
              </div>
            </div>
            {offerData && offerData.length === 0 && (
              <div className="col-6 col-lg-3">
                <div className="dropdown">
                  <button
                    className="btn btn-secondary categories-dropdown bg-transparent w-100 p-3 dropdown-toggle  d-flex align-items-center justify-content-center justify-content-lg-between"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ width: windowSize.width > 786 ? "100%" : "34px" }}
                  >
                    {filter1}
                  </button>
                  <ul className="dropdown-menu categories-dropdown-menu w-100">
                    <li
                      className="dropdown-item categories-dropdown-item"
                      onClick={() => {
                        setFilter1("1 Day");
                        setFilter2(0);
                      }}
                    >
                      1 day
                    </li>
                    <li
                      className="dropdown-item categories-dropdown-item"
                      onClick={() => {
                        setFilter1("3 Days");
                        setFilter2(1);
                      }}
                    >
                      3 days
                    </li>
                    <li
                      className="dropdown-item categories-dropdown-item"
                      onClick={() => {
                        setFilter1("7 Days");
                        setFilter2(2);
                      }}
                    >
                      7 Days
                    </li>
                    <li
                      className="dropdown-item categories-dropdown-item"
                      onClick={() => {
                        setFilter1("14 Days");
                        setFilter2(3);
                      }}
                    >
                      14 Days
                    </li>

                    <li
                      className="dropdown-item categories-dropdown-item"
                      onClick={() => {
                        setFilter1("21 Days");
                        setFilter2(5);
                      }}
                    >
                      21 Days
                    </li>
                    <li
                      className="dropdown-item categories-dropdown-item"
                      onClick={() => {
                        setFilter1("1 Month");
                        setFilter2(6);
                      }}
                    >
                      1 Month
                    </li>
                  </ul>
                </div>
              </div>
            )}
            <div className="col-6 col-lg-3">
              <div className="categories-dropdown p-2 d-flex align-items-center justify-content-center gap-2 bg-transparent">
                <img src={confluxIcon} alt="" />
                <h6 className="token-title mb-0">WCFX</h6>
              </div>
            </div>
          </div>

          {offerData && offerData.length === 0 ? (
            <div className="d-flex align-items-center justify-content-center w-100">
              <button
                className="makeoffer-btn"
                onClick={() => {
                  isApprove
                    ? handleMakeOffer(nftAddress, nftId, price, filter2)
                    : approveMakeOffer(price);
                }}
              >
                {" "}
                {status !== "fail " ||
                  (!isApprove && <img src={whiteTag} alt="" />)}
                {status === "initial" ? (
                  isApprove ? (
                    "Make offer"
                  ) : approvestatus === "initial" ? (
                    "Approve"
                  ) : approvestatus === "loading" ? (
                    <>
                      Approving{" "}
                      <div
                        className="spinner-border mx-1"
                        role="status"
                        style={{ width: 10, height: 10 }}
                      ></div>
                    </>
                  ) : (
                    "Failed"
                  )
                ) : status === "loading" ? (
                  <>
                    Making offer{" "}
                    <div
                      className="spinner-border mx-1"
                      role="status"
                      style={{ width: 10, height: 10 }}
                    ></div>
                  </>
                ) : status === "success" ? (
                  "Success"
                ) : (
                  "Failed"
                )}
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2 justify-content-center w-100">
              {/* <button
              className={`btn ${
                deletestatus === "faildelete" ? "errorbtn" : "mint-now-btn"
              } gap-2  align-self-center align-self-xxl-end align-self-xl-end align-self-lg-end  mt-4`}
              style={{ width: "fit-content" }}
              onClick={() => {
                handleDeleteOffer(offerData[0].index);
              }}
            >
              
            </button>
            <button
              className={`btn ${
                updatestatus === "failupdate" ? "errorbtn" : "pill-btn"
              } gap-2  align-self-center align-self-xxl-end align-self-xl-end align-self-lg-end  mt-4`}
              style={{ width: "fit-content" }}
              
            >
             
            </button> */}
              <button
                className="updateoffer-btn"
                onClick={() => {
                  handleUpdateOffer(price, offerData.index);
                }}
              >
                {" "}
                {updatestatus === "initial" ? (
                  "Update"
                ) : updatestatus === "loadingupdate" ? (
                  <>
                    Updating offer{" "}
                    <div
                      className="spinner-border mx-1"
                      role="status"
                      style={{ width: 10, height: 10 }}
                    ></div>
                  </>
                ) : updatestatus === "successupdate" ? (
                  "Success"
                ) : (
                  "Failed"
                )}
              </button>
              <button
                className="deleteoffer-btn"
                onClick={() => {
                  handleDeleteOffer(offerData.index);
                }}
              >
                {deletestatus === "initial" ? (
                  "Delete offer"
                ) : deletestatus === "loadingdelete" ? (
                  <>
                    Deleting offer{" "}
                    <div
                      className="spinner-border mx-1"
                      role="status"
                      style={{ width: 10, height: 10 }}
                    ></div>
                  </>
                ) : deletestatus === "successdelete" ? (
                  "Success"
                ) : (
                  "Failed"
                )}
              </button>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default MakeOffer;
