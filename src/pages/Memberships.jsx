import React, { useState, useEffect } from "react";
import axios from "axios";

const Memberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/membership`
        );
        setMemberships(res.data);
      } catch (error) {
        console.error("Error fetching memberships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  const approveMembership = async (id) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/membership/${id}/approve`
      );
      window.location.reload()
    } catch (error) {
      console.error("Approval failed", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center font-semibold">Loading memberships…</div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-green-300 text-black text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Mobile</th>
            <th className="p-3">Start Date</th>
            <th className="p-3">Time</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Court</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {memberships.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="p-6 text-center text-gray-500 font-medium"
              >
                No memberships found
              </td>
            </tr>
          ) : (
            memberships.map((m) => (
              <tr key={m._id} className="border-b hover:bg-gray-100 transition">
                <td className="p-3">{m.name}</td>
                <td className="p-3">{m.phoneNumber}</td>
                <td className="p-3">{m.startDate}</td>
                <td className="p-3">{m.slot}</td>
                <td className="p-3 font-semibold">₹4000</td>
                <td className="p-3">{m.turf.name}</td>

                <td className="p-3">
                  {m.isAllowed ? (
                    <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full cursor-not-allowed">
                      Approved
                    </span>
                  ) : (
                    <button
                      onClick={() => approveMembership(m._id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-full transition"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Memberships;
