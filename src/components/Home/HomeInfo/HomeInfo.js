import React from 'react'
import './_homeinfo.scss'
import walletIcon from './assets/walletIcon.svg'
import collectionIcon from './assets/collectionIcon.svg'
import selectIcon from './assets/selectIcon.svg'
import listIcon from './assets/listIcon.svg'
import metamask from './assets/metamask.svg'
import trustwallet from './assets/trustwallet.svg'
import fluent from './assets/fluent.svg'
import coinbase from './assets/coinbase.svg'
import safepal from './assets/safepal.svg'
import infoArrow from './assets/infoArrow.svg'


const partners = [
  {
    title: "MetaMask",
    image: metamask,
  },
  {
    title: "Trust Wallet",
    image: trustwallet,
  },
  {
    title: "Fluent Wallet",
    image: fluent,
  },
  {
    title: "Coinbase",
    image: coinbase,
  },
  {
    title: "SafePal",
    image: safepal,
  },
]

const HomeInfo = () => {
  return (
    <div className="container-lg py-5">
      <div className="row">
        <div className="d-flex justify-content-center w-100">
          <h6 className="info-title mb-0">How it <span style={{color: "#2F80ED"}}>works?</span></h6>
        </div>
        <div className="d-flex align-items-center justify-content-between my-5">
          <div className="d-flex flex-column gap-3 align-items-center justify-content-center">
            <div className="info-icon-wrapper d-flex align-items-center justify-content-center">
              <img src={walletIcon} alt="" />
            </div>
            <span className="info-desc mb-0">Set up your wallet</span>
          </div>
          <img src={infoArrow} alt="" />
          <div className="d-flex flex-column gap-3 align-items-center justify-content-center">
            <div className="info-icon-wrapper d-flex align-items-center justify-content-center">
              <img src={collectionIcon} alt="" />
            </div>
            <span className="info-desc mb-0">View your collection</span>
          </div>
          <img src={infoArrow} alt="" />
          <div className="d-flex flex-column gap-3 align-items-center justify-content-center">
            <div className="info-icon-wrapper d-flex align-items-center justify-content-center">
              <img src={selectIcon} alt="" />
            </div>
            <span className="info-desc mb-0">Select the NFTs</span>
          </div>
          <img src={infoArrow} alt="" />
          <div className="d-flex flex-column gap-3 align-items-center justify-content-center">
            <div className="info-icon-wrapper d-flex align-items-center justify-content-center">
              <img src={listIcon} alt="" />
            </div>
            <span className="info-desc mb-0">List them for sale</span>
          </div>
        </div>
        <div className="d-flex justify-content-center w-100">
          <h6 className="info-title mb-0">Supported <span style={{color: "#2F80ED"}}>Wallets</span></h6>
        </div>
        <div className="d-flex align-items-center justify-content-center mt-4 gap-4 w-100">
          {partners.map((item, index) => (
                 <div className="supported-wallet-item p-3 d-flex flex-column align-items-center justify-content-center gap-3">
                 <div className="supported-wallet-img-wrapper d-flex align-items-center justify-content-center">
                   <img src={item.image} alt="" />
                 </div>
                 <div className="supported-wallet-title mb-0">
                   {item.title}
                 </div>
               </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeInfo