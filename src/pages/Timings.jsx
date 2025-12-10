import React, { useState } from "react";
import CourtCalendar from "../components/CourtCalender";
import TimeCarousel from "../components/TimeCarousel";
import dayjs from "dayjs";

export default function TimingsPage() {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [selectedSlots, setSelectedSlots] = useState([]);

  // availability format:
  // availability = {
  //   "2025-01-10": { available: true, slots: { "06:00 AM": true, "07:00 AM": false } }
  // }
  const [availability, setAvailability] = useState({
    "2026-01-10": {
      available: false,
      slots: {
        "06:00 AM": true,
        "07:00 AM": true,
        "08:00 AM": false,
      },
    },
  });

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

  // Build slots for TimeCarousel, marking 'booked' when slot === false (not available)
  const getSlotsForSelectedDate = () => {
    if (!selectedDate) return [];
    const dayData = availability[selectedDate];

    return timeSlots.map((t) => ({
      time: t,
      // If slot explicitly false -> booked/unavailable; otherwise available
      booked: dayData ? dayData.slots?.[t] === false : false,
    }));
  };

  // onSlotSelect receives an array of currently selected (available) slot times
  // We preserve existing slots and only change those that actually toggled (diff)
  const handleSlotSelect = (selectedSlotsArray) => {
    if (!selectedDate) return;

    const selectedArray = Array.isArray(selectedSlotsArray)
      ? selectedSlotsArray
      : [];

    setAvailability((prev) => {
      const existing = prev[selectedDate] || { available: true, slots: {} };
      const newSlots = { ...existing.slots };

      // Only toggle slots based on selection
      timeSlots.forEach((time) => {
        const wasBooked = existing.slots[time] === false;
        if (!wasBooked) {
          newSlots[time] = selectedArray.includes(time); // true if selected, false otherwise
        }
      });

      return {
        ...prev,
        [selectedDate]: {
          ...existing,
          slots: newSlots,
        },
      };
    });
  };

  // Toggle day availability: if marking as not available -> set all slots to false
  // if making available -> set all slots to true
  const toggleDayAvailability = () => {
    if (!selectedDate) return;

    setAvailability((prev) => {
      const existing = prev[selectedDate] || { available: true, slots: {} };
      const willBeAvailable = !(existing.available ?? true);

      const newSlots = {};
      timeSlots.forEach((t) => {
        newSlots[t] = willBeAvailable ? true : false;
      });

      return {
        ...prev,
        [selectedDate]: {
          ...existing,
          available: willBeAvailable,
          slots: newSlots,
        },
      };
    });
  };

  const saveTimings = () => {
    console.log("Saving admin edits:", availability);
    alert("Timings updated successfully ✔️");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-green-700 mb-4">
        Manage Timings (Admin)
      </h1>

      {/* Calendar expects availability map of date -> boolean (available or not) */}
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
            <h2 className="text-lg font-bold">Timings for {selectedDate}</h2>

            <button
              onClick={toggleDayAvailability}
              className={`px-2 py-2 rounded-xl text-white text-sm ${
                availability[selectedDate]?.available ?? true
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {/* user requested 'not available' phrasing */}
              {availability[selectedDate]?.available ?? true
                ? "Mark Entire Day Not Available"
                : "Make Entire Day Available"}
            </button>
          </div>

          <TimeCarousel
            slots={getSlotsForSelectedDate()}
            selectedSlots={selectedSlots}
            onSlotSelect={setSelectedSlots}
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={saveTimings}
              className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition"
            >
              Save Timings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
