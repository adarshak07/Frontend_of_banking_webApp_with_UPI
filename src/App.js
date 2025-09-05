import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import PaymentsHub from "./pages/PaymentsHub";
import PaymentsCategory from "./pages/PaymentsCategory";
import RewardsPage from "./pages/RewardsPage";
import RedeemPage from "./pages/RedeemPage";
import Accounts from "./pages/Accounts";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import TransactionHistory from "./pages/TransactionHistory";
import TransactionStatement from "./pages/TransactionStatement";
import UpiDashboard from "./pages/UpiDashboard";
import UpiSend from "./pages/UpiSend";
import UpiRequest from "./pages/UpiRequest";
import UpiManage from "./pages/UpiManage";
import UpiHistory from "./pages/UpiHistory";
import UpiRequests from "./pages/UpiRequests";
import Profile from "./pages/Profile";
import AiInsights from "./pages/AiInsights";
import RechargePage from "./pages/RechargePage";
import CinemaPage from "./pages/CinemaPage";
import MoviePage from "./pages/MoviePage";
import FoodPage from "./pages/FoodPage";
import AccountLinking from "./pages/AccountLinking";
import Onboarding from "./pages/Onboarding";
import OAuthSuccess from "./pages/OAuthSuccess";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/link" element={<AccountLinking />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
        <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
        <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
        <Route path="/transactions/history" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
        <Route path="/transactions/statement" element={<ProtectedRoute><TransactionStatement /></ProtectedRoute>} />

        <Route path="/hub" element={<ProtectedRoute><PaymentsHub /></ProtectedRoute>} />
        <Route path="/hub/:category" element={<ProtectedRoute><PaymentsCategory /></ProtectedRoute>} />
        <Route path="/recharge" element={<ProtectedRoute><RechargePage /></ProtectedRoute>} />
        <Route path="/cinema" element={<ProtectedRoute><CinemaPage /></ProtectedRoute>} />
        <Route path="/movie" element={<ProtectedRoute><MoviePage /></ProtectedRoute>} />
        <Route path="/food" element={<ProtectedRoute><FoodPage /></ProtectedRoute>} />
        <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
        <Route path="/redeem" element={<ProtectedRoute><RedeemPage /></ProtectedRoute>} />
        
        {/* UPI Routes */}
        <Route path="/upi" element={<ProtectedRoute><UpiDashboard /></ProtectedRoute>} />
        <Route path="/upi/send" element={<ProtectedRoute><UpiSend /></ProtectedRoute>} />
        <Route path="/upi/request" element={<ProtectedRoute><UpiRequest /></ProtectedRoute>} />
        <Route path="/upi/manage" element={<ProtectedRoute><UpiManage /></ProtectedRoute>} />
        <Route path="/upi/history" element={<ProtectedRoute><UpiHistory /></ProtectedRoute>} />
        <Route path="/upi/requests" element={<ProtectedRoute><UpiRequests /></ProtectedRoute>} />
        
        {/* Profile and AI Insights Routes */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/ai-insights" element={<ProtectedRoute><AiInsights /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;