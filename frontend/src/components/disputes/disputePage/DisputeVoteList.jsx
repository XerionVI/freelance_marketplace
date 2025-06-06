import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Modal } from "react-bootstrap";
import { ethers } from "ethers";
import VotingDisputeResolutionABI from "../../abi/VotingDisputeResolutionABI";
import config from "../../../config";
import axios from "axios";
import FreelanceEscrowABI from "../../../abi/FreelanceEscrowABI";
import DisputeModal from "./DisputeModal";

const ADMIN_ADDRESS = config.ADMIN_ADDRESS;

function DisputeVoteList({ account }) {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votedStatus, setVotedStatus] = useState({});
  const [voting, setVoting] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [voteStats, setVoteStats] = useState({ votesForClient: 0, votesForFreelancer: 0 });
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    const fetchDisputes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${config.API_BASE_URL}/api/disputes/voteable`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDisputes(response.data);
      } catch (err) {
        setDisputes([]);
      }
      setLoading(false);
    };
    fetchDisputes();
  }, []);

  useEffect(() => {
    const fetchVotedStatus = async () => {
      if (!account || disputes.length === 0) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          config.VOTING_DISPUTE_RESOLUTION_ADDRESS,
          VotingDisputeResolutionABI,
          provider
        );
        const status = {};
        for (const dispute of disputes) {
          status[dispute.dispute_id] = await contract.hasVoted(dispute.dispute_id, account);
        }
        setVotedStatus(status);
      } catch (err) {
        setVotedStatus({});
      }
    };
    fetchVotedStatus();
  }, [account, disputes]);

  const handleShowDetails = async (dispute) => {
    setSelectedDispute(dispute);
    setShowModal(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        config.VOTING_DISPUTE_RESOLUTION_ADDRESS,
        VotingDisputeResolutionABI,
        provider
      );
      const [
        jobId, client, freelancer, description, voteCount, votesForClient, votesForFreelancer, resolved
      ] = await contract.getDispute(dispute.dispute_id);

      setVoteStats({
        votesForClient: Number(votesForClient),
        votesForFreelancer: Number(votesForFreelancer)
      });
    } catch (err) {
      setVoteStats({ votesForClient: 0, votesForFreelancer: 0 });
    }
  };

  const castVote = async (disputeId, voteForClient) => {
    setVoting((prev) => ({ ...prev, [disputeId]: true }));
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        config.VOTING_DISPUTE_RESOLUTION_ADDRESS,
        VotingDisputeResolutionABI,
        signer
      );
      const tx = await contract.vote(disputeId, voteForClient);
      await tx.wait();
      alert("Vote cast successfully!");
      setVotedStatus((prev) => ({ ...prev, [disputeId]: true }));
      // Optionally refresh vote stats
      if (selectedDispute && selectedDispute.dispute_id === disputeId) {
        setVoteStats((prev) =>
          voteForClient
            ? { ...prev, votesForClient: prev.votesForClient + 1 }
            : { ...prev, votesForFreelancer: prev.votesForFreelancer + 1 }
        );
      }
    } catch (error) {
      alert("Error casting vote. See console for details.");
      console.error(error);
    }
    setVoting((prev) => ({ ...prev, [disputeId]: false }));
  };

  const handleResolveDispute = async (disputeId) => {
    setResolving(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const escrowContract = new ethers.Contract(
        config.CONTRACT_ADDRESS,
        FreelanceEscrowABI,
        signer
      );
      const tx = await escrowContract.resolveDispute(disputeId);
      await tx.wait();

      // Call backend to mark as resolved
      await axios.patch(
        `${config.API_BASE_URL}/api/disputes/mark-resolved/${disputeId}`
      );

      alert("Dispute resolved!");
      setDisputes((prev) =>
        prev.map((d) =>
          d.dispute_id === disputeId ? { ...d, resolved: 1 } : d
        )
      );
      setShowModal(false);
    } catch (err) {
      alert("Error resolving dispute. See console for details.");
      console.error(err);
    }
    setResolving(false);
  };

  if (loading) return <p>Loading voteable disputes...</p>;
  if (disputes.length === 0) return <p>No voteable disputes found.</p>;

  const isAdmin = account && account.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

  return (
    <div className="table-responsive">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Job ID</th>
            <th>Client</th>
            <th>Freelancer</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {disputes.map((dispute, idx) => (
            <tr key={dispute.dispute_id}>
              <td>{idx + 1}</td>
              <td>{dispute.job_id}</td>
              <td>{dispute.client}</td>
              <td>{dispute.freelancer}</td>
              <td>{dispute.description}</td>
              <td>
                {dispute.resolved ? (
                  <span className="text-success">Resolved</span>
                ) : (
                  <span className="text-warning">Open</span>
                )}
              </td>
              <td>
                <Button
                  variant="info"
                  className="me-2"
                  onClick={() => handleShowDetails(dispute)}
                >
                  Details & Vote
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Dispute Details Modal */}
      <DisputeModal
        show={showModal}
        onHide={() => setShowModal(false)}
        selectedDispute={selectedDispute}
        voteStats={voteStats}
        votedStatus={votedStatus}
        voting={voting}
        castVote={castVote}
        isAdmin={isAdmin}
        resolving={resolving}
        handleResolveDispute={handleResolveDispute}
        account={account}
      />
    </div>
  );
}

export default DisputeVoteList;