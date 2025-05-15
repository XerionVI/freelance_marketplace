import React, { useEffect, useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { ethers } from "ethers";
import VotingDisputeResolutionABI from "../../abi/VotingDisputeResolutionABI";
import config from "../../config";
import axios from "axios";

function DisputeVoteList({ account }) {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votedStatus, setVotedStatus] = useState({});
  const [voting, setVoting] = useState({});

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
                {dispute.resolved ? (
                  <span className="text-muted">Voting closed</span>
                ) : votedStatus[dispute.dispute_id] ? (
                  <span className="text-info">You have voted</span>
                ) : (
                  <>
                    <Button
                      variant="success"
                      className="me-2"
                      onClick={() => castVote(dispute.dispute_id, true)}
                      disabled={voting[dispute.dispute_id]}
                    >
                      {voting[dispute.dispute_id] ? <Spinner size="sm" /> : "Vote Client"}
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => castVote(dispute.dispute_id, false)}
                      disabled={voting[dispute.dispute_id]}
                    >
                      {voting[dispute.dispute_id] ? <Spinner size="sm" /> : "Vote Freelancer"}
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default DisputeVoteList;