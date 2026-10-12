import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FoodRecordsProvider } from './context/FoodRecordsContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import FoodRecords from './pages/FoodRecords';
import AddFoodRecord from './pages/AddFoodRecord';
import WasteTracking from './pages/WasteTracking';
import WasteRecordDetailsTrace from './pages/WasteRecordDetailsTrace';
import FoodWasteAnalytics from './pages/FoodWasteAnalytics';
import EcologicalIntelligence from './pages/EcologicalIntelligence';
import SurplusFood from './pages/SurplusFood';
import SurplusFoodDetails from './pages/SurplusFoodDetails';
import IncomingRequests from './pages/IncomingRequests';
import MyRequests from './pages/MyRequests';
import SurplusHandoverDistribution from './pages/SurplusHandoverDistribution';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import UiComponentsDesignSystem from './pages/UiComponentsDesignSystem';

export default function App() {
  return (
    <AuthProvider>
      <FoodRecordsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Authentication */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route element={<ProtectedRoute />}>
              {/* Authenticated Dashboard Application */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/food-records" element={<FoodRecords />} />
              <Route path="/add-food-record" element={<AddFoodRecord />} />
              <Route path="/waste-tracking" element={<WasteTracking />} />
          
              {/* Food Rescue Workflow Routes */}
              <Route path="/surplus-food" element={<SurplusFood />} />
              <Route path="/surplus" element={<Navigate to="/surplus-food" replace />} />
              <Route path="/surplus-food/:id" element={<SurplusFoodDetails />} />
              <Route path="/incoming-requests" element={<IncomingRequests />} />
              <Route path="/my-requests" element={<MyRequests />} />
              <Route path="/handover/:requestId" element={<SurplusHandoverDistribution />} />
              <Route path="/handover" element={<Navigate to="/handover/REQ-2026-001" replace />} />

              {/* Trace Details Routes */}
              <Route path="/trace/:recordId" element={<WasteRecordDetailsTrace />} />
              <Route path="/trace" element={<Navigate to="/trace/DT-F-0001" replace />} />
              <Route path="/waste-record-details/:recordId" element={<WasteRecordDetailsTrace />} />
              <Route path="/waste-record-details" element={<WasteRecordDetailsTrace />} />

              <Route path="/analytics" element={<FoodWasteAnalytics />} />
              <Route path="/ecological-intelligence" element={<EcologicalIntelligence />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/design-system" element={<UiComponentsDesignSystem />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </FoodRecordsProvider>
    </AuthProvider>
  );
}
