import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
  Box,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";
import DocumentScanner  from "@mui/icons-material/DocumentScanner";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import AppsIcon from "@mui/icons-material/Apps";
import ApplicationsTable from "./ApplicationsTable";

const shortenAddress = (addr) =>
  addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";

export default function ListingDetails({
  open,
  onClose,
  listing,
  account,
  token,
  categories = [],
  skills = [],
  onApply,
}) {
  if (!listing) return null;

  const categoryName =
    categories.find((cat) => String(cat.id) === String(listing.category_id))
      ?.name ||
    listing.category_id ||
    "-";

  const skillNames = (listing.required_skills || "")
    .split(",")
    .filter((s) => s)
    .map((skillId) => {
      const skillObj = skills.find((sk) => String(sk.id) === String(skillId));
      return skillObj ? skillObj.name : skillId;
    });

  const isClient =
    account &&
    listing.client_address &&
    account.toLowerCase() === listing.client_address.toLowerCase();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight="bold">
            {listing.title}
          </Typography>
          <Chip
            label={listing.status}
            color={
              listing.status === "Open"
                ? "success"
                : listing.status === "Closed"
                ? "default"
                : "info"
            }
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {listing.description}
          </Typography>
          <Stack direction="row" spacing={3} alignItems="center">
            <AttachMoneyIcon color="primary" fontSize="small" />
            <Typography variant="body2" color="primary">
              Budget: <b>{listing.budget} ETH</b>
            </Typography>
            <CalendarMonthIcon color="action" fontSize="small" sx={{ ml: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Deadline: <b>{listing.deadline || "-"}</b>
            </Typography>
          </Stack>
          <Stack direction="row" spacing={3} alignItems="center">
            <CategoryIcon color="secondary" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Category: <b>{categoryName}</b>
            </Typography>
            <DocumentScanner color="info" fontSize="small" sx={{ ml: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Delivery Type: <b>{listing.delivery_format || "-"}</b>
            </Typography>
          </Stack>
          <Stack direction="row" spacing={3} alignItems="center">
            <AccessTimeIcon color="warning" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Timezone: <b>{listing.timezone || "-"}</b>
            </Typography>
            <PersonIcon color="success" fontSize="small" sx={{ ml: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Client: <b>{shortenAddress(listing.client_address)}</b>
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mt: 1 }}>
            <AppsIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
            {skillNames.map((skill, idx) => (
              <Chip key={idx} label={skill} size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
            ))}
          </Stack>
          <Box sx={{ mt: 3 }}>
            <ApplicationsTable
              listingId={listing.listing_id}
              token={token}
              listing={listing}
              account={account}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        {!isClient && (
          <Button variant="contained" onClick={() => onApply && onApply()}>
            Apply
          </Button>
        )}
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}