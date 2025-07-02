import React, { useState } from "react";
import {
  Stack,
  Typography,
  Button,
  Chip,
  Box,
  Paper,
  Input,
  Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import Link from "@mui/material/Link";
import { getDisputeResolutionContract } from "../../../utils/getContractInstance";

function DisputeEvidenceSection({
  disputeId,
  evidence,
  onUploaded,
  token,
  account,
  dispute,
}) {
  const [uploading, setUploading] = useState(false);

  // Determine party type and permission
  let partyType = null;
  let canUpload = false;
  if (dispute) {
    if (
      account &&
      dispute.client_address &&
      account.toLowerCase() === dispute.client_address.toLowerCase()
    ) {
      partyType = "client";
      canUpload = true;
    } else if (
      account &&
      dispute.freelancer_address &&
      account.toLowerCase() === dispute.freelancer_address.toLowerCase()
    ) {
      partyType = "freelancer";
      canUpload = true;
    }
  }

  const handleEvidenceUpload = async (e) => {
  const file = e.target.files[0];
  if (!file || !canUpload || !partyType) return;
  setUploading(true);
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("dispute_id", disputeId);
    formData.append("party_type", partyType);

    // 1. Upload evidence to backend
    await fetch(`/api/evidence/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Wallet-Address": account,
      },
      body: formData,
    });

    // 2. Call smart contract to update on-chain evidence status
    const contract = await getDisputeResolutionContract();
    const tx = await contract.submitEvidence(disputeId);
    await tx.wait();

    // 3. Update backend dispute evidence status
    await fetch(`/api/disputes/submit-evidence/${disputeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ party_type: partyType }), // "client" or "freelancer"
    });

    onUploaded();
  } catch (err) {
    alert("Failed to upload evidence or update status: " + (err?.message || err));
  }
  setUploading(false);
};

  return (
    <Stack spacing={3}>
      <Typography variant="h6" fontWeight="bold">
        Evidence
      </Typography>
      <Stack spacing={2}>
        {(!evidence || evidence.length === 0) && (
          <Typography variant="body2" color="text.secondary">
            No evidence uploaded yet.
          </Typography>
        )}
        {evidence &&
          evidence.map((ev) => (
            <Paper
              key={ev.id}
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200",
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={ev.party_type === "client" ? "Client" : "Freelancer"}
                color={ev.party_type === "client" ? "primary" : "success"}
                size="small"
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {ev.file_name}
              </Typography>
              {ev.description && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontStyle: "italic", mx: 1 }}
                >
                  {ev.description}
                </Typography>
              )}
              <Button
                size="small"
                startIcon={<DownloadIcon />}
                component={Link}
                href={`/api/evidence/download/${ev.id}`}
                target="_blank"
                sx={{ ml: "auto" }}
              >
                Download
              </Button>
              {ev.file_type && ev.file_type.startsWith("image/") && (
                <Box
                  component="img"
                  src={`/api/evidence/download/${ev.id}`}
                  alt={ev.file_name}
                  sx={{
                    maxHeight: 40,
                    borderRadius: 1,
                    ml: 2,
                    boxShadow: 1,
                  }}
                />
              )}
            </Paper>
          ))}
      </Stack>
      <Divider />
      <Box>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
          disabled={uploading || !canUpload}
          sx={{ mt: 1 }}
        >
          {uploading ? "Uploading..." : "Upload Evidence"}
          <Input
            type="file"
            sx={{ display: "none" }}
            onChange={handleEvidenceUpload}
            disabled={!canUpload}
          />
        </Button>
        {!canUpload && (
          <Typography variant="caption" color="error" mt={1} display="block">
            Only the client or freelancer involved in this dispute can upload evidence.
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

export default DisputeEvidenceSection;