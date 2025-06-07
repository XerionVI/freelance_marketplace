const DisputeResolutionABI = [
	{
      "inputs": [
        {
          "internalType": "address",
          "name": "_votingModule",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_escrowAddress",
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
          "indexed": true,
          "internalType": "uint256",
          "name": "disputeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "client",
          "type": "address"
        },
        {
          "indexed": true,
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
      "name": "DisputeCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "disputeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "DisputeResolved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "disputeId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum DisputeResolution.DisputeStatus",
          "name": "status",
          "type": "uint8"
        }
      ],
      "name": "DisputeStatusChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "disputeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "party",
          "type": "address"
        }
      ],
      "name": "EvidenceSubmitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "disputeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "FundsReleased",
      "type": "event"
    },
    {
      "inputs": [
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
          "internalType": "uint256",
          "name": "votingDuration",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        }
      ],
      "name": "createDispute",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "disputeCount",
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
      "name": "disputes",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "disputeId",
          "type": "uint256"
        },
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
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "votingEndTime",
          "type": "uint256"
        },
        {
          "internalType": "enum DisputeResolution.DisputeStatus",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "fundsReleased",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "clientEvidenceSubmitted",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "freelancerEvidenceSubmitted",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "escrowAddress",
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
          "name": "disputeId",
          "type": "uint256"
        }
      ],
      "name": "getDispute",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
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
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "votingEndTime",
          "type": "uint256"
        },
        {
          "internalType": "enum DisputeResolution.DisputeStatus",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "fundsReleased",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "clientEvidenceSubmitted",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "freelancerEvidenceSubmitted",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getDisputeCount",
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
          "name": "disputeId",
          "type": "uint256"
        }
      ],
      "name": "getDisputeStatusAndWinner",
      "outputs": [
        {
          "internalType": "enum DisputeResolution.DisputeStatus",
          "name": "",
          "type": "uint8"
        },
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
      "name": "getDisputesByJobId",
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
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "jobToDisputes",
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
          "name": "disputeId",
          "type": "uint256"
        }
      ],
      "name": "resolveDispute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_escrowAddress",
          "type": "address"
        }
      ],
      "name": "setEscrowAddress",
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
      "name": "setFundsReleased",
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
      "name": "startVoting",
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
      "name": "submitEvidence",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingModule",
      "outputs": [
        {
          "internalType": "contract IVotingModule",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
export default DisputeResolutionABI;
  