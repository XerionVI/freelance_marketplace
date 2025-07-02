import { ethers } from "ethers";
import FreelanceEscrowABI from "../abi/FreelanceEscrowABI";

const listenForJobCreated = async (account) => {
  // Use WebSocketProvider for event subscriptions
  const provider = new ethers.WebSocketProvider("ws://localhost:8545"); // Replace with your WebSocket URL
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace with your contract address
  const contract = new ethers.Contract(contractAddress, FreelanceEscrowABI, provider);

  // Listen for the JobCreated event
  contract.on("JobCreated", (jobId, client, freelancer, amount) => {
    console.log("JobCreated event detected:", { jobId, client, freelancer, amount });

    // Check if the connected wallet is the freelancer
    if (freelancer.toLowerCase() === account.toLowerCase()) {
      alert(`You have been assigned a new job! Job ID: ${jobId}`);
    }

    // Check if the connected wallet is the client
    if (client.toLowerCase() === account.toLowerCase()) {
      alert(`You have successfully created a job! Job ID: ${jobId}`);
    }
  });
};

export default listenForJobCreated;