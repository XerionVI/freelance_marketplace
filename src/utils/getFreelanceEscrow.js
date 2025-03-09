import { ethers } from "ethers";
import FreelanceEscrowABI from "../abi/FreelanceEscrowABI.json";

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Example address

export async function getFreelanceEscrowContract() {
  if (typeof window.ethereum === 'undefined') {
    alert("Please install MetaMask!");
    return null;
  }

  // Create the provider
  const provider = new ethers.BrowserProvider(window.ethereum);

  // Get a signer
  const signer = await provider.getSigner();

  // Return the contract connected to the signer
  return new ethers.Contract(CONTRACT_ADDRESS, FreelanceEscrowABI.abi, signer);
}
