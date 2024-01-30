import React, { useEffect, useState, useRef } from "react";
import "./_collectionpage.scss";
import CollectionBanner from "../../components/CollectionPage/CollectionBanner/CollectionBanner";
import CollectionList from "../../components/CollectionPage/CollectionList/CollectionList";
import banner from "../../components/CollectionPage/CollectionBanner/assets/bannerPlaceholder.png";
import collectionIcon from "../../components/CollectionPage/CollectionBanner/assets/cawsIcon.png";
import { useParams } from "react-router-dom";
import axios, { isCancel } from "axios";
import Web3 from "web3";

const CollectionPage = ({
  coinbase,
  onFavoriteCollection,
  userCollectionFavs,
  userData,
  allCollections,
  userNftFavs,
  handleAddFavoriteNft,
  handleRemoveFavoriteNft,
  cfxPrice,
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

  const [next, setnext] = useState(12);
  const baseURL = "https://confluxapi.worldofdypians.com";
  const dataFetchedRef = useRef(false);
  const containerRef = useRef(false);

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

  const nftPerRow = 12;

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

      settotalSupplyPerCollection(totalSupply);
    }
  };

  const fetchInitialNftsPerCollection = async () => {
    setLoading(true);

    const result = await axios.get(
      `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${collectionAddress}`
    );
    const listednfts = await axios
      .get(`${baseURL}/api/collections/${collectionAddress}/listings`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (
      result &&
      result.status === 200 &&
      listednfts &&
      listednfts.status === 200
    ) {
      let nftArray = [];
      let nftListedArray = [];
      let totalSupply = 0;
      const abi = JSON.parse(result.data.result);
      const listednftsArray = listednfts.data.listings;

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

      if (totalSupply && totalSupply > 0) {
        const limit = totalSupply >= 12 ? 12 : totalSupply;

        if (
          listednftsArray !== "none" &&
          listednftsArray &&
          listednftsArray.length > 0
        ) {
          await Promise.all(
            window.range(0, listednftsArray.length - 1).map(async (j) => {
              const nft_data_listed = await fetch(
                `https://cdnflux.dypius.com/collectionsmetadatas/${collectionAddress.toLowerCase()}/${listednftsArray[j].tokenId}/metadata.json`
              )
                .then((res) => res.json())
                .then((data) => {
                  return data;
                })
                .catch((err) => {
                  console.log(err.message);
                });

              if (nft_data_listed) {
                nftListedArray.push({
                  ...nft_data_listed,
                  ...listednftsArray[j],
                });
              }
            })
          );
        }

        await Promise.all(
          window.range(0, limit - 1).map(async (i) => {
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
            const owner = await collection_contract.methods
              .ownerOf(tokenByIndex)
              .call()
              .catch((e) => {
                console.error(e);
              });

            const nft_data = await fetch(
              `https://cdnflux.dypius.com/collectionsmetadatas/${collectionAddress.toLowerCase()}/${tokenByIndex}/metadata.json`
            )
              .then((res) => res.json())
              .then((data) => {
                return data;
              })
              .catch((err) => {
                console.log(err.message);
              });

            if (nft_data) {
              // console.log('nft_data', nft_data);
              nftArray.push({
                ...nft_data,
                tokenId: Number(tokenByIndex),
                owner: owner,
              });
            }
          })
        );

        const finalArray_sorted = nftArray.sort((a, b) => {
          return a.tokenId - b.tokenId;
        });

        const uniqueArray = finalArray_sorted.filter(
          ({ tokenId: id1 }) =>
            !nftListedArray.some(({ tokenId: id2 }) => id2 === id1.toString())
        );

        const finalArray = [...nftListedArray, ...uniqueArray];
        setAllNftArray(finalArray);
        setLoading(false);
      } else {
        setLoading(false);
        setAllNftArray([]);
      }
    }
  };

  const fetchSlicedNftsPerCollection = async () => {
    let nftArray = [];
    let totalSupply = 0;
    setLoading(true);

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

      if (totalSupply && totalSupply > 0) {
        await Promise.all(
          window.range(next - nftPerRow, next - 1).map(async (i) => {
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
            const owner = await collection_contract.methods
              .ownerOf(tokenByIndex)
              .call()
              .catch((e) => {
                console.error(e);
              });

            const nft_data = await fetch(
              `https://cdnflux.dypius.com/collectionsmetadatas/${collectionAddress.toLowerCase()}/${tokenByIndex}/metadata.json`
            )
              .then((res) => res.json())
              .then((data) => {
                return data;
              })
              .catch((err) => {
                console.log(err.message);
              });

            if (nft_data) {
              // console.log(nft_data);
              nftArray.push({
                ...nft_data,
                tokenId: Number(tokenByIndex),
                owner: owner,
              });
            }
          })
        );

        console.log(next, next - nftPerRow);

        const finaldata = [...allNftArray, ...nftArray];
        setAllNftArray(finaldata);
        setLoading(false);
      }
    }
  };
  const loadMore = () => {
    setnext(next + nftPerRow);
  };

  const onScroll = () => {
    const wrappedElement = document.getElementById("header2");
    if (wrappedElement) {
      const isBottom =
        parseInt(wrappedElement.getBoundingClientRect()?.bottom) <=
        window.innerHeight;
      if (isBottom) {
        if (next <= totalSupplyPerCollection) {
          loadMore();
        }
      }
      document.removeEventListener("scroll", onScroll);
    }

    // const { clientHeight, scrollHeight, scrollTop } =
    //   document.documentElement || document.body;

    // // Adjust the threshold as needed
    // const threshold = 100;
    // console.log(scrollHeight, scrollTop, clientHeight);
    // if (scrollHeight - scrollTop - clientHeight < threshold) {
    //   // You've reached the bottom, trigger your API request here
    //   // console.log('Reached bottom, trigger API request');
    //   console.log("yes1", totalSupplyPerCollection);
    //   if (next <= totalSupplyPerCollection || next === 12) {
    //     console.log("yes2");

    //     setnext(next + nftPerRow);
    //     fetchSlicedNftsPerCollection();
    //   }

    //   // Optionally, you can remove the event listener to stop further calls
    //   window.removeEventListener("scroll", onScroll);
    // }
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
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    fetchInitialNftsPerCollection();
  }, []);

  useEffect(() => {
    if (next !== 12) {
      fetchSlicedNftsPerCollection();
    }
  }, [next]);

  useEffect(() => {
    checkifFavorite();
  }, [collectionAddress, userCollectionFavs]);

  useEffect(() => {
    fetchCurrentCollection(collectionAddress);
  }, [collectionAddress, allCollections]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
  });

  return (
    <div
      className="container-fluid py-4 home-wrapper px-0"
      ref={containerRef}
      id="header2"
    >
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
        handleAddFavoriteNft={handleAddFavoriteNft}
        handleRemoveFavoriteNft={handleRemoveFavoriteNft}
        userNftFavs={userNftFavs}
        cfxPrice={cfxPrice}
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
