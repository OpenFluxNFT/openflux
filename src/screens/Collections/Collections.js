import React, { useEffect } from "react";
import "./_collections.scss";
import TopCollections from "../../components/Collections/TopCollections/TopCollections";
import TrendingCollections from "../../components/Collections/TrendingCollections/TrendingCollections";
import CollectionCategories from "../../components/Collections/CollectionCategories/CollectionCategories";
import { NavLink } from "react-router-dom";

const Collections = ({ allCollections, allCollectionsOrdered }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <TopCollections
        allCollections={allCollections}
        allCollectionsOrdered={allCollectionsOrdered}
      />
      <TrendingCollections allCollections={allCollections} />
      <CollectionCategories allCollections={allCollections} />
      <div className="d-flex justify-content-center">
        <NavLink to='/all-collections'>
          <button className="buy-btn px-5 m-auto">Explore all</button>
        </NavLink>
      </div>
    </div>
  );
};

export default Collections;
