import React, { useEffect, useState } from "react";
import "../SingleNftHistory/_singlenfthistory.scss";
import listIcon from "../SingleNftHistory/assets/listIcon.svg";
import getFormattedNumber from "../../../hooks/get-formatted-number";
import moment from "moment";
import { handleSwitchNetworkhook } from "../../../hooks/switchNetwork";
import { shortAddress } from "../../../hooks/shortAddress";
import wcfx from "../SingleNftBanner/assets/cfx.svg";

const ListingsTable = ({
  cfxPrice,
  coinbase,
  chainId,
  isConnected,
  handleUpdateListing,
  nftData,
  handleSwitchNetwork,
  onShowMakeOfferPopup,
  handleSignup,
  handleBuyNft,
  handlecancelListNft,
  offerData,
  updateLoading,
  updateStatus,
  cancelLoading,
  cancelStatus,
  buyloading,
  buyStatus,
}) => {
  const [selectedNftId, setSelectedNftId] = useState("");
  const [nftPrice, setNftPrice] = useState(1);

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

  return (
    <div className="container-lg my-4">
      <div className="row mx-0 justify-content-between gap-lg-0 gap-3">
        <div className="nft-history-wrapper w-100 p-3">
          <div className="d-flex flex-column gap-2">
            <span className="item-history-text">All Listings</span>
            <div className="single-nft-table-wrapper2">
              {nftData.listedObject && nftData.listedObject.length > 0 && (
                <table className="table item-history-table">
                  <thead className="item-history-table-thead">
                    <th className="item-history-table-th text-center">Event</th>
                    <th className="item-history-table-th text-center">Name</th>
                    <th className="item-history-table-th text-center">From</th>

                    <th className="item-history-table-th text-center">Price</th>
                    <th className="item-history-table-th text-center">
                      Expiration
                    </th>
                    <th className="item-history-table-th text-center">
                      Action
                    </th>
                  </thead>
                  <tbody>
                    {nftData.listedObject.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="item-history-table-td left-border text-center">
                            <img src={listIcon} alt="" /> Listing
                          </td>
                          <td className="item-history-table-td text-center">
                            {nftData.nftSymbol} {nftData.name}
                          </td>
                          <td className="item-history-table-td greentext text-center">
                            <a
                              href={`https://evm.confluxscan.net/address/${item.seller}`}
                              className="greentext"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {shortAddress(item.seller)}
                            </a>
                          </td>
                          <td className="item-history-table-td text-center">
                            <div className="d-flex align-items-center gap-1 justify-content-center">
                              {item.seller.toLowerCase() ===
                              coinbase?.toLowerCase() ? (
                                <div className="d-flex position-relative w-100">
                                  <input
                                    type="number"
                                    className="uni-input w-100"
                                    value={
                                      nftPrice === "" ||
                                      nftPrice === 1 ||
                                      selectedNftId === "" ||
                                      selectedNftId != index
                                        ? item.price / 1e18
                                        : nftPrice
                                    }
                                    onChange={(e) => {
                                      setNftPrice(e.target.value);
                                      setSelectedNftId(index);
                                    }}
                                  />
                                  <div className="wcfx-wrapper position-absolute">
                                    <div className="d-flex align-items-center gap-2">
                                      <img
                                        src={wcfx}
                                        alt=""
                                        style={{ width: 12 }}
                                      />
                                      WCFX
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span className="nft-price-crypto">
                                  {getFormattedNumber(item.price / 1e18)} WCFX
                                </span>
                              )}
                              <span className="greentext">
                                ($
                                {getFormattedNumber(
                                  (nftPrice === "" ||
                                  nftPrice === 1 ||
                                  selectedNftId === "" ||
                                  selectedNftId != index
                                    ? item.price / 1e18
                                    : nftPrice) * cfxPrice
                                )}
                                )
                              </span>
                            </div>
                          </td>
                          <td className="item-history-table-td greentext text-center">
                            {moment
                              .duration(item.expiresAt * 1000 - Date.now())
                              .humanize(true)}
                          </td>
                          <td className="item-history-table-td greentext text-center">
                            {isConnected &&
                            chainId === 1030 &&
                            item.seller.toLowerCase() ===
                              coinbase?.toLowerCase() ? (
                              <div className="d-flex align-items-center justify-content-center gap-3">
                                <button
                                  className="buy-btn2 w-100 py-1"
                                  onClick={() => {
                                    setSelectedNftId(index);
                                    chainId === 1030
                                      ? handleUpdateListing(
                                          nftPrice,
                                          item.nftAddress,
                                          item.listingIndex
                                        )
                                      : handleConfluxChain();
                                  }}
                                >
                                  {updateLoading &&
                                  chainId === 1030 &&
                                  selectedNftId === index ? (
                                    <div
                                      className="spinner-border spinner-border-sm text-light"
                                      role="status"
                                    ></div>
                                  ) : !updateLoading &&
                                    chainId !== 1030 &&
                                    selectedNftId === index ? (
                                    "Switch Network"
                                  ) : updateStatus === "update" ||
                                    updateStatus === "" ? (
                                    "Update"
                                  ) : updateStatus === "success" &&
                                    selectedNftId === index ? (
                                    "Success"
                                  ) : (
                                    "Failed"
                                  )}
                                </button>
                                <button
                                  className="buy-btn2 w-100 py-1"
                                  onClick={() => {
                                    setSelectedNftId(index);
                                    chainId === 1030
                                      ? handlecancelListNft(
                                          item.nftAddress,
                                          item.listingIndex
                                        )
                                      : handleConfluxChain();
                                  }}
                                >
                                  {cancelLoading &&
                                  chainId === 1030 &&
                                  selectedNftId === index ? (
                                    <div
                                      className="spinner-border spinner-border-sm text-light"
                                      role="status"
                                    ></div>
                                  ) : !cancelLoading && chainId !== 1030 ? (
                                    "Switch Network"
                                  ) : cancelStatus === "cancel" ||
                                    cancelStatus === "" ? (
                                    "Unlist"
                                  ) : cancelStatus === "success" &&
                                    selectedNftId === index ? (
                                    "Success"
                                  ) : (
                                    "Failed"
                                  )}
                                </button>
                              </div>
                            ) : isConnected &&
                              chainId === 1030 &&
                              item.seller.toLowerCase() !==
                                coinbase?.toLowerCase() ? (
                              <div className="d-flex align-items-center justify-content-center gap-3">
                                <button
                                  className="btn buy-btn2 w-100 py-1"
                                  onClick={onShowMakeOfferPopup}
                                >
                                  {offerData && offerData.amount
                                    ? "Update Offer"
                                    : "Make Offer"}
                                </button>
                                <button
                                  className="btn buy-btn2 w-100 py-1"
                                  onClick={() => {
                                    setSelectedNftId(index);
                                    chainId === 1030
                                      ? handleBuyNft(item.nftAddress, item)
                                      : handleConfluxChain();
                                  }}
                                >
                                  {buyloading &&
                                  chainId === 1030 &&
                                  selectedNftId === index ? (
                                    <div
                                      className="spinner-border spinner-border-sm text-light"
                                      role="status"
                                    ></div>
                                  ) : !buyloading && chainId !== 1030 ? (
                                    "Switch Network"
                                  ) : buyStatus === "success" &&
                                    selectedNftId === index ? (
                                    "Success"
                                  ) : buyStatus === "failed" &&
                                    selectedNftId === index ? (
                                    "Failed"
                                  ) : (
                                    "Buy"
                                  )}
                                </button>
                              </div>
                            ) : !isConnected && chainId === 1030 ? (
                              <button
                                className="btn connect-btn2 d-flex align-items-center gap-2 w-100 justify-content-center "
                                onClick={handleSignup}
                              >
                                Connect Wallet
                              </button>
                            ) : (
                              <button
                                onClick={handleConfluxChain}
                                className="buy-btn2 w-100 py-1"
                              >
                                Switch Network
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
              {nftData.listedObject && nftData.listedObject.length === 0 && (
                <span className="text-secondary d-flex justify-content-center w-100 h-100 align-items-center">
                  No sales available for this NFT
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingsTable;
