import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Card,
  Paper,
  Stack,
  Tabs,
  Tab,
  Chip,
  Divider,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import {
  ArrowBack,
  Person,
  Group,
  MonetizationOn,
  Description,
  CalendarToday,
  AccessTime,
  Category as CategoryIcon,
  CloudUpload,
  Edit,
  ErrorOutline,
  CheckCircle,
  Download,
  Visibility,
} from "@mui/icons-material";

import axios from "axios";
import config from "../../../config.js";
import NotesModal from "../../notes/NotesModal.jsx";
import JobDetails from "./JobDetails";
import UploadedFiles from "../../files/UploadedFiles.jsx";
import UploadFileSection from "../../files/UploadFileSection.jsx";
import categoryData from "../../shared/jsonData/category.js";
import JobBlockDetails from "./JobBlockDetails";
import JobActivityTimeLine from "./JobActivityTimeLine";

import DisputeForm from "../../disputes/DisputeForm"; // Add this import at the top

import { getFreelanceEscrowContract } from "../../../utils/getContractInstance"; // updated import
import { ethers } from "ethers";
import FreelanceEscrowABI from "../../../abi/FreelanceEscrowABI.js";

function getCategoryName(category_id) {
  const found = categoryData.find(
    (cat) => String(cat.id) === String(category_id)
  );
  return found ? found.category_name : "Uncategorized";
}

function StatusBadge({ status }) {
  const statusMap = {
    Accepted: { color: "success", icon: <CheckCircle fontSize="small" /> },
    Pending: { color: "warning", icon: <ErrorOutline fontSize="small" /> },
    Declined: { color: "error", icon: <ErrorOutline fontSize="small" /> },
    Completed: { color: "primary", icon: <CheckCircle fontSize="small" /> },
    Disputed: { color: "secondary", icon: <ErrorOutline fontSize="small" /> },
  };
  const { color, icon } = statusMap[status] || statusMap["Pending"];
  return (
    <Chip
      icon={icon}
      label={status}
      color={color}
      variant="outlined"
      sx={{ fontWeight: 500, fontSize: 14, px: 1.5 }}
    />
  );
}

