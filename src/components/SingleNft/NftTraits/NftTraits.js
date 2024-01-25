import React from "react";
import "./_nfttraits.scss";

const NftTraits = ({ nftData }) => {
  const dummyTraits = [
    {
      type: "Background",
      title: "Red Gradient",
    },
    {
      type: "Body",
      title: "Stripes",
    },
    {
      type: "Mouth",
      title: "Normal",
    },
    {
      type: "Watch",
      title: "CAWS Steel White Dial B",
    },
    {
      type: "Tail",
      title: "Very Angry",
    },
    {
      type: "Clothes",
      title: "Poncho",
    },
    {
      type: "Hat",
      title: "Hard Helmet",
    },
    {
      type: "Ears",
      title: "Nervous",
    },
    {
      type: "Eyes",
      title: "Rolled Eyes",
    },
    {
      type: "Eyewear",
      title: "None",
    },
  ];

  return (
    <div className="container-lg py-3">
      <div className="row mx-0">
        <div className="traits-wrapper p-3">
          <h6 className="traits-title">Traits</h6>
          <div className="row">
            {nftData &&
              nftData.attributes &&
              nftData.attributes !== "false" &&
              nftData.attributes.length > 0 &&
              nftData.attributes.map((item, index) => (
                <div key={index} className="col-12 col-md-6 col-lg-3">
                  <div className="nft-trait pb-1 pt-2 d-flex align-items-start gap-1">
                    <span className="trait-key mb-0">{item.trait_type}</span>
                    <span className="trait-value mb-0">{item.value}</span>
                  </div>
                </div>
              ))}
            {nftData &&
              nftData.attributes &&
              nftData.attributes === "false" && (
                <span className="text-secondary d-flex justify-content-center">
                  No attributes available for this nft
                </span>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftTraits;
