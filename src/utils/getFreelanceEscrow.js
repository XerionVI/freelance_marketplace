import { ethers } from "ethers";
import FreelanceEscrowABI from "../abi/FreelanceEscrowABI.json";

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x8464135c8f25da09e49bc8782676a84730c318bc";  // Example address

export function getFreelanceEscrowContract() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return null;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, FreelanceEscrowABI, signer);
}
