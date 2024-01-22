import React, { useEffect, useState } from "react";
import "./_collectionpage.scss";
import CollectionBanner from "../../components/CollectionPage/CollectionBanner/CollectionBanner";
import CollectionList from "../../components/CollectionPage/CollectionList/CollectionList";
import banner from "../../components/CollectionPage/CollectionBanner/assets/bannerPlaceholder.png";
import collectionIcon from "../../components/CollectionPage/CollectionBanner/assets/cawsIcon.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import Web3 from "web3";
import { FadeLoader } from "react-spinners";

const CollectionPage = ({
  coinbase,
  onFavoriteCollection,
  userCollectionFavs,
  userData,
  allCollections,
}) => {
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

  const [favorite, setFavorite] = useState(false);
  const [collectionOwner, setcollectionOwner] = useState();
  const [isVerified, setisVerified] = useState(false);
  const [currentCollection, setcurrentCollection] = useState([]);
  const [collectionSocials, setcollectionSocials] = useState([]);
  const [allNftArray, setAllNftArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalSupplyPerCollection, settotalSupplyPerCollection] = useState(0);

  const [next, setnext] = useState(4);

  const nftPerRow = 10;

  const { collectionAddress } = useParams();
  const override = {
    display: "block",
    margin: "20px auto 0",
    borderColor: "#554fd8",
  };

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

  const fetchInitialNftsPerCollection = async () => {
    let nftArray = [];
    let totalSupply = 0;

    const result = await axios.get(
      `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${collectionAddress}`
    );
    if (result && result.status === 200) {
      const abi = JSON.parse(result.data.result);
      const web3 = new Web3(window.ethereum);
      const collection_contract = new web3.eth.Contract(abi, collectionAddress);
      if (result.data.result.includes("_totalSupply")) {
        totalSupply = await collection_contract.methods
          ._totalSupply()
          .call()
          .catch((e) => {
            console.error(e);
          });
      } else if (result.data.result.includes("totalSupply")) {
        totalSupply = await collection_contract.methods
          .totalSupply()
          .call()
          .catch((e) => {
            console.error(e);
          });
      }
      settotalSupplyPerCollection(totalSupply);
      console.log(totalSupply);
      if ((totalSupply && totalSupply >= 4) || Number(totalSupply) === 1) {
        for (let i = 0; i < totalSupply >= 4 ? 4 : 1; i++) {
          const tokenByIndex = await collection_contract.methods
            .tokenByIndex(i)
            .call()
            .catch((e) => {
              console.error(e);
            });
          const tokenURI = await collection_contract.methods
            .tokenURI(tokenByIndex)
            .call()
            .catch((e) => {
              console.error(e);
              console.error(tokenByIndex);
            });
          if (tokenURI) {
            console.log(tokenURI);
            if (!tokenURI.includes("ipfs://")) {
              if (tokenURI.endsWith(".svg")) {
                nftArray.push(tokenURI);
              } else {
                const result2 = await axios.get(tokenURI).catch((e) => {
                  console.error(e);
                });
                if (result2 && result2.status === 200) {
                  nftArray.push(result2.data);
                }
              }
            } else if (tokenURI.includes("ipfs://")) {
              const ipfs_key = tokenURI.slice(6, tokenURI.length);
              const result2 = await axios
                .get(`https://ipfs.io/ipfs${ipfs_key}`)
                .catch((e) => {
                  console.error(e);
                });
              if (result2 && result2.status === 200) {
                const nftImage = result2.data.image.slice(
                  6,
                  result2.data.image.length
                );
                nftArray.push({
                  ...result2.data,
                  nftImage: `https://ipfs.io/ipfs${nftImage}`,
                });
              }
            }
          }
          // else {
          //   const tokenURI2 = await collection_contract.methods
          //     .uri()
          //     .call(i)
          //     .catch((e) => {
          //       console.error(e);
          //     });
          //   if (tokenURI2) {
          //     nftArray.push(tokenURI2);
          //   }
          // }
        }
        console.log("nftArray1", nftArray);
        setAllNftArray(nftArray);
      }
    }
  };

  const fetchSlicedNftsPerCollection = async () => {
    let nftArray = [];
    let totalSupply = 0;

    const result = await axios.get(
      `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${collectionAddress}`
    );
    if (result && result.status === 200) {
      const abi = JSON.parse(result.data.result);
      const web3 = new Web3(window.ethereum);
      const collection_contract = new web3.eth.Contract(abi, collectionAddress);

      if (result.data.result.includes("_totalSupply")) {
        totalSupply = await collection_contract.methods
          ._totalSupply()
          .call()
          .catch((e) => {
            console.error(e);
          });
      } else if (result.data.result.includes("totalSupply")) {
        totalSupply = await collection_contract.methods
          .totalSupply()
          .call()
          .catch((e) => {
            console.error(e);
          });
      }
      if (totalSupply && next <= totalSupply) {
        for (let i = next - nftPerRow; i < next; i++) {
          const tokenByIndex = await collection_contract.methods
            .tokenByIndex(i)
            .call()
            .catch((e) => {
              console.error(e);
            });
          const tokenURI = await collection_contract.methods
            .tokenURI(tokenByIndex)
            .call()
            .catch((e) => {
              console.error(e);
              console.error(tokenByIndex);
            });
          if (tokenURI) {
            console.log(tokenURI);
            if (!tokenURI.includes("ipfs://")) {
              const result2 = await axios.get(tokenURI).catch((e) => {
                console.error(e);
              });
              if (result2 && result2.status === 200) {
                nftArray.push(result2.data);
              }
            } else if (tokenURI.includes("ipfs://")) {
              const ipfs_key = tokenURI.slice(6, tokenURI.length);
              const result2 = await axios
                .get(`https://ipfs.io/ipfs${ipfs_key}`)
                .catch((e) => {
                  console.error(e);
                });
              if (result2 && result2.status === 200) {
                const nftImage = result2.data.image.slice(
                  6,
                  result2.data.image.length
                );
                nftArray.push({
                  ...result2.data,
                  nftImage: `https://ipfs.io/ipfs${nftImage}`,
                });
              }
            }
          }
          // else {
          //   const tokenURI2 = await collection_contract.methods
          //     .uri()
          //     .call(i)
          //     .catch((e) => {
          //       console.error(e);
          //     });
          //   if (tokenURI2) {
          //     nftArray.push(tokenURI2);
          //   }
          // }
        }
        const finaldata = [...allNftArray, ...nftArray];
        setAllNftArray(finaldata);
        setLoading(false);
      }
    }
  };

  const loadMore = () => {
    setnext(next + nftPerRow);
    setLoading(true);
  };

  const onScroll = () => {
    const wrappedElement = document.getElementById("header2");
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
    if (next === 4) {
      fetchInitialNftsPerCollection();
    }
  }, [collectionAddress, next]);

  useEffect(() => {
    if (next !== 4) {
      fetchSlicedNftsPerCollection();
    }
  }, [collectionAddress, next]);

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

  useEffect(() => {
    document.addEventListener("scroll", onScroll);
  });

  return (
    <div className="container-fluid py-4 home-wrapper px-0" id="header2">
      <CollectionBanner
        title={currentCollection.collectionName}
        logo={
          currentCollection.collectionProfilePic
            ? `https://confluxapi.worldofdypians.com/${currentCollection.collectionProfilePic}`
            : collectionIcon
        }
        banner={
          currentCollection.collectionBackgroundPic
            ? `https://confluxapi.worldofdypians.com/${currentCollection.collectionBackgroundPic}`
            : banner
        }
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
      <CollectionList
        currentCollection={currentCollection}
        allNftArray={allNftArray}
        collectionAddress={collectionAddress}
      />

      {next <= totalSupplyPerCollection.length && loading === false && (
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
  );
};

export default CollectionPage;
