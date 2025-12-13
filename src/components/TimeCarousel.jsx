import React from "react";

const TimeCarousel = ({ slots = [], onSlotToggle }) => {
  return (
    <div className="bg-white p-3 rounded-2xl shadow-xl border border-gray-100 h-fit">
      <h2 className="text-md font-semibold mb-4 text-gray-800">
        Manage Time Slots
      </h2>

      {/* SLOT LIST */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {slots?.map((slot, index) => {
          const isBooked = slot.booked; // false = not available

          let styleClass = "";

          if (isBooked) {
            // NOT AVAILABLE => RED
            styleClass =
              "bg-red-500 text-white border-red-600 hover:bg-red-600 cursor-pointer";
          } else {
            // AVAILABLE => GREEN
            styleClass =
              "bg-green-500 text-white border-green-600 hover:bg-green-600 cursor-pointer";
          }

          return (
            <button
              key={index}
              onClick={() => onSlotToggle(slot.time)}
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
      <div className="mt-6 flex justify-center gap-8 text-sm font-medium text-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-green-500 border border-green-600 shadow-sm"></span>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-red-500 border border-red-600 shadow-sm"></span>
          <span>Not Available</span>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 text-center mt-3">
        Click any time slot to toggle its availability
      </p>
    </div>
  );
};

export default TimeCarousel;