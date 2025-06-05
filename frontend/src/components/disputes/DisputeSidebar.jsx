import React from "react";
import { Card, CardContent, Typography, Stack, Divider, Box } from "@mui/material";

function DisputeSidebar({ tabCounts }) {
  return (
    <Stack spacing={3}>
      <Card variant="outlined" sx={{ borderRadius: 3, width: "100%" }}>
        <CardContent sx={{ px: 0, py: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ px: 3 }}>
            Quick Stats
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1} sx={{ px: 3 }}>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography variant="body2" color="text.secondary">
                Active Disputes
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {tabCounts.open + tabCounts.voting}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography variant="body2" color="text.secondary">
                Pending Admin Review
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {tabCounts.pending_admin}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography variant="body2" color="text.secondary">
                Resolved This Month
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {tabCounts.resolved}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography variant="body2" color="text.secondary">
                Average Resolution Time
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                5.2 days
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <Card variant="outlined" sx={{ borderRadius: 3, width: "100%" }}>
        <CardContent sx={{ px: 0, py: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ px: 3 }}>
            How Disputes Work
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1} sx={{ px: 3 }}>
            <Typography variant="body2">1. Either party can raise a dispute when issues arise</Typography>
            <Typography variant="body2">2. Both parties present their arguments and evidence</Typography>
            <Typography variant="body2">3. Community members vote based on evidence</Typography>
            <Typography variant="body2">4. Admin finalizes the decision and executes smart contract</Typography>
          </Stack>
        </CardContent>
      </Card>
      <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: "primary.light", width: "100%" }}>
        <CardContent sx={{ px: 0, py: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ px: 3 }}>
            Earn by Voting
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ px: 3 }}>
            Participate in dispute resolution and earn platform tokens for your contributions.
          </Typography>
          <Stack spacing={1} sx={{ mt: 2, px: 3 }}>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography variant="body2" color="text.secondary">
                Your Votes This Month
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                23
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography variant="body2" color="text.secondary">
                Tokens Earned
              </Typography>
              <Typography variant="body2" fontWeight="bold" color="primary">
                115 VOTE
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default DisputeSidebar;