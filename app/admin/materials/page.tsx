"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);

  const fetchMaterials = async () => {
    const res = await fetch("/api/materials");
    const data = await res.json();
    setMaterials(data);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;
    const res = await fetch(`/api/materials/${id}`, { method: "DELETE" });
    if (res.ok) fetchMaterials();
  };

  return (
    <div className="min-h-screen bg-brand-base p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">Printing Materials</h1>
          <Link href="/admin/materials/new" className="bg-brand-primary hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg active:scale-95">
            + Add New Material
          </Link>
        </div>

        <div className="bg-brand-secondary-light rounded-xl overflow-hidden border border-brand-accent/30 shadow-2xl">
          <table className="w-full">
            <thead className="bg-brand-secondary border-b border-brand-accent">
              <tr>
                <th className="text-left py-4 px-8 text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Material Name</th>
                <th className="text-left py-4 px-8 text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Price / Sq.Ft</th>
                <th className="text-right py-4 px-8 text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((item: any) => (
                <tr key={item.id} className="border-b border-brand-accent/20 hover:bg-brand-accent/5 transition-colors group">
                  <td className="py-5 px-8 text-white font-semibold text-lg">{item.name}</td>
                  <td className="py-5 px-8 text-brand-primary font-bold text-lg">৳{item.pricePerSqFt}</td>
                  <td className="py-5 px-8 text-right flex justify-end gap-3">
                    <Link 
                      href={`/admin/materials/edit/${item.id}`} 
                      className="text-brand-primary hover:text-white font-black text-xs tracking-widest border border-brand-primary/30 px-4 py-2 rounded hover:bg-brand-primary transition-all"
                    >
                      EDIT
                    </Link>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-white font-black text-xs tracking-widest border border-red-500/30 px-4 py-2 rounded hover:bg-red-500 transition-all"
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {materials.length === 0 && (
            <div className="p-20 text-center text-gray-500 font-medium">No materials found. Add some to get started!</div>
          )}
        </div>
      </div>
    </div>
  );
}