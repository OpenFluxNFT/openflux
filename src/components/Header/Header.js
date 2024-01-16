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
import Web3 from "web3";
import getFormattedNumber from "../../hooks/get-formatted-number";
const Header = ({
  handleSignup,
  coinbase,
  isConnected,
  chainId,
  handleSwitchNetwork,
  handleSignupAndRedirectToAccount,
  handleDisconnect,
  allCollections,
}) => {
  const [showmenu, setShowMenu] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [balance, setUserBalance] = useState(0);
  const [searchResult, setSearchResult] = useState("");
  const [currentCollection, setcurrentCollection] = useState();
  const [isopen, setisopen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const getUserBalance = async () => {
    if (isConnected && coinbase && chainId === 1030) {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [coinbase, "latest"],
      });

      if (balance) {
        const web3cfx = new Web3(window.config.conflux_endpoint);
        const stringBalance = web3cfx.utils.hexToNumberString(balance);
        const amount = web3cfx.utils.fromWei(stringBalance, "ether");
        setUserBalance(amount);
      }
    }
  };

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
      // navigate("/");
    } else handleDisconnect();
  };

  const handleFilterCollection = (collectionTitle) => {
    if (collectionTitle.length >= 3) {
      const result = allCollections.filter((item) => {
        return item.collectionName
          .toLowerCase()
          .includes(collectionTitle.toLowerCase());
      });
      console.log(result);
      if (result) {
        setcurrentCollection(result);
        setisopen(true);
      } else {
        setcurrentCollection();
        setisopen(false);
      }
    }
  };

  useEffect(() => {
    getUserBalance();
  }, [coinbase, isConnected, chainId]);

  return (
    <div className="container-fluid py-3 header-wrapper">
      <div
        className="container-lg px-0
      "
      >
        <div className="row mx-0 align-items-center justify-content-center position-relative">
          <div className="col-1">
            <NavLink to={"/"}>
              <img src={dypiusLogo} alt="" />
            </NavLink>
          </div>
          <div className="col-4">
            <div
              className="position-relative"
              onClick={() => {
                searchResult !== "" && handleFilterCollection(searchResult);
              }}
            >
              <img src={searchIcon} alt="" className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search anything"
                value={searchResult}
                onChange={(e) => {
                  setSearchResult(e.target.value);
                  handleFilterCollection(e.target.value);
                }}
              />
            </div>
          </div>
          {isopen && (
            <div className="position-absolute">
              <OutsideClickHandler
                onOutsideClick={() => {
                  setisopen(false);
                }}
              >
                <div className="search-result-wrapper position-absolute p-3">
                  <div
                    className={`d-flex flex-column gap-2 ${
                      currentCollection &&
                      currentCollection.length === 0 &&
                      "justify-content-center align-items-center h-100"
                    } `}
                  >
                    {currentCollection &&
                      currentCollection.length > 0 &&
                      currentCollection.map((item, index) => {
                        return (
                          <NavLink
                            to={`/collection/${item.contractAddress}/${item.symbol}`}
                            className={"text-decoration-none"}
                            onClick={() => {
                              setcurrentCollection();
                              setSearchResult("");
                              setisopen(false);
                            }}
                          >
                            <div
                              key={index}
                              className="d-flex align-items-center gap-2"
                            >
                              <div className="menuitem2 w-100">
                                {item.collectionProfilePic && (
                                  <img
                                    src={`https://confluxapi.worldofdypians.com/${item.collectionProfilePic}`}
                                    className="collection-logo-small"
                                  />
                                )}
                                <span className="collection-title">
                                  {item.collectionName}
                                </span>
                              </div>
                            </div>
                          </NavLink>
                        );
                      })}
                    {currentCollection && currentCollection.length === 0 && (
                      <div className="d-flex align-items-center gap-2">
                        <span className="collection-title text-white">
                          No items with this keyword
                        </span>
                      </div>
                    )}
                    <div></div>
                  </div>
                </div>
              </OutsideClickHandler>
            </div>
          )}
          <div className="col-7 px-0">
            <div className="d-flex gap-1 align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-4">
                <NavLink
                  to={"/collections"}
                  className={({ isActive }) =>
                    isActive ? "header-link-active mb-0" : "header-link mb-0"
                  }
                >
                  Collections
                </NavLink>
                {/* <NavLink className={"header-link mb-0"} to={"/mint"}>
                  Mint
                </NavLink> */}
                {/* <a
                  className={"header-link mb-0"}
                  href="mailto:someone@support.com"
                >
                  Support
                </a> */}
              </div>

              <div className="d-flex align-items-center gap-3">
                {coinbase && isConnected && chainId === 1030 && (
                  <button className="btn account-btn d-flex align-items-center gap-2">
                    <img src={conflux} alt="" /> Conflux eSpace
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
                    <img src={walletIcon} alt="" />
                    {getFormattedNumber(balance, 2)} CFX
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
                              navigator.clipboard.writeText(coinbase);
                              setTooltip(true);
                              setTimeout(() => setTooltip(false), 2000);
                            }}
                          >
                            {shortAddress(coinbase)}{" "}
                            <img src={tooltip ? check : copy} alt="" />
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
