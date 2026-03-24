
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMaterialPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerSqFt, setPricePerSqFt] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, pricePerSqFt }),
    });

    if (res.ok) {
      router.push("/admin/materials");
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Printing Material</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Material Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full p-2 border rounded-md mt-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price per Sq. Ft ($)</label>
          <input
            type="number"
            step="0.01"
            className="w-full p-2 border rounded-md mt-1"
            value={pricePerSqFt}
            onChange={(e) => setPricePerSqFt(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Save Material
        </button>
      </form>
    </div>
  );
}