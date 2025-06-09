import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Typography,
  Stack,
} from "@mui/material";
import config from "../../../config";

export default function ApplicationsTable({ listingId, token }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!listingId) return;
    setLoading(true);
    fetch(`${config.API_BASE_URL}/api/applications/listing/${listingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setApplications(Array.isArray(data) ? data : []))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, [listingId, token]);

  if (loading) return <CircularProgress sx={{ my: 2 }} />;
  if (!applications.length)
    return (
      <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
        No applications yet.
      </Typography>
    );

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Freelancer</TableCell>
            <TableCell>Proposed Amount</TableCell>
            <TableCell>Cover Letter</TableCell>
            <TableCell>Attachment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((app, idx) => (
            <TableRow
              key={
                app.id || app.application_id || app.freelancer_address || idx
              }
            >
              <TableCell>
                <Chip label={app.freelancer_address} size="small" />
              </TableCell>
              <TableCell>{app.proposed_amount} ETH</TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ maxWidth: 200, whiteSpace: "pre-line" }}
                >
                  {app.cover_letter}
                </Typography>
              </TableCell>
              <TableCell>
                {app.attachments ? (
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      href={`${config.API_BASE_URL}/api/applications/download/${
                        app.id || app.application_id
                      }`}
                      target="_blank"
                    >
                      Download
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      href={`${config.API_BASE_URL}/api/applications/preview/${
                        app.id || app.application_id
                      }`}
                      target="_blank"
                    >
                      Preview
                    </Button>
                  </Stack>
                ) : (
                  <Chip label="No File" size="small" variant="outlined" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
