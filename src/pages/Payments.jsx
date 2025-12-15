import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";

const PaymentsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");

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
        { isDone: true }
      );
      return response.data;
    } catch (error) {
      console.error(error);
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

  // 🔍 Filter logic
  const filteredBookings = bookings.filter((b) => {
    const name = b.guest?.name?.toLowerCase() || "";
    const phone = b.guest?.phone || "";
    return (
      name.includes(search.toLowerCase()) ||
      phone.includes(search)
    );
  });

  return (
    <div className="p-4">
      {/* Header + Search */}
      <div className="flex justify-between mb-4 flex-col">
        <h1 className="text-2xl font-semibold mb-2">Bookings</h1>

        <div className="relative w-50">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Find name/mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
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
            {filteredBookings.map((b) => (
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
                    disabled={b.isDone}
                    className={`px-4 py-1 rounded-lg text-white transition ${
                      b.isDone
                        ? "bg-green-600 cursor-not-allowed"
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
