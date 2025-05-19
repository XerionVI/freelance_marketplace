import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { ethers } from "ethers";
import VotingDisputeResolutionABI from "../../abi/VotingDisputeResolutionABI";
import config from "../../config";

function DisputeList({ account }) {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [voteStats, setVoteStats] = useState({ votesForClient: 0, votesForFreelancer: 0 });
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchDisputes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${config.API_BASE_URL}/api/disputes`, {
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

  const enableVoting = async (disputeId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${config.API_BASE_URL}/api/disputes/enable-voting/${disputeId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDisputes((prev) =>
        prev.map((d) =>
          d.dispute_id === disputeId ? { ...d, resolved: 0 } : d
        )
      );
      alert("Voting enabled for this dispute.");
    } catch (err) {
      alert("Failed to enable voting.");
    }
  };

  // Show dispute details and voting modal
  const handleShowDetails = async (dispute) => {
    setSelectedDispute(dispute);
    setShowModal(true);

    // Fetch vote stats from contract
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        config.VOTING_DISPUTE_RESOLUTION_ADDRESS,
        VotingDisputeResolutionABI,
        provider
      );
      // You may need to adjust this call to match your contract's getDispute return values
      const [
        jobId, client, freelancer, description, voteCount, votesForClient, votesForFreelancer, resolved
      ] = await contract.getDispute(dispute.dispute_id);

      setVoteStats({
        votesForClient: Number(votesForClient),
        votesForFreelancer: Number(votesForFreelancer)
      });

      // Check if user has voted
      const voted = await contract.hasVoted(dispute.dispute_id, account);
      setHasVoted(voted);
    } catch (err) {
      setVoteStats({ votesForClient: 0, votesForFreelancer: 0 });
      setHasVoted(false);
    }
  };

  const handleVote = async (voteForClient) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        config.VOTING_DISPUTE_RESOLUTION_ADDRESS,
        VotingDisputeResolutionABI,
        signer
      );
      const tx = await contract.vote(selectedDispute.dispute_id, voteForClient);
      await tx.wait();
      alert("Vote cast successfully!");
      setHasVoted(true);
      // Optionally, refresh vote stats
      setVoteStats((prev) =>
        voteForClient
          ? { ...prev, votesForClient: prev.votesForClient + 1 }
          : { ...prev, votesForFreelancer: prev.votesForFreelancer + 1 }
      );
    } catch (err) {
      alert("Error casting vote.");
    }
  };

  if (loading) return <p>Loading disputes...</p>;
  const safeDisputes = Array.isArray(disputes) ? disputes : [];
  if (safeDisputes.length === 0) return <p>No disputes found.</p>;

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
            <th>Enable Voting</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {safeDisputes.map((dispute, idx) => (
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
                {dispute.resolved ? (
                  <Button
                    variant="warning"
                    onClick={() => enableVoting(dispute.dispute_id)}
                  >
                    Enable Voting
                  </Button>
                ) : (
                  <span className="text-info">Voting Enabled</span>
                )}
              </td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleShowDetails(dispute)}
                >
                  Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Dispute Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Dispute Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDispute && (
            <>
              <p><strong>Job ID:</strong> {selectedDispute.job_id}</p>
              <p><strong>Client:</strong> {selectedDispute.client}</p>
              <p><strong>Freelancer:</strong> {selectedDispute.freelancer}</p>
              <p><strong>Description:</strong> {selectedDispute.description}</p>
              <hr />
              <p>
                <strong>Votes for Client:</strong> {voteStats.votesForClient}<br />
                <strong>Votes for Freelancer:</strong> {voteStats.votesForFreelancer}
              </p>
              <p>
                <strong>Client %:</strong> {voteStats.votesForClient + voteStats.votesForFreelancer > 0
                  ? Math.round((voteStats.votesForClient / (voteStats.votesForClient + voteStats.votesForFreelancer)) * 100)
                  : 0
                }%
                <br />
                <strong>Freelancer %:</strong> {voteStats.votesForClient + voteStats.votesForFreelancer > 0
                  ? Math.round((voteStats.votesForFreelancer / (voteStats.votesForClient + voteStats.votesForFreelancer)) * 100)
                  : 0
                }%
              </p>
              {!selectedDispute.resolved && (
                hasVoted ? (
                  <p className="text-info">You have already voted.</p>
                ) : (
                  <>
                    <Button
                      variant="success"
                      className="me-2"
                      onClick={() => handleVote(true)}
                    >
                      Vote Client
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleVote(false)}
                    >
                      Vote Freelancer
                    </Button>
                  </>
                )
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DisputeList;