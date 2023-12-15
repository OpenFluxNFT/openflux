import React from "react";
import "./_mainhero.scss";
import cawsBanner from "./assets/cawsBanner.webp";
import Slider from "react-slick";

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

const mainHeroItems = [
  {
    title: "Cats and watches society (CAWS)",
    desc: "The leading NFT Marketplace on Conflux NetworkHome to the next generation of digital creators. Discover the best NFT collections.",
    button: "explore",
  },
  {
    title: "CAWS Timepiece",
    desc: "The leading NFT Marketplace on Conflux NetworkHome to the next generation of digital creators. Discover the best NFT collections.",
    button: "explore",
  },
  {
    title: "World of Dypians Land",
    desc: "The leading NFT Marketplace on Conflux NetworkHome to the next generation of digital creators. Discover the best NFT collections.",
    button: "explore",
  },
];

const MainHero = () => {
  return (
    <div className="container-lg main-hero-wrapper p-4">
      <Slider {...settings}>
        {mainHeroItems.map((item, index) => (
          <div className="row d-flex align-items-center">
            <div className="col-12 col-lg-7 mb-2">
              <div className="d-flex flex-column gap-4">
                <h6 className="main-hero-title mb-0">{item.title}</h6>
                <p className="main-hero-desc mb-0">{item.desc}</p>
                <button className="gradient-btn px-3 py-1">Explore</button>
              </div>
            </div>
            <div className="col-12 col-lg-5">
              <img src={cawsBanner} className="w-100" alt="" />
            </div>
          </div>
        ))}
      </Slider>
      
    </div>
  );
};

export default MainHero;
