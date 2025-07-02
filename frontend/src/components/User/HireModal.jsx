import React from "react";
import { Modal, Box } from "@mui/material";
import CreateJobForm from "../jobs/CreateJobForm";

const HireModal = ({
  open,
  onClose,
  freelancerAddress,
  account,
  onJobCreated,
}) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        boxShadow: 24,
        borderRadius: 2,
        p: 2,
        minWidth: 350,
        maxWidth: "95vw",
        maxHeight: "95vh",
        overflowY: "auto",
      }}
    >
      <CreateJobForm
        account={account}
        freelancerAddress={freelancerAddress}
        onJobCreated={onJobCreated}
        onClose={onClose}
      />
    </Box>
  </Modal>
);

export default HireModal;