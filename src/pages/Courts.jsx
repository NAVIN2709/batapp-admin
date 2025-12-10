import React, { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import AddCourtModal from "../components/AddCourtModal";
import EditCourtModal from "../components/EditCourtModal";

export default function CourtsPage() {
  const [courts, setCourts] = useState([
    {
      id: 1,
      name: "Court 1",
      surface: "Artificial Turf",
      price: 500,
      image: "",
    },
    { id: 2, name: "Court 2", surface: "Mat Flooring", price: 400, image: "" },
    { id: 3, name: "Court 3", surface: "Clay Turf", price: 550, image: "" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);

  // DELETE Court
  const handleDelete = (id) => {
    const ok = confirm("Are you sure you want to delete this court?");
    if (!ok) return;
    setCourts(courts.filter((c) => c.id !== id));
  };

  // OPEN Edit Modal
  const openEditModal = (court) => {
    setEditingCourt(court);
    setShowEditModal(true);
  };

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
          {courts.map((court) => (
            <div
              key={court.id}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
            >
              {court.image ? (
                <img
                  src={court.image}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <h2 className="text-xl font-bold text-gray-800">{court.name}</h2>
              <p className="text-gray-600 mt-1">Surface: {court.surface}</p>
              <p className="text-gray-600">Price: ₹{court.price}</p>

              <div className="flex items-center justify-between mt-4">
                <button
                  className="flex items-center gap-2 text-green-600 hover:text-green-800 transition"
                  onClick={() => openEditModal(court)}
                >
                  <Edit size={20} /> Edit
                </button>

                <button
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 transition"
                  onClick={() => handleDelete(court.id)}
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
              courts.map((c) => (c.id === updatedCourt.id ? updatedCourt : c))
            );
          }}
        />
      )}
    </div>
  );
}
