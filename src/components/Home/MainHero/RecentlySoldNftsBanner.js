import React from "react";
import { NavLink } from "react-router-dom";
import checkIcon from "../RecentlyListed/assets/checkIcon.svg";

const RecentlySoldNftsBanner = ({ recentlySoldNfts, allCollections }) => {
  return (
    <div className="recent-nfts-sold-wrapper d-none d-lg-block position-relative">
      <div className="d-flex position-relative">
        {recentlySoldNfts &&
          recentlySoldNfts.length > 0 &&
          recentlySoldNfts.slice(0, 1).map((item, index) => {
            return (
              <div
                className="recently-listed-card-home  cardimage1 p-3 pb-4 d-flex flex-column"
                key={index}
              >
                <NavLink
                  to={`/nft/${item.tokenId}/${item.nftAddress}`}
                  style={{ textDecoration: "none" }}
                  className={"position-relative"}
                >
                    {item.collectionName === "WODConfluxPass" && item.image === "undefined" ?
                  <img
                  src={'https://cdnflux.dypius.com/collectionsmetadatas/0x2deecf2a05f735890eb3ea085d55cec8f1a93895/0/0.avif'}
                  className="card-img"
                  style={{width: "135px"}}
                  alt=""
                />
                : 
                item.image && !item.isVideo ? (
                  <img
                    src={`https://cdnflux.dypius.com/${item.image170}`}
                    className="card-img"
                    alt=""
                  />
                ) : item.image && item.isVideo ? (
                  <video
                    preload="auto"
                    className="card-img"
                    src={`https://cdnflux.dypius.com/${item.image}`}
                    autoPlay={true}
                    loop={true}
                    muted="muted"
                    playsInline={true}
                    // onClick={player}
                    controlsList="nodownload"
                  ></video>
                ) : (
                  <></>
                )
                }
               
                
                  {!item.image && (
                    <img
                      src={require(`../RecentlyListed/assets/collectionCardPlaceholder2.png`)}
                      className="card-img"
                      alt=""
                    />
                  )}

                  <div className="d-flex align-items-center gap-2 mt-2 justify-content-center">
                    <h6
                      className="recently-listed-title mb-0"
                      style={{ fontSize: "16px" }}
                    >
                      {item.tokenName +
                        " " +
                        (item.name ? item.name : ` #${item.tokenId}`)}
                    </h6>
                     
                  </div>
                </NavLink>
              </div>
            );
          })}

        {recentlySoldNfts &&
          recentlySoldNfts.length > 0 &&
          recentlySoldNfts.slice(1, 2).map((item, index) => {
            return (
              <div
                className="recently-listed-card-home cardimage2 p-3 pb-4 d-flex flex-column"
                key={index}
              >
                <NavLink
                  to={`/nft/${item.tokenId}/${item.nftAddress}`}
                  style={{ textDecoration: "none" }}
                  className={"position-relative"}
                >
                  {item.collectionName === "WODConfluxPass" && item.image === "undefined" ?
                  <img
                  src={'https://cdnflux.dypius.com/collectionsmetadatas/0x2deecf2a05f735890eb3ea085d55cec8f1a93895/0/0.avif'}
                  className="card-img"
                  style={{width: "135px"}}
                  alt=""
                />
                : 
                item.image && !item.isVideo ? (
                  <img
                    src={`https://cdnflux.dypius.com/${item.image170}`}
                    className="card-img"
                    alt=""
                  />
                ) : item.image && item.isVideo ? (
                  <video
                    preload="auto"
                    className="card-img"
                    src={`https://cdnflux.dypius.com/${item.image}`}
                    autoPlay={true}
                    loop={true}
                    muted="muted"
                    playsInline={true}
                    // onClick={player}
                    controlsList="nodownload"
                  ></video>
                ) : (
                  <></>
                )
                }
                  {!item.image && (
                    <img
                      src={require(`../RecentlyListed/assets/collectionCardPlaceholder2.png`)}
                      className="card-img"
                      alt=""
                    />
                  )}

                  <div className="d-flex align-items-center gap-2 mt-2 justify-content-center">
                    <h6
                      className="recently-listed-title mb-0"
                      style={{ fontSize: "16px" }}
                    >
                      {item.tokenName +
                        " " +
                        (item.name ? item.name : ` #${item.tokenId}`)}
                    </h6>
                    
                  </div>
                </NavLink>
              </div>
            );
          })}
        {recentlySoldNfts &&
          recentlySoldNfts.length > 0 &&
          recentlySoldNfts.slice(2, 3).map((item, index) => {
            return (
              <div
                className="recently-listed-card-home cardimage3 p-3 pb-4 d-flex flex-column"
                key={index}
              >
                <NavLink
                  to={`/nft/${item.tokenId}/${item.nftAddress}`}
                  style={{ textDecoration: "none" }}
                  className={"position-relative"}
                >
                    {item.collectionName === "WODConfluxPass" && item.image === "undefined" ?
                  <img
                  src={'https://cdnflux.dypius.com/collectionsmetadatas/0x2deecf2a05f735890eb3ea085d55cec8f1a93895/0/0.avif'}
                  className="card-img"
                  style={{width: "135px"}}
                  alt=""
                />
                : 
                item.image && !item.isVideo ? (
                  <img
                    src={`https://cdnflux.dypius.com/${item.image170}`}
                    className="card-img"
                    alt=""
                  />
                ) : item.image && item.isVideo ? (
                  <video
                    preload="auto"
                    className="card-img"
                    src={`https://cdnflux.dypius.com/${item.image}`}
                    autoPlay={true}
                    loop={true}
                    muted="muted"
                    playsInline={true}
                    // onClick={player}
                    controlsList="nodownload"
                  ></video>
                ) : (
                  <></>
                )
                }
                  {!item.image && (
                    <img
                      src={require(`../RecentlyListed/assets/collectionCardPlaceholder2.png`)}
                      className="card-img"
                      alt=""
                    />
                  )}

                  <div className="d-flex align-items-center gap-2 mt-2 justify-content-center">
                    <h6
                      className="recently-listed-title mb-0"
                      style={{ fontSize: "16px" }}
                    >
                      {item.tokenName +
                        " " +
                        (item.name ? item.name : ` #${item.tokenId}`)}
                    </h6>
                     
                  </div>
                </NavLink>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default RecentlySoldNftsBanner;
