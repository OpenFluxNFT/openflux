import React, { useRef, useState, useEffect } from "react";
import "./_collectioncategories.scss";
import CollectionCard from "../../CollectionCard/CollectionCard";
import useWindowSize from "../../../hooks/useWindowSize";
import { NavLink } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { Skeleton } from "@mui/material";

const AllCollectionCategories = ({ allCollections }) => {
  const [category, setCategory] = useState("all");
  const [next, setNext] = useState(24);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [collections, setCollections] = useState([]);
  const [allcollectionsUpdated, setallcollectionsUpdated] = useState([]);

  const collectionsPerRow = 12;

  const override = {
    display: "block",
    margin: "20px auto 0",
    borderColor: "#554fd8",
  };

  const listInnerRef = useRef();

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setNext(next + collectionsPerRow);
      setLoading(false);
    }, 1000);
  };


  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const checkIfImageisValid = async (image) => {
    if(image) {
    const result = await fetch(
      `https://confluxapi.worldofdypians.com/${image}`
    ).catch((e) => {
      console.error(e);
    });
    if (result && result.status === 200) {
      return `https://confluxapi.worldofdypians.com/${image}`;
    } else return undefined;
  } else return undefined;
  };

  const changeCategory = (val) => {
    let filteredCollections = [];
    setCategoryLoading(true);
    setCategory(val);
    if (val === "all") {
      setCollections(allCollections);
    } else if (val === "virtual") {
      filteredCollections = allCollections.filter((item) => {
        return item.tags.includes("Virtual World");
      });
      setCollections(filteredCollections);
    } else {
      filteredCollections = allCollections.filter((item) => {
        return item.tags.includes(capitalizeFirstLetter(val));
      });
      setCollections(filteredCollections);
    }
    setTimeout(() => {
      setCategoryLoading(false);
    }, 1500);
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

  useEffect(() => {
    updateCollections()
  }, [allCollections]);


  const onScroll = () => {
    const wrappedElement = document.getElementById("header");
    if (wrappedElement) {
      const isBottom =
        parseInt(wrappedElement.getBoundingClientRect()?.bottom) <=
        window.innerHeight;
      if (isBottom) {
        if (next <= allCollections.length) {
          loadMore();
        }
        document.removeEventListener("scroll", onScroll);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", onScroll);
  });



  
  return (
    <div className="container-lg py-5" id="header" ref={listInnerRef}>
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
        {categoryLoading === true ? 
           <div className="collection-categories-grid">
           <Skeleton variant="rounded" width={"100%"} height={353} />
           <Skeleton variant="rounded" width={"100%"} height={353} />
           <Skeleton variant="rounded" width={"100%"} height={353} />
           <Skeleton variant="rounded" width={"100%"} height={353} />
           <Skeleton variant="rounded" width={"100%"} height={353} />
           <Skeleton variant="rounded" width={"100%"} height={353} />
           <Skeleton variant="rounded" width={"100%"} height={353} />
           <Skeleton variant="rounded" width={"100%"} height={353} />
         </div>
         : categoryLoading === false && collections.length > 0 ?
         <div className="collection-categories-grid">
         {collections.slice(0, next).map((item, index) => (
           <NavLink
             to={`/collection/${item.contractAddress}/${item.symbol}`}
             key={index}
             className={"text-decoration-none"}
           >
             <CollectionCard key={index} data={item} />
           </NavLink>
         ))}
       </div>
         :
         <div
         className="d-flex align-items-center justify-content-center w-100"
         style={{ height: 353 }}
       >
         <h6 className="text-white">
           There are no collections available for this category
         </h6>
       </div>
      }
       
        {next <= collections.length && loading === false && (
          <div className="d-flex justify-content-center mt-5">
            <button className="buy-btn px-5 m-auto" onClick={loadMore}>
              Load more
            </button>
          </div>
        )}

        {loading === true && (
          <FadeLoader
            color={"#554fd8"}
            loading={loading}
            cssOverride={override}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}
      </div>
    </div>
  );
};

export default AllCollectionCategories;
