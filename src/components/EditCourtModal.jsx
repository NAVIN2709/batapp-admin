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

export default function EditCourtModal({ court, onClose, onSave }) {
  const [form, setForm] = useState(court);
  const [preview, setPreview] = useState(court.imageUrl);
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

      let finalImageUrl = form.imageUrl;

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

      onSave(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update court");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[380px] shadow-2xl relative">

        {/* Close */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-500 hover:text-black disabled:opacity-50 cursor-pointer"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-green-700">
          Edit Court
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Update court details & image
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

          {/* Name */}
          <div className="relative">
            <Type
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={form.name}
              disabled={loading}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Court name"
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
              value={form.location}
              disabled={loading}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
              placeholder="Location"
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
              value={form.price}
              disabled={loading}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              placeholder="Price per hour"
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-5 w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
