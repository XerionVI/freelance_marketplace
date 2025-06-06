import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Box,
  Divider,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import UploadIcon from "@mui/icons-material/CloudUpload";
import DisputeDetailsSection from "./DisputeDetailsSection";
import DisputeEvidenceSection from "./DisputeEvidenceSection";
import DisputeArgumentsSection from "./DisputeArgumentsSection";

import config from "../../../config";

function DisputeDetailsModal({ dispute, onClose, token, account }) {
  const [tab, setTab] = useState(0);
  const [fullDispute, setFullDispute] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch full dispute details from backend when modal opens or dispute changes
  useEffect(() => {
    if (!dispute?.id) return;
    setLoading(true);
    fetch(`${config.API_BASE_URL}/api/disputes/details/${dispute.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Wallet-Address": account,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFullDispute(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dispute, token, account]);

  // Refresh evidence after upload
  const refreshEvidence = () => {
    if (!dispute?.id) return;
    fetch(`${config.API_BASE_URL}/api/disputes/details/${dispute.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Wallet-Address": account,
      },
    })
      .then((res) => res.json())
      .then((data) => setFullDispute(data));
  };

  // Refresh arguments after submit
  const refreshArguments = () => {
    if (!dispute?.id) return;
    fetch(`${config.API_BASE_URL}/api/disputes/details/${dispute.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Wallet-Address": account,
      },
    })
      .then((res) => res.json())
      .then((data) => setFullDispute(data));
  };

  if (!dispute) return null;
  if (loading || !fullDispute)
    return (
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.5)",
          zIndex: 1300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0,0,0,0.5)",
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 800,
          width: "100%",
          maxHeight: "95vh",
          overflowY: "auto",
          borderRadius: 3,
          boxShadow: 3,
        }}
        variant="outlined"
      >
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h5" fontWeight="bold">
              Dispute Details
            </Typography>
            <IconButton onClick={onClose} color="default">
              <CloseIcon sx={{ width: 28, height: 28 }} />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            <Tab icon={<VisibilityIcon />} label="Overview" />
            <Tab icon={<InsertDriveFileIcon />} label="Arguments" />
            <Tab icon={<UploadIcon />} label="Evidence" />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {tab === 0 && (
              <DisputeDetailsSection dispute={fullDispute.dispute} />
            )}
            {tab === 1 && (
              <DisputeArgumentsSection
                disputeId={fullDispute.dispute.id}
                argumentsList={fullDispute.arguments}
                onSubmitted={refreshArguments}
                token={token}
                account={account}
                dispute={fullDispute.dispute}
              />
            )}
            {tab === 2 && (
              <DisputeEvidenceSection
                disputeId={fullDispute.dispute.id}
                evidence={fullDispute.evidence}
                onUploaded={refreshEvidence}
                token={token}
                account={account}
                dispute={fullDispute.dispute}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DisputeDetailsModal;