import React from "react";
import "./_header.scss";
import dypiusLogo from "./assets/dypiusLogo.svg";
import cartIcon from "./assets/cartIcon.svg";
import walletIcon from "./assets/walletIcon.svg";
import userIcon from "./assets/userIcon.svg";
import conflux from "./assets/conflux.svg";

import searchIcon from "./assets/searchIcon.svg";
import { shortAddress } from "../../hooks/shortAddress";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { handleSwitchNetworkhook } from "../../hooks/switchNetwork";

const Header = ({
  handleSignup,
  coinbase,
  isConnected,
  chainId,
  handleSwitchNetwork,
}) => {
  const handleConfluxPool = async () => {
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
    <div className="container-fluid py-3 header-wrapper">
      <div className="container-lg px-0
      ">
        <div className="row mx-0 align-items-center justify-content-center">
          <div className="col-1">
            <NavLink to={"/"}>
              <img src={dypiusLogo} alt="" />
            </NavLink>
          </div>
          <div className="col-4">
            <div className="position-relative">
              <img src={searchIcon} alt="" className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search anything"
              />
            </div>
          </div>
          <div className="col-7 px-0">
            <div className="d-flex gap-1 align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-4">
                <NavLink className={"header-link mb-0"} to={"/collections"}>
                  Collections
                </NavLink>
                {/* <NavLink className={"header-link mb-0"} to={"/mint"}>
                  Mint
                </NavLink> */}
                <NavLink className={"header-link mb-0"} to={"/support"}>
                  Support
                </NavLink>
              </div>
              <div className="d-flex align-items-center gap-3">
                {coinbase && isConnected && chainId === 1030 && (
                  <button className="btn account-btn d-flex align-items-center gap-2">
                    <img src={conflux} alt="" /> Conflux
                  </button>
                )}
                {coinbase && isConnected && chainId !== 1030 && (
                  <button className="btn error-btn" onClick={handleConfluxPool}>
                    Unsupported chain
                  </button>
                )}

                {!coinbase && !isConnected && (
                  <button
                    className="btn blue-btn d-flex align-items-center gap-2"
                    onClick={handleSignup}
                  >
                    <img src={walletIcon} alt="" />
                    Connect Wallet
                  </button>
                )}
                {coinbase && isConnected && (
                  <button className="btn account-btn d-flex align-items-center gap-2">
                    {shortAddress(coinbase)}
                  </button>
                )}
                <button className="btn blue-btn">
                  <img src={userIcon} alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
