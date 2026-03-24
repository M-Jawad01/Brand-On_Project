"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditMaterialPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const res = await fetch(`/api/materials`);
        const data = await res.json();
        const material = data.find((m: any) => String(m.id) === String(id));
        if (material) {
          setName(material.name);
          setPrice(material.pricePerSqFt.toString());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/materials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, pricePerSqFt: price }),
    });
    if (res.ok) {
      router.push("/admin/materials");
      router.refresh();
    }
  };

  if (loading) return <div className="min-h-screen bg-brand-base flex items-center justify-center text-brand-primary font-black tracking-widest animate-pulse">LOADING DATA...</div>;

  return (
    <div className="min-h-screen bg-brand-base p-8 flex justify-center items-center font-sans">
      <div className="bg-brand-secondary-light p-10 rounded-2xl border border-brand-accent/30 w-full max-w-lg shadow-2xl">
        <h2 className="text-2xl font-black text-white mb-8 tracking-tighter uppercase border-l-4 border-brand-primary pl-4">Edit Material</h2>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">Material Name</label>
            <input 
              type="text" 
              className="w-full bg-brand-base border border-brand-accent rounded-xl px-4 py-4 text-white focus:border-brand-primary outline-none transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">Price per Sq. Ft (৳)</label>
            <input 
              type="number" 
              step="0.01"
              className="w-full bg-brand-base border border-brand-accent rounded-xl px-4 py-4 text-white focus:border-brand-primary outline-none transition-colors"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="pt-4 flex gap-4">
            <button type="submit" className="flex-1 bg-brand-primary hover:bg-green-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-brand-primary/20 active:scale-95">
              UPDATE MATERIAL
            </button>
            <button type="button" onClick={() => router.back()} className="px-6 py-4 border border-brand-accent text-gray-400 font-bold rounded-xl hover:bg-brand-accent/20 transition-all">
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}