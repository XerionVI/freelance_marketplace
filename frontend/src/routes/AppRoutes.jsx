import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../components/Home/HomePage";
import AuthForm from "../components/auth/AuthForm";
import JobDetailsPage from "../components/jobs/JobDetails/JobDetailsPage";
import UserProfile from "../components/User/UserProfile";
import FreelancerHome from "../components/marketPage/freelancerPage/FreelancerHome";
import JobManagementHome from "../components/jobs/JobManagement/JobManagementHome";
import DisputeHome from "../components/disputes/disputePage/DisputeHome";
import ListingsHome from "../components/marketPage/jobPage/ListingsHome";
import HistoryHome from "../components/history/HistoryHome";

// ...import other pages...

function AppRoutes({ account, token, handleAuthSuccess, handleLogin, handleRegister }) {
  return (
    <Routes>
      <Route path="/" element={<HomePage onLogin={handleLogin} onSignUp={handleRegister} token/>} />
      <Route path="/home" element={<HomePage onLogin={handleLogin} onRegister={handleRegister} token/>} />
      <Route path="/auth" element={<AuthForm onAuthSuccess={handleAuthSuccess} />} />
      <Route path="/job-details/:jobId" element={<JobDetailsPage account={account} token={token} />} />
      <Route path="/profile" element={<UserProfile account={account}/>} />
      <Route path="/freelancer-home" element={<FreelancerHome account={account} token={token} />} />
      <Route path="/users/:id/profile" element={<UserProfile account={account} />} />
      <Route path="/history" element={<HistoryHome account={account} token={token} />} />
      <Route path="/disputes" element={<DisputeHome account={account} token={token} />} />
      <Route path="/job-management" element={<JobManagementHome account={account} token={token} />} />
      <Route path="/listings" element={<ListingsHome account={account} token={token} />} />
    </Routes>
  );
}

export default AppRoutes;