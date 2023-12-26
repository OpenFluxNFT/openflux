import React from "react";
import "./_profile.scss";
import CollectionBanner from "../../components/CollectionPage/CollectionBanner/CollectionBanner";
import profileIcon from "./assets/profileIcon.png";
import profileBanner from "./assets/profileBanner.png";

const Profile = () => {
  const profileSocials = ["website", "twitter", "instagram"];

  const profileCredenrtials = [
    {
      key: "Wallet",
      value: "0xce...64",
    },
    {
      key: "Joined",
      value: "Sept 09, 2023",
    },
  ];

  const profileInfo = [
    {
      title: "Total Owned",
      value: "1,236",
      valueType: "NFTs",
    },
    {
      title: "Total Listed",
      value: "326",
      valueType: "(45%)",
    },
    {
      title: "Total Sold",
      value: "24",
      valueType: "NFTs",
    },
    {
      title: "Favorited",
      value: "125",
      valueType: "NFTs",
    },
  ];

  const profileDesc =
    "I'm NFTExplorer21, a digital art enthusiast and blockchain advocate. I collect diverse NFTs, reflecting global creativity. Believing in NFTs' power to reshape ownership, I'm into building an inclusive community. Join me in exploring the metaverse, navigating NFT market trends, and shaping the future of digital ownership. Let's connect for insightful discussions and collaborations in the dynamic world of NFTs.";

  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <CollectionBanner
        title={"DarkSliffer"}
        logo={profileIcon}
        banner={profileBanner}
        socials={profileSocials}
        credentials={profileCredenrtials}
        desc={profileDesc}
        info={profileInfo}
      />
      <div className="container-lg py-5">
        <div className="row">
          <div className="d-flex align-items-center gap-5">
            <div className="profile-option-item active px-3 py-2">
              <h6 className="mb-0">Collected</h6>
            </div>
            <div className="profile-option-item px-3 py-2">
              <h6 className="mb-0">Favorites</h6>
            </div>
            <div className="profile-option-item px-3 py-2">
              <h6 className="mb-0">Listed</h6>
            </div>
            <div className="profile-option-item px-3 py-2">
              <h6 className="mb-0">Offers Made</h6>
            </div>
            <div className="profile-option-item px-3 py-2">
              <h6 className="mb-0">Has Offers</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
