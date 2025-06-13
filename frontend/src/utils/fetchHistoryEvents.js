import { formatEther } from "ethers";
import {
  getFreelanceEscrowContract,
  getDisputeResolutionContract,
} from "./getContractInstance";

const DISPUTE_STATUS_MAP = {
  0: "Open",
  1: "Voting",
  2: "Resolved",
  3: "Cancelled",
};

// Helper to get block timestamp for each event
async function addBlockTimestamp(provider, events) {
  const blockCache = {};
  for (const e of events) {
    if (!e.blockNumber) continue;
    if (!blockCache[e.blockNumber]) {
      const block = await provider.getBlock(e.blockNumber);
      blockCache[e.blockNumber] = block.timestamp;
    }
    e.blockTimestamp = blockCache[e.blockNumber];
  }
  return events;
}

async function getGasInfo(provider, txHash) {
  const receipt = await provider.getTransactionReceipt(txHash);
  const tx = await provider.getTransaction(txHash);
  if (!receipt || !tx) return null;
  const gasUsed = receipt.gasUsed?.toString() || "0";
  const gasPrice = tx.gasPrice?.toString() || "0";
  const fee = BigInt(gasUsed) * BigInt(gasPrice);
  return {
    gasUsed,
    gasPrice,
    fee: formatEther(fee.toString()),
  };
}

