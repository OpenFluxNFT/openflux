import React, {useEffect} from "react";
import "./_collectionpage.scss";
import CollectionBanner from "../../components/CollectionPage/CollectionBanner/CollectionBanner";
import CollectionList from "../../components/CollectionPage/CollectionList/CollectionList";
import banner from '../../components/CollectionPage/CollectionBanner/assets/bannerPlaceholder.png';
import collectionIcon from '../../components/CollectionPage/CollectionBanner/assets/cawsIcon.png';



const CollectionPage = () => {
  const collectionSocials = ["website", "twitter", "instagram", "discord", "telegram", "confluxScan"];

  const collectionCredenrtials = [
    {
      key: "Items",
      value: "9,953",
    },
    {
      key: "Created",
      value: "Sept 09, 2023",
    },
    {
      key: "Creator Earning",
      value: "5%",
    },
    {
      key: "Chain",
      value: "Conflux Network",
    },
  ];

  const collectionInfo = [
    {
      title: "Total Volume",
      value: "23.6M",
      valueType: "CFX",
    },
    {
      title: "Floor price",
      value: "128,254.8",
      valueType: "CFX",
    },
    {
      title: "Listed",
      value: "1,245",
      valueType: "(5%)",
    },
    {
      title: "Owners (unique)",
      value: "125",
      valueType: "(34%)",
    },
  ];

  const collectionDesc = "Cats And Watches Society (CAWS) Is A Collection Of 10,000 NFTs Developed By Dypius, One Of The Most Experienced And Innovative Projects In Decentralized Finance. Through The Adoption Process, Your Cat Will Be Fitted With A Cool Luxury Watch And Will Also Grant You Access To The Members-Only Society Benefits Zone. As A New Cat Owner, You Can Join The CAWS Staking Pool To Earn 50% APR In ETH Rewards. Cats And Watches Society Is Also Building Its Own Metaverse With An Exciting Play-To-Earn (P2E) Game Still In Development.";

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <CollectionBanner
         title={"Cats And Watches Society"}
         logo={collectionIcon}
         banner={banner}
         socials={collectionSocials}
         credentials={collectionCredenrtials}
         desc={collectionDesc}
         info={collectionInfo}
      />
      <CollectionList />
    </div>
  );
};

export default CollectionPage;
