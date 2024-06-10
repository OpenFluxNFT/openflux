import { Route, Routes } from "react-router-dom";
import Home from "./screens/Home/Home";
import Collections from "./screens/Collections/Collections";
import Header from "./components/Header/Header";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import WalletModal from "./components/WalletModal/WalletModal";
import useWindowSize from "./hooks/useWindowSize";
import MobileHeader from "./components/Header/MobileHeader/MobileHeader";
import Support from "./screens/Support/Support";
import Mint from "./screens/Mint/Mint";
import Footer from "./components/Footer/Footer";
import CollectionPage from "./screens/CollectionPage/CollectionPage";
import SingleNft from "./screens/SingleNft/SingleNft";
import Profile from "./screens/Profile/Profile";
import SettingsPage from "./screens/SettingsPage/SettingsPage";
import { useNavigate } from "react-router-dom";
import Toast from "./components/Toast/Toast";
import { ethers } from "ethers";
import SignModal from "./components/SignModal/SignModal";
import AllCollections from "./screens/AllCollections/AllCollections";
import Web3 from "web3";

function App() {
  const [walletModal, setWalletModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState();
  const [success, setSuccess] = useState(false);
  const [showForms2, setShowForms2] = useState(false);
  const [coinbase, setCoinbase] = useState();
  const [userData, setuserData] = useState([]);
  const [userCollection, setuserCollection] = useState([]);

  const [allCollections, setAllCollections] = useState([]);
  const [newestCollections, setnewestCollections] = useState([]);

  const [recentlyListedNfts, setrecentlyListedNfts] = useState([]);
  const [recentlySoldNfts, setrecentlySoldNfts] = useState([]);

  const [allCollectionsOrdered, setAllCollectionsOrdered] = useState([]);

  const [userCollectionFavs, setuserCollectionFavs] = useState([]);
  const [userNftFavs, setuserNftFavs] = useState([]);
  const [userNftFavsInitial, setuserNftFavsInitial] = useState([]);

  const [isRedirect, setIsRedirect] = useState(false);
  const [isNewCollection, setisNewCollection] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [showSignPopup, setshowSignPopup] = useState(false);

  const [toastMessage, settoastMessage] = useState();
  const [isErrorToast, setisErrorToast] = useState(false);
  const [isSuccestToast, setisSuccestToast] = useState(false);
  const [userTotalNftsOwned, setUserTotalNftsOwned] = useState([]);
  const [userNftsOwned, setUserNftsOwned] = useState(0);
  const [userNftsOwnedArray, setUserNftsOwnedArray] = useState([]);
  const [userCollectionArray, setuserCollectionArray] = useState([]);
  const [isOtherUser, setisOtherUser] = useState(false);


  const [cfxPrice, setCfxPrice] = useState(0);
  const [favoriteNft, setFavoriteNft] = useState(false);
  const [balance, setUserBalance] = useState(0);
  const [wcfxBalance, setwcfxBalance] = useState(0);

  const [successUpdateProfile, setSuccessUpdateProfile] = useState({
    success: null,
    message: "",
  });
  const [successUpdateCollectionProfile, setSuccessUpdateCollectionProfile] =
    useState({
      success: null,
      message: "",
    });
  const [count, setCount] = useState(0);
  const [signStatus, setSignStatus] = useState("initial");
  const [collectionId, setcollectionId] = useState();

  const windowSize = useWindowSize();
  const { ethereum } = window;
  const baseURL = "https://confluxapi.worldofdypians.com";
  const navigate = useNavigate();

  const dataFetchedRef = useRef(false);

  const handleShowWalletModal = () => {
    setWalletModal(true);
  };

  const checkConnection = async () => {
    await window.getCoinbase().then((data) => {
      setCoinbase(data);
    });
    if (window.ethereum.isFluent) {
      window.WALLET_TYPE = "fluent";
    }
  };

  const checkNetworkId = async () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "net_version" })
        .then((data) => {
          setChainId(parseInt(data));
        })
        .catch(console.error);
    } else {
      setChainId(1);
    }
  };

  const handleConnectWallet = async () => {
    try {
      localStorage.setItem("logout", "false");
      await window.connectWallet().then((data) => {
        setIsConnected(data);
      });
      let wallet = "";
      await window.getCoinbase().then((data) => {
        wallet = data;
        setCoinbase(data);
      });
      setWalletModal(false);
      setShowForms2(true);
      setSuccess(true);

      checkConnection();
      if (isRedirect) {
        navigate(`/profile/${wallet}`);
        setIsRedirect(false);
      }

      setShowToast(true);
      settoastMessage("Wallet connected");
      setisErrorToast(false);
      setisSuccestToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    } catch (e) {
      setIsRedirect(false);
      window.alertify.error(String(e) || "Cannot connect wallet!");
      console.log(e);
      setShowToast(true);
      settoastMessage("Cannot connect wallet!");
      setisErrorToast(true);
      setisSuccestToast(false);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return;
    }
    return isConnected;
  };

  const checkConnection2 = async () => {
    const logout = localStorage.getItem("logout");
    if (logout !== "true") {
      await window.getCoinbase().then((data) => {
        if (data) {
          setCoinbase(data);
          setIsConnected(true);
        } else {
          setCoinbase();
          setIsConnected(false);
        }
      });
    } else {
      setIsConnected(false);
      setCoinbase();
    }
  };

  const handleRedirect = async () => {
    const addr = await window
      .getCoinbase()
      .then((data) => {
        return data;
      })
      .catch((e) => {
        console.log(e);
      });

    if (addr) {
      if (window.location.pathname.includes("/profile")) {
        navigate(`/profile/${addr}`);
      }
    }
  };

  const handleSwitchNetwork = async (chain) => {
    if (!window.gatewallet) {
      setChainId(chain);
    }
  };

  // console.log(window.location)

  const handleSetOrderedCollection = async () => {
    const result = await axios
      .get(`${baseURL}/api/collections`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      const newestCollections = result.data.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });
      const finalResult = await Promise.all(
        window.range(0, newestCollections.length - 1).map(async (i) => {
          let floorprice = 0;
          // const result = await axios
          //   .get(
          //     `${baseURL}/api/floor-price/${newestCollections[i].contractAddress}`,
          //     {
          //       headers: {
          //         cascadestyling:
          //           "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
          //       },
          //     }
          //   )
          //   .catch((e) => {
          //     console.error(e);
          //   });

          // if (result && result.status === 200) {
          //   floorprice = result.data.floorPrice / 1e18;
          // }

          return {
            ...newestCollections[i],
            floorPrice: floorprice,
          };
        })
      );
      setAllCollectionsOrdered(finalResult);
    }
  };

  const getAllCollections = async () => {
    const result = await axios
      .get(`${baseURL}/api/collections`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      const regularCollection = result.data;
      const finalResult = await Promise.all(
        window.range(0, regularCollection.length - 1).map(async (i) => {
          let floorprice = 0;
          // const result = await axios
          //   .get(
          //     `${baseURL}/api/floor-price/${regularCollection[i].contractAddress}`,
          //     {
          //       headers: {
          //         cascadestyling:
          //           "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
          //       },
          //     }
          //   )
          //   .catch((e) => {
          //     console.error(e);
          //   });

          // if (result && result.status === 200) {
          //   floorprice = result.data.floorPrice / 1e18;
          // }

          return {
            ...regularCollection[i],
            floorPrice: floorprice,
          };
        })
      );

      setAllCollections(finalResult);
    }
  };

  const fetchNewestCollections = async()=>{
    const response = await axios.get(
      "https://confluxapi.worldofdypians.com/api/newest-collections"
    ).catch((e) => {
      console.error(e);
    });

    if(response && response.status === 200) {
      setnewestCollections(response.data)
    }
  }

  const handleGetRecentlyListedNfts = async () => {
    const result = await axios
      .get(`${baseURL}/api/recent-active-listings`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });
    const web3 = window.confluxWeb3;
    if (result && result.status === 200) {
      // console.log(result.data);
      const recentlyListed = await Promise.all(
        result.data.map(async (item) => {
          let isApproved = false;
          const abiresult = await axios
            .get(
              `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${item.nftAddress}`
            )
            .catch((e) => {
              console.error(e);
            });
          if (
            abiresult &&
            abiresult.status === 200  
          ) {
            let lastSale = 0;
            const abi = abiresult.data.result
      ? JSON.parse(abiresult.data.result)
      : window.BACKUP_ABI;
            const collection_contract = new web3.eth.Contract(
              abi,
              item.nftAddress
            );
            const tokenName = await collection_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });

            const seller = await collection_contract.methods
              .ownerOf(item.tokenId)
              .call()
              .catch((e) => {
                console.error(e);
              });

            const collectionName = await collection_contract.methods
              .name()
              .call()
              .catch((e) => {
                console.error(e);
              });

            const isApprovedresult = await window
              .isApprovedBuy(item.price)
              .catch((e) => {
                console.error(e);
              });

            if (isApprovedresult) {
              isApproved = isApprovedresult;
            }

            const lastSaleResult = await axios
              .get(
                `${baseURL}/api/nft-sale-history/${item.nftAddress.toLowerCase()}/${
                  item.tokenId
                }`,
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

            if (lastSaleResult && lastSaleResult.status === 200) {
              const historyArray = lastSaleResult.data;
              if (historyArray && historyArray.length > 0) {
                const finalArray_sorted = historyArray.sort((a, b) => {
                  return b.blockTimestamp - a.blockTimestamp;
                });
                lastSale = finalArray_sorted[0];
              }
            }

            const nft_data = await fetch(
              `https://cdnflux.dypius.com/collectionsmetadatas/${item.nftAddress.toLowerCase()}/${
                item.tokenId
              }/metadata.json`
            )
              .then((res) => res.json())
              .then((data) => {
                return data;
              })
              .catch((err) => {
                console.log(err.message);
              });

            if (
              nft_data &&
              nft_data.code !== 404 &&
              typeof nft_data !== "string"
            ) {
              return {
                ...item,
                image: `${nft_data.image}`,
                tokenName: tokenName,
                isApproved: isApproved,
                seller: seller,
                collectionName: collectionName,
                lastSale: lastSale,
              };
            } else
              return {
                ...item,
                image: undefined,
                tokenName: tokenName,
                seller: seller,
                collectionName: collectionName,
                lastSale: lastSale,
                isApproved: isApproved,
              };
          }
        })
      );

      setrecentlyListedNfts(recentlyListed.reverse());
    }
  };

  const handleGetRecentlyListedNftsCache = async () => {
    const result = await axios
      .get(`${baseURL}/api/refresh-recent-listings-cache`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200 && coinbase) {
      handleGetRecentlyListedNfts();
      handleMapUserNftsOwned(coinbase);
    }
  };

  const handleGetRecentlySoldNfts = async () => {
    const result = await axios
      .get(`${baseURL}/api/recent-sales`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });
    const web3 = window.confluxWeb3;
    if (result && result.status === 200) {
      const recentlySold = await Promise.all(
        result.data.map(async (item) => {
          let isApproved = false;
          const abiresult = await axios
            .get(
              `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${item.nftAddress}`
            )
            .catch((e) => {
              console.error(e);
            });

          if (
            abiresult &&
            abiresult.status === 200 
          ) {
            const abi = abiresult.data.result
      ? JSON.parse(abiresult.data.result)
      : window.BACKUP_ABI;
            const collection_contract = new web3.eth.Contract(
              abi,
              item.nftAddress
            );
            const tokenName = await collection_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });

            const seller = await collection_contract.methods
              .ownerOf(item.tokenId)
              .call()
              .catch((e) => {
                console.error(e);
              });

            const collectionName = await collection_contract.methods
              .name()
              .call()
              .catch((e) => {
                console.error(e);
              });

            const isApprovedresult = await window
              .isApprovedBuy(item.price)
              .catch((e) => {
                console.error(e);
              });

            if (isApprovedresult) {
              isApproved = isApprovedresult;
            }

            const nft_data = await fetch(
              `https://cdnflux.dypius.com/collectionsmetadatas/${item.nftAddress.toLowerCase()}/${
                item.tokenId
              }/metadata.json`
            )
              .then((res) => res.json())
              .then((data) => {
                return data;
              })
              .catch((err) => {
                console.log(err.message);
              });
            if (
              nft_data &&
              nft_data.code !== 404 &&
              typeof nft_data !== "string"
            ) {
              return {
                ...item,
                ...nft_data,
                image: `${nft_data.image}`,
                tokenName: tokenName,
                isApproved: isApproved,
                seller: seller,
                collectionName: collectionName,
              };
            } else
              return {
                ...item,
                image: undefined,
                tokenName: tokenName,
                seller: seller,
                collectionName: collectionName,
              };
          }
        })
      );

      setrecentlySoldNfts(recentlySold);
    }
  };

  const handleGetRecentlySoldNftsCache = async () => {
    const result = await axios
      .get(`${baseURL}/api/refresh-recent-sales`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      handleGetRecentlySoldNfts();
      handleMapUserNftsOwned(coinbase);
    }
  };

  const handleDisconnect = async () => {
    if (!window.gatewallet) {
      await window.disconnectWallet();
      localStorage.setItem("logout", "true");
      setSuccess(false);
      setCoinbase();
      setIsConnected(false);
    }
  };

  const fetchTotalNftOwned = async (walletAddr) => {
    if (walletAddr) {
      const result = await axios
        .get(`${baseURL}/api/nft-amount/${walletAddr}`, {
          headers: {
            cascadestyling:
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
          },
        })
        .catch((e) => {
          console.error(e);
        });

      if (result && result.status === 200) {
        setUserNftsOwned(result.data.nftList);
        setUserTotalNftsOwned(result.data.totalAmount);
      }
    }
  };

  const handleMapUserNftsOwned = async (wallet) => {
    let nftsOwned = [];
    let nftsOwnedAmount = 0;

    let allUserCollections = [];
    let nftArray = [];
    const userNftsOwnedresult = await axios
      .get(`${baseURL}/api/nft-amount/${wallet}`, {
        headers: {
          cascadestyling:
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (userNftsOwnedresult && userNftsOwnedresult.status === 200) {
      nftsOwned = userNftsOwnedresult.data.nftList;
    }

    if (nftsOwned && nftsOwned.length > 0) {
      await Promise.all(
        window.range(0, nftsOwned.length - 1).map(async (i) => {
          nftsOwnedAmount = nftsOwned[i].amount;
          const result = await axios
            .get(
              `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${nftsOwned[i].contract}`
            )
            .catch((e) => {
              console.log(e);
            });
          allUserCollections.push({
            collectionName: nftsOwned[i].name,
            nftAddress: nftsOwned[i].contract,
          });

          if (result && result.status === 200) {
            const abi = result.data.result ? JSON.parse(result.data.result) : window.BACKUP_ABI;
            const web3 = window.confluxWeb3;
            const collection_contract = new web3.eth.Contract(
              abi,
              nftsOwned[i].contract
            );
            let lastSale = 0;

            const tokens = await Promise.all(
              window.range(0, nftsOwnedAmount - 1).map((j) =>
                collection_contract.methods
                  .tokenOfOwnerByIndex(wallet, j)
                  .call()
                  .catch((e) => {
                    console.error(e);
                  })
              )
            );

            if (
              tokens &&
              tokens.length > 0 &&
              tokens.find((obj) => {
                return obj !== undefined;
              })
            ) {
              await Promise.all(
                window.range(0, tokens.length - 1).map(async (k) => {
                  if (tokens[k]) {
                    let tokenByIndex = tokens[k];

                    const owner = await collection_contract.methods
                      .ownerOf(tokenByIndex)
                      .call()
                      .catch((e) => {
                        console.error(e);
                      });
                    const tokenName = await collection_contract.methods
                      .symbol()
                      .call()
                      .catch((e) => {
                        console.error(e);
                      });

                    const collectionName = await collection_contract.methods
                      .name()
                      .call()
                      .catch((e) => {
                        console.error(e);
                      });

                    const lastSaleResult = await axios
                      .get(
                        `${baseURL}/api/nft-sale-history/${nftsOwned[
                          i
                        ].contract.toLowerCase()}/${tokenByIndex}`,
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

                    if (lastSaleResult && lastSaleResult.status === 200) {
                      const historyArray = lastSaleResult.data;
                      if (historyArray && historyArray.length > 0) {
                        const finalArray_sorted = historyArray.sort((a, b) => {
                          return b.blockTimestamp - a.blockTimestamp;
                        });
                        lastSale = finalArray_sorted[0];
                      }
                    }

                    const nft_data = await fetch(
                      `https://cdnflux.dypius.com/collectionsmetadatas/${nftsOwned[
                        i
                      ].contract.toLowerCase()}/${tokenByIndex}/metadata.json`
                    )
                      .then((res) => res.json())
                      .then((data) => {
                        return data;
                      })
                      .catch((err) => {
                        console.error(err.message);
                      });

                    if (
                      nft_data &&
                      nft_data.code !== 404 &&
                      typeof nft_data !== "string"
                    ) {
                      // console.log('nft_data', nft_data);
                      nftArray.push({
                        ...nft_data,
                        tokenId: tokenByIndex,
                        owner: owner,
                        nftAddress: nftsOwned[i].contract,
                        tokenName: tokenName,
                        collectionName: collectionName,
                        lastSale: lastSale,
                      });
                    } else if (
                      (nft_data && nft_data.code == 404) ||
                      typeof nft_data === "string"
                    ) {
                      // console.log('nft_data', nft_data);
                      nftArray.push({
                        tokenId: tokenByIndex,
                        owner: owner,
                        nftAddress: nftsOwned[i].contract,
                        tokenName: tokenName,
                        collectionName: collectionName,
                        lastSale: lastSale,
                      });
                    }
                  }
                })
              );
            }

            if (nftArray.length > 0) {
              const uniqueArray_listed = recentlyListedNfts.filter(
                ({ tokenId: id1, nftAddress: nftAddr1 }) =>
                  nftArray.some(
                    ({ tokenId: id2, nftAddress: nftAddr2 }) =>
                      id1.toString() == id2.toString() &&
                      nftAddr1.toLowerCase() === nftAddr2.toLowerCase()
                  )
              );

              const uniqueArray_regular = nftArray.filter(
                ({ tokenId: id1, nftAddress: nftAddr1 }) =>
                  !recentlyListedNfts.some(
                    ({ tokenId: id2, nftAddress: nftAddr2 }) =>
                      id1.toString() === id2.toString() &&
                      nftAddr1.toLowerCase() === nftAddr2.toLowerCase()
                  )
              );

              const finalArray = [
                ...uniqueArray_listed,
                ...uniqueArray_regular,
              ];
              setUserNftsOwnedArray(finalArray);
            }
          }
        })
      );
      setuserCollectionArray(allUserCollections);
    } else setUserNftsOwnedArray([]);
  };

  const fetchuserCollection = async (walletAddr) => {
    if (walletAddr) {
      const result = await axios
        .get(`${baseURL}/api/users/checkCollections/${walletAddr}`, {
          headers: {
            cascadestyling:
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
          },
        })
        .catch((e) => {
          console.error(e);
        });

      if (result && result.status === 200) {
        const finalResult = await Promise.all(
          result.data.ownedCollections.map(async (item) => {
            let floorprice = 0;
            // const result = await axios
            //   .get(`${baseURL}/api/floor-price/${item.contractAddress}`, {
            //     headers: {
            //       cascadestyling:
            //         "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
            //     },
            //   })
            //   .catch((e) => {
            //     console.error(e);
            //   });

            // if (result && result.status === 200) {
            //   floorprice = result.data.floorPrice;
            // }

            return {
              ...item,
              floorPrice: floorprice,
            };
          })
        );

        if (finalResult) {
          setuserCollection(finalResult);
        }
      }
    }
  };

  const fetchCFXPrice = async () => {
    await axios
      .get(
        "https://pro-api.coingecko.com/api/v3/simple/price?ids=conflux-token&vs_currencies=usd&x_cg_pro_api_key=CG-4cvtCNDCA4oLfmxagFJ84qev"
      )
      .then((obj) => {
        if (obj.data["conflux-token"] && obj.data["conflux-token"] !== NaN) {
          setCfxPrice(obj.data["conflux-token"].usd);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleAdduserWithSignature = async (walletAddr) => {
    if (walletAddr) {
      setSignStatus("loading");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(walletAddr);
      const signature = await signer
        .signMessage(
          `I am creating my profile with wallet address ${walletAddr}`
        )
        .catch((e) => {
          console.error(e);
        });

      const body = {
        walletAddress: walletAddr,
        signature: signature,
      };

      const result = await axios
        .post(`${baseURL}/api/users/addWithSignature`, body, {
          headers: {
            cascadestyling:
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
          },
        })
        .catch((e) => {
          console.error(e);
          setTimeout(() => {
            setSignStatus("error");
          }, 2000);
          setTimeout(() => {
            setSignStatus("initial");
          }, 2000);
        });

      if ((result && result.status === 200) || result.status === 201) {
        getUserData(walletAddr);
        fetchTotalNftOwned(walletAddr);

        setSignStatus("success");

        setTimeout(() => {
          setSignStatus("initial");
          setshowSignPopup(false);
        }, 2000);
      } else {
        setTimeout(() => {
          setSignStatus("error");
        }, 2000);
        setTimeout(() => {
          setSignStatus("initial");
        }, 2000);
      }
    }
  };

  const getFavNftsPerUser = async (walletAddr) => {
    if (walletAddr) {
      const result = await axios
        .get(`${baseURL}/api/users/${walletAddr}`, {
          headers: {
            cascadestyling:
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
          },
        })
        .catch((e) => {
          console.error(e);
        });

      if (result && result.status === 200 && result.data !== "User not found") {
        const favData = result.data.nftFavorites;

        if (favData.length > 0) {
          const result = await Promise.all(
            window.range(0, favData.length - 1).map(async (item1) => {
              return Promise.all(
                window
                  .range(0, favData[item1].tokenIds.length - 1)
                  .map(async (i) => {
                    const nft_data = await fetch(
                      `https://cdnflux.dypius.com/collectionsmetadatas/${favData[
                        item1
                      ].contractAddress.toLowerCase()}/${
                        favData[item1].tokenIds[i]
                      }/metadata.json`
                    )
                      .then((res) => res.json())
                      .then((data) => {
                        return data;
                      })
                      .catch((err) => {
                        console.log(err.message);
                      });

                    const abiresult = await axios
                      .get(
                        `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${favData[item1].contractAddress}`
                      )
                      .catch((e) => {
                        console.error(e);
                      });

                    if (
                      abiresult &&
                      abiresult.status === 200  
                    ) {
                      const web3 = window.confluxWeb3;

                      const abi = abiresult.data.result
      ? JSON.parse(abiresult.data.result)
      : window.BACKUP_ABI;
                      const collection_contract = new web3.eth.Contract(
                        abi,
                        favData[item1].contractAddress
                      );

                      const collectionName = await collection_contract.methods
                        .name()
                        .call()
                        .catch((e) => {
                          console.error(e);
                        });
                      // console.log(nft_data);
                      if (
                        nft_data &&
                        nft_data.code !== 404 &&
                        typeof nft_data !== "string"
                      ) {
                        // nftArray.push({
                        //   ...nft_data,
                        //   tokenId: Number(favData[item1].tokenIds[i]),
                        //   contractAddress: favData[item1].contractAddress,
                        //   collectionName: collectionName,
                        // });

                        return {
                          ...nft_data,
                          tokenId: Number(favData[item1].tokenIds[i]),
                          contractAddress: favData[item1].contractAddress,
                          collectionName: collectionName,
                        };
                      } else {
                        // nftArray.push({
                        //   ...nft_data,
                        //   tokenId: Number(favData[item1].tokenIds[i]),
                        //   contractAddress: favData[item1].contractAddress,
                        //   collectionName: collectionName,
                        // });

                        return {
                          tokenId: Number(favData[item1].tokenIds[i]),
                          contractAddress: favData[item1].contractAddress,
                          collectionName: collectionName,
                        };
                      }
                    }
                  })
              );
            })
          );
          let length = 0;
          let nftArray = [];
          const finalArray = [...result];
          finalArray.map((item) => {
            return (length += item.length);
          });
          finalArray.map((item) => {
            if (item.length > 1) {
              item.map((item2) => {
                return nftArray.push({ ...item2 });
              });
            } else if (item.length === 1) {
              return nftArray.push({ ...item[0] });
            }
          });
          // console.log(length, nftArray);
          setuserNftFavs(nftArray);
        } else setuserNftFavs([]);
      }
    }
  };

  const getUserData = async (walletAddr) => {
    if (walletAddr && isConnected) {
      const result = await axios
        .get(`${baseURL}/api/users/${walletAddr}`, {
          headers: {
            cascadestyling:
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
          },
        })
        .catch((e) => {
          console.error(e);
        });

      if (result && result.status === 200) {
        if (result.data === "User not found") {
          setTimeout(() => {
            setshowSignPopup(true);
          }, 1000);
        } else {
          setuserData(result.data);
          setuserCollectionFavs(result.data.collectionFavorites);
          setuserNftFavsInitial(result.data.nftFavorites);
          fetchTotalNftOwned(walletAddr);
          fetchuserCollection(walletAddr);
        }
      } else setuserData([]);
    } else setuserData([]);
  };

  const updateUserData = async (userInfo) => {
    if (coinbase && isConnected) {
      setSuccessUpdateProfile({
        success: null,
        message: "",
      });

      const filteredInfo = Object.fromEntries(
        Object.entries(userInfo).filter(
          ([key, value]) => value !== "" && value !== undefined
        )
      );

      const formData = new FormData();
      for (const [key, value] of Object.entries(filteredInfo)) {
        formData.append(key, value);
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(coinbase);
      const signature = await signer
        .signMessage(`I am updating my profile with wallet address ${coinbase}`)
        .catch((e) => {
          console.error(e);
        });

      formData.append("signature", signature);
      formData.append("walletAddress", coinbase);

      axios
        .post(`${baseURL}/api/users/edit`, formData, {
          headers: {
            cascadestyling:
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setSuccessUpdateProfile({
            success: true,
            message: "Succesfully updated",
          });
          setCount(count + 1);

          setTimeout(() => {
            setSuccessUpdateProfile({
              success: null,
              message: "",
            });
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
          setSuccessUpdateProfile({
            success: false,
            message: "Something went wrong",
          });
          setTimeout(() => {
            setSuccessUpdateProfile({
              success: null,
              message: "",
            });
          }, 3000);
        });
    }
  };

  const updateCollectionData = async (collectionInfo) => {
    if (coinbase && isConnected) {
      setSuccessUpdateCollectionProfile({
        success: null,
        message: "",
      });

      const filteredInfo = Object.fromEntries(
        Object.entries(collectionInfo).filter(
          ([key, value]) => value !== "" && value !== undefined
        )
      );

      console.log(
        Object.fromEntries(
          Object.entries(collectionInfo).filter(
            ([key, value]) => value !== "" && value !== undefined
          )
        )
      );

      const formData = new FormData();
      for (const [key, value] of Object.entries(filteredInfo)) {
        formData.append(key, value);
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(coinbase);
      const signature = await signer
        .signMessage(`I am updating my collection with id ${collectionId}`)
        .catch((e) => {
          console.error(e);
        });

      formData.append("signature", signature);
      formData.append("walletAddress", coinbase);
      formData.append("id", collectionId);
      axios
        .post(`${baseURL}/api/collections/edit`, formData, {
          headers: {
            cascadestyling:
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setSuccessUpdateCollectionProfile({
            success: true,
            message: "Succesfully updated",
          });
          setCount(count + 1);

          setTimeout(() => {
            setSuccessUpdateCollectionProfile({
              success: null,
              message: "",
            });
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
          setSuccessUpdateCollectionProfile({
            success: false,
            message: "Something went wrong",
          });
          setTimeout(() => {
            setSuccessUpdateCollectionProfile({
              success: null,
              message: "",
            });
          }, 3000);
        });
    }
  };

  const getOtherUserData = async (walletAddr) => {
    if (walletAddr) {
      const result = await axios
        .get(`${baseURL}/api/users/${walletAddr}`, {
          headers: {
            cascadestyling:
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
          },
        })
        .catch((e) => {
          console.error(e);
        });

      if (result && result.status === 200) {
        if (result.data === "User not found") {
          setuserData([]);
        } else {
          setuserData(result.data);
          fetchTotalNftOwned(walletAddr);
        }
      } else setuserData([]);
    } else setuserData([]);
  };

  useEffect(() => {
    getUserBalance();
    getWcfxBalance();
  }, [coinbase, isConnected, chainId]);

  //const message = I am updating my profile with wallet address ${walletAddress}
  /*


  get collection owner /api/collections/getCollectionOwner/:contractAddress/'

  retrieving all collections:
  app.get('/api/collections', async (req, res) => {
    

  to edit a certain collection (only if owner):
  app.post('/api/collections/edit/:id'

  and you have the following fields for this

  upload.fields([
    { name: 'collectionProfilePic', maxCount: 1 },
    { name: 'collectionBackgroundPic', maxCount: 1 }

  const { id } = req.params;
  const { signature, contractAddress, collectionName, symbol, tags, ...updateData } = req.body;

  i separated contractAddress, collectionName, symbol, because these will never be changed by a user
  
  only tags and ...updateData (which includes: 

  websiteLink: String,
    twitterLink: String,
    tgLink: String,
    discordLink: String,
    instagramLink: String,

  and tags can only be from this: 
  enum: ['Art', 'Gaming', 'Virtual World', 'Music', 'Sports'],



  app.post('/api/users')

  this is the endpoint which you will use if the user is not in the database already
  in order for him to add himself to the db and modify the profile pic/banner pic

  const { walletAddress, signature } = req.body;

  userUpload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'bannerPicture', maxCount: 1 }


  app.get('/api/users/:walletAddress') to get users


  app.post('/api/users/edit/:walletAddress', userUpload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'bannerPicture', maxCount: 1 }

  this is the api you will use in order to edit the profile picture/profile banner of a user that is already in the database

    const walletAddress = req.params.walletAddress;
    const { signature } = req.body;


    also for the adding/editing of a user this is the message u will need to get him to sign:

      const message = I am updating my profile with wallet address ${walletAddress};

      instead of ${walletAddress} you make him sign exactly with the walletAddress you are passing to me

    dimension limit as we discussed, max file size 512KB
    tags must be passed as an array btw, like ['Art', 'Virtual Worlds'], etc


    *****Favorite Collection and Favorite NFT********

    app.post('/api/users/addCollectionFavorite/:walletAddress', async (req, res) => {
    const { walletAddress } = req.params;
    const { contractAddress } = req.body;


  app.post('/api/users/removeCollectionFavorite/:walletAddress', async (req, res) => {
    const { walletAddress } = req.params;
    const { contractAddress } = req.body;
  

  app.post('/api/users/addNftFavorite/:walletAddress', async (req, res) => {
  const { walletAddress } = req.params;
  const { contractAddress, tokenId } = req.body;

  app.post('/api/users/removeNftFavorite/:walletAddress', async (req, res) => {
    const { walletAddress } = req.params;
    const { contractAddress, tokenId } = req.body;

    base url is: https://confluxapi.worldofdypians.com

    also for all details about a user:
    https://confluxapi.worldofdypians.com/api/users/0x65C3d0F9438644945dF5BF321c9F0fCf333302b8


  for welcome notif
    /api/users/:walletAddress/welcomeNotification

  to read a notif
  /api/users/:walletAddress/notifications/read/:notificationId

  to delete a notif
  /api/users/:walletAddress/notifications/:notificationId


    
    */

  const handleAddFavoriteNft = async (tokenId, nftContract) => {
    if (coinbase) {
      const data = {
        contractAddress: nftContract,
        tokenId: tokenId,
      };

      await axios
        .post(
          `https://confluxapi.worldofdypians.com/api/users/addNftFavorite/${coinbase}`,
          data,
          {
            headers: {
              cascadestyling:
                "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
            },
          }
        )
        .then(() => {
          setFavoriteNft(true);
          setCount(count + 1);
          getFavNftsPerUser(coinbase);
        })
        .catch((e) => {
          console.error(e);
          setFavoriteNft(false);
        });
    }
  };

  const handleRemoveFavoriteNft = async (tokenId, nftContract) => {
    if (coinbase) {
      const data = {
        contractAddress: nftContract,
        tokenId: tokenId.toString(),
      };

      await axios
        .post(
          `https://confluxapi.worldofdypians.com/api/users/removeNftFavorite/${coinbase}`,
          data,
          {
            headers: {
              cascadestyling:
                "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
            },
          }
        )
        .then(() => {
          setFavoriteNft(false);
          setCount(count + 1);
          getFavNftsPerUser(coinbase);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  const getUserBalance = async () => {
    if (isConnected && coinbase && chainId === 1030) {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [coinbase, "latest"],
      });

      if (balance) {
        const web3cfx = new Web3(window.config.conflux_endpoint);
        const stringBalance = web3cfx.utils.hexToNumberString(balance);
        const amount = web3cfx.utils.fromWei(stringBalance, "ether");
        setUserBalance(amount);
      }
    }
  };

  const getWcfxBalance = async () => {
    if (coinbase) {
      const contract = new window.confluxWeb3.eth.Contract(
        window.TOKEN_ABI,
        window.config.wcfx_address
      );

      const balance = await contract.methods
        .balanceOf(coinbase)
        .call()
        .then((data) => {
          return window.confluxWeb3.utils.fromWei(data, "ether");
        });
      setwcfxBalance(balance);
    }
  };

  const logout = localStorage.getItem("logout");

  const initializeLocalStorage = () => {
    const viewedNfts = JSON.parse(localStorage.getItem("viewedNfts"));

    if (!viewedNfts || !Array.isArray(viewedNfts)) {
      localStorage.setItem("viewedNfts", JSON.stringify([]));
    }
  };

  useEffect(() => {
    initializeLocalStorage();
  }, []);

  useEffect(() => {
    if (ethereum) {
      ethereum.on("chainChanged", checkNetworkId);
      ethereum?.on("accountsChanged", checkConnection2);
      ethereum?.on("accountsChanged", handleRedirect);
    }
  }, [ethereum]);

  useEffect(() => {
    if (
      !window.coin98 &&
      window.ethereum &&
      window.ethereum.isConnected() === true &&
      !window.gatewallet
    ) {
      if (
        logout === "false" ||
        window.coinbase_address === "0x0000000000000000000000000000000000000000"
      ) {
        checkConnection2();
      } else {
        setIsConnected(false);
        setCoinbase();
        localStorage.setItem("logout", "true");
      }
    } else if (
      logout === "false" ||
      window.coinbase_address ===
        "0x0000000000000000000000000000000000000000" ||
      window.coin98
    ) {
      checkConnection2();
    } else {
      setIsConnected(false);
      setCoinbase();
      localStorage.setItem("logout", "true");
    }
    checkNetworkId();
  }, [coinbase, chainId]);

  useEffect(() => {
    checkNetworkId();
    getUserData(coinbase);
  }, [isConnected, coinbase, count]);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    handleGetRecentlyListedNfts();
    handleGetRecentlySoldNfts();
    getAllCollections();
    handleSetOrderedCollection();
    fetchNewestCollections()
    fetchCFXPrice();
  }, []);

  useEffect(() => {
    if(isOtherUser === false) {
         getFavNftsPerUser(coinbase);
    }
 
  }, [coinbase, isConnected]);

  useEffect(() => {
    if (coinbase) {
      handleMapUserNftsOwned(coinbase, recentlyListedNfts);
    }
  }, [recentlyListedNfts, coinbase]);

  return (
    <div
      className="container-fluid p-0 main-wrapper position-relative"
      style={{ minHeight: "100vh", background: "#141843" }}
    >
      {/* <Toast
        message={toastMessage}
        isError={isErrorToast}
        isSuccess={isSuccestToast}
      /> */}

      {windowSize.width > 992 ? (
        <Header
          handleSignup={handleShowWalletModal}
          coinbase={coinbase}
          isConnected={isConnected}
          chainId={chainId}
          handleSwitchNetwork={handleSwitchNetwork}
          handleSignupAndRedirectToAccount={() => {
            handleShowWalletModal();
            setIsRedirect(true);
          }}
          handleDisconnect={handleDisconnect}
          allCollections={allCollections}
          balance={balance}
          onNewCollectionClick={() => {
            setisNewCollection(true);
          }}
        />
      ) : (
        <MobileHeader
          handleSignup={handleShowWalletModal}
          coinbase={coinbase}
          isConnected={isConnected}
          chainId={chainId}
          handleSwitchNetwork={handleSwitchNetwork}
          handleSignupAndRedirectToAccount={() => {
            handleShowWalletModal();
            setIsRedirect(true);
          }}
          balance={balance}
        />
      )}

      <Routes>
        <Route
          exact
          path="/"
          element={
            <Home
              allCollections={allCollections}
              newestCollections={newestCollections}
              recentlyListedNfts={recentlyListedNfts}
              recentlySoldNfts={recentlySoldNfts}
              cfxPrice={cfxPrice}
              handleAddFavoriteNft={handleAddFavoriteNft}
              handleRemoveFavoriteNft={handleRemoveFavoriteNft}
              userNftFavs={userNftFavs}
              userNftFavsInitial={userNftFavsInitial}
              coinbase={coinbase}
              onRefreshListings={() => {
                handleGetRecentlyListedNftsCache();
                handleGetRecentlySoldNftsCache();
              }}
              chainId={chainId}
            />
          }
        />
        <Route
          exact
          path="/collections"
          element={
            <Collections
              allCollections={allCollections}
              allCollectionsOrdered={allCollectionsOrdered}
              recentlySoldNfts={recentlySoldNfts}
              cfxPrice={cfxPrice}
            />
          }
        />
        <Route
          exact
          path="/all-collections"
          element={
            <AllCollections
              allCollections={allCollections}
              allCollectionsOrdered={allCollectionsOrdered}
            />
          }
        />
        {/* <Route exact path="/mint" element={<Mint />} /> */}
        <Route exact path="/support" element={<Support />} />

        <Route
          exact
          path="/collection/:collectionAddress/:id"
          element={
            <CollectionPage
              coinbase={coinbase}
              onFavoriteCollection={() => {
                setCount(count + 1);
              }}
              userCollectionFavs={userCollectionFavs}
              userNftFavs={userNftFavsInitial}
              userData={userData}
              allCollections={allCollections}
              handleAddFavoriteNft={handleAddFavoriteNft}
              handleRemoveFavoriteNft={handleRemoveFavoriteNft}
              cfxPrice={cfxPrice}
              onRefreshListings={() => {
                handleGetRecentlyListedNftsCache();
                handleGetRecentlySoldNftsCache();
              }}
              isNewCollection={isNewCollection}
              onNewCollectionFetched={() => {
                setisNewCollection(false);
              }}
              wcfxBalance={wcfxBalance}
              userNftsOwnedArray={userNftsOwnedArray}
            />
          }
        />
        <Route
          exact
          path="/profile/:id"
          element={
            <Profile
              coinbase={coinbase}
              userData={userData}
              userTotalNftsOwned={userTotalNftsOwned}
              updateUserData={updateUserData}
              successUpdateProfile={successUpdateProfile}
              onViewShared={(value) => {
                setisOtherUser(true);
                getOtherUserData(value);
                getFavNftsPerUser(value);
                getUserData(value);
                fetchuserCollection(value);
                handleMapUserNftsOwned(value);
                fetchTotalNftOwned(value);
              }}
              userCollection={userCollection}
              userCollectionFavs={userCollectionFavs}
              userNftFavs={userNftFavs}
              allCollections={allCollections}
              handleAddFavoriteNft={handleAddFavoriteNft}
              handleRemoveFavoriteNft={handleRemoveFavoriteNft}
              userNftFavsInitial={userNftFavsInitial}
              userNftsOwnedArray={userNftsOwnedArray}
              cfxPrice={cfxPrice}
              userCollectionArray={userCollectionArray}
              recentlyListedNfts={recentlyListedNfts}
            />
          }
        />
        <Route
          exact
          path="/settings/:type"
          element={
            <SettingsPage
              coinbase={coinbase}
              userData={userData}
              // updateUserData={updateUserData}
              updateUserData={updateUserData}
              userCollection={userCollection}
              successUpdateProfile={successUpdateProfile}
              successUpdateCollectionProfile={successUpdateCollectionProfile}
              updateCollectionData={updateCollectionData}
              onSelectCollection={(value) => {
                setcollectionId(value);
              }}
            />
          }
        />
        <Route
          exact
          path="/nft/:nftId/:nftAddress"
          element={
            <SingleNft
              allCollections={allCollections}
              isConnected={isConnected}
              chainId={chainId}
              coinbase={coinbase}
              handleSignup={handleShowWalletModal}
              recentlyListedNfts={recentlyListedNfts}
              handleSwitchNetwork={handleSwitchNetwork}
              cfxPrice={cfxPrice}
              onRefreshListings={() => {
                handleGetRecentlyListedNftsCache();
                handleGetRecentlySoldNftsCache();
              }}
              balance={balance}
              handleAddFavoriteNft={handleAddFavoriteNft}
              handleRemoveFavoriteNft={handleRemoveFavoriteNft}
              userNftFavs={userNftFavsInitial}
              wcfxBalance={wcfxBalance}
            />
          }
        />
      </Routes>
      {walletModal === true && (
        <WalletModal
          show={walletModal}
          handleClose={() => {
            setWalletModal(false);
          }}
          handleConnection={() => {
            handleConnectWallet();
          }}
        />
      )}
      {showSignPopup === true && (
        <SignModal
          show={showSignPopup}
          handleClose={() => {
            setshowSignPopup(false);
          }}
          onHandleConfirm={() => {
            handleAdduserWithSignature(coinbase);
          }}
          onHandleReject={() => {
            setshowSignPopup(false);
          }}
          signStatus={signStatus}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
