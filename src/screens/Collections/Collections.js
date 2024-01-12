import React, { useEffect } from "react";
import "./_collections.scss";
import TopCollections from "../../components/Collections/TopCollections/TopCollections";
import TrendingCollections from "../../components/Collections/TrendingCollections/TrendingCollections";
import CollectionCategories from "../../components/Collections/CollectionCategories/CollectionCategories";

const Collections = ({ allCollections }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <TopCollections allCollections={allCollections} />
      <TrendingCollections allCollections={allCollections} />
      <CollectionCategories allCollections={allCollections} />
    </div>
  );
};

export default Collections;
