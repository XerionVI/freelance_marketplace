import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Fade,
} from "@mui/material";
import HistorySidebar from "./HistorySidebar";
import HistoryList from "./HistoryList";
import HistoryDetails from "./HistoryDetails";
import VisualAnalyticsDashboard from "./analytics/VisualAnalyticsDashboard";
import { fetchHistoryEvents } from "../../utils/fetchHistoryEvents";

export default function HistoryHome() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: "",
  });
  const [tab, setTab] = useState(0);

  useEffect(() => {
    fetchHistoryEvents().then(setEvents);
  }, []);

  // Filtering logic
  const filteredEvents = events.filter(event => {
    // Search
    if (
      filters.search &&
      !(
        (event.details.jobId && event.details.jobId.toLowerCase().includes(filters.search.toLowerCase())) ||
        (event.details.tx && event.details.tx.toLowerCase().includes(filters.search.toLowerCase())) ||
        (event.details.client && event.details.client.toLowerCase().includes(filters.search.toLowerCase())) ||
        (event.details.freelancer && event.details.freelancer.toLowerCase().includes(filters.search.toLowerCase()))
      )
    ) {
      return false;
    }
    // Type
    if (filters.type && event.type !== filters.type) return false;
    // Status
    if (filters.status && event.details.status !== filters.status) return false;
    // Date
    if (filters.dateFrom && new Date(event.time) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(event.time) > new Date(filters.dateTo)) return false;
    // Amount
    if (filters.amountMin && event.details.amount) {
      const eth = parseFloat(event.details.amount.split(" ")[0]);
      if (eth < parseFloat(filters.amountMin)) return false;
    }
    if (filters.amountMax && event.details.amount) {
      const eth = parseFloat(event.details.amount.split(" ")[0]);
      if (eth > parseFloat(filters.amountMax)) return false;
    }
    return true;
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={4}
          sx={{
            borderRadius: 3,
            p: 3,
            mb: 4,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #38bdf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
              mb: 1,
            }}
            gutterBottom
          >
            {tab === 0 ? "🔗 Blockchain Transaction History" : "📊 Visual Analytics Dashboard"}
          </Typography>
          <Typography align="center" color="text.secondary">
            {tab === 0
              ? "Complete audit trail of all marketplace activities"
              : "Comprehensive insights into your freelance marketplace ecosystem"}
          </Typography>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            centered
            sx={{
              mt: 3,
              ".MuiTabs-indicator": {
                background: "linear-gradient(90deg, #667eea, #764ba2)",
                height: 4,
                borderRadius: 2,
              },
            }}
          >
            <Tab
              label="History"
              sx={{
                fontWeight: 600,
                color: tab === 0 ? "#667eea" : "text.secondary",
                fontSize: 18,
                minWidth: 160,
              }}
            />
            <Tab
              label="Visual Dashboard"
              sx={{
                fontWeight: 600,
                color: tab === 1 ? "#764ba2" : "text.secondary",
                fontSize: 18,
                minWidth: 200,
              }}
            />
          </Tabs>
        </Paper>
        <Fade in={tab === 0} mountOnEnter unmountOnExit>
          <Box>
            <Grid container spacing={3}>
              <Grid >
                <HistorySidebar filters={filters} setFilters={setFilters} events={events} />
              </Grid>
              <Grid >
                <HistoryList
                  events={filteredEvents}
                  onSelect={setSelectedEvent}
                  selectedEvent={selectedEvent}
                />
              </Grid>
              <Grid >
                <HistoryDetails event={selectedEvent} />
              </Grid>
            </Grid>
          </Box>
        </Fade>
        <Fade in={tab === 1} mountOnEnter unmountOnExit>
          <Box>
            <VisualAnalyticsDashboard events={events} />
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}