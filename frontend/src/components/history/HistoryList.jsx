import React, { useState } from "react";
import { Box, Pagination, Stack } from "@mui/material";
import HistoryCard from "./HistoryCard";

export default function HistoryList({ events, onSelect, selectedEvent }) {
  const [page, setPage] = useState(1);

  // Pagination logic (2 per page)
  const perPage = 2;
  const pagedEvents = events.slice((page - 1) * perPage, page * perPage);

  return (
    <Box>
      <Stack spacing={3}>
        {pagedEvents.map((event) => (
          <HistoryCard
            key={event.id}
            event={event}
            selected={selectedEvent && selectedEvent.id === event.id}
            onClick={() => onSelect(event)}
          />
        ))}
      </Stack>
      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(events.length / perPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}