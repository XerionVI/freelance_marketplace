
# 🛠️ Chain Gigs - Freelance Marketplace on Ethereum

![License](https://img.shields.io/badge/license-MIT-green)
![Vue](https://img.shields.io/badge/Vue.js-35495E?logo=vue.js&logoColor=4FC08D)
![Solidity](https://img.shields.io/badge/Solidity-363636?logo=solidity&logoColor=white)

**Chain Gigs** is a decentralized freelance marketplace that leverages the Ethereum blockchain to enable transparent, secure, and automated job contracts between clients and freelancers using cryptocurrency (ETH). It features on-chain job creation, escrow-based payments, dispute resolution via community voting, and file.

Smart Contract Repo: https://github.com/XerionVI/SmartContract

---

## 🚀 Features

- 💼 Job creation with smart contract integration  
- 🔐 Escrow system for holding funds during work  
- ⚖️ Dispute resolution via decentralized voting  
- 📁 File submission system with optional IPFS  
- 📊 Transparent transaction dashboard  
- 🧠 Smart contract logic for full automation  

---

## 🔁 Project Flows

### 📌 Flow 1: Job Creation (with Transaction Logic)

```plaintext
[Start]
   ↓
[Client Fills Job Creation Form]
   ↓
[Client Confirms Transaction via Wallet]
   ↓
[Smart Contract: Create Job (Job Status: Created)]
   ↓
[Notify Freelancer in System]
   ↓
[Freelancer Confirms Job?]
   ↓         ↓
[Yes]        [No]
   ↓             ↓
[Job Status: Accepted]   [Job Status: Rejected]
   ↓
[End]
```

---

### 📁 Flow 2: Upload & Complete Work (with Transaction Logic)

```plaintext
[Start]
   ↓
[Freelancer Uploads Work File]
   ↓
[Use IPFS?]
   ↓           ↓
[Yes]          [No]
   ↓              ↓
[Upload to IPFS → Store Hash in DB & Smart Contract]   [Store File in DB Only]
   ↓
[Freelancer Completes Job]
   ↓
[Freelancer Confirms Transaction via Wallet]
   ↓
[Smart Contract: Set Job Status to Completed]
   ↓
[Notify Client]
   ↓
[End]
```

---

### ✅ Flow 3: Job Approval (with Fund Release)

```plaintext
[Start]
   ↓
[Client Reviews Submitted Work]
   ↓
[Client Approves Job]
   ↓
[Client Confirms Approval via Wallet]
   ↓
[Smart Contract: Set Job Status to Approved]
   ↓
[Smart Contract: Release Funds to Freelancer Wallet]
   ↓
[End]
```

---

### ⚖️ Flow 4: Dispute Voting

```plaintext
[Start]
   ↓
[Job is in Dispute?]
   ↓
[Yes]
   ↓
[Dispute Data Saved in Database]
   ↓
[Community Notified to Vote]
   ↓
[Voting Page → Users Vote on Case]
   ↓
[Choose Winner: Client or Freelancer]
   ↓
[Store Voting Result in Smart Contract]
   ↓
[Smart Contract Executes Escrow]
   ↓         ↓
[Release to Freelancer]   [Refund to Client]
   ↓
[End]
```

---

### 🧾 Flow: Transparency Dashboard

```plaintext
[Start]
   ↓
[System Reads Smart Contract Transactions]
   ↓
[Sync Transaction Data to Database]
   ↓
[Transparency Dashboard Shows History (Jobs, Escrow, Voting, etc.)]
   ↓
[End]
```

---

## ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/your-username/chain-gigs.git
cd chain-gigs

# Install dependencies (frontend)
cd frontend
npm install

# Install dependencies (contracts)
cd ../contracts
npm install

# Start local blockchain
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Run frontend
cd ../frontend
npm run dev
```

---

## 🔗 Usage

1. Connect your MetaMask wallet to `localhost:8545`.
2. Log in as a client and create a job.
3. Accept the job as a freelancer.
4. Submit work and complete the transaction on-chain.
5. Client approves and releases the funds automatically.
6. Use the dashboard to view smart contract activity.

---

## 🧱 Tech Stack

- **Frontend**: Vue.js / React with Vite  
- **Smart Contracts**: Solidity, deployed via Hardhat  
- **Blockchain Network**: Ethereum (localhost/testnet)  
- **Wallet Integration**: MetaMask  
- **Database**: MySQL (Laragon)  
- **IPFS**: Optional for file storage  

---

## 🔒 Smart Contract Events

- `JobCreated`
- `JobAccepted` / `JobRejected`
- `JobCompleted`
- `JobApproved`
- `JobDisputed`
- `VoteResultSubmitted`
- `EscrowReleased`

---

## 🖼️ Demo / Screenshots

Coming soon!

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

Don’t forget to ⭐ the repo if you like the project!

---

## 📬 Contact

Feel free to reach out for collaboration or feedback!

> Made with ❤️ by Alexandro Lucky Wibowo
