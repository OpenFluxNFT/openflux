import React, { useState, useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import closeX from "./assets/closeX.svg";
import getFormattedNumber from "../../hooks/get-formatted-number";
import useWindowSize from "../../hooks/useWindowSize";
import whiteTag from "./assets/whiteTag.svg";
import confluxIcon from "./assets/confluxIcon.svg";
import "./makeoffer.scss";
import moment from "moment";
import collectionCardPlaceholder from "./assets/collectionCardPlaceholder1.png";
import { shortAddress } from "../../hooks/shortAddress";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Draggable from "./Draggable";

const AcceptOfferForCollection = ({
  open,
  onclose,
  coinbase,
  status,
  nftData,
  cfxPrice,
  balance,
  wcfxBalance,
  bestOffer,
  floorPrice,
  currentCollection,
  userNftsOwnedArray,
  handleAcceptOffer,
  offeracceptStatus,
}) => {
  const windowSize = useWindowSize();

  const [selectedId, setselectedId] = useState();

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

  const journalRef = useRef();

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="d-flex flex-column gap-3 h-100 justify-content-between">
          <div className="d-flex justify-content-between gap-1  position-relative">
            <h6 className="text-white summarytitle">Accept Offer</h6>
            <img
              src={closeX}
              alt=""
              onClick={onclose}
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
                <img
                  src={
                    currentCollection.collectionProfilePic
                      ? `https://confluxapi.worldofdypians.com/${currentCollection.collectionProfilePic}`
                      : collectionCardPlaceholder
                  }
                  className="p-0 nft-img nftimg2"
                  alt=""
                  style={{ width: 50, height: 50 }}
                />

                <div className="d-flex flex-column gap-2">
                  <div className="d-flex flex-column">
                    <h6 className="itemname mb-0">
                      {currentCollection.collectionName}
                    </h6>
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
            </div>
          </div>
          <div className="summarywrapper">
            <div className="d-flex gap-2 flex-column align-items-center justify-content-between">
              <div className="d-flex w-100 align-items-center gap-3 justify-content-between">
                <span className="itemchain">Floor price</span>
                <span className="itemname" style={{ whiteSpace: "nowrap" }}>
                  {getFormattedNumber(floorPrice ? floorPrice / 1e18 : 0)} WCFX{" "}
                  <span className="itemcollectionName ms-2">
                    (${" "}
                    {getFormattedNumber(
                      (floorPrice ? floorPrice / 1e18 : 0) * cfxPrice
                    )}
                    )
                  </span>
                </span>
              </div>
              {bestOffer && bestOffer.amount && (
                <div className="d-flex  w-100 align-items-center gap-3 justify-content-between">
                  <span className="itemchain">Best offer</span>
                  <span className="itemvalue">
                    {getFormattedNumber(bestOffer.amount / 1e18)} WCFX
                  </span>
                </div>
              )}

              <div className="d-flex w-100 align-items-center gap-3 justify-content-between">
                <span className="itemchain">My WCFX Balance</span>
                <span className="itemvalue">
                  {getFormattedNumber(wcfxBalance, 2)} WCFX
                </span>
              </div>
            </div>
          </div>
          <div className="summaryseparator"></div>

          {nftData && nftData.amount && (
            <div className="d-flex flex-column gap-2">
              <div className="summaryblue p-2">
                <div className="d-flex align-items-center gap-2 justify-content-between w-100">
                  <span className="myoffer-title">
                    <img src={whiteTag} alt="" /> Selected offer
                  </span>
                  <div className="d-flex flex-row flex-lg-column flex-xxl-column gap-2 gap-lg-0 gap-xxl-0 align-items-end">
                    <span className="itemname" style={{ whiteSpace: "nowrap" }}>
                      {getFormattedNumber(nftData.amount / 10 ** 18)} WCFX
                    </span>
                    <span className="itemcollectionName">
                      (${" "}
                      {getFormattedNumber(
                        (nftData.amount / 10 ** 18) * cfxPrice
                      )}
                      )
                    </span>
                  </div>
                </div>
              </div>
              <div className="summaryblue p-2">
                <div className="d-flex align-items-center gap-2 justify-content-between w-100">
                  <span className="myoffer-title">Offer expires:</span>
                  <span className="myoffer-title">
                    {moment
                      .duration(nftData.expiresAt * 1000 - Date.now())
                      .humanize(true)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="summaryseparator"></div>
          {userNftsOwnedArray && userNftsOwnedArray.length > 0 && (
            <div className="row">
              <h6 className="itemname ">Select one NFT you wish to trade</h6>
              <div className={`col-12 mb-3 mb-lg-0`}>
                <div className="position-relative d-flex  gap-2 align-items-center">
                  {userNftsOwnedArray &&
                    userNftsOwnedArray.length > 0 &&
                    userNftsOwnedArray.length <= 4 &&
                    userNftsOwnedArray.map((item, index) => {
                      return (
                        <div
                          className="recently-listed-card p-2 gap-2 d-flex flex-column"
                          style={{
                            borderRadius: 11, cursor: 'pointer',
                            borderColor:
                              selectedId === item.tokenId && "#3DBDA7",
                          }}
                          key={index}
                          onClick={() => {
                            setselectedId(item.tokenId);
                          }}
                        >
                          {!item.isVideo && item.image ? (
                            <img
                              src={`https://cdnflux.dypius.com/${item.image}`}
                              className="card-img nftimg2"
                              width={136}
                              height={136}
                              alt=""
                            />
                          ) : item.isVideo && item.image ? (
                            <video
                              preload="auto"
                              className="card-img nftimg2"
                              src={`https://cdnflux.dypius.com/${item.image}`}
                              autoPlay={true}
                              loop={true}
                              muted="muted"
                              playsInline={true}
                              // onClick={player}
                              controlsList="nodownload"
                              width={136}
                              height={136}
                            ></video>
                          ) : (
                            <img
                              src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                              className="card-img nftimg2"
                              width={136}
                              height={136}
                              alt=""
                            />
                          )}
                          <h6
                            className="recently-listed-title mb-0 d-flex align-items-center w-100 justify-content-between"
                            style={{ fontSize: "12px" }}
                          >
                            {item.tokenName} #{item.tokenId}
                            <FormGroup
                              key={index}
                              sx={{ display: "block !important" }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    size="small"
                                    sx={{
                                      color: "white",
                                      padding: 0,
                                      "&.Mui-checked": {
                                        color: "#3DBDA7",
                                      },
                                    }}
                                    checked={selectedId === item.tokenId}
                                    onChange={() => {
                                      setselectedId(item.tokenId);
                                    }}
                                  />
                                }
                              />
                            </FormGroup>
                          </h6>
                        </div>
                      );
                    })}
                </div>
                {userNftsOwnedArray &&
                  userNftsOwnedArray.length > 0 &&
                  userNftsOwnedArray.length > 4 && (
                    <div className="d-flex my-3 overflow-hidden min-w-2xl relative w-full will-change-auto hover:will-change-scroll">
                      <Draggable innerRef={journalRef} rootClass={"drag"}>
                        <div
                          className="d-flex flex-row overflow-x-auto w-full"
                          ref={journalRef}
                        >
                          {userNftsOwnedArray.map((item, index) => {
                            return (
                              <div className="px-2 col-4 my-3" key={index}>
                                <div
                                  className="recently-listed-card p-2 gap-2 d-flex flex-column"
                                  style={{
                                    borderRadius: 11, cursor: 'pointer',
                                    borderColor:
                                      selectedId === item.tokenId && "#3DBDA7",
                                  }}
                                  key={index}
                                  onClick={() => {
                                    setselectedId(item.tokenId);
                                  }}
                                >
                                  {!item.isVideo && item.image ? (
                                    <img
                                      src={`https://cdnflux.dypius.com/${item.image}`}
                                      className="card-img nftimg2"
                                      width={136}
                                      height={136}
                                      alt=""
                                    />
                                  ) : item.isVideo && item.image ? (
                                    <video
                                      preload="auto"
                                      className="card-img nftimg2"
                                      src={`https://cdnflux.dypius.com/${item.image}`}
                                      autoPlay={true}
                                      loop={true}
                                      muted="muted"
                                      playsInline={true}
                                      // onClick={player}
                                      controlsList="nodownload"
                                      width={136}
                                      height={136}
                                    ></video>
                                  ) : (
                                    <img
                                      src={require(`../CollectionPage/CollectionList/assets/collectionCardPlaceholder2.png`)}
                                      className="card-img nftimg2"
                                      width={136}
                                      height={136}
                                      alt=""
                                    />
                                  )}
                                  <h6
                                    className="recently-listed-title mb-0 d-flex align-items-center w-100 justify-content-between"
                                    style={{ fontSize: "12px" }}
                                  >
                                    {item.tokenName} #{item.tokenId}
                                    <FormGroup
                                      key={index}
                                      sx={{ display: "block !important" }}
                                    >
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            size="small"
                                            sx={{
                                              color: "white",
                                              padding: 0,
                                              "&.Mui-checked": {
                                                color: "#3DBDA7",
                                              },
                                            }}
                                            checked={
                                              selectedId === item.tokenId
                                            }
                                            onChange={() => {
                                              setselectedId(item.tokenId);
                                            }}
                                          />
                                        }
                                      />
                                    </FormGroup>
                                  </h6>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Draggable>
                    </div>
                  )}
              </div>
            </div>
          )}
          {userNftsOwnedArray && userNftsOwnedArray.length === 0 && (
              <span className="text-white d-flex w-100 align-items-center justify-content-center h-100">You're not holding any NFT from this collection</span>
          )}
{userNftsOwnedArray && userNftsOwnedArray.length > 0 &&
          <div className="d-flex align-items-center gap-2 justify-content-center w-100">
            <button
              disabled={!selectedId}
              className={` px-3 py-1 ${
                selectedId ? "active-accept-btn" : "disabled-accept-btn"
              } `}
              onClick={() => {
                handleAcceptOffer(nftData.index,selectedId, nftData.offeror);
              }}
            >
              {offeracceptStatus === "initial" ? (
                "Accept"
              ) : offeracceptStatus === "loading" ? (
                <>
                  Accepting
                  <div
                    className="spinner-border mx-1"
                    role="status"
                    style={{ width: 10, height: 10 }}
                  ></div>
                </>
              ) : offeracceptStatus === "success" ? (
                "Success"
              ) : offeracceptStatus === "fail" ? (
                "Failed"
              ) : (
                "Accept"
              )}
            </button>
          </div> }
          {/* <div className="invisible">Loading</div> */}
        </div>
      </Box>
    </Modal>
  );
};

export default AcceptOfferForCollection;
