import React from "react";
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

const UploadedFiles = ({ jobFiles, handleShowNotes, handlePreviewFile }) => {
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default UploadedFiles;