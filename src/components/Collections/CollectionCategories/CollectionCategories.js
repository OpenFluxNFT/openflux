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

const CollectionCategories = ({allCollections}) => {
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

  return (
    <div className="container-lg py-5">
      <div className="row">
        <h6 className="info-title my-4">
          Collection <span style={{ color: "#2F80ED" }}>Categories</span>
        </h6>
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
            {allCollections.slice(0, 4).map((item, index) => (
              <NavLink
                to={`/collection/${item.contractAddress}/${item.symbol}`}
                key={index}
                className={"text-decoration-none"}
              >
                <CollectionCard key={index} data={item} />
              </NavLink>
            ))}
          </div>
        ) : (
          <Slider ref={sliderRef} {...settings}>
            {allCollections.map((item, index) => (
              <NavLink
              to={`/collection/${item.contractAddress}/${item.symbol}`}
                className={"text-decoration-none"}
                key={index}
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
