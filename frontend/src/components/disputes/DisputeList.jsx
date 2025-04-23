import React from "react";
import { Card, Button } from "react-bootstrap";

const DisputeList = ({ disputes, account, votingDisputeResolution }) => {
  const handleVote = async (disputeId, voteForClient) => {
    try {
      await votingDisputeResolution.methods.vote(disputeId, voteForClient).send({ from: account });
      alert("Vote cast successfully!");
    } catch (error) {
      console.error("Error casting vote:", error);
      alert("Error casting vote. Please try again.");
    }
  };

  return (
    <div>
      <h2>Disputes</h2>
      {disputes.length === 0 ? (
        <p>No disputes to vote on.</p>
      ) : (
        disputes.map((dispute, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>Dispute #{index}</Card.Title>
              <Card.Text>
                <strong>Job ID:</strong> {dispute.jobId}
                <br />
                <strong>Client:</strong> {dispute.client}
                <br />
                <strong>Freelancer:</strong> {dispute.freelancer}
                <br />
                <strong>Description:</strong> {dispute.description}
                <br />
                <strong>Votes for Client:</strong> {dispute.votesForClient}
                <br />
                <strong>Votes for Freelancer:</strong> {dispute.votesForFreelancer}
              </Card.Text>
              <Button variant="success" onClick={() => handleVote(index, true)}>
                Vote for Client
              </Button>
              <Button variant="danger" onClick={() => handleVote(index, false)} className="ml-2">
                Vote for Freelancer
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default DisputeList;