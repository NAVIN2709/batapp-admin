import React, { useState } from "react";
import axios from "axios";
import {
  X,
  UploadCloud,
  Loader2,
  Type,
  MapPin,
  IndianRupee,
} from "lucide-react";
import { UploadPicture } from "../functions/UploadPicture";

export default function AddCourtModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    imageUrl: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const base64 = await convertToBase64(file);
    setForm({ ...form, imageUrl: base64 });
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      let finalImageUrl = form.imageUrl;

      if (form.imageUrl?.startsWith("data:")) {
        finalImageUrl = await UploadPicture(form.imageUrl);
      }

      const payload = {
        name: form.name,
        location: form.location,
        price: form.price,
        imageUrl: finalImageUrl,
      };

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

      onAdd(res.data);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to add court");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[380px] shadow-2xl relative">

        {/* Close */}
        <button
          onClick={loading ? null : onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-500 hover:text-black disabled:opacity-50 cursor-pointer"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-green-700">
          Add Court
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Create a new court with details & image
        </p>

        {/* Image Preview */}
        <div className="rounded-xl overflow-hidden border mb-3">
          {preview ? (
            <img
              src={preview}
              className="w-full h-44 object-cover"
            />
          ) : (
            <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Upload */}
        <label
          className={`
            flex items-center justify-center gap-3
            w-full cursor-pointer
            border-2 border-dashed border-green-300
            rounded-xl p-4
            text-green-700 font-medium
            bg-green-50
            hover:bg-green-100
            transition
            ${loading ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud size={20} />
              <span>Upload Image</span>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={loading}
            className="hidden"
          />
        </label>

        {/* Inputs */}
        <div className="mt-4 space-y-3">

          {/* Court Name */}
          <div className="relative">
            <Type
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Court name"
              value={form.name}
              disabled={loading}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Location"
              value={form.location}
              disabled={loading}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100"
            />
          </div>

          {/* Price */}
          <div className="relative">
            <IndianRupee
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="number"
              placeholder="Price per hour"
              value={form.price}
              disabled={loading}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-5 w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Adding..." : "Add Court"}
        </button>
      </div>
    </div>
  );
}
