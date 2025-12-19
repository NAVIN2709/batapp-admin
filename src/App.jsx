import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CourtsPage from "./pages/Courts";
import TimingsPage from "./pages/Timings";
import PaymentsPage from "./pages/Payments";
import Navbar from "./components/NavBar";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="app px-4 py-6">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CourtsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timings"
            element={
              <ProtectedRoute>
                <TimingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
