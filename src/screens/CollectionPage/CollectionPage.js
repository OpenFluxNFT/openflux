import React, { useEffect, useState } from "react";
import "./_collectionpage.scss";
import CollectionBanner from "../../components/CollectionPage/CollectionBanner/CollectionBanner";
import CollectionList from "../../components/CollectionPage/CollectionList/CollectionList";
import banner from "../../components/CollectionPage/CollectionBanner/assets/bannerPlaceholder.png";
import collectionIcon from "../../components/CollectionPage/CollectionBanner/assets/cawsIcon.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import Web3 from "web3";

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

  const [isVerified, setisVerified] = useState(false);
  const [currentCollection, setcurrentCollection] = useState([]);
  const [collectionSocials, setcollectionSocials] = useState([]);
  const [allNftArray, setAllNftArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalSupplyPerCollection, settotalSupplyPerCollection] = useState(0);

  const [next, setnext] = useState(0);
  const baseURL = "https://confluxapi.worldofdypians.com";

  //https://confluxapi.worldofdypians.com/api/collections/contractAddress/listings

  /*
  
  
when a user lists an nft or edits/cancels a listing or a listing is bought or an offer is accepted


you call this with the respective nftaddress:


confluxapi.worldofdypians.com/api/collections/contractAddress/refresh-listings

which will refresh the listings and give you a json of the current ones

{
  "listings": [
    {
      "nftAddress": "0x2dEeCF2a05F735890Eb3eA085d55CEc8F1a93895",
      "tokenId": "1049",
      "seller": "0x65C3d0F9438644945dF5BF321c9F0fCf333302b8",
      "price": "1000000000000000000",
      "paymentToken": "0x14b2D3bC65e74DAE1030EAFd8ac30c533c976A9b",
      "duration": "0",
      "expiresAt": "1706095685"
    },
    {
      "nftAddress": "0x2dEeCF2a05F735890Eb3eA085d55CEc8F1a93895",
      "tokenId": "2086",
      "seller": "0x65C3d0F9438644945dF5BF321c9F0fCf333302b8",
      "price": "1000000000000000000",
      "paymentToken": "0x14b2D3bC65e74DAE1030EAFd8ac30c533c976A9b",
      "duration": "1",
      "expiresAt": "1706269322"
    }
  ]
}

if there are no listings


{
  "listings": "none"
}
  */

  const nftPerRow = 20;

  const { collectionAddress } = useParams();

  const getCollectionTotalSupply = async () => {
    let totalSupply = 0;

    const result = await axios.get(
      `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${collectionAddress}`
    );

    if (result && result.status === 200) {
      const abi = JSON.parse(result.data.result);
      const web3 = window.confluxWeb3;
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

      console.log(totalSupply)
      settotalSupplyPerCollection(totalSupply);
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
      const web3 = window.confluxWeb3;
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
      
      if (totalSupply && totalSupply > 0) {
        const limit = totalSupply <= 4 ? totalSupply : 4;
        for (let i = 0; i < limit; i++) {
          let tokenByIndex = 0;
          if (result.data.result.includes("tokenByIndex")) {
            tokenByIndex = await collection_contract.methods
              .tokenByIndex(i)
              .call()
              .catch((e) => {
                console.error(e);
              });
          } else if (!result.data.result.includes("tokenByIndex")) {
            tokenByIndex = i;
          }

          const tokenURI = await collection_contract.methods
            .tokenURI(tokenByIndex)
            .call()
            .catch((e) => {
              console.error(e);
              console.error(tokenByIndex);
            });
          const tokenName = await collection_contract.methods
            .symbol()
            .call()
            .catch((e) => {
              console.error(e);
            });
          if (tokenURI) {
            if (
              !tokenURI.includes("ipfs://") &&
              !tokenURI.includes("ipfs;//")
            ) {
              if (tokenURI.endsWith(".svg") || tokenURI.endsWith(".gif")) {
                nftArray.push({ name: tokenName, image: tokenURI });
              } else if (tokenURI.includes("tokenURI:")) {
                nftArray.push({
                  name: tokenName,
                  image: tokenURI.slice(9, tokenURI.length),
                });
              } else {
                console.log(tokenURI);
                const result2 = await axios.get(tokenURI).catch((e) => {
                  console.error(e);
                });
                if (result2 && result2.status === 200) {
                  nftArray.push(result2.data);
                }
              }
            } else if (
              tokenURI.includes("ipfs://") ||
              tokenURI.includes("ipfs;//")
            ) {
              const ipfs_key = tokenURI.slice(6, tokenURI.length);
              console.log("ipfs_key", ipfs_key);
              const result2 = await axios
                .get(`https://ipfs.io/ipfs${ipfs_key}`)
                .catch((e) => {
                  console.error(e);
                });
              if (result2 && result2.status === 200) {
                if (result2.data.image) {
                  const nftImage = result2.data.image.slice(
                    6,
                    result2.data.image.length
                  );
                  nftArray.push({
                    ...result2.data,
                    nftImage: `https://ipfs.io/ipfs${nftImage}`,
                  });
                } else if (result2) {
                  nftArray.push({
                    name: tokenName,
                    image: `https://ipfs.io/ipfs${ipfs_key}`,
                  });
                }
              }
            }
          } else if (tokenURI === "") {
            nftArray.push({ name: tokenName, image: undefined });
          }
        }
        console.log("nftArray1", nftArray);
        setAllNftArray(nftArray);
      }
    }
  };
