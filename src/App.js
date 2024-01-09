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

function App() {
  const [walletModal, setWalletModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState();
  const [success, setSuccess] = useState(false);
  const [showForms, setShowForms] = useState(false);
  const [showForms2, setShowForms2] = useState(false);
  const [coinbase, setCoinbase] = useState();
  const [userData, setuserData] = useState([]);
  const [allCollections, setAllCollections] = useState([]);
  const [isRedirect, setIsRedirect] = useState(false);

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
    } catch (e) {
      setIsRedirect(false);
      window.alertify.error(String(e) || "Cannot connect wallet!");
      console.log(e);
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

  const getAllCollections = async () => {
    const result = await axios.get(`${baseURL}/api/collections`).catch((e) => {
      console.error(e);
    });

    if (result && result.status === 200) {
      setAllCollections(result.data);
    }
  };

  const getUserData = async (walletAddr) => {
    const result = await axios
      .get(`${baseURL}/api/users/${walletAddr}`)
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      console.log(result);
    }

    if (result && result.status === 404) {
      setuserData([]);
    }
  };

  //const message = I am updating my profile with wallet address ${walletAddress}
  /*

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
    getUserData("0xBF8BC0660F96b1068E21e0f28614148dfA758cEC");
  }, [isConnected, coinbase]);

  useEffect(() => {
    getAllCollections();
  }, []);

  return (
    <div
      className="container-fluid p-0 main-wrapper position-relative"
      style={{ minHeight: "100vh", background: "#141843" }}
    >
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
        <Route exact path="/" element={<Home />} />
        <Route exact path="/collections" element={<Collections />} />
        {/* <Route exact path="/mint" element={<Mint />} /> */}
        <Route exact path="/support" element={<Support />} />
        <Route exact path="/collection/:id" element={<CollectionPage />} />
        <Route exact path="/profile/:id" element={<Profile />} />
        <Route exact path="/settings" element={<SettingsPage />} />
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
      <Footer />
    </div>
  );
}

export default App;
