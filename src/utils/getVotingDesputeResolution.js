import { ethers } from "ethers";
import VotingDisputeResolutionABI from "../abi/VotingDisputeResolutionABI.json";

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0xYourVotingDisputeResolutionContractAddress";  // Example address

export function getVotingDisputeResolutionContract(providerType = 'metamask') {
  let provider;

  switch (providerType) {
    case 'metamask':
      if (typeof window.ethereum === 'undefined') {
        alert("Please install MetaMask!");
        return null;
      }
      provider = new ethers.providers.Web3Provider(window.ethereum);
      break;
      
    default:
      alert("Unsupported provider type!");
      return null;
  }

  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, VotingDisputeResolutionABI.abi, signer);
}