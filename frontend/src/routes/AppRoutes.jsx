import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../components/Home/LandingPage";
import HomePage from "../components/Home/HomePage";
import AuthForm from "../components/auth/AuthForm";
import JobDetailsPage from "../components/jobs/JobDetailsPage";
import UserProfile from "../components/User/UserProfile";
import FreelancerHome from "../components/marketPage/freelancerPage/FreelancerHome";
import TransactionHome from "../components/transcation/TransactionHome";
// ...import other pages...

function AppRoutes({ account, token, handleAuthSuccess, handleLogin, handleRegister }) {
  return (
    <Routes>
      <Route path="/" element={<LandingPage onLogin={handleLogin} onSignUp={handleRegister} />} />
      <Route path="/home" element={<HomePage onLogin={handleLogin} onRegister={handleRegister} />} />
      <Route path="/auth" element={<AuthForm onAuthSuccess={handleAuthSuccess} />} />
      <Route path="/job-details/:jobId" element={<JobDetailsPage account={account} token={token} />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/freelancer-home" element={<FreelancerHome account={account} token={token} />} />
      <Route path="/users/:id/profile" element={<UserProfile />} />
      <Route path="/transaction" element={<TransactionHome account={account}/>} />
    </Routes>
  );
}

export default AppRoutes;