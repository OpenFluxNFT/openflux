import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import closeX from "./assets/closeX.svg";
import getFormattedNumber from "../../hooks/get-formatted-number";
import OutsideClickHandler from "react-outside-click-handler";
import useWindowSize from "../../hooks/useWindowSize";
import dropdownIcon from "./assets/dropdownIcon.svg";
import whiteTag from "./assets/whiteTag.svg";
import Web3 from "web3";


const MakeOffer = ({
  open,
  onclose,
  isCaws,
  isWod,
  isTimepiece,
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
}) => {
  const windowSize = useWindowSize();
  const [filter1, setFilter1] = useState("weth");
  const [price, setprice] = useState(0);
  const [offerData, setofferData] = useState([]);
  const [isApprove, setisApprove] = useState(false);
  const [approvestatus, setapprovestatus] = useState("initial");

  const [dypBalance, setDypBalance] = useState(0);
  const [dypBalance_new, setDypBalance_new] = useState(0);

  const [wethBalance, setWethBalance] = useState(0);
  const [lowestPriceNftListed, setlowestPriceNftListed] = useState([]);
  const [lowestPriceNftListedDYP, setlowestPriceNftListedDYP] = useState([]);

  const [bestOffer, setbestOffer] = useState([]);

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
  };


  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="d-flex flex-column gap-3">
          <div className="d-flex justify-content-between gap-1  position-relative">
            <h6 className="text-white summarytitle">Make an offer</h6>
            <img
              src={closeX}
              alt=""
              className="close-x"
              onClick={() => {
                onclose();
              }}
              style={{ bottom: "17px", right: "-22px", width: "auto" }}
            />
          </div>
          <div className="summarywrapper">
            <div className="d-flex flex-column flex-column flex-xxl-row flex-lg-row align-items-center justify-content-between">
              <div className="d-flex flex-column w-100 flex-xxl-row flex-lg-row  align-items-center gap-2">
                <img
                  className="p-0 nft-img nftimg2"
                  src={
                    'https://mint.dyp.finance/thumbs50/423.png'
                  }
                  alt=""
                  loading="lazy"
                />
                <div className="d-flex flex-column justify-content-between">
                  <div className="d-flex flex-column align-items-center">
                    <span className="itemname">
                    CAWS #1264
                    </span>
                    {/* <span className="itemcollectionName">
                   {nft.name}
                  </span> */}
                  </div>
                  <span className="itemchain">Chain: Conflux</span>
                </div>
              </div>
            
                <div className="d-flex flex-row flex-lg-column flex-xxl-column gap-2 gap-lg-0 gap-xxl-0 align-items-xxl-end align-items-lg-end align-items-center">
                  <span className="itemname" style={{ whiteSpace: "nowrap" }}>
                  1254.89 CFX
                  </span>
                  <span className="itemcollectionName">
                  ($ 654,874.86)
                  </span>
                </div>
            
            </div>
          </div>
          <div className="summarywrapper">
            <div className="d-flex flex-column align-items-center justify-content-between">
              <div className="d-flex w-100 align-items-center gap-3 justify-content-between">
                <span className="itemchain">Balance</span>
                <span className="itemchain">
                1254.89 CFX
                </span>
              </div>
              <div className="d-flex w-100 align-items-center gap-3 justify-content-between">
                <span className="itemchain">Floor price</span>
                <span className="itemchain">
                1254.89 CFX
                </span>
              </div>
              {offerData.length > 0 && (
                <div className="d-flex  w-100 align-items-center gap-3 justify-content-between">
                  <span className="itemchain">Best offer</span>
                  <span className="itemchain">
                  1254.89 CFX
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="summaryseparator"></div>
          {offerData.length > 0 && (
            <div className="summaryred">
              <div className="d-flex align-items-center gap-2 justify-content-between w-100">
                <span className="itemchain">
                  <img src={whiteTag} alt="" /> My offer
                </span>
                <div className="d-flex flex-row flex-lg-column flex-xxl-column gap-2 gap-lg-0 gap-xxl-0 align-items-end">
                  <span className="itemname" style={{ whiteSpace: "nowrap" }}>
                    {getFormattedNumber(offerData[0].offer[0] / 1e18, 2)}{" "}
                    {offerData[0].offer.payment.priceType === "0"
                      ? "ETH"
                      : offerData[0].offer.payment.tokenAddress ===
                        window.config.token_dypius_new_address
                      ? "DYPv2"
                      : "DYPv1"}
                  </span>
                  <span className="itemcollectionName">
                    $
                    {getFormattedNumber(
                      offerData[0].offer.payment.priceType === "0"
                        ? ethTokenData * (offerData[0].offer[0] / 1e18)
                        : offerData[0].offer.payment.tokenAddress ===
                          window.config.token_dypius_new_address
                        ? dypTokenData * (offerData[0].offer[0] / 1e18)
                        : dyptokenData_old * (offerData[0].offer[0] / 1e18),
                      offerData[0].offer.payment.priceType === "0" ? 3 : 3
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="d-flex flex-column flex-xxl-row flex-xl-row flex-lg-row flex-md-row align-items-center gap-3 justify-content-between">
            <div className="d-flex flex-column flex-xxl-row flex-xl-row flex-lg-row flex-md-row align-items-center gap-2">
              <input
                type="number"
                min={0}
                pattern="^[0-9]*[.,]?[0-9]*$"
                placeholder="Price"
                className="px-3 py-2 offerInput"
                value={price}
                onClickCapture={() => {
                  setprice(price != 0 ? price : "");
                }}
                onChange={(e) => {
                  setprice(e.target.value === "" ? "" : Number(e.target.value));
                //   isapprovedMakeOffer(
                //     Number(e.target.value),
                //     filter1 === "weth" ? 0 : 1,
                //     filter1
                //   );
                }}
              />
              <span className="itemcollectionName">
                $tbd
               
              </span>
            </div>
            <div className="dropdown" style={{ width: "150px" }}>
              <button
                className="btn btn-secondary nft-dropdown w-100
                 d-flex align-items-center justify-content-between dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="d-flex align-items-center gap-2">
                  <h6
                    className="filter-nav-title mb-0"
                    style={{ textTransform: "uppercase" }}
                  >
                    CFX
                  </h6>
                </div>
              </button>
             
            </div>
          </div>
          {offerData.length === 0 ? (
            <button
              className={`btn ${
                status === "fail" || approvestatus === "fail"
                  ? "errorbtn"
                  : "mint-now-btn"
              } gap-2 align-self-center align-self-xxl-end align-self-xl-end align-self-lg-end mt-4`}
              style={{ width: "fit-content" }}
            //   onClick={() => {
            //     isApprove
            //       ? handleMakeOffer(price, filter1 === "weth" ? 0 : 1, filter1)
            //       : approveMakeOffer(
            //           price,
            //           filter1 === "weth" ? 0 : 1,
            //           filter1
            //         );
            //   }}
            >
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
                      style={{ width: 16, height: 16 }}
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
                    style={{ width: 16, height: 16 }}
                  ></div>
                </>
              ) : status === "success" ? (
                "Success"
              ) : (
                "Failed"
              )}
            </button>
          ) : (
            <div className="d-flex align-items-center gap-2 justify-content-between w-100">
              <button
                className={`btn ${
                  deletestatus === "faildelete" ? "errorbtn" : "mint-now-btn"
                } gap-2  align-self-center align-self-xxl-end align-self-xl-end align-self-lg-end  mt-4`}
                style={{ width: "fit-content" }}
                onClick={() => {
                  handleDeleteOffer(offerData[0].index);
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
                      style={{ width: 16, height: 16 }}
                    ></div>
                  </>
                ) : deletestatus === "successdelete" ? (
                  "Success"
                ) : (
                  "Failed"
                )}
              </button>

              <button
                className={`btn ${
                  updatestatus === "failupdate" ? "errorbtn" : "pill-btn"
                } gap-2  align-self-center align-self-xxl-end align-self-xl-end align-self-lg-end  mt-4`}
                style={{ width: "fit-content" }}
                onClick={() => {
                  handleUpdateOffer(
                    price,
                    filter1 === "weth" ? 0 : 1,
                    offerData[0].index,
                    filter1
                  );
                }}
              >
                {updatestatus === "initial" ? (
                  "Update"
                ) : updatestatus === "loadingupdate" ? (
                  <>
                    Updating offer{" "}
                    <div
                      className="spinner-border mx-1"
                      role="status"
                      style={{ width: 16, height: 16 }}
                    ></div>
                  </>
                ) : updatestatus === "successupdate" ? (
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
