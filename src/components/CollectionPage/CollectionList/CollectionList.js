import React from "react";
import "./_collectionlist.scss";
import bigGrid from "./assets/bigGrid.svg";
import bigGridActive from "./assets/bigGridActive.svg";
import listView from "./assets/listView.svg";
import listViewActive from "./assets/listViewActive.svg";
import smallGrid from "./assets/smallGrid.svg";
import smallGridActive from "./assets/smallGridActive.svg";
import liveIcon from "./assets/liveIcon.svg";
import priceIcon from "./assets/priceIcon.svg";
import statusIcon from "./assets/statusIcon.svg";
import traitsIcon from "./assets/traitsIcon.svg";

const CollectionList = () => {
  return (
    <div className="container-lg">
      <div className="row collection-list-wrapper py-4 px-2">
        <div className="col-2">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-1">
              <img src={liveIcon} alt="" />
              <span className="live-text mb-0">Live</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <span className="collection-info mb-0">9,943</span>
              <span className="collection-info-span mb-0">Results</span>
            </div>
          </div>
          .
        </div>
        <div className="col-10"></div>
      </div>
    </div>
  );
};

export default CollectionList;
