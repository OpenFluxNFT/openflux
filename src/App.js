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

function App() {
  const [walletModal, setWalletModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState();
  const [success, setSuccess] = useState(false);
  const [showForms, setShowForms] = useState(false);
  const [showForms2, setShowForms2] = useState(false);
  const [coinbase, setCoinbase] = useState();
  const [username, setUsername] = useState("");
  const windowSize = useWindowSize();
  const { ethereum } = window;

  const handleShowWalletModal = () => {
    setWalletModal(true);
  };

  const checkConnection = async () => {
    await window.getCoinbase().then((data) => {
      setCoinbase(data);
      axios
        .get(`https://api-image.dyp.finance/api/v1/username/${data}`)
        .then((res) => {
          if (res.data?.username) {
            setUsername(res.data?.username);
          } else {
            setUsername("");
          }
        });
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

      await window.getCoinbase().then((data) => {
        setCoinbase(data);
      });
      setWalletModal(false);
      setShowForms2(true);
      setSuccess(true);
      checkConnection();
    } catch (e) {
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
  }, [isConnected, coinbase]);

  return (
    <div className="container-fluid p-0 main-wrapper position-relative" style={{minHeight: "100vh", background: "#141843"}}>
      {windowSize.width > 992 ? (
        <Header
          handleSignup={handleShowWalletModal}
          coinbase={coinbase}
          isConnected={isConnected}
          chainId={chainId}
          handleSwitchNetwork={handleSwitchNetwork}
        />
      ) : (
        <MobileHeader
          handleSignup={handleShowWalletModal}
          coinbase={coinbase}
          isConnected={isConnected}
          chainId={chainId}
          handleSwitchNetwork={handleSwitchNetwork}
        />
      )}

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/collections" element={<Collections />} />
        <Route exact path="/mint" element={<Mint />} />
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
