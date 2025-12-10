import React, { useState } from "react";
import { X } from "lucide-react";

export default function EditCourtModal({ court, onClose, onSave }) {
  const [form, setForm] = useState(court);
  const [preview, setPreview] = useState(court.image);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    setForm({ ...form, image: imageUrl });
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-xl relative">

        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black">
          <X size={22} />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-green-700">Edit Court</h2>

        <div className="flex flex-col gap-3">
          
          {preview ? (
            <img src={preview} className="w-full h-40 object-cover rounded-lg" />
          ) : (
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
              No Image
            </div>
          )}

          <input type="file" accept="image/*" onChange={handleFile} className="border p-2 rounded-lg" />

          <input
            type="text"
            className="border p-2 rounded-lg"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="text"
            className="border p-2 rounded-lg"
            value={form.surface}
            onChange={(e) => setForm({ ...form, surface: e.target.value })}
          />

          <input
            type="number"
            className="border p-2 rounded-lg"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <button
            onClick={handleSubmit}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
