import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import config from "../../config";
import PreviewModal from "./PreviewModal";

const handleDownloadFile = (fileId) => {
  const url = `${config.API_BASE_URL}/api/files/download/${fileId}`;
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const UploadedFiles = ({ jobFiles, handleShowNotes }) => {
  const [previewFile, setPreviewFile] = useState(null);
  const [previewType, setPreviewType] = useState("");

  const handlePreviewFile = async (fileUrl) => {
    if (!fileUrl) return;
    // Ensure the fileUrl is absolute
    const url = fileUrl.startsWith("http")
      ? fileUrl
      : `${config.API_BASE_URL}${fileUrl}`;
    const ext = url.split('.').pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
      setPreviewType("image");
      setPreviewFile(url);
    } else if (ext === "pdf") {
      setPreviewType("pdf");
      setPreviewFile(url);
    } else if (ext === "txt") {
      try {
        const response = await fetch(url);
        const text = await response.text();
        setPreviewType("txt");
        setPreviewFile(text);
      } catch (e) {
        setPreviewType("other");
        setPreviewFile(url);
      }
    } else {
      setPreviewType("other");
      setPreviewFile(url);
    }
  };

  const closePreview = () => {
    setPreviewFile(null);
    setPreviewType("");
  };

  return (
    <Card sx={{ mb: 4, background: "#f8fafc" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Uploaded Files
        </Typography>
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <InsertDriveFileIcon sx={{ mr: 1 }} />
                    File Name
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    Uploaded By
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AccessTimeIcon sx={{ mr: 1 }} />
                    Uploaded At
                  </Box>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobFiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">No files uploaded yet.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                jobFiles.map((file, index) => (
                  <TableRow key={file.file_id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Chip
                        icon={<InsertDriveFileIcon />}
                        label={file.file_name}
                        variant="outlined"
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<PersonIcon />}
                        label={file.uploaded_by}
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={new Date(file.uploaded_at).toLocaleString()}
                        color="default"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleShowNotes(file.file_id)}
                        sx={{ mr: 1 }}
                        size="small"
                      >
                        View Notes
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handlePreviewFile(file.file_url)}
                        size="small"
                      >
                        Preview
                      </Button>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => handleDownloadFile(file.file_id)}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <PreviewModal
        open={Boolean(previewFile)}
        onClose={closePreview}
        previewType={previewType}
        previewFile={previewFile}
      />
    </Card>
  );
};

export default UploadedFiles;