import { useWeb3Contract } from "react-moralis";
import { Presale_ABI, Presale_Address } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";
import {useState} from "react";
import { ethers } from "ethers";

export default function TokenRaised() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const [tokenRaised, setTokenRaised] = useState(0);
    const [error, setError] = useState(null);
    const contAddress = chainId in Presale_Address ? Presale_Address[chainId][0] : null;

    const { runContractFunction: getTotalRaised } = useWeb3Contract({
        abi: Presale_ABI,
        contractAddress: contAddress,
        functionName: "getTotalRaised",
        params: {},
    })

    
    useEffect(() => {
      if (isWeb3Enabled) {
        async function getToken() {
          try {
            let TotalRaised = (await getTotalRaised()).toString();
            if (TotalRaised !== undefined) {
              setTokenRaised(ethers.utils.formatUnits(TotalRaised, "ether"));
            } else {
              setTokenRaised('0'); // Set to 0 if undefined
            }
          } catch (error) {
            setError(error.message || "Error fetching total raised");
          }
        }
  
        getToken();
      }
    }, [isWeb3Enabled, getTotalRaised]);
  
    return (
      <div className="flex flex-col justify-center items-center border-4 border-slate-400 rounded-md px-5 py-10 font-poppins font-semibold leading-10 tracking-wider mx-3 mt-3 md:mt-0 md:mx-0">
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <h1>Total Token Raised: <span className="text-[#d55025]"> {tokenRaised}  BNB </span></h1>
        )}
      </div>
    );
}
