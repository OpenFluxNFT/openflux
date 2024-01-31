import React from "react";
import "./_mobileheader.scss";
import "../_header.scss";
import dypiusLogo from "../assets/dypiusLogo.svg";
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
  handleSignupAndRedirectToAccount,balance
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
    setMenu(false)
  }, [])
  

  return (
    <>
      <div
        className="container-fluid py-4 mobile-header-wrapper header-wrapper "
        style={{ height: "85px", pointerEvents: "auto", zIndex: 5 }}
        
      >
        <div className="container-lg">
          <div className="row align-items-center justify-content-center">
            <div className="d-flex align-items-center justify-content-between">
              <NavLink to={'/'}>
              <img src={dypiusLogo} width={35} height={35} alt="" />
              </NavLink>
              <>
                <input
                  id="menu-toggle"
                  className={`${menu && 'menu-toggle-open'}`}
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
      <NavLink
        className={`mobile-menu-container ${
          menu && "mobile-active"
        } d-flex flex-column align-items-center justify-content-center gap-3 p-3`}
        to={"/collections"}
        style={{textDecoration: "none"}}

      >
        <div
          className={
            "mobile-menu-item d-flex align-items-center justify-content-between p-3"
          }
          onClick={() => {
            setMenu(false);
            console.log(menu, "menu");
          }}
        >
          <h6 className="mb-0 text-white">Collections</h6>
          <img src={mobileNavArrow} alt="" />
        </div>

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
        <div className="d-flex align-items-center gap-3">
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
          {coinbase && isConnected ? (
            <NavLink className="btn blue-btn" to={`/profile/${coinbase}`} onClick={() => setMenu(false)}>
              <img src={userIcon} alt="" />
            </NavLink>
          ) : (
            <button
              className="btn blue-btn"
              onClick={handleSignupAndRedirectToAccount}
            >
              <img src={userIcon} alt="" />
            </button>
          )}
        </div>
      </NavLink>
    </>
  );
};

export default MobileHeader;
