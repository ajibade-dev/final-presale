import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import TokenLeft from "./TokenLeft";
import Stage from "./GetStage";
import Price from "./buyTokens";
import HardCap from "./GetHardCap";
import TotalRaised from "./TotalRaised";
import Claim from  "./Claim";
import Bits from "../logo/bits.png"

export default function Home() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    chainId,
  } = useMoralis();

  const [showMessage, setShowMessage] = useState(false);
  const [preferredChainId, setPreferredChainId] = useState("0x57");
  const [isConnecting, setIsConnecting] = useState(false);

  // Call enableWeb3 when Connect button is clicked
  const handleConnectClick = async () => {
    setIsConnecting(true); // Set connecting status to true
    await enableWeb3();
    window.localStorage.setItem("connected", "injected");
    setIsConnecting(false); // Set connecting status to false after connection is established
  };

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null account found");
      }
    });

    console.log("Connected chainId:", chainId);
    if (account && chainId) {
      // Display "Hello world" after 10 seconds
      const timer = setTimeout(() => {
        setShowMessage(true);
      }, 5000); // Changed delay to 10 seconds

      return () => clearTimeout(timer);
    }
  }, [chainId, account]);

  const switchToPreferredNetwork = async () => {
    try {
      // Check if the preferredChainId starts with "0x"
      
      // Check if the chainId matches the preferredChainId
      if (chainId !== preferredChainId) {
        // Add the custom network using wallet_addEthereumChain
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0x61",
            chainName: "Binance Smart Chain Testnet",
            nativeCurrency: {
              name: "BNB",
              symbol: "tBNB",
              decimals: 18,
            },
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
            blockExplorerUrls: ["https://testnet.bscscan.com"],
          }],
        });
        
        
        // Switch to the preferred network
        await Moralis.switchNetwork("0x61");
        console.log(`Switched to preferred network`);
      } else {
        console.log("Already connected to the preferred network");
      }
    } catch (error) {
      console.error("Error switching network:", error);
      // Handle error (display error message, etc.)
    }
  };

  return (
      <div>
    <div className="flex flex-row bg-[#07091a] items-center text-white justify-between px-10 py-2">
      <img src={Bits} />
      {account ? (
        <div className="px-4 py-2 bg-[#d55025] text-white rounded-xl border-2 border-slate-300">
          Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
        </div>
      ) : (
        <button
        className="px-4 py-2 bg-[#d55025] text-white rounded-xl border-2 border-slate-300"
          onClick={handleConnectClick}
          disabled={isWeb3Enabled || isConnecting} // Disable button while connecting
        >
          {isConnecting ? "Connecting..." : "Connect"} {/* Show "Connecting..." text while connecting */}
        </button>
      )}
  </div>
      {showMessage ? (
        chainId === "0x61" ? (
          <div className="flex md:flex-wrap flex-col justify-center w-screen md:flex-row gap-6 h-full text-white py-2 md:px-10 md:py-5">
            <Stage />
            <Price />
            <HardCap />
            <TokenLeft />
            <TotalRaised />
            <Claim />
          </div>
        ) : (
          <button onClick={switchToPreferredNetwork}>Switch Network</button>
        )
      ) : null}
    
    </div>
  );
}






