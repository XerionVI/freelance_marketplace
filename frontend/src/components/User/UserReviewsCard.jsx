import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Divider,
  Stack,
  Avatar,
  Rating,
  Box,
} from "@mui/material";
import axios from "axios";
import config from "../../config";

const UserReviewsCard = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios
      .get(`${config.API_BASE_URL}/api/reviews/user/${userId}`)
      .then((res) => setReviews(res.data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <Typography>Loading reviews...</Typography>;

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 3, p: 2, background: "#f8fafc" }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Reviews ({reviews.length})
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {reviews.length === 0 ? (
        <Typography color="text.secondary">No reviews yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {reviews.map((review) => (
            <Box
              key={review.id}
              sx={{ display: "flex", alignItems: "flex-start" }}
            >
              <Avatar
                src={
                  review.reviewer_avatar
                    ? review.reviewer_avatar.startsWith("http")
                      ? review.reviewer_avatar
                      : `${config.API_BASE_URL}${review.reviewer_avatar}`
                    : undefined
                }
                alt={review.reviewer_name}
                sx={{ mr: 2, width: 40, height: 40 }}
              />
              <Box>
                <Typography fontWeight="bold">
                  {review.reviewer_name}
                </Typography>
                <Rating value={review.rating} readOnly size="small" />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {review.comment}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(review.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Card>
  );
};

export default UserReviewsCard;
