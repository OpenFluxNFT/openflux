import React from "react";
import "./_singlenfthistory.scss";
import saleIcon from "./assets/saleIcon.svg";
import listIcon from "./assets/listIcon.svg";
import mintedIcon from "./assets/mintedIcon.svg";
import transferIcon from "./assets/transferIcon.svg";
import getFormattedNumber from "../../../hooks/get-formatted-number";
import moment from "moment";
import { shortAddress } from "../../../hooks/shortAddress";

const SingleNftHistory = ({
  allOffers,
  cfxPrice,
  nftData,
  coinbase,
  handleAcceptOffer,
  offeracceptStatus,
  lowestPriceNftListed,
}) => {
  return (
    <div className="container-lg my-4">
      <div className="row mx-0 justify-content-between">
        <div className="nft-history-wrapper p-3">
          <div className="d-flex flex-column gap-2">
            <span className="item-history-text">Item History</span>
            <div className="single-nft-table-wrapper">
              <table className="table item-history-table">
                <thead className="item-history-table-thead">
                  <th className="item-history-table-th">Event</th>
                  <th className="item-history-table-th">Price</th>
                  <th className="item-history-table-th">From</th>
                  <th className="item-history-table-th">To</th>
                  <th className="item-history-table-th">Date</th>
                </thead>
                <tbody>
                  <tr>
                    <td className="item-history-table-td left-border">
                      <img src={saleIcon} alt="" /> Sale
                    </td>
                    <td className="item-history-table-td">128.50 WCFX</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td right-border">
                      11d ago
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      <img src={saleIcon} alt="" /> Sale
                    </td>
                    <td className="item-history-table-td">128.50 WCFX</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td right-border">
                      11d ago
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      <img src={listIcon} alt="" /> Listing
                    </td>
                    <td className="item-history-table-td">128.50 WCFX</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td right-border">
                      11d ago
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      <img src={transferIcon} alt="" /> Transfer
                    </td>
                    <td className="item-history-table-td">128.50 WCFX</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td right-border">
                      11d ago
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      <img src={mintedIcon} alt="" /> Minted
                    </td>
                    <td className="item-history-table-td">128.50 WCFX</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td right-border">
                      11d ago
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      <img src={saleIcon} alt="" /> Sale
                    </td>
                    <td className="item-history-table-td">128.50 WCFX</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td right-border">
                      11d ago
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      <img src={saleIcon} alt="" /> Sale
                    </td>
                    <td className="item-history-table-td">128.50 WCFX</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td right-border">
                      11d ago
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      <img src={saleIcon} alt="" /> Sale
                    </td>
                    <td className="item-history-table-td">128.50 WCFX</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td right-border">
                      11d ago
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      <img src={saleIcon} alt="" /> Sale
                    </td>
                    <td className="item-history-table-td">128.50 WCFX</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td right-border">
                      11d ago
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      <img src={saleIcon} alt="" /> Sale
                    </td>
                    <td className="item-history-table-td">128.50 WCFX</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td right-border">
                      11d ago
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      <img src={saleIcon} alt="" /> Sale
                    </td>
                    <td className="item-history-table-td">128.50 WCFX</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td greentext">0x50c4</td>
                    <td className="item-history-table-td right-border">
                      11d ago
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="nft-history-wrapper p-3">
          <div className="d-flex flex-column gap-2">
            <span className="item-history-text">Active Offers</span>
            <div className="single-nft-table-wrapper">
              {allOffers && allOffers.length > 0 && (
                <table className="table item-history-table">
                  <thead className="item-history-table-thead">
                    <th className="item-history-table-th text-center">Offer</th>
                    <th className="item-history-table-th text-center">
                      USD Price
                    </th>
                    <th className="item-history-table-th text-center">
                      Expiration
                    </th>
                    <th className="item-history-table-th text-center">
                      Floor difference
                    </th>
                    <th className="item-history-table-th text-center">From</th>
                    {nftData &&
                      nftData.owner &&
                      coinbase &&
                      coinbase.toLowerCase() ===
                        nftData.owner.toLowerCase() && (
                        <th className="item-history-table-th text-center">
                          Action
                        </th>
                      )}
                  </thead>
                  <tbody>
                    {allOffers &&
                      allOffers.length > 0 &&
                      allOffers.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="item-history-table-td left-border text-center">
                              {getFormattedNumber(item.amount / 1e18)} WCFX
                            </td>
                            <td className="item-history-table-td text-center">
                              $
                              {getFormattedNumber(
                                (item.amount / 1e18) * cfxPrice
                              )}
                            </td>
                            <td className="item-history-table-td text-center">
                              {moment
                                .duration(item.expiresAt * 1000 - Date.now())
                                .humanize(true)}
                            </td>
                            <td className="item-history-table-td text-center">
                              {lowestPriceNftListed / 1e18 > item.amount / 1e18
                                ? (lowestPriceNftListed / 1e18 -
                                    item.amount / 1e18) /
                                  100
                                : (item.amount / 1e18 -
                                    lowestPriceNftListed / 1e18) /
                                  100}
                            </td>
                            <td className="item-history-table-td greentext right-border text-center">
                              <a
                                href={`https://evm.confluxscan.net/address/${item.offeror}`}
                                className="greentext"
                              >
                                {shortAddress(item.offeror)}
                              </a>
                            </td>
                            {nftData &&
                              nftData.owner &&
                              coinbase &&
                              coinbase.toLowerCase() ===
                                nftData.owner.toLowerCase() && (
                                <td className="item-history-table-td greentext right-border text-center">
                                  <button
                                    disabled={!item.isAllowed}
                                    className={` px-3 py-1 ${
                                      item.isAllowed
                                        ? "active-accept-btn"
                                        : "disabled-accept-btn"
                                    } `}
                                    onClick={() => {
                                      handleAcceptOffer(item.index);
                                    }}
                                  >
                                    {offeracceptStatus === "initial" ? (
                                      "Accept"
                                    ) : offeracceptStatus === "loading" ? (
                                      <>
                                        Accepting{" "}
                                        <div
                                          className="spinner-border mx-1"
                                          role="status"
                                          style={{ width: 10, height: 10 }}
                                        ></div>
                                      </>
                                    ) : offeracceptStatus === "success" ? (
                                      "Success"
                                    ) : (
                                      "Failed"
                                    )}
                                  </button>
                                </td>
                              )}
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              )}
              {allOffers && allOffers.length === 0 && (
                <span className="text-secondary d-flex justify-content-center w-100 p-3">
                  No offers available for this NFT
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleNftHistory;
