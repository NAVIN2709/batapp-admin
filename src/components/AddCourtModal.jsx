import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { UploadPicture } from "../functions/UploadPicture";

export default function AddCourtModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    imageUrl: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false); // ⭐ loading state

  // Convert file -> base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Converts to base64
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    const base64 = await convertToBase64(file);
    setForm({ ...form, imageUrl: base64 });
  };

  const handleSubmit = async () => {
    if (loading) return; // prevent double-click
    setLoading(true);

    try {
      // 1. Upload base64 to Cloudinary if needed
      let finalImageUrl = form.imageUrl;

      if (form.imageUrl && form.imageUrl.startsWith("data:")) {
        finalImageUrl = await UploadPicture(form.imageUrl);
      }

      // 2. Prepare payload
      const payload = {
        name: form.name,
        location: form.location,
        price: form.price,
        imageUrl: finalImageUrl,
      };

      // 3. Send POST request
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/turfs`,
        payload,
        {
          headers: {
            "x-api-key": "admin123",
            "Content-Type": "application/json",
          },
        }
      );

      const created = res.data;

      onAdd(created);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to add court");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-xl relative">

        <button
          onClick={loading ? null : onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
          disabled={loading}
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-green-700">
          Add Court
        </h2>

        <div className="flex flex-col gap-3">
          {preview ? (
            <img src={preview} className="w-full h-40 object-cover rounded-lg" />
          ) : (
            <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="border p-2 rounded-lg"
            disabled={loading}
          />

          <input
            type="text"
            placeholder="Court Name"
            className="border p-2 rounded-lg"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={loading}
          />

          <input
            type="text"
            placeholder="Location"
            className="border p-2 rounded-lg"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            disabled={loading}
          />

          <input
            type="number"
            placeholder="Price"
            className="border p-2 rounded-lg"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            disabled={loading}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-3 px-4 py-2 rounded-lg transition text-white
              ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
          >
            {loading ? "Loading..." : "Add Court"}
          </button>
        </div>
      </div>
    </div>
  );
}
