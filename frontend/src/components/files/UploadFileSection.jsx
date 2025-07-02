import React, { useRef, useState } from "react";
import { Box, Button, Typography, Alert, Card, CardContent, InputAdornment, IconButton, Paper } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const UploadFileSection = ({ handleFileUpload, setFile, message }) => {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setSelectedFile(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Card sx={{ mb: 4, background: "#f8fafc" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          <CloudUploadIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Upload File
        </Typography>
        {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
        <Box component="form" onSubmit={handleFileUpload} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <input
            type="file"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              minHeight: 56,
              mb: 1,
              background: "#fff",
              borderStyle: selectedFile ? "solid" : "dashed",
              borderColor: selectedFile ? "primary.main" : "grey.400",
              cursor: "pointer"
            }}
            onClick={handleBrowseClick}
          >
            <InsertDriveFileIcon color={selectedFile ? "primary" : "disabled"} sx={{ mr: 2 }} />
            <Typography variant="body1" color={selectedFile ? "text.primary" : "text.secondary"}>
              {selectedFile ? selectedFile.name : "Click to select a file"}
            </Typography>
          </Paper>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<CloudUploadIcon />}
            disabled={!selectedFile}
          >
            Upload File
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UploadFileSection;