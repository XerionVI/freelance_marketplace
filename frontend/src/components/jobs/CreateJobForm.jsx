import React, { useState } from "react";
import { ethers } from "ethers";
import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  CircularProgress,
  MenuItem,
  Stack,
  Checkbox,
  FormControlLabel,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TimezoneSelect from "react-timezone-select";
import { format } from "date-fns";
import categoryData from "../shared/jsonData/category.js"; // adjust path if needed

import { getFreelanceEscrowContract } from "../../utils/getContractInstance"; // updated import

import config from "../../config";

const deliveryFormatOptions = [
  { value: ".pdf", label: "PDF (.pdf)" },
  { value: ".zip", label: "ZIP Archive (.zip)" },
  { value: ".mp4", label: "Video (.mp4)" },
  { value: ".fig", label: "Figma (.fig)" },
  { value: "other", label: "Other (specify below)" },
];

function CreateJobForm({ account, freelancerAddress, onJobCreated, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [deadline, setDeadline] = useState(null);
  const [deliveryFormat, setDeliveryFormat] = useState("");
  const [deliveryFormatOther, setDeliveryFormatOther] = useState("");
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCreateJob = async () => {
    setIsLoading(true);
    setMessage("");
    setError("");
    try {
      // Validate required fields
      if (!ethers.isAddress(freelancerAddress)) {
        setError("Invalid freelancer address.");
        setIsLoading(false);
        return;
      }
      if (!title || !description || !amount || !categoryId) {
        setError("Please fill all required fields.");
        setIsLoading(false);
        return;
      }
      if (isNaN(amount) || parseFloat(amount) <= 0) {
        setError("Amount must be a positive number.");
        setIsLoading(false);
        return;
      }

      // 1. Create the job on the blockchain (only necessary data)
      const contract = await getFreelanceEscrowContract(); // no account param needed
      const tx = await contract.createJob(freelancerAddress, {
        value: ethers.parseEther(amount),
      });
      const receipt = await tx.wait();

      // 2. Fetch the JobCreated event from the transaction receipt
      const eventFilter = contract.filters.JobCreated();
      const events = await contract.queryFilter(
        eventFilter,
        receipt.blockNumber,
        "latest"
      );
      if (!events.length) {
        setError("No JobCreated event found.");
        setIsLoading(false);
        return;
      }
      const { jobId, client, freelancer, amount: eventAmount } = events[0].args;
      const contractJobId = Number(jobId);

      // 3. Save the job and job_details to the database in one request
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated.");
        setIsLoading(false);
        return;
      }
      const res = await fetch(`${config.API_BASE_URL}/api/jobs/createFull`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contractJobId,
          client: account,
          freelancer: freelancerAddress,
          amount: ethers.formatEther(eventAmount),
          blockNumber: events[0].blockNumber,
          transactionHash: events[0].transactionHash,
          status: "Pending",

          job_type: "ClientToFreelancer",
          title,
          description,
          categoryId,
          deadline: deadline ? format(deadline, "yyyy-MM-dd") : null,
          deliveryFormat:
            deliveryFormat === "other" ? deliveryFormatOther : deliveryFormat,
          timezone: timezone || null,
        }),
      });
      if (!res.ok) {
        setError("Failed to save job and details to database.");
        setIsLoading(false);
        return;
      }
      const jobData = await res.json();

      setMessage("Job created and saved!");
      if (typeof onJobCreated === "function")
        onJobCreated({ jobId: jobData.jobId, contractJobId });
      if (typeof onClose === "function") onClose();
    } catch (error) {
      console.error("Error creating job:", error);
      setError("Job creation failed. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Create New Job
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        {/* Freelancer Address (hidden, from prop) */}
        <input type="hidden" value={freelancerAddress} readOnly />
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          margin="normal"
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Amount (ETH)"
          variant="outlined"
          margin="normal"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <TextField
          select
          fullWidth
          label="Category"
          variant="outlined"
          margin="normal"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          {categoryData.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.category_name}
            </MenuItem>
          ))}
        </TextField>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Deadline"
            value={deadline}
            onChange={(newValue) => setDeadline(newValue)}
            slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
          />
        </LocalizationProvider>
        <FormControl fullWidth margin="normal">
          <InputLabel id="delivery-format-label">Delivery Format</InputLabel>
          <Select
            labelId="delivery-format-label"
            value={deliveryFormat}
            label="Delivery Format"
            onChange={(e) => setDeliveryFormat(e.target.value)}
          >
            {deliveryFormatOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {deliveryFormat === "other" && (
          <TextField
            fullWidth
            label="Specify Other Format"
            variant="outlined"
            margin="normal"
            value={deliveryFormatOther}
            onChange={(e) => setDeliveryFormatOther(e.target.value)}
          />
        )}
        <Box sx={{ my: 2 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: "block" }}>
            Timezone
          </label>
          <TimezoneSelect
            value={timezone}
            onChange={(tz) =>
              setTimezone(typeof tz === "string" ? tz : tz.value)
            }
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateJob}
          disabled={isLoading}
          fullWidth
          sx={{ mt: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Create Job"}
        </Button>
      </Box>
      {message && (
        <Alert severity="success" sx={{ mt: 3 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

export default CreateJobForm;
