import React, { useRef } from "react";
import "./_trendingcollections.scss";
import trendingPlaceholder1 from "./assets/trendingPlaceholder1.png";
import trendingPlaceholder2 from "./assets/trendingPlaceholder2.png";
import trendingPlaceholder3 from "./assets/trendingPlaceholder3.png";
import trendingPlaceholder4 from "./assets/trendingPlaceholder4.png";
import Slider from "react-slick";
import CollectionCard from "../../CollectionCard/CollectionCard";
import { NavLink } from "react-router-dom";

const TrendingCollections = () => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 6000,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    // dotsClass: "button__bar",
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 786,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const dummyCollections = [
    {
      title: "Cats and Watches Society",
      img: trendingPlaceholder1,
      floorPrice: "128,254.8",
      totalVolume: "23.6M+",
      collectionName: "catsandwatchessocietycaws",
      collectionAddress: window.config.nft_caws_address,
    },
    {
      title: "World of Dypians Land",
      img: trendingPlaceholder2,
      floorPrice: "128,254.8",
      totalVolume: "23.6M+",
      collectionName: "worldofdypians",
      collectionAddress: window.config.nft_land_address,
    },
    {
      title: "CAWS Timepiece",
      img: trendingPlaceholder3,
      floorPrice: "128,254.8",
      totalVolume: "23.6M+",
      collectionName: "cawstimepiece",
      collectionAddress: window.config.nft_timepiece_address,
    },
    {
      title: "Cats and Watches Society",
      img: trendingPlaceholder4,
      floorPrice: "128,254.8",
      totalVolume: "23.6M+",
      collectionName: "catsandwatchessocietycaws",
      collectionAddress: window.config.nft_caws_address,
    },
    {
      title: "Cats and Watches Society",
      img: trendingPlaceholder1,
      floorPrice: "128,254.8",
      totalVolume: "23.6M+",
      collectionName: "catsandwatchessocietycaws",
      collectionAddress: window.config.nft_caws_address,
    },
    {
      title: "World of Dypians Land",
      img: trendingPlaceholder2,
      floorPrice: "128,254.8",
      totalVolume: "23.6M+",
      collectionName: "worldofdypians",
      collectionAddress: window.config.nft_land_address,
    },
    {
      title: "CAWS Timepiece",
      img: trendingPlaceholder3,
      floorPrice: "128,254.8",
      totalVolume: "23.6M+",
      collectionName: "cawstimepiece",
      collectionAddress: window.config.nft_timepiece_address,
    },
    {
      title: "Cats and Watches Society",
      img: trendingPlaceholder4,
      floorPrice: "128,254.8",
      totalVolume: "23.6M+",
      collectionName: "catsandwatchessocietycaws",
      collectionAddress: window.config.nft_caws_address,
    },
  ];

  const sliderRef = useRef();

  return (
    <div className="container-lg mt-5">
      <div className="row">
        <h6 className="info-title my-4">
          Trending <span style={{ color: "#2F80ED" }}>Now</span>
        </h6>
        <Slider ref={sliderRef} {...settings}>
          {dummyCollections.map((item, index) => (
            <div className="px-2" key={index}>
              <NavLink
                to={`/collection/${item.collectionAddress}/${item.collectionName}`}
                style={{textDecoration: 'none'}}
              >
                <CollectionCard key={index} data={item} />
              </NavLink>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TrendingCollections;
