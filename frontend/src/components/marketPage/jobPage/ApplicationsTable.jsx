import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

import { ethers } from "ethers";
import { getFreelanceEscrowContract } from "../../../utils/getContractInstance";
import config from "../../../config";
import ApplicationForms from "./ApplicationForms";

export default function ApplicationsTable({
  listingId,
  token,
  account,
  listing,
}) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hiring, setHiring] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editApp, setEditApp] = useState(null);
  const [hireDialogOpen, setHireDialogOpen] = useState(false);
  const [hireApp, setHireApp] = useState(null);
  const [hireAmount, setHireAmount] = useState("");

  useEffect(() => {
    if (!listingId) return;
    setLoading(true);
    fetch(`${config.API_BASE_URL}/api/applications/listing/${listingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setApplications(Array.isArray(data) ? data : []))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, [listingId, token, hiring, success, editDialogOpen]);

  // Helper: is current user the client?
  const isClient =
    account &&
    listing &&
    listing.client_address &&
    account.toLowerCase() === listing.client_address.toLowerCase();

  // Only show own application if not client
  const filteredApplications = isClient
    ? applications
    : applications.filter(
        (app) =>
          app.freelancer_address &&
          app.freelancer_address.toLowerCase() === account?.toLowerCase()
      );

  // Convert ISO string to MySQL DATETIME format
  function toMySQLDatetime(isoString) {
    if (!isoString) return null;
    return isoString.replace("T", " ").replace("Z", "").split(".")[0];
  }

  const openHireDialog = (app) => {
    setHireApp(app);
    setHireAmount(app.proposed_amount || "");
    setHireDialogOpen(true);
  };

  // Confirm hire with chosen amount
  const confirmHire = async () => {
    setHireDialogOpen(false);
    if (!hireApp) return;
    await handleHire(hireApp, hireAmount);
  };

  const handleReject = async (app) => {
    setHiring(app.application_id || app.id);
    setError("");
    setSuccess("");
    try {
      await fetch(
        `${config.API_BASE_URL}/api/applications/status/${
          app.application_id || app.id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Rejected" }),
        }
      );
      setSuccess("Application Rejected.");
      setHiring(null);
    } catch (e) {
      setError(e.message || "Failed to Reject application.");
      setHiring(null);
    }
  };

  // Hire logic with contract call
  const handleHire = async (app, customAmount) => {
    setHiring(app.application_id || app.id);
    setError("");
    setSuccess("");
    try {
      if (!window.ethereum) throw new Error("No wallet found.");
      if (!ethers.isAddress(app.freelancer_address))
        throw new Error("Invalid freelancer address.");
      if (!listing || !listing.client_address)
        throw new Error("Listing or client missing.");
      const amountToUse = customAmount || app.proposed_amount;
      if (!amountToUse) throw new Error("No proposed amount.");

      const contract = await getFreelanceEscrowContract();
      const signer = contract.runner;
      if (!signer) throw new Error("No signer found. Connect your wallet.");

      const tx = await contract.createJob(app.freelancer_address, {
        value: ethers.parseEther(amountToUse.toString()),
      });
      const receipt = await tx.wait();

      const eventFilter = contract.filters.JobCreated();
      const events = await contract.queryFilter(
        eventFilter,
        receipt.blockNumber,
        "latest"
      );
      if (!events.length) throw new Error("No JobCreated event found.");
      const { jobId, amount: eventAmount } = events[0].args;
      const contractJobId = Number(jobId);

      const res = await fetch(`${config.API_BASE_URL}/api/jobs/createFull`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contractJobId,
          client: listing.client_address,
          freelancer: app.freelancer_address,
          amount: ethers.formatEther(eventAmount),
          blockNumber: events[0].blockNumber,
          transactionHash: events[0].transactionHash,
          status: "Pending",
          job_type: "ClientToFreelancer",
          title: listing.title,
          description: listing.description,
          categoryId: listing.category_id,
          deadline: toMySQLDatetime(listing.deadline),
          deliveryFormat: listing.delivery_format,
          timezone: listing.timezone,
          cover_letter: app.cover_letter,
        }),
      });
      if (!res.ok)
        throw new Error("Failed to save job and details to database.");

      await fetch(
        `${config.API_BASE_URL}/api/applications/status/${
          app.application_id || app.id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ application_status: "Accepted" }),
        }
      );

      setSuccess("Job created and freelancer hired!");
      setHiring(null);
    } catch (e) {
      setError(e.message || "Failed to hire freelancer.");
      setHiring(null);
    }
  };

  const handleDelete = async (app) => {
    setError("");
    setSuccess("");
    try {
      await fetch(
        `${config.API_BASE_URL}/api/applications/${app.application_id || app.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Application deleted.");
    } catch (e) {
      setError(e.message || "Failed to delete application.");
    }
  };

  const handleEdit = (app) => {
    setEditApp(app);
    setEditDialogOpen(true);
  };

  const handleEditApplied = () => {
    setEditDialogOpen(false);
    setSuccess("Application updated.");
  };

  if (loading) return <CircularProgress sx={{ my: 2 }} />;
  if (!filteredApplications.length)
    return (
      <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
        No applications found.
      </Typography>
    );

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Freelancer</TableCell>
              <TableCell>Proposed Amount</TableCell>
              <TableCell>Cover Letter</TableCell>
              <TableCell>Attachment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplications.map((app, idx) => (
              <TableRow
                key={
                  app.id || app.application_id || app.freelancer_address || idx
                }
              >
                <TableCell>
                  <Chip label={app.freelancer_address} size="small" />
                </TableCell>
                <TableCell>{app.proposed_amount} ETH</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ maxWidth: 200, whiteSpace: "pre-line" }}
                  >
                    {app.cover_letter}
                  </Typography>
                </TableCell>
                <TableCell>
                  {app.attachments ? (
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        href={`${
                          config.API_BASE_URL
                        }/api/applications/download/${
                          app.id || app.application_id
                        }`}
                        target="_blank"
                      >
                        Download
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        href={`${
                          config.API_BASE_URL
                        }/api/applications/preview/${
                          app.id || app.application_id
                        }`}
                        target="_blank"
                      >
                        Preview
                      </Button>
                    </Stack>
                  ) : (
                    <Chip label="No File" size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                  {app.application_status === "Accepted" ? (
                    <Chip label="Hired" color="success" size="small" />
                  ) : app.application_status === "Rejected" ? (
                    <Chip label="Rejected" color="error" size="small" />
                  ) : (
                    <Chip
                      label={app.application_status || "Pending"}
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {isClient && app.application_status === "Pending" && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        disabled={hiring === (app.application_id || app.id)}
                        onClick={() => openHireDialog(app)}
                        sx={{ mr: 1 }}
                      >
                        Hire
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        disabled={hiring === (app.application_id || app.id)}
                        onClick={() => handleReject(app)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {!isClient &&
                    app.freelancer_address &&
                    app.freelancer_address.toLowerCase() === account?.toLowerCase() &&
                    app.application_status === "Pending" && (
                      <>
                        <Button
                          color="primary"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(app)}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(app)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ApplicationForms
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        listing={listing}
        account={account}
        token={token}
        onApplied={handleEditApplied}
        editMode={true}
        initialValues={editApp || {}}
        applicationId={editApp?.application_id || editApp?.id}
      />
      {/* Hire Amount Dialog */}
      <Dialog open={hireDialogOpen} onClose={() => setHireDialogOpen(false)}>
        <DialogTitle>Set Amount to Hire</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount (ETH)"
            type="number"
            value={hireAmount}
            onChange={e => setHireAmount(e.target.value)}
            fullWidth
            inputProps={{ min: 0, step: "0.0001" }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHireDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={confirmHire}
            disabled={!hireAmount || Number(hireAmount) <= 0}
          >
            Confirm Hire
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}