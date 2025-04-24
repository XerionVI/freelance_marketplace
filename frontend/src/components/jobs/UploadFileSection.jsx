import React from "react";
import { Box, Button, TextField, Typography, Alert, Card, CardContent } from "@mui/material";

const UploadFileSection = ({ handleFileUpload, setFile, message }) => {
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Upload File
        </Typography>
        {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
        <Box component="form" onSubmit={handleFileUpload}>
          <TextField
            type="file"
            fullWidth
            onChange={(e) => setFile(e.target.files[0])}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" type="submit">
            Upload File
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UploadFileSection;