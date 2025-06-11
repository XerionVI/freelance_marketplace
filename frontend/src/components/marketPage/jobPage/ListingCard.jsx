import React from "react";
import {
  Typography,
  Chip,
  Stack,
  Tooltip,
  Button,
  Box,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";

const shortenAddress = (addr) =>
  addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";

function ListingCard({
  listing,
  selected,
  onSelect,
  categories = [],
  skills = [],
  account,
  token,
  onOpenDetails,
}) {
  const categoryName =
    categories.find((cat) => String(cat.id) === String(listing.category_id))?.name ||
    listing.category_id ||
    "-";

  const skillNames = (listing.required_skills || "")
    .split(",")
    .filter((s) => s)
    .map((skillId) => {
      const skillObj = skills.find((sk) => String(sk.id) === String(skillId));
      return skillObj ? skillObj.name : skillId;
    });

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: 3,
        p: 3,
        boxShadow: selected ? "0 8px 30px rgba(0,0,0,0.15)" : "0 4px 20px rgba(0,0,0,0.10)",
        borderLeft: "5px solid #667eea",
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        },
        cursor: "pointer",
      }}
      onClick={onSelect}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AssignmentIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              {listing.title}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
            {listing.description}
          </Typography>
        </Box>
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
          sx={{ fontWeight: 500, minWidth: 80, textTransform: "uppercase" }}
        />
      </Stack>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2,1fr)",
            md: "repeat(4,1fr)",
          },
          gap: 2,
          mb: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <AttachMoneyIcon fontSize="small" color="action" />
          <Typography variant="body2" fontWeight={500}>
            <b>Budget:</b> {listing.budget} ETH
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CalendarMonthIcon fontSize="small" color="action" />
          <Typography variant="body2" fontWeight={500}>
            <b>Deadline:</b> {listing.deadline || "-"}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CategoryIcon fontSize="small" color="action" />
          <Typography variant="body2" fontWeight={500}>
            <b>Category:</b> {categoryName}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccessTimeIcon fontSize="small" color="action" />
          <Typography variant="body2" fontWeight={500}>
            <b>Timezone:</b> {listing.timezone || "-"}
          </Typography>
        </Stack>
      </Box>
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
        {skillNames.map((skill, idx) => (
          <Chip key={idx} label={skill} size="small" variant="outlined" />
        ))}
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
        <PersonIcon fontSize="small" color="action" />
        <Typography variant="body2" fontWeight={500}>
          <b>Client:</b>{" "}
          <Tooltip title={listing.client_address || ""}>
            <span>{shortenAddress(listing.client_address)}</span>
          </Tooltip>
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails && onOpenDetails(listing, token, account);
          }}
        >
          Details
        </Button>
      </Stack>
    </Box>
  );
}

export default ListingCard;