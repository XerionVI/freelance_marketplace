import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

function AddressDetails({ address, onClose }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balanceWei = await provider.getBalance(address);
        setBalance(ethers.formatEther(balanceWei));
      } catch (error) {
        console.error("Error fetching address details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [address]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "5px",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h5>Address Details</h5>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p>
              <strong>Address:</strong> {address}
            </p>
            <p>
              <strong>Balance:</strong> {balance} ETH
            </p>
          </div>
        )}
        <button
          className="btn btn-secondary"
          onClick={onClose}
          style={{ marginTop: "10px" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default AddressDetails;
