import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import config from "../../../config";

export default function ReviewModal({
  open,
  onClose,
  jobDetails,
  account,
  token,
  onReviewed,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${config.API_BASE_URL}/api/reviews`,
        {
          job_id: jobDetails.job_id,
          rating,
          comment,
          reviewer_wallet: account,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data && res.data.success) {
        onReviewed();
        onClose();
      } else {
        alert(res.data?.msg || "Failed to submit review");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to submit review");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Leave a Review</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          {account?.toLowerCase() === jobDetails.client?.toLowerCase()
            ? "You are reviewing the freelancer"
            : "You are reviewing the client"}
        </Typography>
        <Rating value={rating} onChange={(_, v) => setRating(v)} max={5} />
        <TextField
          label="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !rating}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
