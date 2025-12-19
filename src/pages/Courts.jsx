import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import AddCourtModal from "../components/AddCourtModal";
import EditCourtModal from "../components/EditCourtModal";
import axios from "axios";

export default function CourtsPage() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/turfs`);
        setCourts(res.data);
      } catch (error) {
        console.error("Error fetching courts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);

  const handleDelete = async (id) => {
    const ok = confirm("Are you sure you want to delete this court?");
    if (!ok) return;
    setCourts((prev) => prev.filter((c) => c.id !== id));

    try {
      // 1. Call backend DELETE API
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/turfs/${id}`, {
        headers: {
          "x-api-key": "admin123",
        },
      });

      alert("Court deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete court");
    }
  };

  // OPEN Edit Modal
  const openEditModal = (court) => {
    setEditingCourt(court);
    setShowEditModal(true);
  };

  if (!courts) return (
    <div className="loading">Loading Courts..</div>
  )

  return (
    <div className="">
      <div className="main p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-green-700">Courts</h1>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
          >
            <Plus size={20} /> Add Court
          </button>
        </div>

        {/* Courts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courts?.map((court, idx) => (
            <div
              key={idx}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
            >
              {court.imageUrl ? (
                <img
                  src={court.imageUrl}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <h2 className="text-xl font-bold text-gray-800">{court.name}</h2>
              <p className="text-gray-600 mt-1">Location: {court.location}</p>
              <p className="text-gray-600">Price: ₹{court.price}/hr</p>

              <div className="flex items-center justify-between mt-4">
                <button
                  className="flex items-center gap-2 text-green-600 hover:text-green-800 transition cursor-pointer"
                  onClick={() => openEditModal(court)}
                >
                  <Edit size={20} /> Edit
                </button>

                <button
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 transition cursor-pointer"
                  onClick={() => handleDelete(court._id)}
                >
                  <Trash2 size={20} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddCourtModal
          onClose={() => setShowAddModal(false)}
          onAdd={(court) => setCourts([...courts, court])}
        />
      )}

      {showEditModal && editingCourt && (
        <EditCourtModal
          court={editingCourt}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedCourt) => {
            setCourts(
              courts.map((c) => (c._id === updatedCourt._id ? updatedCourt : c))
            );
          }}
        />
      )}
    </div>
  );
}
