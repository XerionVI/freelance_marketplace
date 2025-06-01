import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../components/Home/LandingPage";
import HomePage from "../components/Home/HomePage";
import AuthForm from "../components/auth/AuthForm";
import JobDetailsPage from "../components/jobs/JobDetailsPage";
import UserProfile from "../components/User/UserProfile";
// ...import other pages...

function AppRoutes({ account, token, handleAuthSuccess, handleLogin, handleRegister }) {
  return (
    <Routes>
      <Route path="/" element={<LandingPage onLogin={handleLogin} onSignUp={handleRegister} />} />
      <Route path="/home" element={<HomePage onLogin={handleLogin} onRegister={handleRegister} />} />
      <Route path="/auth" element={<AuthForm onAuthSuccess={handleAuthSuccess} />} />
      <Route path="/job-details/:jobId" element={<JobDetailsPage account={account} token={token} />} />
      <Route path="/profile" element={<UserProfile profile={userProfile} />} />
    </Routes>
  );
}

export default AppRoutes;