console.log(totalSupplyPerCollection)
  const getTestCollections = async () => {
    let nftArray = [];
    setLoading(true);
    const result = await axios
      .get(`${baseURL}/api/nfts/${collectionAddress}?skip=${next}`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      console.log(result.data,totalSupplyPerCollection);
      if (result.data.metadatas === false && totalSupplyPerCollection === 0) {
        setAllNftArray([]);
        setLoading(false);
      } else if (
        result.data.metadatas === false &&
        Number(totalSupplyPerCollection) > 0
      ) {
        console.log("yes");
        const result2 = await axios.get(
          `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${collectionAddress}`
        );
        if (result2 && result2.status === 200) {
          const abi = JSON.parse(result2.data.result);
          const web3 = window.confluxWeb3;
          const collection_contract = new web3.eth.Contract(
            abi,
            collectionAddress
          );

          const tokenName = await collection_contract.methods
            .symbol()
            .call()
            .catch((e) => {
              console.error(e);
            });
          const limit = next === 0 ? 20 : next;
          for (let i = 0; i < limit; i++) {
            nftArray.push({ name: tokenName, image: undefined });
          }
          setAllNftArray(nftArray);
        }
      } else {
        setAllNftArray(result.data);
        setLoading(false);
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
      const web3 = window.confluxWeb3;
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
          let tokenByIndex = 0;
          if (result.data.result.includes("tokenByIndex")) {
            tokenByIndex = await collection_contract.methods
              .tokenByIndex(i)
              .call()
              .catch((e) => {
                console.error(e);
              });
          } else if (!result.data.result.includes("tokenByIndex")) {
            tokenByIndex = i;
          }
          const tokenURI = await collection_contract.methods
            .tokenURI(tokenByIndex)
            .call()
            .catch((e) => {
              console.error(e);
              console.error(tokenByIndex);
            });
          const tokenName = await collection_contract.methods
            .symbol()
            .call()
            .catch((e) => {
              console.error(e);
            });
          if (tokenURI) {
            console.log(tokenURI);
            if (
              !tokenURI.includes("ipfs://") &&
              !tokenURI.includes("ipfs;//")
            ) {
              if (tokenURI.endsWith(".svg") || tokenURI.endsWith(".gif")) {
                nftArray.push({ name: tokenName, image: tokenURI });
              } else if (tokenURI.includes("tokenURI:")) {
                nftArray.push({
                  name: tokenName,
                  image: tokenURI.slice(9, tokenURI.length),
                });
              } else {
                const result2 = await axios.get(tokenURI).catch((e) => {
                  console.error(e);
                });
                if (result2 && result2.status === 200) {
                  nftArray.push(result2.data);
                }
              }
            } else if (
              tokenURI.includes("ipfs://") ||
              tokenURI.includes("ipfs;//")
            ) {
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
          } else if (tokenURI === "") {
            nftArray.push({ name: tokenName, image: undefined });
          }
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
              cascadestyling:
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
              cascadestyling:
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
    getCollectionTotalSupply();
  }, []);

  useEffect(() => {
    // if (next === 4) {
    // fetchInitialNftsPerCollection();
    getTestCollections();
    // }
  }, [collectionAddress, totalSupplyPerCollection, next]);

  // useEffect(() => {
  //   if (next !== 4) {
  //     fetchSlicedNftsPerCollection();
  //   }
  // }, [collectionAddress, next]);

  useEffect(() => {
    checkifFavorite();
  }, [collectionAddress, userCollectionFavs]);

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
        isVerified={currentCollection.verified === "yes" ? true : false}
        currentCollection={currentCollection}
      />
      <CollectionList
        currentCollection={currentCollection}
        allNftArray={allNftArray}
        collectionAddress={collectionAddress}
        loading={loading}
      />

      {totalSupplyPerCollection &&
        next <= totalSupplyPerCollection &&
        totalSupplyPerCollection > 0 &&
        loading === false && (
          <div className="d-flex justify-content-center mt-5">
            <button className="buy-btn px-5 m-auto" onClick={loadMore}>
              Load more
            </button>
          </div>
        )}
    </div>
  );
};

export default CollectionPage;