export async function fetchHistoryEvents() {
  const escrow = await getFreelanceEscrowContract();
  const dispute = await getDisputeResolutionContract();
  if (!escrow || !dispute) return [];

  const provider = escrow.runner?.provider || escrow.provider;

  // Fetch all relevant events
  const [
    jobCreated,
    jobAccepted,
    jobDeclined,
    jobCompleted,
    jobApproved,
    disputeInitiated,
    disputeCreated,
    disputeStatusChanged,
    votingEnabled,
    disputeResolved,
    fundsReleased,
    evidenceSubmitted,
    disputeFundsReleased,
  ] = await Promise.all([
    escrow.queryFilter("JobCreated"),
    escrow.queryFilter("JobAccepted"),
    escrow.queryFilter("JobDeclined"),
    escrow.queryFilter("JobCompleted"),
    escrow.queryFilter("JobApproved"),
    escrow.queryFilter("DisputeInitiated"),
    dispute.queryFilter("DisputeCreated"),
    dispute.queryFilter("DisputeStatusChanged"),
    dispute.queryFilter("VotingEnabled"),
    dispute.queryFilter("DisputeResolved"),
    dispute.queryFilter("FundsReleased"),
    dispute.queryFilter("EvidenceSubmitted"),
    escrow.queryFilter("DisputeFundsReleased"),
  ]);

  // Add block timestamps for sorting and display
  await Promise.all([
    addBlockTimestamp(provider, jobCreated),
    addBlockTimestamp(provider, jobAccepted),
    addBlockTimestamp(provider, jobDeclined),
    addBlockTimestamp(provider, jobCompleted),
    addBlockTimestamp(provider, jobApproved),
    addBlockTimestamp(provider, disputeInitiated),
    addBlockTimestamp(provider, disputeCreated),
    addBlockTimestamp(provider, disputeStatusChanged),
    addBlockTimestamp(provider, votingEnabled),
    addBlockTimestamp(provider, disputeResolved),
    addBlockTimestamp(provider, fundsReleased),
    addBlockTimestamp(provider, evidenceSubmitted),
    addBlockTimestamp(provider, disputeFundsReleased),
  ]);

  // Map events to UI format
  const events = [
    ...jobCreated.map((e) => ({
      id: `job-${e.args.jobId.toString()}`,
      type: "job",
      title: "Job Created",
      time: new Date(e.blockTimestamp * 1000).toUTCString(),
      details: {
        jobId: "#" + e.args.jobId.toString(),
        amount: `${formatEther(e.args.amount)} ETH`,
        status: "created",
        client: e.args.client,
        freelancer: e.args.freelancer,
        tx: e.transactionHash,
        block: "#" + e.blockNumber,
      },
    })),
    ...jobAccepted.map((e) => ({
      id: `job-${e.args.jobId.toString()}-accepted`,
      type: "job",
      title: "Job Accepted",
      time: new Date(e.blockTimestamp * 1000).toUTCString(),
      details: {
        jobId: "#" + e.args.jobId.toString(),
        freelancer: e.args.freelancer,
        client: e.args.client,
        status: "accepted",
        tx: e.transactionHash,
        block: "#" + e.blockNumber,
      },
    })),
    ...jobDeclined.map((e) => ({
      id: `job-${e.args.jobId.toString()}-declined`,
      type: "job",
      title: "Job Declined",
      time: new Date(e.blockTimestamp * 1000).toUTCString(),
      details: {
        jobId: "#" + e.args.jobId.toString(),
        freelancer: e.args.freelancer,
        client: e.args.client,
        status: "declined",
        tx: e.transactionHash,
        block: "#" + e.blockNumber,
      },
    })),
    ...jobCompleted.map((e) => ({
      id: `job-${e.args.jobId.toString()}-completed`,
      type: "job",
      title: "Job Completed",
      time: new Date(e.blockTimestamp * 1000).toUTCString(),
      details: {
        jobId: "#" + e.args.jobId.toString(),
        freelancer: e.args.freelancer,
        client: e.args.client,
        status: "completed",
        tx: e.transactionHash,
        block: "#" + e.blockNumber,
      },
    })),
    ...jobApproved.map((e) => ({
      id: `job-${e.args.jobId.toString()}-approved`,
      type: "payment",
      title: "Payment Released",
      time: new Date(e.blockTimestamp * 1000).toUTCString(),
      details: {
        jobId: "#" + e.args.jobId.toString(),
        recipient: e.args.freelancer,
        client: e.args.client,
        status: "approved",
        tx: e.transactionHash,
        block: "#" + e.blockNumber,
      },
    })),
    ...disputeInitiated.map((e) => ({
      id: `dispute-${(e.args?.disputeId ?? "unknown").toString()}`,
      type: "dispute",
      title: "Dispute Initiated",
      time: new Date(e.blockTimestamp * 1000).toUTCString(),
      details: {
        jobId: "#" + (e.args?.jobId ?? "unknown").toString(),
        disputeId: "#" + (e.args?.disputeId ?? "unknown").toString(),
        client: e.args?.client ?? "",
        freelancer: e.args?.freelancer ?? "",
        amount: e.args?.amount ? `${formatEther(e.args.amount)} ETH` : "",
        status: "initiated",
        tx: e.transactionHash,
        block: "#" + e.blockNumber,
      },
    })),
    ...disputeCreated.map((e) => ({
      id: `dispute-${(e.args?.disputeId ?? "unknown").toString()}-created`,
      type: "dispute",
      title: "Dispute Created",
      time: new Date(e.blockTimestamp * 1000).toUTCString(),
      details: {
        disputeId: "#" + (e.args?.disputeId ?? "unknown").toString(),
        client: e.args?.client ?? "",
        freelancer: e.args?.freelancer ?? "",
        amount: e.args?.amount ? `${formatEther(e.args.amount)} ETH` : "",
        jobId: "#" + (e.args?.jobId ?? "unknown").toString(),
        status: "open",
        tx: e.transactionHash,
        block: "#" + e.blockNumber,
      },
    })),
    ...disputeStatusChanged.map((e) => ({
      id: `dispute-${(e.args?.disputeId ?? "unknown").toString()}-status`,
      type: "dispute",
      title: "Dispute Status Changed",
      time: new Date(e.blockTimestamp * 1000).toUTCString(),
      details: {
        disputeId: "#" + (e.args?.disputeId ?? "unknown").toString(),
        status:
          e.args?.status !== undefined
            ? DISPUTE_STATUS_MAP[e.args.status.toString()] ||
              e.args.status.toString()
            : "",
        tx: e.transactionHash,
        block: "#" + e.blockNumber,
      },
    })),
    ...votingEnabled.map((e) => ({
      id: `dispute-${(
        e.args?.disputeId ?? "unknown"
      ).toString()}-voting-enabled`,
      type: "dispute",
      title: "Voting Enabled",
      time: new Date(e.blockTimestamp * 1000).toUTCString(),
      details: {
        disputeId: "#" + (e.args?.disputeId ?? "unknown").toString(),
        votingEndTime: e.args?.votingEndTime
          ? new Date(Number(e.args.votingEndTime) * 1000).toUTCString()
          : undefined,
        tx: e.transactionHash,
        block: "#" + e.blockNumber,
      },
    })),
    ...disputeResolved.map((e) => ({
      id: `dispute-${(e.args?.disputeId ?? "unknown").toString()}-resolved`,
      type: "dispute",
      title: "Dispute Resolved",
      time: new Date(e.blockTimestamp * 1000).toUTCString(),
      details: {
        disputeId: "#" + (e.args?.disputeId ?? "unknown").toString(),
        winner: e.args?.winner ?? "",
        amount: e.args?.amount ? `${formatEther(e.args.amount)} ETH` : "",
        jobId: "#" + (e.args?.jobId ?? "unknown").toString(),
        status: "resolved",
        tx: e.transactionHash,
        block: "#" + e.blockNumber,
      },
    })),
    ...fundsReleased.map((e) => ({
      id: `dispute-${(e.args?.disputeId ?? "unknown").toString()}-funds`,
      type: "dispute",
      title: "Dispute Funds Released",
      time: new Date(e.blockTimestamp * 1000).toUTCString(),
      details: {
        disputeId: "#" + (e.args?.disputeId ?? "unknown").toString(),
        recipient: e.args?.recipient ?? "",
        amount: e.args?.amount ? `${formatEther(e.args.amount)} ETH` : "",
        jobId: "#" + (e.args?.jobId ?? "unknown").toString(),
        status: "fundsReleased",
        tx: e.transactionHash,
        block: "#" + e.blockNumber,
      },
    })),
    ...evidenceSubmitted.map((e) => ({
      id: `dispute-${(e.args?.disputeId ?? "unknown").toString()}-evidence-${
        e.args?.party ?? "unknown"
      }`,
      type: "dispute",
      title: "Evidence Submitted",
      time: new Date(e.blockTimestamp * 1000).toUTCString(),
      details: {
        disputeId: "#" + (e.args?.disputeId ?? "unknown").toString(),
        party: e.args?.party ?? "",
        jobId: "#" + (e.args?.jobId ?? "unknown").toString(),
        status: "evidenceSubmitted",
        tx: e.transactionHash,
        block: "#" + e.blockNumber,
      },
    })),
    ...disputeFundsReleased.map((e) => ({
      id: `dispute-${(
        e.args?.disputeId ?? "unknown"
      ).toString()}-funds-released`,
      type: "dispute",
      title: "Dispute Funds Released",
      time: new Date(e.blockTimestamp * 1000).toUTCString(),
      details: {
        disputeId: "#" + (e.args?.disputeId ?? "unknown").toString(),
        recipient: e.args?.recipient ?? "",
        amount: e.args?.amount ? `${formatEther(e.args.amount)} ETH` : "",
        jobId: "#" + (e.args?.jobId ?? "unknown").toString(),
        status: "fundsReleased",
        tx: e.transactionHash,
        block: "#" + e.blockNumber,
      },
    })),
  ];

  // Fetch gas info for each event and add to details
  await Promise.all(
    events.map(async (event) => {
      const gas = await getGasInfo(provider, event.details.tx);
      if (gas) {
        event.details.gas = `${gas.gasUsed} units | ${
          Number(gas.gasPrice) / 1e9
        } gwei | ${gas.fee} ETH`;
      } else {
        event.details.gas = "N/A";
      }
    })
  );

  // Sort by time descending
  return events.sort((a, b) => (a.time < b.time ? 1 : -1));
}
