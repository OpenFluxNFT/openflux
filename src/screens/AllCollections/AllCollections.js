import React, { useState, useEffect } from "react";
import AllCollectionCategories from "../../components/Collections/CollectionCategories/AllCollectionCategories";

const AllCollections = ({ allCollections, allCollectionsOrdered }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <AllCollectionCategories allCollections={allCollectionsOrdered} />
    </div>
  );
};

export default AllCollections;
