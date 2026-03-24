"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMaterialPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, pricePerSqFt: priceNum }),
      });

      if (res.ok) {
        router.push("/admin/materials");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Material</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">Material Name</label>
            <input
              type="text"
              className="w-full p-2.5 border rounded-lg mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error === "Name is required" && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          
          <div>
            <label className="text-sm font-semibold text-gray-600">Price per Sq. Ft</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2.5 border rounded-lg mt-1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {error === "Price must be greater than 0" && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600">Description</label>
          <textarea
            className="w-full p-2.5 border rounded-lg mt-1"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold"
        >
          {loading ? "Saving..." : "Save Material"}
        </button>
      </form>
    </div>
  );
}