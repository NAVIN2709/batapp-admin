import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { UploadPicture } from "../functions/UploadPicture";

export default function EditCourtModal({ court, onClose, onSave }) {
  const [form, setForm] = useState(court);
  const [preview, setPreview] = useState(court.image);
  const [base64Image, setBase64Image] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    const base64 = await fileToBase64(file);
    setBase64Image(base64);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let finalImageUrl = form.image;

      if (base64Image) {
        finalImageUrl = await UploadPicture(base64Image);
      }

      const payload = {
        name: form.name,
        location: form.location,
        price: form.price,
        imageUrl: finalImageUrl,
      };

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/turfs/${court._id}`,
        payload,
        {
          headers: {
            "x-api-key": "admin123",
            "Content-Type": "application/json",
          },
        }
      );

      const updated = res.data;

      onSave(updated);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update court");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-xl relative">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-3 right-3 text-gray-600 hover:text-black disabled:opacity-50"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-green-700">
          Edit Court
        </h2>

        <div className="flex flex-col gap-3">
          {preview ? (
            <img
              src={preview}
              className="w-full h-40 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
              No Image
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={loading}
            className="border p-2 rounded-lg disabled:bg-gray-100"
          />

          <input
            type="text"
            className="border p-2 rounded-lg disabled:bg-gray-100"
            value={form.name}
            disabled={loading}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="text"
            className="border p-2 rounded-lg disabled:bg-gray-100"
            value={form.location}
            disabled={loading}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <input
            type="number"
            className="border p-2 rounded-lg disabled:bg-gray-100"
            value={form.price}
            disabled={loading}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
