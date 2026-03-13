"use client";

import { useState, useEffect } from "react";

type Material = {
  id: string;
  name: string;
  pricePerSqFt: number;
  description: string | null;
  isActive: boolean;
};

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch("/api/materials");
      if (response.ok) {
        const data = await response.json();
        setMaterials(data);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // new materials adding function (POST request)
  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return alert("Name and Price are required!");

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          pricePerSqFt: parseFloat(price),
          description,
        }),
      });

      if (response.ok) {
        // to clear form 
        setName("");
        setPrice("");
        setDescription("");
        // data fetching for update table 
        fetchMaterials();
      } else {
        const errData = await response.json();
        alert(`Error: ${errData.error}`);
      }
    } catch (error) {
      console.error("Failed to add material:", error);
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen">
      <h1 className="text-3xl font-bold text-green-500 mb-8">Materials Inventory</h1>

      {/* Add Material Form */}
      <div className="bg-[#1e293b] rounded-lg p-6 mb-8 border border-gray-700">
        <form onSubmit={handleAddMaterial} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Material Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0f172a] text-white border border-gray-600 rounded p-3 focus:outline-none focus:border-green-500"
              placeholder="e.g. Star Flex"
              required
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Price per SqFt (৳)</label>
            <input 
              type="number" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-[#0f172a] text-white border border-gray-600 rounded p-3 focus:outline-none focus:border-green-500"
              placeholder="e.g. 250"
              required
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Description (Optional)</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0f172a] text-white border border-gray-600 rounded p-3 focus:outline-none focus:border-green-500"
              placeholder="e.g. High-quality material"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add To Inventory"}
          </button>
        </form>
      </div>

      {/* Materials Table */}
      <div className="bg-[#1e293b] rounded-lg p-6 border border-gray-700">
        {isLoading ? (
          <p className="text-gray-400 text-center py-4">Loading materials...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-white min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-700 text-xs uppercase text-gray-400 tracking-wider">
                  <th className="pb-4 font-semibold">Name</th>
                  <th className="pb-4 font-semibold">Price/SqFt</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No materials found in the database. Add one above!
                    </td>
                  </tr>
                ) : (
                  materials.map((material) => (
                    <tr key={material.id} className="border-b border-gray-700/50 hover:bg-[#0f172a]/50 transition-colors">
                      <td className="py-4 font-medium">{material.name}</td>
                      <td className="py-4 text-green-400 font-mono">৳{material.pricePerSqFt.toFixed(2)}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-full ${material.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                          {material.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}