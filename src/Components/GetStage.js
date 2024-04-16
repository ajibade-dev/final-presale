import { useWeb3Contract } from "react-moralis";
import { Presale_ABI, Presale_Address } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";
import {useState} from "react";
//import { ethers } from "ethers";

export default function Stage() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const [stage, setStage] = useState(0);
    const [error, setError] = useState(null);
    const contAddress = chainId in Presale_Address ? Presale_Address[chainId][0] : null;

    const { runContractFunction: getCurrentStage } = useWeb3Contract({
        abi: Presale_ABI,
        contractAddress: contAddress,
        functionName: "getCurrentStage",
        params: {},
    })

    useEffect(() => {
      if (isWeb3Enabled) {
        async function getStage() {
          try {
            let stage = (await getCurrentStage()).toString();
            if (stage !== undefined) {
              setStage(stage);
            } else {
              setStage('0'); // Set to 0 if undefined
            }
          } catch (error) {
            setError(error.message || "Error fetching total raised");
          }
        }
  
        getStage();
      }
    }, [isWeb3Enabled, getCurrentStage]);


  return (
    <div className="flex flex-col justify-center items-center border-4 border-slate-400 rounded-md px-5 py-10 font-poppins font-semibold leading-10 tracking-wider mx-3 mt-3 md:mt-0 md:mx-0">
      {error ? (<p>Error: {error}</p>) : (<h1>Current Stage: <span className="text-[#d55025]">{stage}</span></h1>)}
    </div>
  );
} 



