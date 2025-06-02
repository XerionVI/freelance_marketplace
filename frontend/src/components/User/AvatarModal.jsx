import React, { useRef, useState, useEffect } from "react";
import { Modal, Box, Typography, Button, IconButton, Avatar, CircularProgress } from "@mui/material";
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
  maxWidth: 400,
  width: "90vw",
  outline: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const AvatarModal = ({ open, onClose, onUpload, loading, currentAvatar }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentAvatar);
  const fileInputRef = useRef();

  // Reset preview and selected file when modal opens/closes or currentAvatar changes
  useEffect(() => {
    if (open) {
      setSelectedFile(null);
      setPreviewUrl(currentAvatar);
    }
  }, [open, currentAvatar]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
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
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Upload New Avatar
        </Typography>
        <Avatar
          src={previewUrl}
          sx={{ width: 96, height: 96, mb: 2 }}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button
          variant="outlined"
          onClick={() => fileInputRef.current.click()}
          sx={{ mb: 2 }}
        >
          Choose Image
        </Button>
        {selectedFile && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedFile.name}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!selectedFile || loading}
        >
          {loading ? <CircularProgress size={24} /> : "Upload"}
        </Button>
      </Box>
    </Modal>
  );
};

export default AvatarModal;