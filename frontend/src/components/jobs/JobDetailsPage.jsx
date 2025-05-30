import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import axios from "axios";
import config from "../../config";
import NotesModal from "../files/NotesModal";
import JobDetails from "./JobDetails";
import UploadedFiles from "./UploadedFiles";
import UploadFileSection from "./UploadFileSection";
import { getFreelanceEscrowContract } from "../../utils/getFreelanceEscrow";
import { ethers } from "ethers";
import FreelanceEscrowABI from "../../abi/FreelanceEscrowABI";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function JobDetailsPage({ account, token }) {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [jobFiles, setJobFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [dispute, setDispute] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });

  console.log("Account on job page:", account);

  const normalizedAccount = account ? ethers.getAddress(account) : "";
  console.log("Normalized Account on job page:", normalizedAccount);
  // Fetch job details and files on mount/jobId change
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
        });

        if (response.status === 200) {
          const { client, freelancer, ...rest } = response.data;
          const normalizedJobDetails = {
            ...rest,
            client: client ? ethers.getAddress(client) : "",
            freelancer: freelancer ? ethers.getAddress(freelancer) : "",
          };
          setJobDetails(normalizedJobDetails);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchJobFiles = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/files/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
        });

        if (response.status === 200) {
          setJobFiles(response.data);
        }
      } catch (error) {
        console.error("Error fetching job files:", error);
      }
    };

    fetchJobDetails();
    fetchJobFiles();
  }, [jobId, account, token]);

  // Fetch dispute only after jobDetails is loaded and has contractJobId
  useEffect(() => {
    const fetchDispute = async () => {
      if (!jobDetails || !jobDetails.contractJobId) {
        setDispute(null);
        return;
      }
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/disputes/job/${jobDetails.contractJobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
        });
        if (response.status === 200 && response.data) {
          setDispute(response.data);
        } else {
          setDispute(null);
        }
      } catch (error) {
        setDispute(null);
      }
    };

    fetchDispute();
  }, [jobDetails, account, token]);




  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadedBy", account === jobDetails.client ? "Client" : "Freelancer");

      const response = await axios.post(`${config.API_BASE_URL}/api/files/upload/${jobId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Wallet-Address": account,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setMessage("File uploaded successfully!");
        setJobFiles((prevFiles) => [...prevFiles, response.data]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleShowNotes = async (fileId) => {
    setSelectedFileId(fileId);
    setShowNotesModal(true);

    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/notes/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handlePreviewFile = (fileUrl) => {
    setPreviewFile(fileUrl);
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  const handleAcceptJob = async () => {
    setIsLoading(true);
    try {
      const contract = await getFreelanceEscrowContract(normalizedAccount);
      const contractJobId = jobDetails.contractJobId;
      const tx = await contract.acceptJob(contractJobId);
      await tx.wait();

      // Update status in the database
      const response = await axios.patch(
        `${config.API_BASE_URL}/api/jobs/${jobId}`,
        { status: "Accepted" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
        }
      );
      if (response.status === 200) {
        setJobDetails((prevDetails) => ({ ...prevDetails, status: "Accepted" }));
        setSnackbar({ open: true, message: "Job accepted successfully!", severity: "success" });
      }
    } catch (error) {
      console.error("Error accepting job:", error);
      let errorMsg = "Error accepting job. Please try again.";
      if (error && error.message) {
        if (error.shortMessage) {
          errorMsg = error.shortMessage;
        } else if (error.info && error.info.error && error.info.error.message) {
          errorMsg = error.info.error.message;
        } else {
          errorMsg = error.message;
        }
      }
      setSnackbar({ open: true, message: errorMsg, severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineJob = async () => {
    setIsLoading(true);
    try {
      const contract = await getFreelanceEscrowContract(normalizedAccount);
      const contractJobId = jobDetails.contractJobId;
      const tx = await contract.declineJob(contractJobId);
      await tx.wait();

      // Update status in the database
      const response = await axios.patch(
        `${config.API_BASE_URL}/api/jobs/${jobId}`,
        { status: "Declined" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": normalizedAccount,
          },
        }
      );
      if (response.status === 200) {
        setJobDetails((prevDetails) => ({ ...prevDetails, status: "Declined" }));
        setSnackbar({ open: true, message: "Job declined successfully!", severity: "success" });
      }
    } catch (error) {
      console.error("Error declining job:", error);
      let errorMsg = "Error declining job. Please try again.";
      if (error && error.message) {
        if (error.shortMessage) {
          errorMsg = error.shortMessage;
        } else if (error.info && error.info.error && error.info.error.message) {
          errorMsg = error.info.error.message;
        } else {
          errorMsg = error.message;
        }
      }
      setSnackbar({ open: true, message: errorMsg, severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteJob = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const contract = await getFreelanceEscrowContract(normalizedAccount);
      const contractJobId = jobDetails.contractJobId;
      const jobOnChain = await contract.getJobDetails(contractJobId);
      const tx = await contract.completeJob(contractJobId);
      await tx.wait();
      setMessage("Job marked as completed successfully!");
      setSnackbar({ open: true, message: "Job marked as completed successfully!", severity: "success" });
    } catch (error) {
      console.error("Error completing job:", error);
      let errorMsg = "Error completing job. Please try again.";
      if (error && error.message) {
        if (error.shortMessage) {
          errorMsg = error.shortMessage;
        } else if (error.info && error.info.error && error.info.error.message) {
          errorMsg = error.info.error.message;
        } else {
          errorMsg = error.message;
        }
      }
      setSnackbar({ open: true, message: errorMsg, severity: "error" });
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveJob = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceBefore = await provider.getBalance(jobDetails.freelancer);
      console.log("Freelancer balance before:", ethers.formatEther(balanceBefore));
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(config.CONTRACT_ADDRESS, FreelanceEscrowABI, signer);

      // Use contractJobId for contract call
      const contractJobId = jobDetails.contractJobId;
      console.log("Approving job with contractJobId:", contractJobId);
      const tx = await contract.approveJob(contractJobId);
      await tx.wait();
      const receipt = await tx.wait();
      console.log("approve Recipt: ", receipt);

      const balanceAfter = await provider.getBalance(jobDetails.freelancer);
      console.log("Freelancer balance after:", ethers.formatEther(balanceAfter));

      setSnackbar({ open: true, message: "Job approved and payment released successfully!", severity: "success" });
    } catch (error) {
      console.error("Error approving job:", error);
      // Try to extract a meaningful error message
      let errorMsg = "Error approving job. Please try again.";
      if (error && error.message) {
        if (error.shortMessage) {
          errorMsg = error.shortMessage;
        } else if (error.info && error.info.error && error.info.error.message) {
          errorMsg = error.info.error.message;
        } else {
          errorMsg = error.message;
        }
      }
      setSnackbar({ open: true, message: errorMsg, severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRaiseDispute = async () => {
    try {
      const description = prompt("Describe the reason for the dispute:");
      if (!description) return;

      // 1. Call the smart contract to raise the dispute
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        config.CONTRACT_ADDRESS, // FreelanceEscrow contract address
        FreelanceEscrowABI,
        signer
      );
      // Call the contract function (adjust if your function signature is different)
      const tx = await contract.initiateDispute(jobDetails.contractJobId, description);
      const receipt = await tx.wait();

      // Get the disputeId from the event logs (assuming event DisputeInitiated(jobId, disputeId))
      let disputeId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          if (parsed.name === "DisputeInitiated") {
            disputeId = parsed.args.disputeId.toString();
            break;
          }
        } catch (e) { }
      }

      if (!disputeId) {
        alert("Dispute raised on-chain, but could not get disputeId from event.");
        return;
      }

      // 2. Save the dispute in your backend/database
      const response = await axios.post(`${config.API_BASE_URL}/api/disputes`, {
        jobId: jobDetails.contractJobId,
        client: jobDetails.client,
        freelancer: jobDetails.freelancer,
        description,
        disputeId, // Save the on-chain disputeId for mapping
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Wallet-Address": normalizedAccount,
        },
      });

      if (response.status === 200) {
        alert("Dispute raised successfully!");
        setDispute(response.data);
      }
    } catch (error) {
      alert("Error raising dispute.");
      console.error(error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const addedBy = account === jobDetails.client ? "Client" : "Freelancer";

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/notes/${selectedFileId}`,
        { note: newNote, addedBy },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setNotes((prevNotes) => [
          ...prevNotes,
          { note: newNote, added_by: addedBy, added_at: new Date() },
        ]);
        setNewNote("");
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading job details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <JobDetails jobDetails={jobDetails} />
      {/* --- Dispute Info --- */}
      {dispute && (
        <Box sx={{ mb: 2, p: 2, border: "1px solid #fbc02d", borderRadius: 2, background: "#fffde7" }}>
          <Typography variant="subtitle1" color="warning.main">
            Dispute Raised
          </Typography>
          <Typography variant="body2">
            <strong>Description:</strong> {dispute.description}
          </Typography>
          <Typography variant="body2">
            <strong>Status:</strong> {dispute.resolved ? "Resolved" : "Open"}
          </Typography>
        </Box>
      )}
      {/* --- Raise Dispute Button --- */}
      {(jobDetails.status === "Accepted" || jobDetails.status === "Completed") &&
        (normalizedAccount.toLowerCase() === jobDetails.client.toLowerCase() ||
          normalizedAccount.toLowerCase() === jobDetails.freelancer.toLowerCase()) &&
        !dispute && (
          <Button
            variant="contained"
            color="warning"
            sx={{ mb: 2 }}
            onClick={handleRaiseDispute}
          >
            Raise Dispute
          </Button>
        )}

      {jobDetails.status === "Pending" &&
        account.toLowerCase() === jobDetails.freelancer.toLowerCase() && (
          <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAcceptJob}
            >
              Accept Job
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeclineJob}
            >
              Decline Job
            </Button>
          </Box>
        )}

      {jobDetails.status === "Accepted" && (
        <>
          <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
            {/* Show "Complete Job" button if the logged-in account is the freelancer */}
            {normalizedAccount.toLowerCase() === jobDetails.freelancer.toLowerCase() && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleCompleteJob}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Complete Job"}
              </Button>
            )}

            {/* Show "Approve Job" button if the logged-in account is the client */}
            {normalizedAccount.toLowerCase() === jobDetails.client.toLowerCase() && (
              <Button
                variant="contained"
                color="success"
                onClick={handleApproveJob}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Approve Job"}
              </Button>
            )}

          </Box>

          <UploadedFiles
            jobFiles={jobFiles}
            handleShowNotes={handleShowNotes}
            handlePreviewFile={handlePreviewFile}
          />

          <UploadFileSection
            handleFileUpload={handleFileUpload}
            setFile={setFile}
            message={message}
          />

          <NotesModal
            show={showNotesModal}
            onHide={() => setShowNotesModal(false)}
            notes={notes}
            newNote={newNote}
            setNewNote={setNewNote}
            handleAddNote={handleAddNote}
          />
        </>
      )}

      {previewFile && (
        <Modal open={Boolean(previewFile)} onClose={closePreview}>
          <Box sx={{ p: 4, backgroundColor: "white", maxWidth: "80%", margin: "auto" }}>
            {previewFile.endsWith(".pdf") ? (
              <iframe src={previewFile} width="100%" height="500px" title="File Preview"></iframe>
            ) : (
              <img src={previewFile} alt="Preview" style={{ maxWidth: "100%" }} />
            )}
            <Button onClick={closePreview} sx={{ mt: 2 }}>
              Close
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
}

export default JobDetailsPage;