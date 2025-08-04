const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL, // Backend server URL
  SOCKET_URL: import.meta.env.VITE_API_BASE_URL, // Socket.IO server URL
  CONTRACT_ADDRESS: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  DISPUTE_RESOLUTION_ADDRESS: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // dispute resolution contract address
  VOTING_MODULE_ADDRESS: "0x5FbDB2315678afecb367f032d93F642f64180aa3", //  voting module contract address
  ADMIN_ADDRESS: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", //  Admin address
};

export default config;