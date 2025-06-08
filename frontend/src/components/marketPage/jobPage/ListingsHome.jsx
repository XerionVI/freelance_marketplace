import React, { useEffect, useState } from "react";
import { Box, Container, Button } from "@mui/material";
import axios from "axios";
import ListingsSidebar from "./ListingsSidebar";
import ListingsStats from "./ListingsStats";
import ListingsList from "./ListingsList";
import ListingForm from "./ListingForm";
import ApplicationForms from "./ApplicationForms";
import config from "../../../config";

function ListingsHome({ account, token }) {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [listingFormOpen, setListingFormOpen] = useState(false);

  // Fetch listings
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const listingsRes = await axios.get(
          `${config.API_BASE_URL}/api/listings/listings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Wallet-Address": account,
            },
          }
        );
        setListings(listingsRes.data);
        setFilteredListings(listingsRes.data);
      } catch (err) {
        setListings([]);
        setFilteredListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [account, token]);

  // Calculate stats
  const listingTotal = listings.length;
  const ethTotal = listings
    .filter((l) => l.status === "Open")
    .reduce((sum, l) => sum + Number(l.budget || 0), 0);

  // When filters change in sidebar
  const handleFilter = (filtered) => {
    setFilteredListings(filtered);
    if (
      selectedListing &&
      !filtered.some((l) => l.listing_id === selectedListing.listing_id)
    ) {
      setSelectedListing(null);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        <ListingsStats listingTotal={listingTotal} ethTotal={ethTotal} />
        <Box sx={{ display: "flex", alignItems: "flex-start", mt: 3 }}>
          {/* Sidebar */}
          <Box
            sx={{
              width: { xs: "100%", md: 320 },
              flexShrink: 0,
              position: { md: "sticky" },
              top: { md: 32 },
              alignSelf: "flex-start",
              zIndex: 2,
              mr: { md: 3 },
            }}
          >
            <ListingsSidebar
              listings={listings}
              onSelect={setSelectedListing}
              onFilter={handleFilter}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => setListingFormOpen(true)}
              sx={{ mt: 2, width: "100%" }}
            >
              Create Listing
            </Button>
            <ListingForm
              open={listingFormOpen}
              onClose={() => setListingFormOpen(false)}
              account={account}
              token={token}
              onCreated={(newListing) => {
                setListings([newListing, ...listings]);
                setFilteredListings([newListing, ...filteredListings]);
                setListingFormOpen(false);
              }}
            />
          </Box>
          {/* Main Content */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <ListingsList
              listings={filteredListings}
              loading={loading}
              onSelectListing={(listing) => {
                setSelectedListing(listing);
                setApplicationOpen(true);
              }}
              selectedListingId={selectedListing?.listing_id}
            />
            <ApplicationForms
              open={applicationOpen}
              onClose={() => setApplicationOpen(false)}
              listing={selectedListing}
              account={account}
              token={token}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ListingsHome;