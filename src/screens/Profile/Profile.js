import React, { useState, useEffect } from "react";
import "./_profile.scss";
import ProfileNFTList from "../../components/Profile/ProfileNFTList";
import ProfileBanner from "../../components/Profile/ProfileBanner/ProfileBanner";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";

const Profile = ({
  coinbase,
  userData,
  userTotalNftsOwned,
  onViewShared,
  updateUserData,
  successUpdateProfile,
  userCollectionFavs,
  allCollections,
  userNftFavs,
  handleAddFavoriteNft,
  handleRemoveFavoriteNft,
  userNftFavsInitial,
  userNftsOwnedArray,
  cfxPrice,
}) => {
  const [option, setOption] = useState("collected");
  const profileSocials = ["website", "twitter", "instagram"];

  const [userJoined, setUserJoined] = useState("");
  const [userWallet, setuserWallet] = useState("");
  const [userName, setUserName] = useState("");
  const [profilePicture, setprofilePicture] = useState("");
  const [bannerPicture, setbannerPicturePicture] = useState("");
  const baseURL = "https://confluxapi.worldofdypians.com";
  const [nftFinalArray, setnftFinalArray] = useState([]);
  const [userTotalNftsFavs, setUserTotalNftsFavs] = useState(0);
  const [bestOffer, setbestOffer] = useState([]);
  // const [offerData, setofferData] = useState([]);
  const [allOffers, setallOffers] = useState([]);

  const { id } = useParams();

  const getOffer = async () => {
    let finalArray = [];
    let offerArray = [];
    let allOffersArray = [];

    await Promise.all(
      window.range(0, userNftsOwnedArray.length - 1).map(async (i) => {
        const result = await window
          .getAllOffers(
            userNftsOwnedArray[i].nftAddress,
            userNftsOwnedArray[i].tokenId
          )
          .catch((e) => {
            console.log(e);
          });

        const finalResult = result[1];
        console.log(finalResult);
        if (finalResult && finalResult.length > 0) {
          if (coinbase) {
            finalArray = finalResult.filter((object) => {
              return object.offeror.toLowerCase() === coinbase.toLowerCase();
            });

            let finalArrayIndex = finalResult.findIndex((object) => {
              return object.offeror.toLowerCase() === coinbase.toLowerCase();
            });

            // if (finalArray && finalArray.length > 0) {
            //   offerArray = finalArray.map((item) => {
            //     return { ...item, index: finalArrayIndex };
            //   });
            // }

            const maxPrice = Math.max(...finalResult.map((o) => o.amount));
            const obj = finalResult.find((item) => item.amount == maxPrice);
            setbestOffer(obj);

            // if (offerArray && offerArray.length > 0) {
            //   setofferData(...offerArray);
            // }
          }

          const contract = new window.confluxWeb3.eth.Contract(
            window.TOKEN_ABI,
            window.config.wcfx_address
          );

          await Promise.all(
            window.range(0, finalResult.length - 1).map(async (i) => {
              const balance = await contract.methods
                .balanceOf(finalResult[i].offeror)
                .call()
                .then((data) => {
                  return window.confluxWeb3.utils.fromWei(data, "ether");
                });

              const allowance = await contract.methods
                .allowance(
                  finalResult[i].offeror,
                  window.config.nft_marketplace_address
                )
                .call()
                .then((data) => {
                  return window.confluxWeb3.utils.fromWei(data, "ether");
                });

              const priceFormatted = finalResult[i].amount / 1e18;
              const hasExpired = moment
                .duration(finalResult[i].expiresAt * 1000 - Date.now())
                .humanize(true)
                .includes("ago");
              if (!hasExpired) {
                return allOffersArray.push({
                  ...finalResult[i],
                  index: i,
                  isAllowed:
                    balance >= priceFormatted && allowance >= priceFormatted,
                  nftAddress: userNftsOwnedArray[i].nftAddress,
                });
              }
            })
          );

          console.log(allOffersArray);

          setallOffers(allOffersArray);
        } else {
          // setbestOffer([]);
          // setofferData([]);
          setallOffers([]);
        }
      })
    );
  };

  const formatDate = (date) => {
    const test = new Date(date);
    const options = { month: "short", day: "2-digit", year: "numeric" };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      test
    );

    return formattedDate;
  };

  const assignUserData = () => {
    if (userData && userData._id) {
      const userTime = new Date(userData.joinedAt).toLocaleDateString();
      const userTime2 = userTime;
      const userAddr = userData.walletAddress;
      const totalNFTFavs = userData.nftFavorites.length;
      const profilepic = userData.profilePicture;
      const bannerpic = userData.bannerPicture;

      setprofilePicture(profilepic);
      setbannerPicturePicture(bannerpic);
      setUserJoined(userTime2);
      setuserWallet(userAddr);
      setUserTotalNftsFavs(totalNFTFavs);

      const username = userData.username;
      if (!username) {
        setUserName("Unnamed");
      } else {
        setUserName(username);
      }
    } else {
      setUserName("Unnamed");
      setUserJoined("-");
      setuserWallet("-");
      setprofilePicture();
      setbannerPicturePicture();
      setUserTotalNftsFavs(0);
    }
  };

  const fetchFavoriteCounts = async () => {
    if (userNftFavsInitial && userNftFavsInitial.length > 0) {
      let favoriteCount = 0;
      let nftArray = [];

      await Promise.all(
        userNftFavsInitial.map(async (item1) => {
          item1.tokenIds.forEach(async (i) => {
            const nft_data = await fetch(
              `https://cdnflux.dypius.com/collectionsmetadatas/${item1.contractAddress}/${i}/metadata.json`
            )
              .then((res) => res.json())
              .then((data) => {
                // console.log(data);
                return data;
              })
              .catch((err) => {
                console.log(err.message);
              });

            const fav_count_listed = await axios
              .get(
                `${baseURL}/api/nftFavoritesCount/${item1.contractAddress}/${i}`,
                {
                  headers: {
                    cascadestyling:
                      "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
                  },
                }
              )
              .catch((e) => {
                console.error(e);
              });
            if (fav_count_listed && fav_count_listed.status === 200) {
              favoriteCount = fav_count_listed.data;
            }

            if (
              nft_data &&
              nft_data.code !== 404 &&
              typeof nft_data !== "string"
            ) {
              nftArray.push({
                ...nft_data,
                tokenId: Number(i),
                contractAddress: item1.contractAddress,
                ...favoriteCount,
              });
            }
          });
        })
      );

      await Promise.all(
        window.range(0, userNftFavs.length - 1).map(async (i) => {})
      );
      setnftFinalArray(nftArray);
    }
  };

  useEffect(() => {
    fetchFavoriteCounts();
  }, [userNftFavsInitial]);

  const checkIfSameAccount = () => {
    if (userData && userData.walletAddress) {
      if (id.toLowerCase() !== userData.walletAddress?.toLowerCase()) {
        onViewShared(id);
      }
    }
  };

  useEffect(() => {
    checkIfSameAccount();
  }, [userData, id]);

  useEffect(() => {
    assignUserData();
  }, [userData, id]);

  useEffect(() => {
    if (userNftsOwnedArray && userNftsOwnedArray.length > 0 && coinbase) {
      getOffer();
    }
  }, [userNftsOwnedArray, coinbase]);

  const profileCredenrtials = [
    {
      key: "Wallet",
      value: userWallet,
    },
    {
      key: "Joined",
      value: userJoined,
    },
  ];

  const profileInfo = [
    {
      title: "Total Owned",
      value: userTotalNftsOwned,
      valueType: "NFTs",
    },
    {
      title: "Total Listed",
      value: "tbd",
      valueType: "(45%)",
    },
    {
      title: "Total Sold",
      value: "tbd",
      valueType: "NFTs",
    },
    {
      title: "Favorited",
      value: userTotalNftsFavs,
      valueType: "NFTs",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <ProfileBanner
        title={userName}
        logo={profilePicture}
        banner={bannerPicture}
        socials={profileSocials}
        credentials={profileCredenrtials}
        desc={userData.bio ?? "No bio Available"}
        info={profileInfo}
        updateUserData={updateUserData}
        successUpdateProfile={successUpdateProfile}
      />
      <div className="container-lg py-5">
        <div className="row mx-0">
          <div className="d-flex align-items-center gap-5 px-0 profile-filter-wrapper">
            <div
              className={`profile-option-item ${
                option === "collected" && "active"
              } px-3 py-2`}
              onClick={() => setOption("collected")}
            >
              <h6 className="mb-0">Collected</h6>
            </div>
            <div
              className={`profile-option-item ${
                option === "favorites" && "active"
              } px-3 py-2`}
              onClick={() => setOption("favorites")}
            >
              <h6 className="mb-0">Favorites</h6>
            </div>
            <div
              className={`profile-option-item ${
                option === "listed" && "active"
              } px-3 py-2`}
              onClick={() => setOption("listed")}
            >
              <h6 className="mb-0">Listed</h6>
            </div>
            <div
              className={`profile-option-item ${
                option === "offersMade" && "active"
              } px-3 py-2`}
              onClick={() => setOption("offersMade")}
            >
              <h6 className="mb-0">Offers Made</h6>
            </div>
            <div
              className={`profile-option-item ${
                option === "hasOffers" && "active"
              } px-3 py-2`}
              onClick={() => setOption("hasOffers")}
            >
              <h6 className="mb-0">Has Offers</h6>
            </div>
          </div>
          <hr className="profile-divider mt-2" />
          <ProfileNFTList
            option={option}
            userCollectionFavs={userCollectionFavs}
            allCollections={allCollections}
            userNftFavs={userNftFavs}
            userNftFavsInitial={userNftFavsInitial}
            handleAddFavoriteNft={handleAddFavoriteNft}
            handleRemoveFavoriteNft={handleRemoveFavoriteNft}
            nftFinalArray={nftFinalArray}
            fetchFavoriteCounts={fetchFavoriteCounts}
            userNftsOwnedArray={userNftsOwnedArray}
            cfxPrice={cfxPrice}
            allOffers={allOffers}
            bestOffer={bestOffer}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
