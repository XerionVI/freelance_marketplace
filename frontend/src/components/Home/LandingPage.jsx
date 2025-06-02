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
  Divider,
  Link,
} from "@mui/material";
import AnimatedLogo from "../../assets/AnimatedLogo";

const featuredFreelancers = [
  {
    name: "Alice Smith",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    skills: ["Solidity", "React", "Web3.js"],
  },
  {
    name: "Bob Lee",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    skills: ["UI/UX", "Figma", "Branding"],
  },
  {
    name: "Carol Tan",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    skills: ["Content Writing", "Editing", "SEO"],
  },
];

const testimonials = [
  {
    quote: "Chain Gigs made hiring a blockchain dev fast and safe!",
    user: "Startup Founder",
  },
  {
    quote: "I love getting paid instantly after job completion.",
    user: "Freelancer",
  },
];

const categories = [
  "Web3 Developers",
  "Designers",
  "Editors",
  "Writers",
  "Marketers",
  "Translators",
];

function LandingPage({ onLogin, onSignUp }) {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: "#f8fafc", py: 8, textAlign: "center" }}>
        <Container maxWidth="md">
          <AnimatedLogo width={100} height={100} />
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Find & Hire Top Freelance Talent — Fast & Secure
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Powered by blockchain smart contracts and decentralized payments.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button variant="contained" size="large" color="primary">
              I'm a Freelancer
            </Button>
            <Button variant="outlined" size="large" color="primary">
              I'm a Client
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* How it Works */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
          How it Works
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  1
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  Sign Up
                </Typography>
                <Typography color="text.secondary">Create your free account in seconds.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  2
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  Create Job or Apply
                </Typography>
                <Typography color="text.secondary">Post a job or apply as a freelancer.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  3
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  Get Paid Securely
                </Typography>
                <Typography color="text.secondary">Payments via blockchain smart contract.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Popular Categories */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Popular Categories
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {categories.map((cat) => (
            <Chip key={cat} label={cat} color="primary" variant="outlined" sx={{ mb: 1 }} />
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
            <Grid item xs={12} sm={4} key={idx}>
              <Card elevation={3} sx={{ textAlign: "center", p: 2 }}>
                <Avatar src={f.avatar} sx={{ width: 64, height: 64, mx: "auto", mb: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  {f.name}
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ flexWrap: "wrap", mt: 1 }}>
                  {f.skills.map((skill) => (
                    <Chip key={skill} label={skill} size="small" color="secondary" />
                  ))}
                </Stack>
                <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                  View Profile
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Testimonials
        </Typography>
        <Grid container spacing={3}>
          {testimonials.map((t, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Card elevation={1} sx={{ p: 2 }}>
                <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                  "{t.quote}"
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  — {t.user}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default LandingPage;