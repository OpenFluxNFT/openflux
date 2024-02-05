import React, { useState } from "react";
import "./_morefromcollection.scss";
import Slider from "react-slick";
import checkIcon from "../../Collections/TopCollections/assets/checkIcon.svg";
import { NavLink } from "react-router-dom";
import { Skeleton } from "@mui/material";
import getFormattedNumber from "../../../hooks/get-formatted-number";
import axios from "axios";
const MoreFromCollection = ({
  loading,
  allNftArray,
  cfxPrice,
  onNftClick,
  coinbase,
  onRefreshListings,
}) => {
  const settings = {
    // dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    // dotsClass: "button__bar",
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 786,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const dummyCards = [
    {
      title: "CAWS #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
      bestOffer: 100.0,
      lastSale: 120.0,
      owner: "0x50c4",
      timeListed: "11d Ago",
    },
    {
      title: "CAWS #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
      bestOffer: 100.0,
      lastSale: 120.0,
      owner: "0x50c4",
      timeListed: "11d Ago",
    },
    {
      title: "CAWS #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
      bestOffer: 100.0,
      lastSale: 120.0,
      owner: "0x50c4",
      timeListed: "11d Ago",
    },
    {
      title: "Timepiece #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
      bestOffer: 100.0,
      lastSale: 120.0,
      owner: "0x50c4",
      timeListed: "11d Ago",
    },
    {
      title: "Timepiece #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
      bestOffer: 100.0,
      lastSale: 120.0,
      owner: "0x50c4",
      timeListed: "11d Ago",
    },
    {
      title: "Timepiece #1125",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
      bestOffer: 100.0,
      lastSale: 120.0,
      owner: "0x50c4",
      timeListed: "11d Ago",
    },
    {
      title: "Land #9999",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
      bestOffer: 100.0,
      lastSale: 120.0,
      owner: "0x50c4",
      timeListed: "11d Ago",
    },
    {
      title: "Land #9999",
      cfxPrice: 1254.89,
      usdPrice: 654874.86,
      bestOffer: 100.0,
      lastSale: 120.0,
      owner: "0x50c4",
      timeListed: "11d Ago",
    },
  ];

  const [buyStatus, setbuyStatus] = useState("buy"); //buy
  const [buyloading, setbuyLoading] = useState(false); //buy
  const [selectedNftId, setSelectedNftId] = useState(""); //buy
  const baseURL = "https://confluxapi.worldofdypians.com";

  const handleRefreshData = async (nft) => {
    const listednfts = await axios
      .get(
        `${baseURL}/api/collections/${nft.nftAddress.toLowerCase()}/refresh-listings`,
        {
          headers: {
            cascadestyling:
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
          },
        }
      )
      .catch((e) => {
        console.log(e);
      });

    if (listednfts && listednfts.status === 200) {
      onRefreshListings();
    }
  };

  const checkNftApprovalForBuying = async (amount) => {
    const result = await window.isApprovedBuy(amount).catch((e) => {
      console.error(e);
    });

    if (result === true) {
      setbuyStatus("buy");
      return true;
    } else {
      setbuyStatus("approve");
      return false;
    }
  };

  const handleBuyNft = async (nft) => {
    setSelectedNftId(nft.tokenId);

    if (coinbase) {
      const isApproved = await checkNftApprovalForBuying(nft.price).then(
        (data) => {
          return data;
        }
      );

      console.log(nft.listingIndex);

      if (isApproved) {
        setbuyLoading(true);
        setbuyStatus("buy");

        await window
          .buyNFT(nft.nftAddress, nft.listingIndex, nft.price)
          .then((result) => {
            setbuyLoading(false);

            setbuyStatus("success");
            handleRefreshData(nft);
            setTimeout(() => {
              setbuyStatus("");
            }, 2000);
          })
          .catch((e) => {
            setbuyStatus("failed");
            setbuyLoading(false);
            setTimeout(() => {
              setbuyStatus("buy");
            }, 3000);
            console.error(e);
          });
      } else {
        setbuyStatus("approve");
        setbuyLoading(true);

        await window
          .approveBuy(nft.price)
          .then(() => {
            setTimeout(() => {
              setbuyStatus("buy");
            }, 3000);
            setbuyStatus("success");
            setbuyLoading(false);
          })
          .catch((e) => {
            console.error(e);
            setbuyStatus("failed");
            setTimeout(() => {
              setbuyStatus("approve");
            }, 3000);
            setbuyLoading(false);
          });
      }
    } else window.alertify.error("Please connect wallet first!");
  };
  
  return (
    <div className="container-lg py-3">
      <div className="row mx-0">
        <div className="more-collection-wrapper p-3">
          <h6 className="more-collection-title">More From This Collection</h6>

          <Slider {...settings}>
            {allNftArray && allNftArray.length > 0
              ? allNftArray.map((item, index) => (
                  <div
                    className="recently-listed-card p-3 d-flex flex-column"
                    key={index}
                  >
                    <NavLink
                      to={`/nft/${
                        item.tokenId
                      }/${item.nftAddress?.toLowerCase()}`}
                      style={{ textDecoration: "none" }}
                      onClick={() => {
                        window.scrollTo(0, 0);
                        onNftClick(item.tokenId);
                      }}
                    >
                      {!item.isVideo ? (
                        <img
                          src={`https://cdnflux.dypius.com/${item.image}`}
                          className="card-img"
                          alt=""
                        />
                      ) : (
                        <video
                          src={`https://cdnflux.dypius.com/${item.image}`}
                          alt=""
                          className="card-img"
                          controlsList="nodownload"
                          autoPlay={true}
                          loop={true}
                          muted="muted"
                          playsInline={true}
                        />
                      )}
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <h6
                          className="recently-listed-title mb-0"
                          style={{ fontSize: "12px" }}
                        >
                          {item.nftSymbol} {item.name}
                        </h6>
                        <img src={checkIcon} alt="" />
                      </div>
                      {item?.price ? (
                        <div className="d-flex align-items-center mt-2 gap-3">
                          <h6
                            className="cfx-price mb-0"
                            style={{ fontSize: "10px" }}
                          >
                            {getFormattedNumber(item?.price / 10 ** 18)} WCFX
                          </h6>
                          <span
                            className="usd-price"
                            style={{ fontSize: "9px" }}
                          >
                            (${" "}
                            {getFormattedNumber(
                              (item?.price / 10 ** 18) * cfxPrice
                            )}
                            )
                          </span>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center mt-2 gap-3">
                          <h6
                            className="cfx-price mb-0"
                            style={{ fontSize: "10px" }}
                          >
                            --- WCFX
                          </h6>
                          <span
                            className="usd-price"
                            style={{ fontSize: "9px" }}
                          >
                            ($ ---)
                          </span>
                        </div>
                      )}
                      <div className="mt-3">
                        {item.seller &&
                        item.seller.toLowerCase() !==
                          coinbase?.toLowerCase() ? (
                          <button
                            className="buy-btn w-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleBuyNft(item);
                            }}
                          >
                            {item.isApproved ? "Buy" : "Approve Buy"}
                            {buyloading && selectedNftId === item.tokenId && (
                              <div
                                className="spinner-border spinner-border-sm text-light ms-1"
                                role="status"
                              ></div>
                            )}
                          </button>
                        ) : (
                          <NavLink
                            className="buy-btn w-100 d-flex justify-content-center "
                            to={`/nft/${item.tokenId}/${item.nftAddress}`}
                            style={{ textDecoration: "none" }}
                          >
                            View Details
                          </NavLink>
                        )}
                      </div>
                    </NavLink>
                  </div>
                ))
              : dummyCards.map((item, index) => (
                  <Skeleton
                    variant="rounded"
                    height={240}
                    width={"100%"}
                    key={index}
                  />
                ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default MoreFromCollection;
