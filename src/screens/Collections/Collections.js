import React, { useEffect } from "react";
import "./_collections.scss";
import TopCollections from "../../components/Collections/TopCollections/TopCollections";
import TrendingCollections from "../../components/Collections/TrendingCollections/TrendingCollections";
import CollectionCategories from "../../components/Collections/CollectionCategories/CollectionCategories";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Collections = ({
  allCollections,
  allCollectionsOrdered,
  recentlySoldNfts,
  cfxPrice,newestCollections
}) => {
  const location = useLocation();

  const scrollToElement = () => {
    const element = document.getElementById("recentSales");
    if (element && location.hash === `#recent-sales`) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else window.scrollTo(0, 0);
  };

  useEffect(() => {
    scrollToElement();
  }, []);

  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <TopCollections
        allCollections={allCollections}
        allCollectionsOrdered={allCollectionsOrdered}
        newestCollections={newestCollections}

      />
      <TrendingCollections
        allCollections={allCollections}
        recentlySoldNfts={recentlySoldNfts}
        cfxPrice={cfxPrice}
      />
      <CollectionCategories allCollections={allCollections} />
      <div className="d-flex justify-content-center">
        <NavLink to="/all-collections">
          <button className="buy-btn px-5 m-auto">Explore all</button>
        </NavLink>
      </div>
    </div>
  );
};

export default Collections;
