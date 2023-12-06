import React from "react";
import "./_mobileheader.scss";
import '../_header.scss'
import dypiusLogo from "../assets/dypiusLogo.svg";
import { useState } from "react";
import { useEffect } from "react";
import mobileNavArrow from './mobileNavArrow.svg'
import { shortAddress } from "../../../hooks/shortAddress";
import cartIcon from '../../Header/assets/cartIcon.svg'
import walletIcon from '../../Header/assets/walletIcon.svg'
import userIcon from '../../Header/assets/userIcon.svg'

const MobileHeader = ({handleSignup, coinbase}) => {

    const [menu, setMenu] = useState(false)

    const html = document.querySelector("html");
  
  
    useEffect(() => {
      if (menu) {
        html.classList.add('hidescroll')
      } else {
        // Enable scroll
        html.classList.remove('hidescroll')
      }
  
  
  
    }, [menu]);
  
  return (
    <>
    <div className="container-fluid py-4 mobile-header-wrapper header-wrapper " style={{height: "85px", pointerEvents: "auto", zIndex: 5}}>
      <div className="container-lg">
        <div className="row align-items-center justify-content-center">
          <div className="d-flex align-items-center justify-content-between">
            <img src={dypiusLogo} width={35} height={35} alt="" />
            <>
              <input id="menu-toggle" type="checkbox" onChange={() => {setMenu(!menu)}} />
              <label class="menu-button-container" for="menu-toggle">
                <div class="menu-button"></div>
              </label>
            </>
          </div>
        </div>
      </div>
    </div>
    <div className={`mobile-menu-container ${menu && "mobile-active"} d-flex flex-column align-items-center justify-content-center gap-3 p-3`}>
        <div className="mobile-menu-item d-flex align-items-center justify-content-between p-3">
            <h6 className="mb-0 text-white">Collections</h6>
            <img src={mobileNavArrow} alt="" />
        </div>
        <div className="mobile-menu-item d-flex align-items-center justify-content-between p-3">
            <h6 className="mb-0 text-white">Mint</h6>
            <img src={mobileNavArrow} alt="" />
        </div>
        <div className="mobile-menu-item d-flex align-items-center justify-content-between p-3">
            <h6 className="mb-0 text-white">Support</h6>
            <img src={mobileNavArrow} alt="" />
        </div>
        <div className="d-flex align-items-center gap-3">
              <button className="btn blue-btn d-flex align-items-center gap-2" 
                  onClick={handleSignup}
              >
                <img src={walletIcon} alt="" />
                {!coinbase ? "Connect Wallet" : shortAddress(coinbase)}
              </button>
              <button className="btn blue-btn" onClick={() => console.log("hello")}>
                <img src={userIcon} alt="" />
              </button>
              <button className="btn blue-btn">
                <img src={cartIcon} alt="" />
              </button>
            </div>
    </div>
    </>
  );
};

export default MobileHeader;
