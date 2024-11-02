import React, { useState } from "react";
import { getFreelanceEscrowContract } from "../utils/FreelanceEscrow";
import { Button, Form, Alert } from "react-bootstrap";
import { ethers } from "ethers";

function DepositForm() {
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");

    const handleDeposit = async () => {
        const contract = getFreelanceEscrowContract();
        if (!contract) return;

        try {
            const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
            await tx.wait();
            setMessage("Funds deposited successfully!");
        } catch (error) {
            console.error("Deposit failed:", error);
            setMessage("Deposit failed. Check console for details.");
        }
    };

    return (
        <>
            <h5>Deposit Funds</h5>
            <Form>
                <Form.Group controlId="depositAmount">
                    <Form.Label>Amount in ETH</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter amount in ETH"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleDeposit} className="mt-3">
                    Deposit
                </Button>
            </Form>
            {message && <Alert className="mt-3">{message}</Alert>}
        </>
    );
}

export default DepositForm;
