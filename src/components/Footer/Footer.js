import React from "react";
import "./_footer.scss";
import dypiusLogo from "../Header/assets/dypiusLogo.svg";
import twitterLogo from "./assets/twitterLogo.svg";
import telegramLogo from "./assets/telegramLogo.svg";
import discordLogo from "./assets/discordLogo.svg";
import instagramLogo from "./assets/instagramLogo.svg";
import copyrightIcon from "./assets/copyrightIcon.svg";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="container-fluid footer-outer-wrapper px-0">
           <div className="container-fluid pb-4 pt-4 footer-wrapper">
      <div className="container-lg">
        <div className="row">
          <hr className="trending-divider mb-4"></hr>
          <div className="d-flex flex-column flex-lg-row align-items-start justify-content-between gap-2">
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-2">
                <img src={dypiusLogo} alt="" />
                <h6 className="footer-title mb-0">Logo</h6>
              </div>
              <p className="footer-desc mb-0">
                The leading NFT Marketplace on Conflux Network. Home to the next
                generation of digital creators. Discover the best NFT
                collections.
              </p>
              <div className="d-flex align-items-center gap-3">
                <a href="#" target="_blank">
                  <img src={twitterLogo} alt="" />
                </a>
                <a href="#" target="_blank">
                  <img src={telegramLogo} alt="" />
                </a>
                <a href="#" target="_blank">
                  <img src={discordLogo} alt="" />
                </a>
                <a href="#" target="_blank">
                  <img src={instagramLogo} alt="" />
                </a>
              </div>
            </div>
            <div className="d-flex flex-column align-items-start gap-4">
              <h6 className="footer-title mb-0">Marketplace</h6>
              <div className="d-flex flex-column gap-2">
                <NavLink to={"/"} className="footer-link mb-0">
                  Collections
                </NavLink>
                {/* <NavLink to={"/"} className="footer-link mb-0">
                  Mint
                </NavLink> */}
                <NavLink to={"/"} className="footer-link mb-0">
                  Become Partners
                </NavLink>
                <NavLink to={"/"} className="footer-link mb-0">
                  Support
                </NavLink>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-center w-100 gap-1">
            <img src={copyrightIcon} width={16} height={16} alt="" />
            <span className="copyright-text mb-0">2024 Company. all Right Reserved.</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Footer;
