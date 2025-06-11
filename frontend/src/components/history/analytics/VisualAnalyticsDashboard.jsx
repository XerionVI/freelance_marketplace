import React, { useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import { Doughnut, Line } from "react-chartjs-2";
import { Chart, ArcElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler } from "chart.js";
import StatCard from "./StatCard";
import FlowStep from "./FlowStep";
import ProgressRing from "./ProgressRing";
Chart.register(ArcElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

export default function VisualAnalyticsDashboard({ events = [] }) {
  // Memoize analytics to avoid recalculation on every render
  const analytics = useMemo(() => {
    const jobs = events.filter(e => e.type === "job");
    const disputes = events.filter(e => e.type === "dispute");
    const payments = events.filter(e => e.type === "payment");

    // Total jobs and volume
    const totalJobs = jobs.length;
    const totalVolume = jobs
      .map(e => {
        if (!e.details.amount) return 0;
        const val = parseFloat(e.details.amount.split(" ")[0]);
        return isNaN(val) ? 0 : val;
      })
      .reduce((a, b) => a + b, 0);

    // Status counts for flow and chart
    const statusCounts = {
      created: jobs.filter(e => e.details.status === "created").length,
      accepted: jobs.filter(e => e.details.status === "accepted").length,
      completed: jobs.filter(e => e.details.status === "completed").length,
      approved: payments.filter(e => e.details.status === "approved").length,
      disputed: disputes.filter(e => e.details.status === "disputed").length,
    };

    // Success rate (completed/created)
    const successRate = statusCounts.completed && statusCounts.created
      ? ((statusCounts.completed / statusCounts.created) * 100).toFixed(1)
      : "0";

    // Active disputes
    const activeDisputes = disputes.filter(e => e.details.status === "disputed").length;

    // Dispute funnel
    const disputeCreated = disputes.filter(e => e.title === "Dispute Created").length;
    const evidenceSubmitted = disputes.filter(e => e.title === "Evidence Submitted").length;
    const votingStarted = disputes.filter(e => e.title === "Dispute Status Changed" && e.details.status === "voting").length;
    const resolved = disputes.filter(e => e.title === "Dispute Resolved").length;

    // Chart data: aggregate volume per month (if you have timestamps)
    // For now, aggregate by month using event.time if available, else fallback to dummy months
    let volumeByMonth = {};
    jobs.forEach(e => {
      if (e.time && e.details.amount) {
        const date = new Date(e.time);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const val = parseFloat(e.details.amount.split(" ")[0]);
        if (!isNaN(val)) {
          volumeByMonth[key] = (volumeByMonth[key] || 0) + val;
        }
      }
    });
    // Sort months
    const sortedMonths = Object.keys(volumeByMonth).sort();
    const volumeData = {
      labels: sortedMonths.length > 0 ? sortedMonths : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Volume (ETH)",
          data: sortedMonths.length > 0 ? sortedMonths.map(m => volumeByMonth[m]) : [0, 0, 0, 0, 0, 0],
          borderColor: "#667eea",
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    };

    // Status chart data
    const statusData = {
      labels: ["Approved", "Completed", "Accepted", "Created", "Disputed"],
      datasets: [
        {
          data: [
            statusCounts.approved,
            statusCounts.completed,
            statusCounts.accepted,
            statusCounts.created,
            statusCounts.disputed,
          ],
          backgroundColor: [
            "#8bc34a",
            "#ff9800",
            "#4caf50",
            "#2196f3",
            "#f44336",
          ],
        },
      ],
    };

    return {
      totalJobs,
      totalVolume: totalVolume.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      successRate,
      activeDisputes,
      statusCounts,
      statusData,
      volumeData,
      disputeFunnel: {
        created: disputeCreated,
        evidence: evidenceSubmitted,
        voting: votingStarted,
        resolved,
      },
    };
  }, [events]);

  return (
    <Box>
      {/* Stats Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid>
          <StatCard number={analytics.totalJobs || "0"} label="Total Jobs" trend="↗ +12% this month" trendType="up" />
        </Grid>
        <Grid >
          <StatCard number={`${analytics.totalVolume || "0"} ETH`} label="Total Volume" trend="↗ +8.5% this month" trendType="up" />
        </Grid>
        <Grid>
          <StatCard number={`${analytics.successRate || "0"}%`} label="Success Rate" trend="↗ +2.1% this month" trendType="up" />
        </Grid>
        <Grid>
          <StatCard number={analytics.activeDisputes || "0"} label="Active Disputes" trend="↘ -15% this month" trendType="down" />
        </Grid>
      </Grid>

      {/* Job Flow Diagram */}
      <Paper
        elevation={3}
        sx={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 3,
          p: 3,
          mb: 4,
          boxShadow: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            📋 Job Lifecycle Overview
          </Typography>
          <Typography color="text.secondary" fontSize={14}>
            Real-time status distribution
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            borderRadius: 2,
            p: 3,
          }}
        >
          <FlowStep icon="📝" count={analytics.statusCounts.created} label="Created" colorClass="created" />
          <FlowStep icon="✅" count={analytics.statusCounts.accepted} label="Accepted" colorClass="accepted" />
          <FlowStep icon="🎯" count={analytics.statusCounts.completed} label="Completed" colorClass="completed" />
          <FlowStep icon="💰" count={analytics.statusCounts.approved} label="Approved" colorClass="approved" />
          <FlowStep icon="⚠️" count={analytics.statusCounts.disputed} label="Disputed" colorClass="disputed" />
        </Box>
      </Paper>

      {/* Analytics Charts Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid>
          <Paper className="chart-card" sx={{ p: 3, borderRadius: 3 }}>
            <Box className="chart-header" sx={{ display: "flex", alignItems: "center", mb: 2, pb: 1, borderBottom: "2px solid #f0f0f0" }}>
              <Box className="chart-icon" sx={{ fontSize: 24, mr: 1, p: 1, borderRadius: 1, background: "linear-gradient(45deg, #667eea, #764ba2)", color: "#fff" }}>💹</Box>
              <Typography className="chart-title" sx={{ fontSize: 18, fontWeight: 600, color: "#2c3e50" }}>Transaction Volume</Typography>
            </Box>
            <Line data={analytics.volumeData} options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } }
            }} />
          </Paper>
        </Grid>
        <Grid >
          <Paper className="chart-card" sx={{ p: 3, borderRadius: 3 }}>
            <Box className="chart-header" sx={{ display: "flex", alignItems: "center", mb: 2, pb: 1, borderBottom: "2px solid #f0f0f0" }}>
              <Box className="chart-icon" sx={{ fontSize: 24, mr: 1, p: 1, borderRadius: 1, background: "linear-gradient(45deg, #667eea, #764ba2)", color: "#fff" }}>📊</Box>
              <Typography className="chart-title" sx={{ fontSize: 18, fontWeight: 600, color: "#2c3e50" }}>Job Status Distribution</Typography>
            </Box>
            <Doughnut data={analytics.statusData} options={{
              responsive: true,
              plugins: { legend: { position: "bottom" } }
            }} />
          </Paper>
        </Grid>
      </Grid>

      {/* Performance Metrics Progress Rings */}
      <Paper className="chart-card" sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Box className="chart-header" sx={{ display: "flex", alignItems: "center", mb: 2, pb: 1, borderBottom: "2px solid #f0f0f0" }}>
          <Box className="chart-icon" sx={{ fontSize: 24, mr: 1, p: 1, borderRadius: 1, background: "linear-gradient(45deg, #667eea, #764ba2)", color: "#fff" }}>🎯</Box>
          <Typography className="chart-title" sx={{ fontSize: 18, fontWeight: 600, color: "#2c3e50" }}>Performance Metrics</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <ProgressRing value={parseFloat(analytics.successRate)} color="#667eea" label="Success Rate" />
          <ProgressRing value={analytics.statusCounts.disputed ? Math.round((analytics.statusCounts.disputed / (analytics.statusCounts.created || 1)) * 100) : 0} color="#f44336" label="Dispute Rate" />
        </Box>
      </Paper>

      {/* Dispute Resolution Funnel */}
      <Paper className="chart-card" sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Box className="chart-header" sx={{ display: "flex", alignItems: "center", mb: 2, pb: 1, borderBottom: "2px solid #f0f0f0" }}>
          <Box className="chart-icon" sx={{ fontSize: 24, mr: 1, p: 1, borderRadius: 1, background: "linear-gradient(45deg, #667eea, #764ba2)", color: "#fff" }}>⚖️</Box>
          <Typography className="chart-title" sx={{ fontSize: 18, fontWeight: 600, color: "#2c3e50" }}>Dispute Resolution Funnel</Typography>
        </Box>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Box sx={{
            background: "linear-gradient(90deg, #667eea, #764ba2)",
            color: "#fff",
            p: 2,
            borderRadius: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)"
          }}>
            <span>Disputes Created</span>
            <strong>{analytics.disputeFunnel.created}</strong>
          </Box>
          <Box sx={{
            background: "linear-gradient(90deg, #4caf50, #388e3c)",
            color: "#fff",
            p: 2,
            borderRadius: 2,
            width: "80%",
            marginLeft: "10%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)"
          }}>
            <span>Evidence Submitted</span>
            <strong>{analytics.disputeFunnel.evidence}</strong>
          </Box>
          <Box sx={{
            background: "linear-gradient(90deg, #ff9800, #f57c00)",
            color: "#fff",
            p: 2,
            borderRadius: 2,
            width: "60%",
            marginLeft: "20%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)"
          }}>
            <span>Voting Started</span>
            <strong>{analytics.disputeFunnel.voting}</strong>
          </Box>
          <Box sx={{
            background: "linear-gradient(90deg, #f44336, #d32f2f)",
            color: "#fff",
            p: 2,
            borderRadius: 2,
            width: "40%",
            marginLeft: "30%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)"
          }}>
            <span>Resolved</span>
            <strong>{analytics.disputeFunnel.resolved}</strong>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}