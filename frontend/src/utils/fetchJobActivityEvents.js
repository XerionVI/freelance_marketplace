import { getFreelanceEscrowContract } from "./getContractInstance";
import { formatEther } from "ethers";

export async function fetchJobActivityEvents(contractJobId) {
  const contract = await getFreelanceEscrowContract();
  if (!contract) return [];

  // Fetch all events (no filter by jobId)
  const [
    jobCreated,
    jobAccepted,
    jobDeclined,
    jobCompleted,
    jobApproved,
    disputeInitiated,
    disputeFundsReleased,
  ] = await Promise.all([
    contract.queryFilter("JobCreated"),
    contract.queryFilter("JobAccepted"),
    contract.queryFilter("JobDeclined"),
    contract.queryFilter("JobCompleted"),
    contract.queryFilter("JobApproved"),
    contract.queryFilter("DisputeInitiated"),
    contract.queryFilter("DisputeFundsReleased"),
  ]);

  // Add block timestamps for sorting and display
  const provider = contract.runner?.provider || contract.provider;
  async function addBlockTimestamp(events) {
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
  await Promise.all([
    addBlockTimestamp(jobCreated),
    addBlockTimestamp(jobAccepted),
    addBlockTimestamp(jobDeclined),
    addBlockTimestamp(jobCompleted),
    addBlockTimestamp(jobApproved),
    addBlockTimestamp(disputeInitiated),
    addBlockTimestamp(disputeFundsReleased),
  ]);

  // Filter and map events for this job
  const jobIdStr = contractJobId.toString();
  const events = [
    ...jobCreated
      .filter(e => e.args.jobId.toString() === jobIdStr)
      .map(e => ({
        name: "JobCreated",
        label: "Job Created",
        icon: "Description",
        blockTimestamp: e.blockTimestamp,
        args: e.args,
        blockNumber: e.blockNumber,
        transactionHash: e.transactionHash,
      })),
    ...jobAccepted
      .filter(e => e.args.jobId.toString() === jobIdStr)
      .map(e => ({
        name: "JobAccepted",
        label: "Job Accepted",
        icon: "CheckCircle",
        blockTimestamp: e.blockTimestamp,
        args: e.args,
        blockNumber: e.blockNumber,
        transactionHash: e.transactionHash,
      })),
    ...jobDeclined
      .filter(e => e.args.jobId.toString() === jobIdStr)
      .map(e => ({
        name: "JobDeclined",
        label: "Job Declined",
        icon: "ErrorOutline",
        blockTimestamp: e.blockTimestamp,
        args: e.args,
        blockNumber: e.blockNumber,
        transactionHash: e.transactionHash,
      })),
    ...jobCompleted
      .filter(e => e.args.jobId.toString() === jobIdStr)
      .map(e => ({
        name: "JobCompleted",
        label: "Job Completed",
        icon: "CheckCircle",
        blockTimestamp: e.blockTimestamp,
        args: e.args,
        blockNumber: e.blockNumber,
        transactionHash: e.transactionHash,
      })),
    ...jobApproved
      .filter(e => e.args.jobId.toString() === jobIdStr)
      .map(e => ({
        name: "JobApproved",
        label: "Job Approved",
        icon: "MonetizationOn",
        blockTimestamp: e.blockTimestamp,
        args: e.args,
        blockNumber: e.blockNumber,
        transactionHash: e.transactionHash,
      })),
    ...disputeInitiated
      .filter(e => e.args.jobId.toString() === jobIdStr)
      .map(e => ({
        name: "DisputeInitiated",
        label: "Dispute Initiated",
        icon: "ErrorOutline",
        blockTimestamp: e.blockTimestamp,
        args: e.args,
        blockNumber: e.blockNumber,
        transactionHash: e.transactionHash,
      })),
    ...disputeFundsReleased
      .filter(e => e.args.jobId.toString() === jobIdStr)
      .map(e => ({
        name: "DisputeFundsReleased",
        label: "Dispute Funds Released",
        icon: "MonetizationOn",
        blockTimestamp: e.blockTimestamp,
        args: e.args,
        blockNumber: e.blockNumber,
        transactionHash: e.transactionHash,
        recipient: e.args.recipient,
        amount: e.args.amount ? `${formatEther(e.args.amount)} ETH` : "",
        disputeId: e.args.disputeId?.toString() ?? "",
      })),
  ];

  // Sort by block/time ascending
  events.sort((a, b) => (a.blockTimestamp || 0) - (b.blockTimestamp || 0));
  return events;
}