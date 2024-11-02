import { ethers } from "ethers";
import FreelanceEscrowABI from "../abi/FreelanceEscrowABI.json";

// Contract address on the blockchain (replace with your deployed contract address)
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";

export function getFreelanceEscrowContract() {
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return null;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, FreelanceEscrowABI, signer);
}
