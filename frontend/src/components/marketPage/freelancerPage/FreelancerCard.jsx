import React from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  Stack,
  Button,
  Box,
  Rating,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import config from "../../../config";

const FreelancerCard = ({ freelancer }) => (
  <Card
    sx={{
      mb: 3,
      borderRadius: 3,
      boxShadow: 2,
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "scale(1.025)",
        boxShadow: 6,
        borderColor: "primary.main",
      },
      border: "1px solid #e3e8ee",
      bgcolor: "#fff",
    }}
  >
    <CardContent sx={{ display: "flex", alignItems: "center" }}>
      <Avatar
        src={
          freelancer.avatar_url
            ? freelancer.avatar_url.startsWith("http")
              ? freelancer.avatar_url
              : `${config.API_BASE_URL}${freelancer.avatar_url}`
            : undefined
        }
        alt={freelancer.display_name}
        sx={{ width: 64, height: 64, mr: 3, border: "2px solid #1976d2" }}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {freelancer.display_name}{" "}
          <Typography variant="body2" component="span" color="text.secondary">
            ({freelancer.role})
          </Typography>
        </Typography>
        <Stack direction="row" spacing={1} sx={{ my: 1, flexWrap: "wrap" }}>
          {freelancer.skills?.map((skill) => (
            <Chip
              key={skill.id ?? skill.name}
              label={skill.name}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {freelancer.bio?.slice(0, 80) || "No bio provided."}
        </Typography>
        <Typography
          variant="body2"
          color="primary"
          sx={{ fontWeight: 500, mb: 0.5 }}
        >
          {freelancer.hourly_rate} ETH/hr
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Rating
            value={
              typeof freelancer.rating === "number" ? freelancer.rating : 0
            }
            precision={0.1}
            readOnly
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            {typeof freelancer.rating === "number"
              ? freelancer.rating.toFixed(1)
              : "0.0"}{" "}
            ({freelancer.completed_jobs || 0} jobs)
          </Typography>
          <Chip
            label={freelancer.availability || "Available"}
            color="info"
            size="small"
          />
        </Stack>
      </Box>
      <Stack spacing={1} sx={{ ml: 2 }}>
        <Button
          variant="contained"
          size="small"
          component={RouterLink}
          to={`/users/${freelancer.id}/profile`}
        >
          View Profile
        </Button>
      </Stack>
    </CardContent>
  </Card>
);

export default FreelancerCard;
