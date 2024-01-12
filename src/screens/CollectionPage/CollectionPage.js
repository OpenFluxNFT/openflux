import React, { useEffect, useState } from "react";
import "./_collectionpage.scss";
import CollectionBanner from "../../components/CollectionPage/CollectionBanner/CollectionBanner";
import CollectionList from "../../components/CollectionPage/CollectionList/CollectionList";
import banner from "../../components/CollectionPage/CollectionBanner/assets/bannerPlaceholder.png";
import collectionIcon from "../../components/CollectionPage/CollectionBanner/assets/cawsIcon.png";
import { useParams } from "react-router-dom";
import axios from "axios";

const CollectionPage = ({
  coinbase,
  onFavoriteCollection,
  userCollectionFavs,
  userData,
  allCollections,
}) => {
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
      value: "Conflux eSpace",
    },
  ];

  const collectionInfo = [
    {
      title: "Total Volume",
      value: "tbd",
      valueType: "CFX",
    },
    {
      title: "Floor price",
      value: "tbd",
      valueType: "CFX",
    },
    {
      title: "Listed",
      value: "tbd",
      valueType: "(5%)",
    },
    {
      title: "Owners (unique)",
      value: "tbd",
      valueType: "(34%)",
    },
  ];

  const collectionDesc =
    "Cats And Watches Society (CAWS) Is A Collection Of 10,000 NFTs Developed By Dypius, One Of The Most Experienced And Innovative Projects In Decentralized Finance. Through The Adoption Process, Your Cat Will Be Fitted With A Cool Luxury Watch And Will Also Grant You Access To The Members-Only Society Benefits Zone. As A New Cat Owner, You Can Join The CAWS Staking Pool To Earn 50% APR In ETH Rewards. Cats And Watches Society Is Also Building Its Own Metaverse With An Exciting Play-To-Earn (P2E) Game Still In Development.";

  const [favorite, setFavorite] = useState(false);
  const [collectionOwner, setcollectionOwner] = useState();
  const [isVerified, setisVerified] = useState(false);
  const [currentCollection, setcurrentCollection] = useState([]);
  const [collectionSocials, setcollectionSocials] = useState([]);

  const { collectionAddress } = useParams();

  const checkCollectionOwner = async (walletAddr) => {
    if (walletAddr) {
      const result = await axios
        .get(`https://confluxapi.worldofdypians.com/api/users/${walletAddr}`, {
          headers: {
            "x-api-key":
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
          },
        })
        .catch((e) => {
          console.error(e);
        });

      if (result && result.status === 200) {
        if (result.data === "User not found") {
          setisVerified(false);
        } else {
          setisVerified(true);
        }
      } else setisVerified(false);
    }
  };

  const fetchCurrentCollection = (collectionAddr) => {
    const result = allCollections.find((item) => {
      return item.contractAddress === collectionAddr;
    });
    if (result) {
      setcurrentCollection(result);

      const socialsObject = [
        { title: "website", link: result.websiteLink },
        { title: "twitter", link: result.twitterLink },
        { title: "instagram", link: result.instagramLink },
        { title: "discord", link: result.discordLink },
        { title: "telegram", link: result.tgLink },
        {
          title: "confluxScan",
          link: `https://evm.confluxscan.net/address/${collectionAddr}`,
        },
      ];

      setcollectionSocials(socialsObject);
    }
  };

  const getCollectionOwner = async () => {
    const result = await axios
      .get(
        `https://confluxapi.worldofdypians.com/api/collections/getCollectionOwner/${collectionAddress}`,
        {
          headers: {
            "x-api-key":
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
          },
        }
      )
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      setcollectionOwner(result.data);
      checkCollectionOwner(result.data);
    }
  };

  const checkifFavorite = () => {
    if (userCollectionFavs && userCollectionFavs.length > 0) {
      if (userCollectionFavs.find((obj) => obj === collectionAddress)) {
        setFavorite(true);
      } else {
        setFavorite(false);
      }
    }
  };

  const handleAddFavorite = async () => {
    if (coinbase && collectionAddress) {
      const data = {
        contractAddress: collectionAddress,
      };

      await axios
        .post(
          `https://confluxapi.worldofdypians.com/api/users/addCollectionFavorite/${coinbase}`,
          data,
          {
            headers: {
              "x-api-key":
                "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
            },
          }
        )
        .then(() => {
          setFavorite(true);
          onFavoriteCollection();
        })
        .catch((e) => {
          console.error(e);
          setFavorite(false);
        });
    }
  };

  const handleRemoveFavorite = async () => {
    if (coinbase && collectionAddress) {
      const data = {
        contractAddress: collectionAddress,
      };

      await axios
        .post(
          `https://confluxapi.worldofdypians.com/api/users/removeCollectionFavorite/${coinbase}`,
          data,
          {
            headers: {
              "x-api-key":
                "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
            },
          }
        )
        .then(() => {
          setFavorite(false);
          onFavoriteCollection();
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    checkifFavorite();
  }, [collectionAddress, userCollectionFavs]);

  useEffect(() => {
    getCollectionOwner();
    fetchCurrentCollection(collectionAddress);
  }, [collectionAddress]);

  useEffect(() => {
    fetchCurrentCollection(collectionAddress);
  }, [collectionAddress, allCollections]);

  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <CollectionBanner
        title={currentCollection.collectionName}
        logo={collectionIcon}
        banner={banner}
        socials={collectionSocials}
        desc={currentCollection.description ?? "No description"}
        info={collectionInfo}
        isFavorite={favorite}
        handleFavorite={() => {
          favorite ? handleRemoveFavorite() : handleAddFavorite();
        }}
        isVerified={isVerified}
        currentCollection={currentCollection}
      />
      <CollectionList currentCollection={currentCollection} />
    </div>
  );
};

export default CollectionPage;
