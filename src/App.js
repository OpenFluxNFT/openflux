import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./screens/Home/Home";
import Header from "./components/Header/Header";
import './App.css'
import { useState } from "react";
import {
  useWeb3React,
  disconnect,
  connectWallet,
  ConnectionType,
} from "web3-connector";
import axios from "axios";
import WalletModal from "./components/WalletModal/WalletModal";
import useWindowSize from "./hooks/useWindowSize";
import MobileHeader from "./components/Header/MobileHeader/MobileHeader";

function App() {

  const [walletModal, setWalletModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState();
  const [success, setSuccess] = useState(false);
  const [showForms, setShowForms] = useState(false);
  const [showForms2, setShowForms2] = useState(false);
  const [coinbase, setCoinbase] = useState();
  const [username, setUsername] = useState("")
  const windowSize = useWindowSize();


  const { connector, account, accounts, isActive, isActivating, provider } =
    useWeb3React();

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


  const handleConnectWallet = async () => {
    
    try {
      if (!window.gatewallet) {
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
      } else {
        await window.connectWallet(ConnectionType.INJECTED);
        setCoinbase(account);
        setIsConnected(isActive);
        setWalletModal(false);
        setShowForms2(true);
        setSuccess(true);
        setChainId(parseInt(window.gatewallet.chainId));
      }
    } catch (e) {
      window.alertify.error(String(e) || "Cannot connect wallet!");
      console.log(e);
      return;
    }
    return isConnected;
  };



  return (
    <>
      {
        windowSize.width > 786 ? 
        <Header handleSignup={handleShowWalletModal} coinbase={coinbase} />
        :
        <MobileHeader handleSignup={handleShowWalletModal} coinbase={coinbase} />
      }

      <Routes>
        <Route exact path="/" element={<Home />} />
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

    </>
  );
}

export default App;
