import React from "react";
import "./_singlenfthistory.scss";
import saleIcon from "./assets/saleIcon.svg";
import listIcon from "./assets/listIcon.svg";
import mintedIcon from "./assets/mintedIcon.svg";
import transferIcon from "./assets/transferIcon.svg";

const SingleNftHistory = () => {
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
                    <td className="item-history-table-td">128.50 CFX</td>
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
                    <td className="item-history-table-td">128.50 CFX</td>
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
                    <td className="item-history-table-td">128.50 CFX</td>
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
                    <td className="item-history-table-td">128.50 CFX</td>
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
                    <td className="item-history-table-td">128.50 CFX</td>
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
                    <td className="item-history-table-td">128.50 CFX</td>
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
                    <td className="item-history-table-td">128.50 CFX</td>
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
                    <td className="item-history-table-td">128.50 CFX</td>
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
                    <td className="item-history-table-td">128.50 CFX</td>
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
                    <td className="item-history-table-td">128.50 CFX</td>
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
                    <td className="item-history-table-td">128.50 CFX</td>
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
            <span className="item-history-text">Offer History</span>
            <div className="single-nft-table-wrapper">
              <table className="table item-history-table">
                <thead className="item-history-table-thead">
                  <th className="item-history-table-th">Offer</th>
                  <th className="item-history-table-th">USD Price</th>
                  <th className="item-history-table-th">Floor difference</th>
                  <th className="item-history-table-th">From</th>
                </thead>
                <tbody>
                  <tr>
                    <td className="item-history-table-td left-border">
                      128.50 CFX
                    </td>
                    <td className="item-history-table-td">$120.00</td>
                    <td className="item-history-table-td">24% below</td>
                    <td className="item-history-table-td greentext right-border">
                      0x50c4
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      128.50 CFX
                    </td>
                    <td className="item-history-table-td">$120.00</td>
                    <td className="item-history-table-td">24% below</td>
                    <td className="item-history-table-td greentext right-border">
                      0x50c4
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      128.50 CFX
                    </td>
                    <td className="item-history-table-td">$120.00</td>
                    <td className="item-history-table-td">24% below</td>
                    <td className="item-history-table-td greentext right-border">
                      0x50c4
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      128.50 CFX
                    </td>
                    <td className="item-history-table-td">$120.00</td>
                    <td className="item-history-table-td">24% below</td>
                    <td className="item-history-table-td greentext right-border">
                      0x50c4
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      128.50 CFX
                    </td>
                    <td className="item-history-table-td">$120.00</td>
                    <td className="item-history-table-td">24% below</td>
                    <td className="item-history-table-td greentext right-border">
                      0x50c4
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      128.50 CFX
                    </td>
                    <td className="item-history-table-td">$120.00</td>
                    <td className="item-history-table-td">24% below</td>
                    <td className="item-history-table-td greentext right-border">
                      0x50c4
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      128.50 CFX
                    </td>
                    <td className="item-history-table-td">$120.00</td>
                    <td className="item-history-table-td">24% below</td>
                    <td className="item-history-table-td greentext right-border">
                      0x50c4
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      128.50 CFX
                    </td>
                    <td className="item-history-table-td">$120.00</td>
                    <td className="item-history-table-td">24% below</td>
                    <td className="item-history-table-td greentext right-border">
                      0x50c4
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      128.50 CFX
                    </td>
                    <td className="item-history-table-td">$120.00</td>
                    <td className="item-history-table-td">24% below</td>
                    <td className="item-history-table-td greentext right-border">
                      0x50c4
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      128.50 CFX
                    </td>
                    <td className="item-history-table-td">$120.00</td>
                    <td className="item-history-table-td">24% below</td>
                    <td className="item-history-table-td greentext right-border">
                      0x50c4
                    </td>
                  </tr>
                  <tr>
                    <td className="item-history-table-td left-border">
                      128.50 CFX
                    </td>
                    <td className="item-history-table-td">$120.00</td>
                    <td className="item-history-table-td">24% below</td>
                    <td className="item-history-table-td greentext right-border">
                      0x50c4
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleNftHistory;
