import React from "react";
import "./_homeinfo.scss";
import walletIcon from "./assets/walletIcon.svg";
import collectionIcon from "./assets/collectionIcon.svg";
import selectIcon from "./assets/selectIcon.svg";
import listIcon from "./assets/listIcon.svg";
import metamask from "./assets/metamask.svg";
import trustwallet from "./assets/trustwallet.svg";
import fluent from "./assets/fluent.svg";
import coinbase from "./assets/coinbase.svg";
import safepal from "./assets/safepal.svg";
import infoArrow from "./assets/infoArrow.svg";
import useWindowSize from "../../../hooks/useWindowSize";
import Slider from "react-slick";

const HomeInfo = () => {
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
  ];

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: "button__bar",
  };

  const windowSize = useWindowSize();

  return (
    <div className="container-lg py-5">
      <div className="row">
        <div className="d-flex justify-content-center w-100">
          <h6 className="info-title mb-4">
            How it <span style={{ color: "#2F80ED" }}>works?</span>
          </h6>
        </div>
        <div className="d-flex align-items-center flex-column flex-lg-row justify-content-between my-5">
          <div className="d-flex flex-column gap-3 align-items-center justify-content-center">
            <div className="info-icon-wrapper d-flex align-items-center justify-content-center">
              <img src={walletIcon} alt="" />
            </div>
            <span className="info-desc mb-0">Set up your wallet</span>
          </div>
          <div className="info-arrow-wrapper">
            <img src={infoArrow} className="info-arrow" alt="" />
          </div>
          <div className="d-flex flex-column gap-3 align-items-center justify-content-center">
            <div className="info-icon-wrapper d-flex align-items-center justify-content-center">
              <img src={collectionIcon} alt="" />
            </div>
            <span className="info-desc mb-0">View your collection</span>
          </div>
          <div className="info-arrow-wrapper">
            <img src={infoArrow} className="info-arrow" alt="" />
          </div>
          <div className="d-flex flex-column gap-3 align-items-center justify-content-center">
            <div className="info-icon-wrapper d-flex align-items-center justify-content-center">
              <img src={selectIcon} alt="" />
            </div>
            <span className="info-desc mb-0">Select the NFTs</span>
          </div>
          <div className="info-arrow-wrapper">
            <img src={infoArrow} className="info-arrow" alt="" />
          </div>
          <div className="d-flex flex-column gap-3 align-items-center justify-content-center">
            <div className="info-icon-wrapper d-flex align-items-center justify-content-center">
              <img src={listIcon} alt="" />
            </div>
            <span className="info-desc mb-0">Trade NFTs</span>
          </div>
        </div>
        <div className="d-flex justify-content-center w-100 mt-5">
          <h6 className="info-title mb-4">
            Supported <span style={{ color: "#2F80ED" }}>Wallets</span>
          </h6>
        </div>
        {windowSize.width > 786 ? (
          <div className="partners-grid">
            {partners.map((item, index) => (
              <div
                className="supported-wallet-item p-3 d-flex flex-column align-items-center justify-content-center gap-3"
                key={index}
              >
                <div className="supported-wallet-img-wrapper d-flex align-items-center justify-content-center">
                  <img src={item.image} alt="" />
                </div>
                <div className="supported-wallet-title mb-0">{item.title}</div>
              </div>
            ))}
          </div>
        ) : (
          <Slider {...settings}>
            {partners.map((item, index) => (
              <div
                className="supported-wallet-item p-3 d-flex flex-column align-items-center justify-content-center gap-3"
                key={index}
              >
                <div className="supported-wallet-img-wrapper d-flex align-items-center justify-content-center">
                  <img src={item.image} alt="" />
                </div>
                <div className="supported-wallet-title mb-0">{item.title}</div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default HomeInfo;
