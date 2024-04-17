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
            chainId: "0x38", // Chain ID for Binance Smart Chain Mainnet
            chainName: "Binance Smart Chain Mainnet",
            nativeCurrency: {
              name: "BNB",
              symbol: "BNB",
              decimals: 18,
            },
            rpcUrls: ["https://bsc-dataseed.binance.org/"],
            blockExplorerUrls: ["https://bscscan.com"],
          }],
        });
        
        
        
        // Switch to the preferred network
        await Moralis.switchNetwork("0x38");
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
      {account ? (
        <div className="flex flex-row bg-[#07091a] items-center text-white justify-between px-2 md:px-10 py-2">
        <img src={Bits} />
        <div  className="ml-5 md:ml-0 px-2 md:px-4 py-2 bg-[#d55025] text-white text-center rounded-xl border-2 border-slate-300">
          
          Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
        </div>
        </div>
      ) : (
        <div className="flex flex-col ">
        <div className="flex flex-row bg-[#07091a] items-center text-white justify-between px-2 md:px-10 py-2 mb-24">
        <img src={Bits} />
        <button
        className="px-4 py-2 bg-[#d55025] text-white rounded-xl border-2 border-slate-300"
          onClick={handleConnectClick}
          disabled={isWeb3Enabled || isConnecting} // Disable button while connecting
        >
          {isConnecting ? "Connecting..." : "Connect"} {/* Show "Connecting..." text while connecting */}
        </button>
        </div>
        <div class="flex items-center justify-center">
  <h1 class="text-center text-2xl lg:text-4xl font-normal lg:font-bold text-white leading-10">
    Welcome to <span className="text-[#d55025] animate-pulse duration-700">BitsLab.</span> Kindly connect your wallet.
  </h1>
</div>

        </div>
      )}
      {showMessage ? (
        chainId === "0x38" ? (
          <div className="flex md:flex-wrap flex-col justify-center w-screen md:flex-row gap-6 h-full text-white py-2 md:px-10 md:py-5">
            <Stage />
            <Price />
            <HardCap />
            <TokenLeft />
            <TotalRaised />
            <Claim />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-10">
            <h1 className="text-center md:w-1/2 w-full text-white md:text-2xl text-xl mb-4">Please click the button below to switch to the preferred network</h1>
              <button className="ml-5 md:ml-0 px-2 md:px-4 py-2 bg-[#d55025] text-white text-center rounded-xl border-2 border-slate-300" onClick={switchToPreferredNetwork}>Switch Network</button>
          </div>
        )
      ) : null}
        </div>
  );

}






