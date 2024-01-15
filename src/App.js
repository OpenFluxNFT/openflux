import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./screens/Home/Home";
import Collections from "./screens/Collections/Collections";
import Header from "./components/Header/Header";
import "./App.css";
import { useState, useEffect } from "react";

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

function App() {
  const [walletModal, setWalletModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState();
  const [success, setSuccess] = useState(false);
  const [showForms, setShowForms] = useState(false);
  const [showForms2, setShowForms2] = useState(false);
  const [coinbase, setCoinbase] = useState();
  const [userData, setuserData] = useState([]);
  const [userCollection, setuserCollection] = useState([]);

  const [allCollections, setAllCollections] = useState([]);
  const [userCollectionFavs, setuserCollectionFavs] = useState([]);

  const [isRedirect, setIsRedirect] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showSignPopup, setshowSignPopup] = useState(false);

  const [toastMessage, settoastMessage] = useState();
  const [isErrorToast, setisErrorToast] = useState(false);
  const [isSuccestToast, setisSuccestToast] = useState(false);
  const [userTotalNftsOwned, setUserTotalNftsOwned] = useState(0);
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

  const handleSwitchNetwork = async (chain) => {
    if (!window.gatewallet) {
      setChainId(chain);
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

  const getAllCollections = async () => {
    const result = await axios
      .get(`${baseURL}/api/collections`, {
        headers: {
          "x-api-key":
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      setAllCollections(result.data);
    }
  };

  const fetchTotalNftOwned = async (walletAddr) => {
    const result = await axios
      .get(`${baseURL}/nft-amount/${walletAddr}`, {
        headers: {
          "x-api-key":
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      setUserTotalNftsOwned(result.data.totalAmount);
    }
  };

  const fetchuserCollection = async (walletAddr) => {
    const result = await axios
      .get(`${baseURL}/api/users/checkCollections/${walletAddr}`, {
        headers: {
          "x-api-key":
            "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
        },
      })
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      setuserCollection(result.data.ownedCollections);
    }
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
            "x-api-key":
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

  const getUserData = async (walletAddr) => {
    if (walletAddr && isConnected) {
      const result = await axios
        .get(`${baseURL}/api/users/${walletAddr}`, {
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
          setTimeout(() => {
            setshowSignPopup(true);
          }, 1000);
        } else {
          setuserData(result.data);
          setuserCollectionFavs(result.data.collectionFavorites);
          fetchTotalNftOwned(walletAddr);
          fetchuserCollection(walletAddr);
        }
      } else setuserData([]);
    }
  };

  const updateUserData = async (userInfo) => {
    if (coinbase && isConnected) {
      setSuccessUpdateProfile({
        success: null,
        message: "",
      });

      const filteredInfo = Object.fromEntries(
        Object.entries(userInfo).filter(([key, value]) => value !== "")
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
            "x-api-key":
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
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
            "x-api-key":
              "SBpioT4Pd7R9981xl5CQ5bA91B3Gu2qLRRzfZcB5KLi5AbTxDM76FsvqMsEZLwMk--KfAjSBuk3O3FFRJTa-mw",
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
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
            "x-api-key":
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
    }
  };

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

  const logout = localStorage.getItem("logout");
  useEffect(() => {
    if (ethereum) {
      ethereum.on("chainChanged", checkNetworkId);
      ethereum?.on("accountsChanged", checkConnection2);
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
    getAllCollections();
  }, []);

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
        />
      )}

      <Routes>
        <Route
          exact
          path="/"
          element={<Home allCollections={allCollections} />}
        />
        <Route
          exact
          path="/collections"
          element={<Collections allCollections={allCollections} />}
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
              userData={userData}
              allCollections={allCollections}
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
                getOtherUserData(value);
              }}
              userCollection={userCollection}
            />
          }
        />
        <Route
          exact
          path="/settings"
          element={
            <SettingsPage
              coinbase={coinbase}
              userData={userData}
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
              isConnected={isConnected}
              chainId={chainId}
              coinbase={coinbase}
              handleSignup={handleShowWalletModal}
              handleSwitchNetwork={handleSwitchNetwork}
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
