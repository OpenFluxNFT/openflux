import React from "react";
import "./_mainhero.scss";
import cawsBanner from "./assets/cawsBanner.webp";
import newCollectionBanner from "./assets/newCollectionBanner.webp";
import RecentlySoldNftsBanner from "./RecentlySoldNftsBanner";
import Slider from "react-slick";
import { NavLink } from "react-router-dom";

const settings = {
  dots: true,
  arrows: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 6000,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  dotsClass: "button__bar",
};

const mainHeroItems = [
  {
    title: "Discover, collect, & sell Extraordinary NFTs ",
    desc: "The leading NFT Marketplace on Conflux eSpace, home to the next generation of digital creators, where you can discover the best NFT collections.",
    button: "explore",
  },

  {
    title: "New NFT Collections Unveiled",
    desc: "Explore the latest trends and artistic expressions in the world of digital art with our curated selection of new NFT collections.",
    button: "explore",
    heroImage: newCollectionBanner,
  },
    {
    title: "Recently Sold NFTs Showcase",
    desc: "Browse through the recently sold NFTs to witness the latest transactions in our vibrant digital marketplace.",
    button: "explore",
    image: cawsBanner,
  },
];

const MainHero = ({ allCollections, recentlySoldNfts }) => {
  return (
    <div className="container-lg main-hero-wrapper p-4 ">
      <Slider {...settings}>
        {mainHeroItems.map((item, index) => (
          <div
            className={`d-flex align-items-center p-4 justify-content-between position-relative`}
            key={index}
          >
            <div className="col-12 col-lg-6 mb-2">
              <div className="d-flex flex-column gap-4">
                <h6 className="main-hero-title mb-0">{item.title}</h6>
                <p className="main-hero-desc mb-0">{item.desc}</p>
                <NavLink
                  to={item.image ? "/collections#recent-sales" : "/collections"}
                  className="explore-btn px-3 py-1"
                >
                  Explore
                </NavLink>
              </div>
            </div>
            <div className="col-12 col-lg-5 position-relative">
              {item.heroImage && (
                <div className="position-relative package-blur">
                  <div className="first-box-blur first-bigbox-blur d-none d-lg-flex  align-items-end justify-content-center"></div>
                  <div className="second-box-blur d-none d-lg-flex second-bigbox-blur"></div>
                  <img
                    className="blur-img blur-img-big d-none d-lg-block"
                    src={item.heroImage}
                    alt=""
                  />
                </div>
              )}
              {item.image && (
                // <img
                //   src={item.image}
                //   className="w-100 d-none d-lg-block"
                //   alt=""
                // />
                <RecentlySoldNftsBanner
                  recentlySoldNfts={recentlySoldNfts}
                  allCollections={allCollections}
                />
              )}
              {index === 0 && (
                <div className="small-collection-wrapper d-none d-lg-block d-md-block p-3">
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex gap-3 justify-content-end">
                      {allCollections &&
                        allCollections.length > 0 &&
                        allCollections.slice(10, 14).map((item, index) => {
                          return (
                            <NavLink
                              to={`/collection/${item.contractAddress}/${item.symbol}`}
                            >
                              <div
                                className="single-small-collection-wrapper"
                                key={index}
                              >
                                <img
                                  src={require(`./assets/small-collection-${
                                    index + 1
                                  }.png`)}
                                  alt=""
                                  className="small-collection-img"
                                />
                              </div>
                            </NavLink>
                          );
                        })}
                    </div>
                    <div className="d-flex gap-3 justify-content-start">
                      {allCollections &&
                        allCollections.length > 0 &&
                        allCollections.slice(14, 18).map((item, index) => {
                          return (
                            <NavLink
                              to={`/collection/${item.contractAddress}/${item.symbol}`}
                            >
                              <div
                                className="single-small-collection-wrapper"
                                key={index}
                              >
                                <img
                                  src={require(`./assets/small-collection-${
                                    index + 1
                                  }.png`)}
                                  alt=""
                                  className="small-collection-img"
                                />
                              </div>
                            </NavLink>
                          );
                        })}
                    </div>
                    <div className="d-flex gap-3 justify-content-end">
                      {allCollections &&
                        allCollections.length > 0 &&
                        allCollections.slice(18, 22).map((item, index) => {
                          return (
                            <NavLink
                              to={`/collection/${item.contractAddress}/${item.symbol}`}
                            >
                              <div
                                className="single-small-collection-wrapper"
                                key={index}
                              >
                                <img
                                  src={require(`./assets/small-collection-${
                                    index + 1
                                  }.png`)}
                                  alt=""
                                  className="small-collection-img"
                                />
                              </div>
                            </NavLink>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MainHero;
