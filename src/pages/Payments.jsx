import React, { useState, useEffect } from "react";
import axios from "axios";

const PaymentsPage = () => {
  const [bookings, setBookings] = useState([]);

  // 🔥 Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookings/allbookings`
        );
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  const updateDone = async (id) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings/${id}`,
        {
          isDone: true,
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error updating booking:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const toggleDone = async (id) => {
    try {
      const updatedBooking = await updateDone(id);

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? updatedBooking : b))
      );
    } catch (error) {
      console.error("Failed to update booking", error);
    }
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
              <th className="p-3">Court</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings?.map((b) => (
              <tr key={b._id} className="border-b hover:bg-gray-100 transition">
                <td className="p-3">{b.guest?.name}</td>
                <td className="p-3">{b.guest?.phone}</td>
                <td className="p-3">{b.date}</td>
                <td className="p-3">{b.slot}</td>
                <td className="p-3 font-semibold">₹{b.totalPrice}</td>
                <td className="p-3 font-semibold">{b.turf.name}</td>

                <td className="p-3">
                  {b.status === "paid" ? (
                    <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                      Paid
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                      Not Paid
                    </span>
                  )}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => toggleDone(b._id)}
                    disabled={b.isDone == true}
                    className={`px-4 py-1 rounded-lg text-white transition ${
                      b.isDone == true
                        ? "bg-green-600 hover:bg-green-700 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {b.isDone ? "Slot Done" : "Mark Played"}
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
