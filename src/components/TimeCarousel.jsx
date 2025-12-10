import React from "react";

const TimeCarousel = ({ slots = [], selectedSlots = [], onSlotSelect }) => {
  const toggleSlot = (time) => {
    onSlotSelect((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Select Time Slot
      </h2>

      {/* SLOT LIST */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {slots.map((slot, index) => {
          const isSelected = selectedSlots.includes(slot.time);
          const isBooked = slot.booked;

          let styleClass = "";

          if (isBooked) {
            // BOOKED => ALWAYS RED
            styleClass =
              "bg-red-700 text-white border-red-800 cursor-not-allowed opacity-90";
          } else if (isSelected) {
            // SELECTED => DARK GREEN
            styleClass =
              "bg-green-700 text-white border-green-800 shadow-lg scale-105";
          } else {
            // AVAILABLE (DEFAULT) => LIGHT GREEN
            styleClass =
              "bg-green-100 text-green-800 border-green-300 hover:bg-green-200 hover:shadow";
          }

          return (
            <button
              key={index}
              disabled={isBooked}
              onClick={() => !isBooked && toggleSlot(slot.time)}
              className={`
                shrink-0 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 
                border ${styleClass}
              `}
            >
              {slot.time}
            </button>
          );
        })}
      </div>

      {/* LEGEND */}
      <div className="mt-6 flex items-center gap-8 text-sm font-medium text-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-green-100 border border-green-300 shadow-sm"></span>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-green-700 border border-green-800 shadow-sm"></span>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-red-700 border border-red-800 shadow-sm"></span>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default TimeCarousel;
