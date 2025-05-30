import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import axios from "axios";
import config from "../../config";

const DisputeModal = ({
  show,
  onHide,
  selectedDispute,
  voteStats,
  votedStatus,
  voting,
  castVote,
  isAdmin,
  resolving,
  handleResolveDispute,
  account,
}) => {
  const [clientArgument, setClientArgument] = useState("");
  const [freelancerArgument, setFreelancerArgument] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedDispute) {
      setClientArgument(selectedDispute.client_argument || "");
      setFreelancerArgument(selectedDispute.freelancer_argument || "");
      setEditing(false);
    }
  }, [selectedDispute]);

  const handleSaveArguments = async () => {
    setSaving(true);
    try {
      await axios.patch(
        `${config.API_BASE_URL}/api/disputes/arguments/${selectedDispute.dispute_id}`,
        {
          client_argument: clientArgument,
          freelancer_argument: freelancerArgument,
        }
      );
      setEditing(false);
    } catch (err) {
      alert("Failed to save arguments.");
    }
    setSaving(false);
  };

  const isClient = account && selectedDispute && account.toLowerCase() === selectedDispute.client.toLowerCase();
  const isFreelancer = account && selectedDispute && account.toLowerCase() === selectedDispute.freelancer.toLowerCase();

  return (
    <Modal show={show} onHide={onHide}>
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
            <Form.Group className="mb-3">
              <Form.Label><strong>Client Argument</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={clientArgument}
                onChange={e => setClientArgument(e.target.value)}
                disabled={!editing || !isClient}
                placeholder="Client's argument"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label><strong>Freelancer Argument</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={freelancerArgument}
                onChange={e => setFreelancerArgument(e.target.value)}
                disabled={!editing || !isFreelancer}
                placeholder="Freelancer's argument"
              />
            </Form.Group>
            {(isClient || isFreelancer) && (
              <div className="mb-3">
                {!editing ? (
                  <Button variant="outline-primary" onClick={() => setEditing(true)}>
                    Edit
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    onClick={handleSaveArguments}
                    disabled={saving}
                  >
                    {saving ? <Spinner size="sm" /> : "Save"}
                  </Button>
                )}
              </div>
            )}
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
              <>
                {votedStatus[selectedDispute.dispute_id] ? (
                  <p className="text-info">You have already voted.</p>
                ) : (
                  <div>
                    <Button
                      variant="success"
                      className="me-2 mb-2"
                      onClick={() => castVote(selectedDispute.dispute_id, true)}
                      disabled={voting[selectedDispute.dispute_id]}
                    >
                      {voting[selectedDispute.dispute_id] ? <Spinner size="sm" /> : "Vote Client"}
                    </Button>
                    <Button
                      variant="primary"
                      className="mb-2"
                      onClick={() => castVote(selectedDispute.dispute_id, false)}
                      disabled={voting[selectedDispute.dispute_id]}
                    >
                      {voting[selectedDispute.dispute_id] ? <Spinner size="sm" /> : "Vote Freelancer"}
                    </Button>
                  </div>
                )}
                {isAdmin && (
                  <div className="d-grid mt-3">
                    <Button
                      variant="danger"
                      onClick={() => handleResolveDispute(selectedDispute.dispute_id)}
                      disabled={resolving}
                    >
                      {resolving ? <Spinner size="sm" /> : "End Voting & Resolve"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DisputeModal;