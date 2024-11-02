import React, { useState } from "react";
import { getFreelanceEscrowContract } from "../utils/FreelanceEscrow.js";
import { Button, Alert } from "react-bootstrap";

function WithdrawButton() {
    const [message, setMessage] = useState("");

    const handleWithdraw = async () => {
        const contract = getFreelanceEscrowContract();
        if (!contract) return;

        try {
            const tx = await contract.releaseFunds();
            await tx.wait();
            setMessage("Funds released to freelancer successfully!");
        } catch (error) {
            console.error("Withdrawal failed:", error);
            setMessage("Withdrawal failed. Check console for details.");
        }
    };

    return (
        <>
            <h5>Withdraw Funds</h5>
            <Button variant="warning" onClick={handleWithdraw}>
                Withdraw Funds
            </Button>
            {message && <Alert className="mt-3">{message}</Alert>}
        </>
    );
}

export default WithdrawButton;
