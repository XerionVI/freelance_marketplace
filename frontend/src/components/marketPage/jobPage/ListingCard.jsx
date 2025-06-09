import React from "react";
import { Card, CardContent, Typography, Chip, Stack, Tooltip, Button } from "@mui/material";

// Helper to shorten Ethereum address
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
    <Card
      variant={selected ? "elevation" : "outlined"}
      sx={{
        borderRadius: 3,
        borderColor: selected ? "primary.main" : "grey.200",
        boxShadow: selected ? 4 : 1,
        cursor: "pointer",
        transition: "box-shadow 0.2s",
      }}
      onClick={onSelect}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
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
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
          {listing.description}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="body2" color="primary">
            Budget: {listing.budget} ETH
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Deadline: {listing.deadline || "-"}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Category: <b>{categoryName}</b>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Delivery: <b>{listing.delivery_format || "-"}</b>
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Timezone: <b>{listing.timezone || "-"}</b>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Client:{" "}
            <Tooltip title={listing.client_address || ""}>
              <span>
                <b>{shortenAddress(listing.client_address)}</b>
              </span>
            </Tooltip>
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
          {skillNames.map((skill, idx) => (
            <Chip key={idx} label={skill} size="small" variant="outlined" />
          ))}
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails && onOpenDetails(listing);
            }}
          >
            Details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ListingCard;