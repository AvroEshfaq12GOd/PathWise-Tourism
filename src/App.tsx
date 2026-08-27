import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SriLankaSyncProvider } from './context/SriLankaSyncContext';
import { RequireAuth } from './components/RequireAuth';
import { PhoneFrame } from './components/PhoneFrame';
import { BottomNav } from './components/BottomNav';
import { ViewSwitcher } from './components/ViewSwitcher';
import { AdminLayout } from './components/admin/AdminLayout';

// Tourist Pages
import { Landing } from './pages/Landing';
import { Home } from './pages/Home';
import { MapView } from './pages/MapView';
import { Forecast } from './pages/Forecast';
import { Nudges } from './pages/Nudges';
import { Profile } from './pages/Profile';
import { MobileSignIn } from './pages/auth/MobileSignIn';
import { MobileSignUp } from './pages/auth/MobileSignUp';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { Overview } from './pages/admin/Overview';
import { Reports } from './pages/admin/Reports';
import { PeakMonitor } from './pages/admin/PeakMonitor';
import { Broadcast } from './pages/admin/Broadcast';
import { Simulation } from './pages/admin/Simulation';
import { Sites } from './pages/admin/Sites';
import { Thresholds } from './pages/admin/Thresholds';
import { Performance } from './pages/admin/Performance';
import { Incentives } from './pages/admin/Incentives';
import { Analytics } from './pages/admin/Analytics';

function TouristLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhoneFrame>
      {children}
      <BottomNav />
    </PhoneFrame>
  );
}

function TouristAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhoneFrame>
      {children}
    </PhoneFrame>
  );
}

export function App() {
  return (
    <AuthProvider>
      <SriLankaSyncProvider>
        <BrowserRouter>
          <ViewSwitcher />
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Landing />} />

            {/* Tourist App Routes */}
            <Route path="/app" element={<TouristLayout><Home /></TouristLayout>} />
            <Route path="/app/map" element={<TouristLayout><MapView /></TouristLayout>} />
            <Route path="/app/forecast" element={<TouristLayout><Forecast /></TouristLayout>} />
            <Route path="/app/nudges" element={<TouristLayout><Nudges /></TouristLayout>} />
            <Route path="/app/profile" element={<TouristLayout><Profile /></TouristLayout>} />
            <Route path="/app/signin" element={<TouristAuthLayout><MobileSignIn /></TouristAuthLayout>} />
            <Route path="/app/signup" element={<TouristAuthLayout><MobileSignUp /></TouristAuthLayout>} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireAuth role="admin">
                  <AdminLayout>
                    <Overview />
                  </AdminLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <RequireAuth role="admin">
                  <AdminLayout>
                    <Reports />
                  </AdminLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/peak-monitor"
              element={
                <RequireAuth role="admin">
                  <AdminLayout>
                    <PeakMonitor />
                  </AdminLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/broadcast"
              element={
                <RequireAuth role="admin">
                  <AdminLayout>
                    <Broadcast />
                  </AdminLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/simulation"
              element={
                <RequireAuth role="admin">
                  <AdminLayout>
                    <Simulation />
                  </AdminLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/sites"
              element={
                <RequireAuth role="admin">
                  <AdminLayout>
                    <Sites />
                  </AdminLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/thresholds"
              element={
                <RequireAuth role="admin">
                  <AdminLayout>
                    <Thresholds />
                  </AdminLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/performance"
              element={
                <RequireAuth role="admin">
                  <AdminLayout>
                    <Performance />
                  </AdminLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/incentives"
              element={
                <RequireAuth role="admin">
                  <AdminLayout>
                    <Incentives />
                  </AdminLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <RequireAuth role="admin">
                  <AdminLayout>
                    <Analytics />
                  </AdminLayout>
                </RequireAuth>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SriLankaSyncProvider>
    </AuthProvider>
  );
}

export default App;
