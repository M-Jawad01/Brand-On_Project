'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import MaterialCard from '@/components/MaterialCard';

interface Material {
  id: string;
  name: string;
  description: string | null;
  pricePerSqFt: number;
  imageUrl: string | null;
}

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerSqFt, setPricePerSqFt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/materials', label: 'Materials', icon: '📦' },
    { href: '/admin/orders', label: 'Orders', icon: '🛒' },
    { href: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
    { href: '/admin/messages', label: 'Messages', icon: '💬' },
  ];

  useEffect(() => {
    fetchMaterials();
  }, []);

  async function fetchMaterials() {
    try {
      const res = await fetch('/api/materials?all=true');
      if (res.ok) {
        const data = await res.json();
        setMaterials(data);
      } else {
        toast.error('Failed to fetch materials');
      }
    } catch (err) {
      toast.error('Error loading materials');
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      
      if (res.ok) {
        setImageUrl(data.url);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  }

  async function handleAddMaterial(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !pricePerSqFt) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description: description || null,
          pricePerSqFt: parseFloat(pricePerSqFt),
          imageUrl: imageUrl || null,
        }),
      });

      if (res.ok) {
        toast.success('Material added successfully!');
        setName('');
        setDescription('');
        setPricePerSqFt('');
        setImageUrl('');
        setShowAddForm(false);
        fetchMaterials();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to add material');
      }
    } catch (err) {
      toast.error('Error adding material');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteMaterial(id: string) {
    if (!confirm('Are you sure you want to delete this material?')) return;
    
    try {
      const res = await fetch(`/api/materials?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMaterials(materials.filter(material => material.id !== id));
        toast.success('Material deleted successfully!');
      } else {
        toast.error('Failed to delete material');
      }
    } catch (err) {
      toast.error('Error deleting material');
    }
  }

  async function handleLogout() {
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    toast.success('Logged out successfully');
    setTimeout(() => {
      window.location.href = '/admin/login';
    }, 1000);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-brand-base">
      <nav className="bg-brand-secondary-light border-b border-brand-accent-dark sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-white">BrandON</span>
                <span className="text-sm text-brand-primary">Admin</span>
              </Link>
              <div className="hidden md:flex space-x-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-primary text-white'
                          : 'text-gray-300 hover:text-white hover:bg-brand-accent/20'
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Materials Management</h1>
            <p className="text-sm text-gray-400 mt-1">Manage banner materials and pricing</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-brand-primary hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            {showAddForm ? 'Cancel' : '+ Add New Material'}
          </button>
        </div>

        {showAddForm && (
          <div className="mb-8 bg-brand-secondary-light rounded-xl p-6 border border-brand-accent/30">
            <h2 className="text-xl font-semibold text-white mb-4">Add New Material</h2>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Material Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-base border border-brand-accent rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-brand-base border border-brand-accent rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
                  placeholder="Optional description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price per sq ft (PKR) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={pricePerSqFt}
                  onChange={(e) => setPricePerSqFt(e.target.value)}
                  className="w-full bg-brand-base border border-brand-accent rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Material Image</label>
                <input
                  type="file"
                  accept="image/jpeg"
                  onChange={handleImageUpload}
                  className="w-full bg-brand-base border border-brand-accent rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-green-700"
                />
                {uploading && <p className="text-sm text-brand-primary mt-2">Uploading...</p>}
                {imageUrl && (
                  <div className="mt-3">
                    <p className="text-sm text-green-400 mb-2">✓ Image uploaded</p>
                    <div className="relative h-32 w-32 rounded-lg overflow-hidden">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="bg-brand-primary hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Material'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setName('');
                    setDescription('');
                    setPricePerSqFt('');
                    setImageUrl('');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {materials.length === 0 ? (
          <div className="text-center py-12 bg-brand-secondary-light rounded-xl border border-brand-accent/30">
            <p className="text-gray-400">No materials found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <div key={material.id} className="relative">
                <MaterialCard material={material} isAdmin={true} />
                <button
                  onClick={() => handleDeleteMaterial(material.id)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}