import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Modal } from "react-bootstrap";
import { ethers } from "ethers";
import VotingDisputeResolutionABI from "../../abi/VotingDisputeResolutionABI";
import config from "../../config";
import axios from "axios";

function DisputeVoteList({ account }) {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votedStatus, setVotedStatus] = useState({});
  const [voting, setVoting] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [voteStats, setVoteStats] = useState({ votesForClient: 0, votesForFreelancer: 0 });

  useEffect(() => {
    const fetchDisputes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        console.log("token", token);
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

  if (loading) return <p>Loading voteable disputes...</p>;
  if (disputes.length === 0) return <p>No voteable disputes found.</p>;

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
                votedStatus[selectedDispute.dispute_id] ? (
                  <p className="text-info">You have already voted.</p>
                ) : (
                  <>
                    <Button
                      variant="success"
                      className="me-2"
                      onClick={() => castVote(selectedDispute.dispute_id, true)}
                      disabled={voting[selectedDispute.dispute_id]}
                    >
                      {voting[selectedDispute.dispute_id] ? <Spinner size="sm" /> : "Vote Client"}
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => castVote(selectedDispute.dispute_id, false)}
                      disabled={voting[selectedDispute.dispute_id]}
                    >
                      {voting[selectedDispute.dispute_id] ? <Spinner size="sm" /> : "Vote Freelancer"}
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

export default DisputeVoteList;