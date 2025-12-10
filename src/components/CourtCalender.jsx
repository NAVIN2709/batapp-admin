import React, { useState } from "react";
import dayjs from "dayjs";

const CourtCalendar = ({
  availability = {},
  selectedDate,
  onDateSelect = () => {},
}) => {
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = useState(today.startOf("month"));

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  const generateMonthDays = (month) => {
    const startOfMonth = month.startOf("month");
    const endOfMonth = month.endOf("month");

    const leadingEmptyDays = (startOfMonth.day() + 6) % 7; // Monday as first day
    const days = [];

    for (let i = 0; i < leadingEmptyDays; i++) days.push(null);

    for (let d = 1; d <= endOfMonth.date(); d++) {
      const dateString = month.date(d).format("YYYY-MM-DD");
      days.push(dateString);
    }

    return days;
  };

  const days = generateMonthDays(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Select a Date</h2>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Prev
        </button>
        <h3 className="text-xl font-semibold text-gray-900 tracking-wide">
          {currentMonth.format("MMMM YYYY")}
        </h3>
        <button
          onClick={handleNextMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* Weekday row */}
      <div className="grid grid-cols-7 text-center text-gray-500 font-medium text-xs sm:text-sm mb-3">
        {weekDays.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {days.map((date, index) => {
          if (!date) return <div key={index} className="aspect-square"></div>;

          const isAvailable = availability[date] ?? true;
          const isSelected = selectedDate === date;

          return (
            <button
              key={date}
              disabled={!isAvailable}
              onClick={() => isAvailable && onDateSelect(date)}
              className={`
                aspect-square flex items-center justify-center 
                rounded-lg text-xs sm:text-sm font-medium select-none
                transition-all duration-200 border
                ${
                  !isAvailable
                    ? "bg-red-100 text-red-600 border-red-300 cursor-not-allowed opacity-60"
                    : "bg-green-100 text-green-700 border-green-300 hover:bg-green-200 hover:shadow-sm"
                }
                ${
                  isSelected
                    ? "bg-green-600 text-white border-green-700 shadow-lg scale-105"
                    : ""
                }
              `}
            >
              {dayjs(date).date()}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mt-8 text-sm sm:text-base">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-green-200 border border-green-400"></span>
          <span className="text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-red-200 border border-red-400"></span>
          <span className="text-gray-700">Not Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-green-600"></span>
          <span className="text-gray-700">Selected</span>
        </div>
      </div>
    </div>
  );
};

export default CourtCalendar;
