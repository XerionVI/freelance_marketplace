import React, { useState } from "react";
import { getFreelanceEscrowContract } from "../utils/FreelanceEscrow";
import { Button, Form, Alert } from "react-bootstrap";

function ReleaseFunds() {
    const [jobId, setJobId] = useState("");
    const [message, setMessage] = useState("");

    const handleRelease = async () => {
        const contract = getFreelanceEscrowContract();
        if (!contract) return;

        try {
            const tx = await contract.releaseFunds(jobId);
            await tx.wait();
            setMessage(`Funds released for Job ${jobId} successfully!`);
        } catch (error) {
            console.error("Release failed:", error);
            setMessage("Release failed. Check console for details.");
        }
    };

    return (
        <div>
            <h5>Release Funds</h5>
            <Form>
                <Form.Group controlId="jobId">
                    <Form.Label>Job ID</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter job ID"
                        value={jobId}
                        onChange={(e) => setJobId(e.target.value)}
                    />
                </Form.Group>
                <Button variant="warning" onClick={handleRelease} className="mt-3">
                    Release Funds
                </Button>
            </Form>
            {message && <Alert className="mt-3">{message}</Alert>}
        </div>
    );
}

export default ReleaseFunds;
