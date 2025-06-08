import React, { useEffect, useState } from "react";
import { Stack, Card, Typography, LinearProgress, Chip } from "@mui/material";
import ListingCard from "./ListingCard";
import config from "../../../config";

function ListingsList({
  listings,
  loading,
  onSelectListing,
  selectedListingId,
}) {
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setCategories([]));
    fetch(`${config.API_BASE_URL}/api/skills`)
      .then((res) => res.json())
      .then(setSkills)
      .catch(() => setSkills([]));
  }, []);

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          Job Listings
        </Typography>
        <Chip
          label={listings.length}
          size="small"
          sx={{
            ml: 1,
            bgcolor: "primary.light",
            color: "primary.main",
            fontWeight: 500,
          }}
        />
      </Stack>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Stack spacing={3}>
        {listings.map((listing) => (
          <ListingCard
            key={listing.listing_id}
            listing={listing}
            selected={selectedListingId === listing.listing_id}
            onSelect={() => onSelectListing(listing)}
            categories={categories}
            skills={skills}
          />
        ))}
        {!loading && listings.length === 0 && (
          <Card variant="outlined" sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              No job listings found.
            </Typography>
          </Card>
        )}
      </Stack>
    </>
  );
}

export default ListingsList;