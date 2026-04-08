"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function OrderPage() {
  const [material, setMaterial] = useState<any>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [qty, setQty] = useState("1");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;
    const fetchMaterial = async () => {
      const res = await fetch(`/api/materials`);
      const data = await res.json();
      const found = data.find((m: any) => String(m.id) === String(id));
      setMaterial(found);
    };
    fetchMaterial();
  }, [id]);

  const sqft = (parseFloat(width) || 0) * (parseFloat(height) || 0);
  const total = material ? sqft * parseFloat(material.pricePerSqFt) * (parseInt(qty) || 1) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materialId: material.id,
          width: width,
          height: height,
          quantity: qty,
          totalPrice: total,
          customerName: name,
          customerPhone: phone,
          address: address,
        }),
      });

      if (res.ok) {
        alert("Order Placed Successfully!");
        router.push("/services");
      } else {
        const errorText = await res.text();
        alert("Error: " + errorText.substring(0, 150));
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!material) return <div className="min-h-screen bg-brand-base flex justify-center items-center text-brand-primary font-black animate-pulse">LOADING...</div>;

  return (
    <div className="min-h-screen bg-brand-base p-10 font-sans flex justify-center items-center">
      <div className="bg-brand-secondary-light p-10 rounded-3xl border border-brand-accent/30 w-full max-w-5xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-black text-white mb-2 uppercase">Place Order</h2>
          <p className="text-gray-400 mb-8"><strong className="text-brand-primary">{material.name}</strong></p>
          <div className="bg-brand-base p-8 rounded-2xl border border-brand-accent/30">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300 font-medium">Rate per sq.ft</span>
              <span className="text-white font-bold">৳{material.pricePerSqFt}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300 font-medium">Total Area</span>
              <span className="text-white font-bold">{sqft.toFixed(2)} sq.ft</span>
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-brand-accent/30 mt-4">
              <span className="text-gray-400 font-black uppercase text-sm">Total Cost</span>
              <span className="text-5xl font-black text-brand-primary">৳{total.toFixed(0)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-brand-base p-8 rounded-2xl border border-brand-accent/30">
          <div className="grid grid-cols-2 gap-5">
            <input type="number" step="0.01" required placeholder="Width (ft)" className="w-full bg-brand-secondary-light border border-brand-accent rounded-xl px-4 py-4 text-white focus:border-brand-primary outline-none" value={width} onChange={e => setWidth(e.target.value)} />
            <input type="number" step="0.01" required placeholder="Height (ft)" className="w-full bg-brand-secondary-light border border-brand-accent rounded-xl px-4 py-4 text-white focus:border-brand-primary outline-none" value={height} onChange={e => setHeight(e.target.value)} />
          </div>
          <input type="number" min="1" required placeholder="Quantity" className="w-full bg-brand-secondary-light border border-brand-accent rounded-xl px-4 py-4 text-white focus:border-brand-primary outline-none" value={qty} onChange={e => setQty(e.target.value)} />
          <input type="text" required placeholder="Full Name" className="w-full bg-brand-secondary-light border border-brand-accent rounded-xl px-4 py-4 text-white focus:border-brand-primary outline-none" value={name} onChange={e => setName(e.target.value)} />
          <input type="text" required placeholder="Phone Number" className="w-full bg-brand-secondary-light border border-brand-accent rounded-xl px-4 py-4 text-white focus:border-brand-primary outline-none" value={phone} onChange={e => setPhone(e.target.value)} />
          <input type="text" required placeholder="Full Address" className="w-full bg-brand-secondary-light border border-brand-accent rounded-xl px-4 py-4 text-white focus:border-brand-primary outline-none" value={address} onChange={e => setAddress(e.target.value)} />
          <button type="submit" disabled={loading} className="w-full bg-brand-primary hover:bg-green-700 text-white font-black uppercase py-4 rounded-xl transition-all mt-4">
            {loading ? "PROCESSING..." : "CONFIRM ORDER"}
          </button>
        </form>
      </div>
    </div>
  );
}