import { ethers } from "ethers";
import FreelanceEscrowABI from "../abi/FreelanceEscrowABI";
import DisputeResolutionABI from "../abi/DisputeResolutionABI";
import VotingModuleABI from "../abi/VotingModuleABI";
import config from "../config";

const ESCROW_ADDRESS = config.CONTRACT_ADDRESS;
const DISPUTE_ADDRESS = config.DISPUTE_RESOLUTION_ADDRESS;
const VOTING_ADDRESS = config.VOTING_MODULE_ADDRESS;

export async function getContractInstance(address, abi) {
  if (typeof window === "undefined" || !window.ethereum) {
    alert("MetaMask is not installed!");
    return null;
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(address, abi, signer);
}

// Usage:
export async function getFreelanceEscrowContract() {
  return getContractInstance(ESCROW_ADDRESS, FreelanceEscrowABI);
}
export async function getDisputeResolutionContract() {
  return getContractInstance(DISPUTE_ADDRESS, DisputeResolutionABI);
}
export async function getVotingModuleContract() {
  return getContractInstance(VOTING_ADDRESS, VotingModuleABI);
}