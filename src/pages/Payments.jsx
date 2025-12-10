import React, { useState } from "react";

const PaymentsPage = () => {
  const [bookings, setBookings] = useState([
    {
      id: "1",
      name: "Rahul Sharma",
      mobile: "9876543210",
      date: "2024-12-10",
      time: "05:00 PM",
      amount: 500,
      done: false,
    },
    {
      id: "2",
      name: "Aman Gupta",
      mobile: "9988776655",
      date: "2024-12-11",
      time: "07:00 PM",
      amount: 700,
      done: true,
    },
  ]);

  const toggleDone = (id) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, done: !b.done }
          : b
      )
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Bookings</h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-300 text-black text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="p-3">{b.name}</td>
                <td className="p-3">{b.mobile}</td>
                <td className="p-3">{b.date}</td>
                <td className="p-3">{b.time}</td>
                <td className="p-3 font-semibold">₹{b.amount}</td>

                <td className="p-3">
                  {b.done ? (
                    <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                      Done
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                      Pending
                    </span>
                  )}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => toggleDone(b.id)}
                    className={`px-4 py-1 rounded-lg text-white transition ${
                      b.done
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {b.done ? "Mark Not Done" : "Mark Done"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsPage;
