import React from 'react'
import './_header.scss'
import dypiusLogo from './assets/dypiusLogo.svg'
import cartIcon from './assets/cartIcon.svg'
import walletIcon from './assets/walletIcon.svg'
import userIcon from './assets/userIcon.svg'
import searchIcon from './assets/searchIcon.svg';
import { shortAddress } from '../../hooks/shortAddress'
import { useEffect } from 'react'




const Header = ({handleSignup, coinbase}) => {
  

  return (
    <div className="container-fluid py-4 header-wrapper" >
      <div className="container-lg">
        <div className="row align-items-center justify-content-center">
          <div className="col-1">
            <img src={dypiusLogo} alt="" />
          </div>
          <div className="col-5">
            <div className="position-relative">
              <img src={searchIcon} alt="" className="search-icon" />
              <input type="text" className="search-input" placeholder='Search anything' />
            </div>
          </div>
          <div className="col-6 px-0">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-4">
              <h6 className="header-link mb-0">Collections</h6>
              <h6 className="header-link mb-0">Mint</h6>
              <h6 className="header-link mb-0">Support</h6>
              </div>
            <div className="d-flex align-items-center gap-3">
              <button className="btn blue-btn d-flex align-items-center gap-2" 
                  onClick={handleSignup}
              >
                <img src={walletIcon} alt="" />
                {!coinbase ? "Connect Wallet" : shortAddress(coinbase)}
              </button>
              <button className="btn blue-btn">
                <img src={userIcon} alt="" />
              </button>
              <button className="btn blue-btn">
                <img src={cartIcon} alt="" />
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header