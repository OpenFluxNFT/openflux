import React, { useState } from "react";
import "./_singlenfthistory.scss";
import saleIcon from "./assets/saleIcon.svg";
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
  saleHistory,
}) => {
  const [selectedNftId, setSelectedNftId] = useState(""); //buy

  return (
    <div className="container-lg my-4">
      <div className="row mx-0 justify-content-between gap-lg-0 gap-3">
        <div className="nft-history-wrapper p-3">
          <div className="d-flex flex-column gap-2">
            <span className="item-history-text">Sales History</span>
            <div className="single-nft-table-wrapper">
              {saleHistory && saleHistory.length > 0 && (
                <table className="table item-history-table">
                  <thead className="item-history-table-thead">
                    <th className="item-history-table-th text-center">Event</th>
                    <th className="item-history-table-th text-center">Price</th>
                    <th className="item-history-table-th text-center">From</th>
                    <th className="item-history-table-th text-center">To</th>
                    <th className="item-history-table-th text-center">Date</th>
                  </thead>
                  <tbody>
                    {saleHistory.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="item-history-table-td left-border text-center">
                            <img src={saleIcon} alt="" /> Sale
                          </td>
                          <td className="item-history-table-td text-center">
                            {getFormattedNumber(item.amount / 1e18)} WCFX
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
                          <td className="item-history-table-td greentext text-center">
                            <a
                              href={`https://evm.confluxscan.net/address/${item.buyer ?? item.offeror}`}
                              className="greentext"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {shortAddress(item.buyer ?? item.offeror)}
                            </a>
                          </td>
                          <td className="item-history-table-td right-border text-center">
                            {moment
                              .duration(item.blockTimestamp * 1000 - Date.now())
                              .humanize(true)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
              {saleHistory && saleHistory.length === 0 && (
                <span className="text-secondary d-flex justify-content-center w-100 h-100 align-items-center">
                  No sales available for this NFT
                </span>
              )}
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
                              {getFormattedNumber( lowestPriceNftListed ?
                              
                                   (100 - ((item.amount/ 1e18 )/ (lowestPriceNftListed / 1e18)) )
                                 : 0,
                                3
                              )}
                              %{" "}
                              {lowestPriceNftListed ? (lowestPriceNftListed / 1e18) > (item.amount / 1e18)
                                ? "Below"
                                : "Above" : 'Below'}
                            </td>
                            <td className="item-history-table-td greentext right-border text-center">
                              <a
                                href={`https://evm.confluxscan.net/address/${item.offeror}`}
                                className="greentext"
                                target="_blank"
                              rel="noreferrer"
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
                                      handleAcceptOffer(item.index, item.offeror);
                                      setSelectedNftId(item.index);
                                    }}
                                  >
                                    {offeracceptStatus === "initial" ? (
                                      "Accept"
                                    ) : offeracceptStatus === "loading" &&
                                      selectedNftId === item.index ? (
                                      <>
                                        Accepting
                                        <div
                                          className="spinner-border mx-1"
                                          role="status"
                                          style={{ width: 10, height: 10 }}
                                        ></div>
                                      </>
                                    ) : offeracceptStatus === "success" &&
                                      selectedNftId === item.index ? (
                                      "Success"
                                    ) : offeracceptStatus === "fail" &&
                                      selectedNftId === item.index ? (
                                      "Failed"
                                    ) : (
                                      "Accept"
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
                <span className="text-secondary d-flex justify-content-center w-100 h-100 align-items-center">
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
