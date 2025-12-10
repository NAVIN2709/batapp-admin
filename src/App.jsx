import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CourtsPage from "./pages/Courts";
import TimingsPage from "./pages/Timings";
import PaymentsPage from "./pages/Payments";
import Navbar from "./components/NavBar";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="app px-4 py-6">
        <Routes>
          <Route path="/courts" element={<CourtsPage />} />
          <Route path="/timings" element={<TimingsPage />} />
          <Route path="/bookings" element={<PaymentsPage />} />

          {/* Optional default page */}
          <Route path="*" element={<CourtsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
