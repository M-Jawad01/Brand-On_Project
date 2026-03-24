"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditMaterialPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const router = useRouter();
  const { id } = useParams();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/materials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, pricePerSqFt: price }),
    });
    router.push("/admin/materials");
    router.refresh();
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow rounded-lg mt-10">
      <h1 className="text-xl font-bold mb-4 text-gray-800">Edit Material</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input 
          className="w-full p-2 border rounded" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          className="w-full p-2 border rounded" 
          placeholder="Price" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Update</button>
      </form>
    </div>
  );
}