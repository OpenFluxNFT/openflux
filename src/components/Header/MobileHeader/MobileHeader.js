import React from "react";
import "./_mobileheader.scss";
import "../_header.scss";
import headerLogo from "../assets/headerLogo.svg";
import swappiIcon from "../assets/swappiIcon.svg";
import { useState } from "react";
import { useEffect } from "react";
import mobileNavArrow from "./mobileNavArrow.svg";
import { shortAddress } from "../../../hooks/shortAddress";
import walletIcon from "../../Header/assets/walletIcon.svg";
import userIcon from "../../Header/assets/userIcon.svg";
import { handleSwitchNetworkhook } from "../../../hooks/switchNetwork";
import conflux from "../assets/conflux.svg";
import { NavLink } from "react-router-dom";

const MobileHeader = ({
  handleSignup,
  coinbase,
  isConnected,
  chainId,
  handleSwitchNetwork,
  handleSignupAndRedirectToAccount,
  balance,
}) => {
  const [menu, setMenu] = useState(false);

  const html = document.querySelector("html");

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

  useEffect(() => {
    if (menu) {
      html.classList.add("hidescroll");
    } else {
      // Enable scroll
      html.classList.remove("hidescroll");
    }
  }, [menu]);

  useEffect(() => {
    setMenu(false);
  }, []);

  return (
    <>
      <div
        className="container-fluid py-4 mobile-header-wrapper header-wrapper "
        style={{ height: "85px", pointerEvents: "auto", zIndex: 5 }}
      >
        <div className="container-lg">
          <div className="row align-items-center justify-content-center">
            <div className="d-flex align-items-center justify-content-between">
              <NavLink to={"/"}>
                <img src={headerLogo} width={35} height={35} alt="" />
              </NavLink>
              <>
                <input
                  id="menu-toggle"
                  className={`${menu && "menu-toggle-open"}`}
                  type="checkbox"
                  onChange={() => {
                    setMenu(!menu);
                  }}
                />
                <label className="menu-button-container" htmlFor="menu-toggle">
                  <div className="menu-button"></div>
                </label>
              </>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`mobile-menu-container ${
          menu && "mobile-active"
        } d-flex flex-column align-items-center justify-content-center gap-3 p-3`}
      >
        {/* <NavLink
          className={
            "mobile-menu-item d-flex align-items-center justify-content-between w-100"
          }
          style={{ textDecoration: "none" }}
          to={"/collections"}
        >
          <div
            className="d-flex align-items-center justify-content-between p-3 w-100"
            onClick={() => {
              setMenu(false);
            }}
          >
            <h6 className="mb-0 text-white">Collections</h6>
            <img src={mobileNavArrow} alt="" />
          </div>
        </NavLink> */}

        <NavLink
          className={
            "mobile-menu-item d-flex align-items-center justify-content-between w-100"
          }
          style={{ textDecoration: "none" }}
          to={`/profile/${coinbase}`}
        >
          <div
            className="d-flex align-items-center justify-content-between p-3 w-100"
            onClick={() => {
              setMenu(false);
            }}
          >
            <h6 className="mb-0 text-white">Account</h6>
            <img src={mobileNavArrow} alt="" />
          </div>
        </NavLink>

        {/* <div className="mobile-menu-item d-flex align-items-center justify-content-between p-3">
          <h6 className="mb-0 text-white">Mint</h6>
          <img src={mobileNavArrow} alt="" />
        </div> */}
        {/* <div className="mobile-menu-item d-flex align-items-center justify-content-between p-3">
          <a className={"mb-0 text-white"} href="mailto:someone@support.com">
            Support
          </a>

          <img src={mobileNavArrow} alt="" />
        </div> */}
        <div className="w-100 d-flex align-items-center gap-3 justify-content-between">
          <a
            href="https://swappi.io/"
            style={{ textDecoration: "none" }}
            target="_blank"
          >
            <button className="swappi-btn px-3 d-flex align-items-center gap-2">
              <img src={swappiIcon} alt="" />
              Swappi
            </button>
          </a>
          {coinbase && isConnected && chainId === 1030 && (
            <button className="btn account-btn d-flex align-items-center gap-2">
              <img src={conflux} alt="" />
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
        
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
