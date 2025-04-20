# 🛠️ Chain Gigs - Freelance Marketplace on Ethereum

**Chain Gigs** is a decentralized freelance marketplace that leverages the power of Ethereum blockchain to enable transparent, secure, and automated job contracts between clients and freelancers using cryptocurrency (ETH). It features on-chain job creation, escrow-based payments, dispute resolution via community voting, and file submission with optional IPFS support.

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

### 📌 Flow 1: Job Creation

```plaintext
[Start]
   ↓
[Client Fills Job Creation Form]
   ↓
[Job Data Saved to Database (description, deadline, cost, etc.)]
   ↓
[Blockchain Transaction: Create Job in Smart Contract]
   ↓
[Notification Sent to Freelancer]
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

### 📁 Flow 2: Upload Work File

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
[Notify Client]
   ↓
[Client Confirms Work?]
   ↓         ↓
[Yes]        [No]
   ↓             ↓
[Job Status: Completed]   [Dispute Submitted]
   ↓
[End]
```

---

### ⚖️ Flow 3: Dispute Voting

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
- `JobDisputed`
- `VoteResultSubmitted`
- `EscrowReleased`

---

## 📬 Contact

Feel free to reach out for collaboration or feedback!

> Made with ❤️ by Alexandro Lucky Wibowo
