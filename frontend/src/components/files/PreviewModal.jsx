import React from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
  maxWidth: 600,
  width: "90vw",
  maxHeight: "90vh",
  outline: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const getTypeLabel = (type) => {
  if (type === "image") return "Image";
  if (type === "pdf") return "PDF";
  if (type === "txt") return "Text";
  return "File";
};

const PreviewModal = ({ open, onClose, previewType, previewFile, fileName }) => (
  <Modal open={open} onClose={onClose}>
    <Box sx={modalStyle}>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 12,
          top: 12,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
        File Preview: ({getTypeLabel(previewType)})
      </Typography>
      {previewType === "image" ? (
        <img src={previewFile} alt="Preview" style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 8, marginBottom: 8 }} />
      ) : previewType === "pdf" ? (
        <iframe src={previewFile} width="100%" height="400px" title="File Preview" style={{ border: "none", borderRadius: 8, marginBottom: 8 }}></iframe>
      ) : previewType === "txt" ? (
        <Box sx={{ maxHeight: 400, overflow: "auto", background: "#f5f5f5", p: 2, borderRadius: 2, width: "100%", mb: 1 }}>
          <Typography variant="body2" component="pre" sx={{ whiteSpace: "pre-wrap" }}>
            {previewFile}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Preview not available for this file type.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href={previewFile}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in New Tab
          </Button>
        </Box>
      )}
      <Button onClick={onClose} sx={{ mt: 2 }} variant="outlined">
        Close
      </Button>
    </Box>
  </Modal>
);

export default PreviewModal;