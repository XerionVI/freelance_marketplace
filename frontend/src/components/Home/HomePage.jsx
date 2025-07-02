import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  Link,
  Rating,
} from "@mui/material";
import logo from "../../assets/chainGigs.png"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import AnimatedLogo from "../../assets/AnimatedLogo.jsx"; // Adjust path as needed

const categories = [
  "Design",
  "Web3",
  "Writing",
  "Video Editing",
  "Marketing",
  "Translation",
];

const featuredFreelancers = [
  {
    name: "Jane Doe",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    skills: ["Web3", "Solidity", "React"],
    rating: 4.9,
    completedJobs: 32,
  },
  {
    name: "John Smith",
    avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    skills: ["Design", "Figma", "Branding"],
    rating: 4.8,
    completedJobs: 27,
  },
  {
    name: "Sara Lee",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    skills: ["Writing", "Editing", "SEO"],
    rating: 4.7,
    completedJobs: 19,
  },
];

function HomePage({ onLogin, onRegister }) {
  const navigate = useNavigate();
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Container maxWidth="md">
          <Box
            sx={{
              background: "rgba(255,255,255,0.75)", // transparent white
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(31,38,135,0.18)", // soft shadow
              px: { xs: 2, sm: 6 },
              py: { xs: 4, sm: 6 },
              mb: 2,
              display: "inline-block",
            }}
          >
            <AnimatedLogo />
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Find top freelance talent for your next project
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Connect with skilled professionals and get work done securely.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={() => navigate("/freelancer-home")}
              >
                Find Talent
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="primary"
                onClick={() => navigate("/listings")}
              >
                Find Work
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
      {/* How it Works */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
          How it Works
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  1
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  Sign Up
                </Typography>
                <Typography color="text.secondary">
                  Create your free account in seconds.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  2
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  Create Job or Apply
                </Typography>
                <Typography color="text.secondary">
                  Post a job or apply as a freelancer.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  3
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  Get Paid Securely
                </Typography>
                <Typography color="text.secondary">
                  Payments via blockchain smart contract.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      {/* Categories */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Categories
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              variant="outlined"
              sx={{
                mb: 1,
                color: "#fff",
                borderColor: "#fff",
                background: "rgba(255,255,255,0.08)",
                fontWeight: "bold",
                "& .MuiChip-label": { color: "#fff" },
              }}
            />
          ))}
        </Stack>
      </Container>

      {/* Featured Freelancers */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Featured Freelancers
        </Typography>
        <Grid container spacing={3}>
          {featuredFreelancers.map((f, idx) => (
            <Grid key={idx}>
              <Card elevation={3} sx={{ textAlign: "center", p: 2 }}>
                <Avatar
                  src={f.avatar}
                  sx={{ width: 64, height: 64, mx: "auto", mb: 1 }}
                />
                <Typography variant="subtitle1" fontWeight="bold">
                  {f.name}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  sx={{ flexWrap: "wrap", mt: 1 }}
                >
                  {f.skills.slice(0, 3).map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      color="secondary"
                    />
                  ))}
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mt: 1 }}
                >
                  <Rating
                    value={f.rating}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {f.rating} ({f.completedJobs} jobs)
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  sx={{ mt: 2 }}
                >
                  <Button variant="outlined" size="small">
                    View Profile
                  </Button>
                  <Button variant="contained" size="small" color="success">
                    Hire
                  </Button>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default HomePage;
