import React, { useRef, useState } from "react";
import "./_collectioncategories.scss";
import Slider from "react-slick";
import CollectionCard from "../../CollectionCard/CollectionCard";
import collectionCardPlaceholder1 from "./assets/collectionCardPlaceholder1.png";
import collectionCardPlaceholder2 from "./assets/collectionCardPlaceholder2.png";
import collectionCardPlaceholder3 from "./assets/collectionCardPlaceholder3.png";
import collectionCardPlaceholder4 from "./assets/collectionCardPlaceholder4.png";
import useWindowSize from "../../../hooks/useWindowSize";
import { NavLink } from "react-router-dom";

const CollectionCategories = () => {
  const [category, setCategory] = useState("all");
  const windowSize = useWindowSize();
  const sliderRef = useRef();

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 6000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // dotsClass: "button__bar",
  };

  const dummyCollections = [
    {
      title: "Cats and Watches Society",
      img: collectionCardPlaceholder1,
      floorPrice: "128,254.8",
      totalVolume: "23.6M+",
      collectionName: "catsandwatchessocietycaws",
      collectionAddress: window.config.nft_caws_address,
    },
    {
      title: "World of Dypians Land",
      img: collectionCardPlaceholder2,
      floorPrice: "128,254.8",
      totalVolume: "23.6M+",
      collectionName: "worldofdypians",
      collectionAddress: window.config.nft_land_address,
    },
    {
      title: "CAWS Timepiece",
      img: collectionCardPlaceholder3,
      floorPrice: "128,254.8",
      totalVolume: "23.6M+",
      collectionName: "cawstimepiece",
      collectionAddress: window.config.nft_timepiece_address,
    },
    {
      title: "Cats and Watches Society",
      img: collectionCardPlaceholder4,
      floorPrice: "128,254.8",
      totalVolume: "23.6M+",
      collectionName: "catsandwatchessocietycaws",
      collectionAddress: window.config.nft_caws_address,
    },
    {
      title: "Cats and Watches Society",
      img: collectionCardPlaceholder1,
      floorPrice: "128,254.8",
      totalVolume: "23.6M+",
      collectionName: "catsandwatchessocietycaws",
      collectionAddress: window.config.nft_caws_address,
    },
    {
      title: "World of Dypians Land",
      img: collectionCardPlaceholder2,
      floorPrice: "128,254.8",
      totalVolume: "23.6M+",
      collectionName: "worldofdypians",
      collectionAddress: window.config.nft_land_address,
    },
    {
      title: "CAWS Timepiece",
      img: collectionCardPlaceholder3,
      floorPrice: "128,254.8",
      totalVolume: "23.6M+",
      collectionName: "cawstimepiece",
      collectionAddress: window.config.nft_timepiece_address,
    },
    {
      title: "Cats and Watches Society",
      img: collectionCardPlaceholder4,
      floorPrice: "128,254.8",
      totalVolume: "23.6M+",
      collectionName: "catsandwatchessocietycaws",
      collectionAddress: window.config.nft_caws_address,
    },
  ];

  return (
    <div className="container-lg py-5">
      <div className="row">
        <div className="d-flex align-items center gap-3 pb-3 pb-lg-0 mb-5 categories-tabs">
          <div
            className={`trending-tab ${
              category === "all" && "trending-tab-active"
            } p-2 d-flex align-items-center gap-2`}
            onClick={() => setCategory("all")}
          >
            <h6 className="mb-0">All</h6>
          </div>
          <div
            className={`trending-tab ${
              category === "gaming" && "trending-tab-active"
            } p-2 d-flex align-items-center gap-2`}
            onClick={() => setCategory("gaming")}
          >
            <h6 className="mb-0">Gaming</h6>
          </div>
          <div
            className={`trending-tab ${
              category === "art" && "trending-tab-active"
            } p-2 d-flex align-items-center gap-2`}
            onClick={() => setCategory("art")}
          >
            <h6 className="mb-0">Art</h6>
          </div>
          <div
            className={`trending-tab ${
              category === "virtualWorld" && "trending-tab-active"
            } p-2 d-flex align-items-center gap-2`}
            onClick={() => setCategory("virtualWorld")}
          >
            <h6 className="mb-0">Virtual World</h6>
          </div>
          <div
            className={`trending-tab ${
              category === "music" && "trending-tab-active"
            } p-2 d-flex align-items-center gap-2`}
            onClick={() => setCategory("music")}
          >
            <h6 className="mb-0">Music</h6>
          </div>
          <div
            className={`trending-tab ${
              category === "sports" && "trending-tab-active"
            } p-2 d-flex align-items-center gap-2`}
            onClick={() => setCategory("sports")}
          >
            <h6 className="mb-0">Sports</h6>
          </div>
        </div>
        {/* <Slider ref={sliderRef} {...settings}>
          {dummyCollections.map((item, index) => (
            <CollectionCard key={index} data={item} />
          ))}
        </Slider> */}
        {windowSize.width > 786 ? (
          <div className="collection-categories-grid">
            {dummyCollections.slice(0, 4).map((item, index) => (
               <NavLink
               to={`/collection/${item.collectionAddress}/${item.collectionName}`}
               style={{textDecoration: 'none'}}
             >
              <CollectionCard key={index} data={item} />
              </NavLink>
            ))}
          </div>
        ) : (
          <Slider ref={sliderRef} {...settings}>
            {dummyCollections.map((item, index) => (
               <NavLink
               to={`/collection/${item.collectionAddress}/${item.collectionName}`}
               style={{textDecoration: 'none'}}
             >
              <CollectionCard key={index} data={item} />
              </NavLink>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default CollectionCategories;
