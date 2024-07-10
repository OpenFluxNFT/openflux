import React, { useEffect, useRef, useState } from "react";
import "./_collectioncategories.scss";
import Slider from "react-slick";
import CollectionCard from "../../CollectionCard/CollectionCard";
import collectionCardPlaceholder1 from "./assets/collectionCardPlaceholder1.png";
import collectionCardPlaceholder2 from "./assets/collectionCardPlaceholder2.png";
import collectionCardPlaceholder3 from "./assets/collectionCardPlaceholder3.png";
import collectionCardPlaceholder4 from "./assets/collectionCardPlaceholder4.png";
import useWindowSize from "../../../hooks/useWindowSize";
import { NavLink } from "react-router-dom";
import { Skeleton } from "@mui/material";

const CollectionCategories = ({ allCollections }) => {
  const [category, setCategory] = useState("all");
  const [collections, setCollections] = useState([]);
  const [allcollectionsUpdated, setallcollectionsUpdated] = useState([]);

  const windowSize = useWindowSize();
  const sliderRef = useRef();
  const [loading, setLoading] = useState(false);

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

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const checkIfImageisValid = async (image) => {
    const result = await fetch(
      `https://confluxapi.worldofdypians.com/${image}`
    ).catch((e) => {
      console.error(e);
    });
    if (result && result.status === 200) {
      return `https://confluxapi.worldofdypians.com/${image}`;
    } else return undefined;
  };

  const updateCollections = async () => {
    if (allCollections && allCollections.length > 0) {
      const allData = await Promise.all(
        allCollections.map(async (item) => {
          return {
            ...item,
            image: await checkIfImageisValid(item.featuredBannerPicture),
          };
        })
      );

      setallcollectionsUpdated(allData);
      setCollections(allData);
      
    }
  };

  const changeCategory = async (val) => {
    let filteredCollections = [];
    setLoading(true);
    setCategory(val);

    if (val === "all") {
      setCollections(allcollectionsUpdated);
    } else if (val === "virtual") {
      filteredCollections = allcollectionsUpdated.filter((item) => {
        return item.tags.includes("Virtual World");
      });
      setCollections(filteredCollections);
    } else {
      filteredCollections = allcollectionsUpdated.filter((item) => {
        return item.tags.includes(capitalizeFirstLetter(val));
      });
      setCollections(filteredCollections);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    updateCollections();
  }, [allCollections]); 
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
            onClick={() => changeCategory("all")}
          >
            <h6 className="mb-0">All</h6>
          </div>
          <div
            className={`trending-tab ${
              category === "gaming" && "trending-tab-active"
            } p-2 d-flex align-items-center gap-2`}
            onClick={() => changeCategory("gaming")}
          >
            <h6 className="mb-0">Gaming</h6>
          </div>
          <div
            className={`trending-tab ${
              category === "art" && "trending-tab-active"
            } p-2 d-flex align-items-center gap-2`}
            onClick={() => changeCategory("art")}
          >
            <h6 className="mb-0">Art</h6>
          </div>
          <div
            className={`trending-tab ${
              category === "virtual" && "trending-tab-active"
            } p-2 d-flex align-items-center gap-2`}
            onClick={() => changeCategory("virtual")}
          >
            <h6 className="mb-0">Virtual World</h6>
          </div>
          <div
            className={`trending-tab ${
              category === "music" && "trending-tab-active"
            } p-2 d-flex align-items-center gap-2`}
            onClick={() => changeCategory("music")}
          >
            <h6 className="mb-0">Music</h6>
          </div>
          <div
            className={`trending-tab ${
              category === "sports" && "trending-tab-active"
            } p-2 d-flex align-items-center gap-2`}
            onClick={() => changeCategory("sports")}
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
          <>
            {loading === true ? (
              <div className="collection-categories-grid">
                <Skeleton variant="rounded" width={310} height={353} />
                <Skeleton variant="rounded" width={310} height={353} />
                <Skeleton variant="rounded" width={310} height={353} />
                <Skeleton variant="rounded" width={310} height={353} />
              </div>
            ) : loading === false && collections.length > 0 ? (
              <div className="collection-categories-grid">
                {collections
                  .slice(collections.length - 4, collections.length)
                  .map((item, index) => (
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
              <div
                className="d-flex align-items-center justify-content-center w-100"
                style={{ height: 353 }}
              >
                <h6 className="text-white">
                  There are no collections available for this category
                </h6>
              </div>
            )}
          </>
        ) : (
          <>
            {loading === true ? (
              <Slider ref={sliderRef} {...settings}>
                <Skeleton variant="rounded" width={"100%"} height={351} />
              </Slider>
            ) : loading === false && collections.length > 0 ? (
              <Slider ref={sliderRef} {...settings}>
                {collections.slice(collections.length - 4, collections.length).map((item, index) => (
                  <NavLink
                    to={`/collection/${item.contractAddress}/${item.symbol}`}
                    className={"text-decoration-none"}
                    key={index}
                  >
                    <CollectionCard key={index} data={item} />
                  </NavLink>
                ))}
              </Slider>
            ) : (
              <div
                className="d-flex align-items-center justify-content-center w-100"
                style={{ height: 353 }}
              >
                <h6 className="text-white" style={{ textAlign: "center" }}>
                  There are no collections available for this category
                </h6>
              </div>
            )}
          </>
        )}
        {!window.location.pathname.includes("/collections") && (
          <NavLink
            to="/collections"
            className="d-flex justify-content-center mt-4 text-decoration-none"
          >
            <button className="buy-btn px-5 m-auto">Explore all</button>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default CollectionCategories;
