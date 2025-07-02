import { ethers } from "ethers";
import FreelanceEscrowABI from "../abi/FreelanceEscrowABI";  // Ensure correct path
import config from "../config";  // Ensure correct path


const CONTRACT_ADDRESS = config.CONTRACT_ADDRESS;



export async function getFreelanceEscrowContract(account) {
  // Ensure window.ethereum is available (MetaMask)
  if (typeof window === "undefined" || !window.ethereum) {
    console.error("MetaMask is not installed or not available.");
    alert("MetaMask is not installed. Please install MetaMask!");
    return null;
  }

  // Log ABI for debugging
  console.log(FreelanceEscrowABI);  // Check if ABI is valid
  console.log(account);

  try {
    // Initialize the provider and signer with MetaMask
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    console.log("Signer:", signer);

    if (account) {
      // Make sure ABI is an array and valid
      if (Array.isArray(FreelanceEscrowABI) && FreelanceEscrowABI.length > 0) {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, FreelanceEscrowABI, signer);
        
        // Log the contract instance to see the details
        console.log("Contract instance:", contract);

        return contract;
      } else {
        console.error("Invalid ABI format.");
        alert("Contract ABI is invalid.");
        return null;
      }
    } else {
      console.error("Account is not connected. Please ensure your MetaMask account is connected.");
      alert("Account is not connected. Please connect your MetaMask account.");
      return null;
    }
  } catch (error) {
    console.error("Error getting signer:", error);
    return null;
  }
}
