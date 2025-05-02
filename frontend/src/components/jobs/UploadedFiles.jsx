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
  Typography
} from "@mui/material";

const UploadedFiles = ({ jobFiles, handleShowNotes, handlePreviewFile }) => {
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Uploaded Files
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell>Uploaded By</TableCell>
                <TableCell>Uploaded At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobFiles.map((file, index) => (
                <TableRow key={file.file_id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{file.file_name}</TableCell>
                  <TableCell>{file.uploaded_by}</TableCell>
                  <TableCell>{new Date(file.uploaded_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleShowNotes(file.file_id)}
                      sx={{ mr: 1 }}
                    >
                      View Notes
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handlePreviewFile(file.file_url)}
                    >
                      Preview
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default UploadedFiles;