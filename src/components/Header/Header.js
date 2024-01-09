import React, { useState } from "react";
import "./_header.scss";
import dypiusLogo from "./assets/dypiusLogo.svg";
import cartIcon from "./assets/cartIcon.svg";
import walletIcon from "./assets/walletIcon.svg";
import userIcon from "./assets/userIcon.svg";
import conflux from "./assets/conflux.svg";
import copy from "./assets/copy.svg";
import check from "./assets/check.svg";
import logout from "./assets/logout.svg";

import searchIcon from "./assets/searchIcon.svg";
import { shortAddress } from "../../hooks/shortAddress";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { handleSwitchNetworkhook } from "../../hooks/switchNetwork";
import OutsideClickHandler from "react-outside-click-handler";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import dropdown from "./assets/dropdown.svg";

const Header = ({
  handleSignup,
  coinbase,
  isConnected,
  chainId,
  handleSwitchNetwork,
  handleSignupAndRedirectToAccount,
  handleDisconnect,
}) => {
  const [showmenu, setShowMenu] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const manageDisconnect = () => {
    if (location.pathname.includes("/profile")) {
      handleDisconnect();
      navigate("/");
    } else handleDisconnect();
  };

  return (
    <div className="container-fluid py-3 header-wrapper">
      <div
        className="container-lg px-0
      "
      >
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
                <a
                  className={"header-link mb-0"}
                  href="mailto:someone@support.com"
                >
                  Support
                </a>
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
                  <button
                    className="btn account-btn d-flex align-items-center gap-2"
                    onClick={() => {
                      setShowMenu(true);
                    }}
                  >
                    {shortAddress(coinbase)}
                    <img src={dropdown} alt="" />
                  </button>
                )}
                {coinbase && isConnected ? (
                  <NavLink className="btn blue-btn" to={`/profile/${coinbase}`}>
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
                {showmenu === true && (
                  <div className="position-absolute" style={{ width: "210px" }}>
                    <OutsideClickHandler
                      onOutsideClick={() => {
                        setShowMenu(false);
                      }}
                    >
                      <div className="menuwrapper">
                        <div className="d-flex flex-column gap-2">
                          <span
                            className="menuitem2"
                            onClick={() => {
                              setTooltip(true);
                              setTimeout(() => setTooltip(false), 2000);
                            }}
                          >
                            <img src={tooltip ? check : copy} alt="" /> Copy{" "}
                          </span>

                          <span
                            className="menuitem2"
                            onClick={() => {
                              setShowMenu(false);
                              manageDisconnect();
                            }}
                          >
                            <img src={logout} alt="" /> Disconnect{" "}
                          </span>
                        </div>
                      </div>
                    </OutsideClickHandler>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
