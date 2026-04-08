"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMaterialPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, pricePerSqFt: price }),
    });
    if (res.ok) router.push("/admin/materials");
  };

  return (
    <div className="min-h-screen bg-brand-base p-8 flex justify-center items-center">
      <div className="bg-brand-secondary-light rounded-xl p-8 border border-brand-accent/30 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-white mb-6">Add New Material</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Material Name</label>
            <input 
              type="text" 
              placeholder="Enter name"
              className="w-full bg-brand-secondary border border-brand-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Price per Sq. Ft</label>
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full bg-brand-secondary border border-brand-accent rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-brand-primary hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition">
            Save Material
          </button>
        </form>
      </div>
    </div>
  );
}