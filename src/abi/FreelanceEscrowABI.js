const FreelanceEscrowABI = [
	{
		"anonymous": false,
		"inputs": [
		  {
			"indexed": false,
			"internalType": "uint256",
			"name": "jobId",
			"type": "uint256"
		  },
		  {
			"indexed": false,
			"internalType": "address",
			"name": "client",
			"type": "address"
		  }
		],
		"name": "JobApproved",
		"type": "event"
	  },
	  {
		"anonymous": false,
		"inputs": [
		  {
			"indexed": false,
			"internalType": "uint256",
			"name": "jobId",
			"type": "uint256"
		  },
		  {
			"indexed": false,
			"internalType": "address",
			"name": "freelancer",
			"type": "address"
		  }
		],
		"name": "JobCompleted",
		"type": "event"
	  },
	  {
		"anonymous": false,
		"inputs": [
		  {
			"indexed": false,
			"internalType": "uint256",
			"name": "jobId",
			"type": "uint256"
		  },
		  {
			"indexed": false,
			"internalType": "address",
			"name": "client",
			"type": "address"
		  },
		  {
			"indexed": false,
			"internalType": "address",
			"name": "freelancer",
			"type": "address"
		  },
		  {
			"indexed": false,
			"internalType": "uint256",
			"name": "amount",
			"type": "uint256"
		  }
		],
		"name": "JobCreated",
		"type": "event"
	  },
	  {
		"stateMutability": "payable",
		"type": "fallback"
	  },
	  {
		"inputs": [
		  {
			"internalType": "uint256",
			"name": "jobId",
			"type": "uint256"
		  }
		],
		"name": "approveJob",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "uint256",
			"name": "jobId",
			"type": "uint256"
		  }
		],
		"name": "completeJob",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address",
			"name": "_freelancer",
			"type": "address"
		  }
		],
		"name": "createJob",
		"outputs": [
		  {
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		  }
		],
		"stateMutability": "payable",
		"type": "function"
	  },
	  {
		"inputs": [],
		"name": "jobCount",
		"outputs": [
		  {
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		  }
		],
		"name": "jobs",
		"outputs": [
		  {
			"internalType": "address",
			"name": "client",
			"type": "address"
		  },
		  {
			"internalType": "address",
			"name": "freelancer",
			"type": "address"
		  },
		  {
			"internalType": "uint256",
			"name": "amount",
			"type": "uint256"
		  },
		  {
			"internalType": "enum FreelanceEscrow.JobStatus",
			"name": "status",
			"type": "uint8"
		  }
		],
		"stateMutability": "view",
		"type": "function"
	  },
	  {
		"stateMutability": "payable",
		"type": "receive"
	  }
	// (Include the rest of your ABI array here)
  ];
  
  export default FreelanceEscrowABI;
  