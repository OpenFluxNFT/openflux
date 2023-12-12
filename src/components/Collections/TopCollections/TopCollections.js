import React from "react";
import "./_topcollections.scss";
import collectionPlaceholder1 from './assets/collectionPlaceholder1.png'
import collectionPlaceholder2 from './assets/collectionPlaceholder2.png'
import collectionPlaceholder3 from './assets/collectionPlaceholder3.png'
import collectionPlaceholder4 from './assets/collectionPlaceholder4.png'
import checkIcon from './assets/checkIcon.svg'

const TopCollections = () => {

  const dummyCollections = [
    {
      title: "Cats and Watches Society",
      img: collectionPlaceholder1,
      floorPrice: 122.8,
    },
    {
      title: "World of Dypians Land",
      img: collectionPlaceholder2,
      floorPrice: 142.7,
    },
    {
      title: "CAWS Timepiece",
      img: collectionPlaceholder3,
      floorPrice: "--",
    },
    {
      title: "Cats and Watches Society",
      img: collectionPlaceholder4,
      floorPrice: "--",
    },
  ]

  return (
    <div className="container-lg py-5">
      <div className="row">
        <h6 className="main-hero-title mb-3">Top Collections</h6>
        <div className="top-collections-grid pe-0">
          {dummyCollections.map((item, index) => (
              <div className="position-relative" key={index} style={{width: "fit-content"}}>
              <img src={item.img} className="top-collection-image" alt="" />
              <div className="top-collection-info d-flex flex-column p-3 gap-2">
                <div className="d-flex align-items-center gap-1">
                  <h6 className="top-collection-title mb-0">
                    {item.title}
                  </h6>
                  <img src={checkIcon} alt="" />
                </div>
                  <div className="d-flex align-items-center gap-1">
                    <span className="mb-0 floor-placeholder">Floor:</span>
                    <span className="floor-price mb-0">{item.floorPrice} CFX</span>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCollections;
