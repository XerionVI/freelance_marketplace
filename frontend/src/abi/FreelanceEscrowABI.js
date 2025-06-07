const FreelanceEscrowABI = [
	{
      "inputs": [
        {
          "internalType": "address",
          "name": "_disputeResolutionAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
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
          "internalType": "uint256",
          "name": "disputeId",
          "type": "uint256"
        }
      ],
      "name": "DisputeInitiated",
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
      "name": "JobAccepted",
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
      "name": "JobDeclined",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        }
      ],
      "name": "acceptJob",
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        }
      ],
      "name": "declineJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "disputeResolution",
      "outputs": [
        {
          "internalType": "contract DisputeResolution",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllJobIds",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
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
      "name": "getJobDetails",
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "votingDuration",
          "type": "uint256"
        }
      ],
      "name": "initiateDispute",
      "outputs": [],
      "stateMutability": "nonpayable",
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
      "name": "jobIds",
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
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
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
      "name": "releaseDisputedFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "disputeId",
          "type": "uint256"
        }
      ],
      "name": "resolveDispute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  
  export default FreelanceEscrowABI;
  