import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import config from "../../config";

function DisputeList({ account }) {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

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
      // Refresh list
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

  if (loading) return <p>Loading disputes...</p>;

// Ensure disputes is always an array
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
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default DisputeList;