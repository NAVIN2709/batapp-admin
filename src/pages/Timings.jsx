import React, { useState, useEffect } from "react";
import CourtCalendar from "../components/CourtCalender";
import TimeCarousel from "../components/TimeCarousel";
import dayjs from "dayjs";
import axios from "axios";

export default function TimingsPage() {
  const [courts, setCourts] = useState([]);
  const [selectedCourtId, setSelectedCourtId] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const timeSlots = [
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
  ];

  // Fetch list of courts on mount
  useEffect(() => {
    fetchCourts();
  }, []);

  // Fetch court availability when court is selected
  useEffect(() => {
    if (selectedCourtId) {
      fetchCourtAvailability(selectedCourtId);
    }
  }, [selectedCourtId]);

  const fetchCourts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.vite.BACKEND_URL}/api/turfs`); 
      setCourts(response.data);

      // Auto-select first court if available
      if (response.data.length > 0) {
        setSelectedCourtId(response.data[0]._id);
      }
    } catch (err) {
      console.error("Error fetching courts:", err);
      setError("Failed to load courts");
    }
  };

  const fetchCourtAvailability = async (courtId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${import.meta.env.vite.BACKEND_URL}/api/turfs/court-timings/${courtId}`
      );
      // Convert API response to availability format
      const convertedAvailability = convertBookingsToAvailability(
        response.data.bookings.bookings
      );
      setAvailability(convertedAvailability);
    } catch (err) {
      console.error("Error fetching availability:", err);
      setError("Failed to load court availability");
    } finally {
      setLoading(false);
    }
  };

  // Convert API booking format to internal availability format
  const convertBookingsToAvailability = (bookings) => {
    const availabilityMap = {};

    if (!bookings || bookings.length === 0) return availabilityMap;

    bookings.forEach((booking) => {
      const date = booking.date;

      // Initialize date if not exists
      if (!availabilityMap[date]) {
        const slots = {};
        timeSlots.forEach((t) => (slots[t] = true)); // All available by default

        availabilityMap[date] = {
          available: true,
          slots: slots,
        };
      }

      // Mark booked slots as unavailable
      if (booking.slots && Array.isArray(booking.slots)) {
        booking.slots.forEach((bookedSlot) => {
          // Convert "10:00-11:00" to "10:00 AM" format
          const timeSlot = convertApiSlotToDisplayFormat(bookedSlot);
          if (timeSlot && availabilityMap[date].slots[timeSlot] !== undefined) {
            availabilityMap[date].slots[timeSlot] = false; // Mark as unavailable
          }
        });
      }

      // Update day availability based on slots
      const allSlotsBooked = Object.values(availabilityMap[date].slots).every(
        (slot) => slot === false
      );
      availabilityMap[date].available = !allSlotsBooked;
    });

    return availabilityMap;
  };

  // Convert API time format "10:00-11:00" to display format "10:00 AM"
  const convertApiSlotToDisplayFormat = (apiSlot) => {
    try {
      const [startTime] = apiSlot.split("-");
      const [hours, minutes] = startTime.split(":");
      const hour = parseInt(hours);

      if (hour === 0) return "12:00 AM";
      if (hour < 12) return `${hour.toString().padStart(2, "0")}:${minutes} AM`;
      if (hour === 12) return `12:${minutes} PM`;
      return `${(hour - 12).toString().padStart(2, "0")}:${minutes} PM`;
    } catch (err) {
      console.error("Error converting slot format:", err);
      return null;
    }
  };

  // Convert display format "10:00 AM" to API format "10:00-11:00"
  const convertDisplayToApiFormat = (displaySlot) => {
    try {
      const [time, period] = displaySlot.split(" ");
      const [hours, minutes] = time.split(":");
      let hour = parseInt(hours);

      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      const startHour = hour.toString().padStart(2, "0");
      const endHour = (hour + 1).toString().padStart(2, "0");

      return `${startHour}:${minutes}-${endHour}:${minutes}`;
    } catch (err) {
      console.error("Error converting to API format:", err);
      return null;
    }
  };

  const getSlotsForSelectedDate = () => {
    if (!selectedDate) return [];
    const dayData = availability[selectedDate];

    return timeSlots.map((t) => ({
      time: t,
      booked: dayData ? dayData.slots?.[t] === false : false,
    }));
  };

  const handleSlotToggle = (time) => {
    if (!selectedDate) return;

    setAvailability((prev) => {
      const existing = prev[selectedDate] || { available: true, slots: {} };
      const currentStatus = existing.slots[time] ?? true;

      const newSlots = {
        ...existing.slots,
        [time]: !currentStatus,
      };

      // Check if all slots are now unavailable
      const allUnavailable = timeSlots.every((t) => newSlots[t] === false);

      return {
        ...prev,
        [selectedDate]: {
          available: !allUnavailable,
          slots: newSlots,
        },
      };
    });
  };

  const toggleDayAvailability = () => {
    if (!selectedDate) return;

    setAvailability((prev) => {
      const existing = prev[selectedDate] || { available: true, slots: {} };
      const willBeAvailable = !(existing.available ?? true);

      const newSlots = {};
      timeSlots.forEach((t) => {
        newSlots[t] = willBeAvailable;
      });

      return {
        ...prev,
        [selectedDate]: {
          available: willBeAvailable,
          slots: newSlots,
        },
      };
    });
  };

  const saveTimings = async () => {
    if (!selectedCourtId) {
      alert("Please select a court first");
      return;
    }

    try {
      // Convert availability back to API format
      const bookingsToSave = [];

      Object.entries(availability).forEach(([date, data]) => {
        const bookedSlots = [];

        Object.entries(data.slots).forEach(([time, isAvailable]) => {
          if (!isAvailable) {
            const apiSlot = convertDisplayToApiFormat(time);
            if (apiSlot) bookedSlots.push(apiSlot);
          }
        });

        if (bookedSlots.length > 0) {
          bookingsToSave.push({
            date: date,
            slots: bookedSlots,
          });
        }
      });

      const response = await axios.put(
        `${import.meta.env.vite.BACKEND_URL}/api/turfs/update-timings/${selectedCourtId}`,
        {
          date : bookingsToSave.at(-1).date ,
          slots : bookingsToSave.at(-1).slots
        },
        {
          headers: {
            "x-api-key": "admin123",
          },
        }
      );

      if (response.ok) {
        alert("Timings updated successfully ✔️");
        // Refresh data
        fetchCourtAvailability(selectedCourtId);
      } else {
        alert("Failed to save timings ❌");
        console.error(response)
      }
    } catch (error) {
      console.error("Error saving timings:", error);
      alert("Error saving timings ❌");
    }
  };

  const selectedCourt = courts.find((c) => c._id === selectedCourtId);

  return (
    <div className="p-0">
      <h1 className="text-3xl font-semibold text-green-700 mb-4">
        Manage Timings (Admin)
      </h1>

      {/* Court Selection */}
      <div className="bg-white p-6 rounded-2xl shadow mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Court
        </label>
        <select
          value={selectedCourtId}
          onChange={(e) => setSelectedCourtId(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          disabled={loading}
        >
          <option value="">-- Choose a court --</option>
          {courts?.map((court) => (
            <option key={court._id} value={court._id}>
              {court.name} - {court.location} (₹{court.price})
            </option>
          ))}
        </select>

        {selectedCourt && (
          <div className="mt-3 text-sm text-gray-600">
            <p>
              <strong>Location:</strong> {selectedCourt.location}
            </p>
            <p>
              <strong>Price:</strong> ₹{selectedCourt.price}/hour
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl shadow text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading availability...</p>
        </div>
      ) : selectedCourtId ? (
        <>
          <CourtCalendar
            availability={Object.fromEntries(
              Object.entries(availability).map(([date, data]) => [
                date,
                data.available,
              ])
            )}
            selectedDate={selectedDate}
            onDateSelect={(d) => {
              setSelectedDate(d);

              // Auto-create availability for new dates
              setAvailability((prev) => {
                if (prev[d]) return prev;

                const defaultSlots = {};
                timeSlots.forEach((t) => (defaultSlots[t] = true));

                return {
                  ...prev,
                  [d]: {
                    available: true,
                    slots: defaultSlots,
                  },
                };
              });
            }}
          />

          {selectedDate && (
            <div className="bg-white p-6 rounded-2xl shadow mt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">
                  Timings for {selectedDate}
                </h2>

                <button
                  onClick={toggleDayAvailability}
                  className={`px-2 py-2 rounded-xl text-white text-sm ${
                    availability[selectedDate]?.available ?? true
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {availability[selectedDate]?.available ?? true
                    ? "Mark Entire Day Not Available"
                    : "Make Entire Day Available"}
                </button>
              </div>

              <TimeCarousel
                slots={getSlotsForSelectedDate()}
                onSlotToggle={handleSlotToggle}
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={saveTimings}
                  className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition"
                >
                  Save Timings
                </button>
                <button
                  onClick={() => fetchCourtAvailability(selectedCourtId)}
                  className="bg-gray-500 text-white px-5 py-3 rounded-xl hover:bg-gray-600 transition"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
          Please select a court to manage timings
        </div>
      )}
    </div>
  );
}