function JobDetailsPage({ account, token }) {
  const { jobId } = useParams();
  const navigate = useNavigate();
  //native variables
  const [jobDetails, setJobDetails] = useState(null);
  const [jobFiles, setJobFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");
  const [newNote, setNewNote] = useState("");
  const [onChainJob, setOnChainJob] = useState(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);

  //function state variables
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [onChainLoading, setOnChainLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [tab, setTab] = useState(0);

  console.log("Account on job page:", account);

  const normalizedAccount = account ? ethers.getAddress(account) : "";
  console.log("Normalized Account on job page:", normalizedAccount);
  // Fetch job details and files on mount/jobId change
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}/api/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Wallet-Address": account,
            },
          }
        );

        if (response.status === 200) {
          const {
            client,
            freelancer,
            Jobtitle,
            description,
            category_id,
            deadline,
            delivery_format,
            timezone,
            amount,
            status,
            contractJobId,
            job_id,
            on_dispute,
            created_at,
          } = response.data;

          const normalizedJobDetails = {
            title: Jobtitle || "Untitled",
            description: description || "Description not provided",
            category_id: getCategoryName(category_id),
            deadline: deadline
              ? new Date(deadline).toLocaleDateString()
              : "No deadline set",
            delivery_format: delivery_format || "Not specified",
            timezone: timezone || "Not specified",
            created_at: created_at
              ? new Date(created_at).toLocaleDateString()
              : "Not specified",
            client: client ? ethers.getAddress(client) : "",
            freelancer: freelancer ? ethers.getAddress(freelancer) : "",
            amount: amount || "-",
            status: status || "-",
            contractJobId: contractJobId,
            job_id: job_id || "-",
            on_dispute: on_dispute,
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
        const response = await axios.get(
          `${config.API_BASE_URL}/api/files/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Wallet-Address": account,
            },
          }
        );

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

  // Fetch on-chain job data when modal is opened
 useEffect(() => {
  const fetchOnChainJob = async () => {
    if (
      !blockModalOpen ||
      jobDetails?.contractJobId === null ||
      jobDetails?.contractJobId === undefined ||
      !account
    )
      return;
    setOnChainLoading(true);
    try {
      const contract = await getFreelanceEscrowContract();
      const job = await contract.jobs(jobDetails.contractJobId);
      setOnChainJob({
        jobId: jobDetails.contractJobId,
        client: job.client,
        freelancer: job.freelancer,
        amount: ethers.formatEther(job.amount),
        status: Number(job.status),
        title: jobDetails.title,
        description: jobDetails.description,
        deadline: jobDetails.deadline,
      });
    } catch (err) {
      setOnChainJob(null);
    } finally {
      setOnChainLoading(false);
    }
  };
  fetchOnChainJob();
}, [blockModalOpen, jobDetails?.contractJobId, account]);

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "uploadedBy",
        account === jobDetails.client ? "Client" : "Freelancer"
      );

      const response = await axios.post(
        `${config.API_BASE_URL}/api/files/upload/${jobId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
      const response = await axios.get(
        `${config.API_BASE_URL}/api/notes/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleAcceptJob = async () => {
    setIsLoading(true);
    try {
      const contract = await getFreelanceEscrowContract();
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
        setJobDetails((prevDetails) => ({
          ...prevDetails,
          status: "Accepted",
        }));
        setSnackbar({
          open: true,
          message: "Job accepted successfully!",
          severity: "success",
        });
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
      const contract = await getFreelanceEscrowContract();
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
        setJobDetails((prevDetails) => ({
          ...prevDetails,
          status: "Declined",
        }));
        setSnackbar({
          open: true,
          message: "Job declined successfully!",
          severity: "success",
        });
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
      const contract = await getFreelanceEscrowContract();
      const contractJobId = jobDetails.contractJobId;
      const jobOnChain = await contract.getJobDetails(contractJobId);
      const tx = await contract.completeJob(contractJobId);
      await tx.wait();

      // Update status in the database
      const response = await axios.patch(
        `${config.API_BASE_URL}/api/jobs/${jobId}`,
        { status: "Completed" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
        }
      );
      if (response.status === 200) {
        setJobDetails((prevDetails) => ({
          ...prevDetails,
          status: "Completed",
        }));
        setSnackbar({
          open: true,
          message: "Job marked as completed successfully!",
          severity: "success",
        });
      }
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
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        config.CONTRACT_ADDRESS,
        FreelanceEscrowABI,
        signer
      );

      // Use contractJobId for contract call
      const contractJobId = jobDetails.contractJobId;
      console.log("Approving job with contractJobId:", contractJobId);

      const tx = await contract.approveJob(contractJobId);
      const receipt = await tx.wait(); // Only wait ONCE

      console.log("Transaction approve receipt:", receipt);

      // Update status in the database
      const response = await axios.patch(
        `${config.API_BASE_URL}/api/jobs/${jobId}`,
        { status: "Approved" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
        }
      );
      if (response.status === 200) {
        setJobDetails((prevDetails) => ({
          ...prevDetails,
          status: "Approved",
        }));
        setSnackbar({
          open: true,
          message: "Job Approved and payment released successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error approving job:", error);
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

  const handleOpenDisputeModal = () => setDisputeModalOpen(true);
  const handleCloseDisputeModal = () => setDisputeModalOpen(false);

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

  if (isLoading || !jobDetails) {
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
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 1100,
          mx: "auto",
          p: { xs: 2, md: 4 },
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(31,38,135,0.15)",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            variant="text"
            onClick={() => navigate(-1)}
            sx={{ color: "text.secondary" }}
          >
            Back to Jobs
          </Button>
          <Divider orientation="vertical" flexItem />
          <Typography variant="body2" color="text.secondary">
            Job ID: {jobDetails.job_id}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <StatusBadge status={jobDetails.status} />
        </Stack>

        {/* Job Header */}
        <Box sx={{ mb: 4 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {jobDetails.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {jobDetails.description}
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                sx={{ mb: 2, flexWrap: "wrap" }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarToday fontSize="small" />
                  <Typography variant="body2">
                    Created:{" "}
                    {jobDetails.created_at
                      ? new Date(jobDetails.created_at).toLocaleDateString()
                      : "-"}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTime fontSize="small" />
                  <Typography variant="body2">
                    Deadline: {jobDetails.deadline || "-"}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CategoryIcon fontSize="small" />
                  <Typography variant="body2">
                    Category: {jobDetails.category_id || "-"}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                {(jobDetails.skills || []).map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Stack>
            </Box>
            <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
              <Typography variant="h3" fontWeight="bold" color="success.main">
                {jobDetails.amount} ETH
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Budget
              </Typography>
              <Button
                variant="outlined"
                color="info"
                sx={{ mt: 2 }}
                onClick={() => setBlockModalOpen(true)}
              >
                View Blockchain Info
              </Button>
            </Box>
          </Stack>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: 3 }}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Overview" />
          {/* Only show Files tab if status is NOT Pending */}
          {jobDetails.status !== "Pending" &&
            jobDetails.status !== "Declined" && <Tab label="Files" />}
          <Tab label="Activity" />
        </Tabs>

        {/* Tab Content */}
        {tab === 0 && <JobDetails jobDetails={jobDetails} />}

        {/* Only show Files tab content if status is NOT Pending */}
        {jobDetails.status !== "Pending" &&
          jobDetails.status !== "Declined" &&
          tab === 1 && (
            <Box>
              <UploadFileSection
                handleFileUpload={handleFileUpload}
                setFile={setFile}
                message={message}
              />
              <UploadedFiles
                jobFiles={jobFiles}
                handleShowNotes={handleShowNotes}
              />
              <NotesModal
                show={showNotesModal}
                onHide={() => setShowNotesModal(false)}
                notes={notes}
                newNote={newNote}
                setNewNote={setNewNote}
                handleAddNote={handleAddNote}
              />
            </Box>
          )}

        {tab === 2 && (
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Activity Timeline
            </Typography>
            <JobActivityTimeLine contractJobId={jobDetails.contractJobId} />
          </Paper>
        )}

        {/* Action Buttons */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mt: 5 }}
        >
          <Button
            variant="outlined"
            startIcon={<Edit />}
            color="primary"
            // onClick={handleEditJob}
            disabled={!!jobDetails.on_dispute}
          >
            Edit Job (notfix)
          </Button>
          <Stack direction="row" spacing={2}>
            {/* If job is on dispute, show warning and disable all status update buttons */}
            {!!jobDetails.on_dispute ? (
              <>
                <Button
                  variant="contained"
                  color="warning"
                  disabled
                  startIcon={<ErrorOutline />}
                >
                  Job On Dispute
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ErrorOutline />}
                  disabled
                >
                  Raise Dispute
                </Button>
              </>
            ) : (
              <>
                {jobDetails.status === "Pending" &&
                  account?.toLowerCase() !==
                    jobDetails.client?.toLowerCase() && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleAcceptJob}
                        disabled={isLoading}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDeclineJob}
                        disabled={isLoading}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                {jobDetails.status === "Accepted" && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={handleCompleteJob}
                    disabled={isLoading}
                  >
                    Complete
                  </Button>
                )}
                {jobDetails.status === "Completed" &&
                  account &&
                  account.toLowerCase() ===
                    jobDetails.client?.toLowerCase() && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleApproveJob}
                      disabled={isLoading}
                    >
                      Approve
                    </Button>
                  )}
                {jobDetails.status !== "Pending" && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<ErrorOutline />}
                    onClick={handleOpenDisputeModal}
                    disabled={!!jobDetails.on_dispute}
                  >
                    Raise Dispute
                  </Button>
                )}
              </>
            )}
          </Stack>
        </Stack>

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
        {/* Dispute Modal */}
        <DisputeForm
          open={disputeModalOpen}
          onClose={handleCloseDisputeModal}
          jobDetails={jobDetails}
          account={account}
          token={token}
          onDisputeRaised={() => {
            setSnackbar({
              open: true,
              message: "Dispute raised successfully!",
              severity: "success",
            });
            setDisputeModalOpen(false);
          }}
        />
        {/* Job Block Details Modal */}
        <JobBlockDetails
          open={blockModalOpen}
          onClose={() => setBlockModalOpen(false)}
          jobBlockData={onChainJob}
          loading={onChainLoading}
          jobDetails={jobDetails} // pass for title/description/deadline fallback
        />
      </Card>
    </Box>
  );
}

export default JobDetailsPage;
