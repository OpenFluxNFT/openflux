import React from "react";
import "./_footer.scss";
import footerLogo from "./assets/footerLogo.svg";
import twitterLogo from "./assets/twitterLogo.svg";
import telegramLogo from "./assets/telegramLogo.svg";
import discordLogo from "./assets/discordLogo.svg";
import mediumLogo from "./assets/mediumLogo.svg";
import githubLogo from "./assets/githubLogo.svg";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div className="container-fluid footer-outer-wrapper px-0">
      <div className="container-fluid pb-4 pt-4 footer-wrapper">
        <div className="container-lg">
          <div className="row">
            <hr className="trending-divider mb-4"></hr>
            <div className="d-flex flex-column flex-lg-row align-items-start justify-content-between gap-2">
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-2">
                  <NavLink
                    to={"/"}
                    onClick={() => {
                      window.scrollTo(0, 0);
                    }}
                  >
                    <img src={footerLogo} alt="" />
                  </NavLink>
                </div>
                <p className="footer-desc mb-0">
                  The leading NFT Marketplace on Conflux{" "}
                  <span style={{ textTransform: "initial" }}>eSpace.</span> Home
                  to the next generation of digital creators. Discover the best
                  NFT collections.
                </p>
                <div className="d-flex align-items-center gap-3">
                  <a
                    href="https://twitter.com/OpenFluxNFT"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={twitterLogo} alt="" />
                  </a>
                  {/* <a
                    href="https://t.me/OpenFlux"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={telegramLogo} alt="" />
                  </a> */}
                  <a
                    href="https://discord.gg/openflux"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={discordLogo} alt="" />
                  </a>
                  <a href="https://medium.com/@openflux" target="_blank" rel='noreferrer'>
                    <img src={mediumLogo} alt="" />
                  </a>
                  <a href="https://github.com/OpenFluxNFT" target="_blank" rel='noreferrer'>
                    <img src={githubLogo} alt="" />
                  </a>
                </div>
              </div>
              <div className="d-flex flex-column align-items-start gap-4">
                <h6 className="footer-title mb-0">Marketplace</h6>
                <div className="d-flex flex-column gap-2">
                  <NavLink to={"/all-collections"} className="footer-link mb-0">
                    Collections
                  </NavLink>
                  {/* <NavLink to={"/"} className="footer-link mb-0">
                  Mint
                </NavLink> */}
                  <a
                    href={
                      "https://drive.google.com/drive/folders/1SeWA1dwUQISV5rUK4m60Xs_NhJbYO3xG?usp=sharing"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="footer-link mb-0"
                  >
                    Brand
                  </a>
                  <a
                    className={"footer-link mb-0"}
                    href="mailto:contact@openflux.com"
                  >
                    Support
                  </a>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-center w-100 gap-1">
              <span className="copyright-text mb-0">
                Copyright © OpenFlux {year}. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
