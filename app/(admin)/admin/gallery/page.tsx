'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface GalleryItem {
  id: string;
  title: string;
  category: string | null;
  imageUrl: string;
  createdAt?: string;
}

export default function AdminGalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
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

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        setGalleryItems(data);
      } else {
        toast.error('Failed to fetch gallery items');
      }
    } catch (err) {
      toast.error('Error loading gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

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

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !category || !imageUrl) {
      toast.error('Please fill in all fields and upload an image');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: description || null, category, imageUrl }),
      });

      if (res.ok) {
        toast.success('Gallery item added successfully!');
        setTitle('');
        setDescription('');
        setCategory('');
        setImageUrl('');
        setShowAddForm(false);
        fetchGallery();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to add item');
      }
    } catch (err) {
      toast.error('Error adding item');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGalleryItems(galleryItems.filter(item => item.id !== id));
        toast.success('Gallery item deleted successfully!');
      } else {
        toast.error('Failed to delete item');
      }
    } catch (err) {
      toast.error('Error deleting item');
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
            <h1 className="text-2xl font-bold text-white">Gallery Management</h1>
            <p className="text-sm text-gray-400 mt-1">Manage portfolio images</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-brand-primary hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            {showAddForm ? 'Cancel' : '+ Add New Item'}
          </button>
        </div>

        {showAddForm && (
          <div className="mb-8 bg-brand-secondary-light rounded-xl p-6 border border-brand-accent/30">
            <h2 className="text-xl font-semibold text-white mb-4">Add New Gallery Item</h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-brand-base border border-brand-accent rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-brand-base border border-brand-accent rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
                  placeholder="Optional description of the gallery item"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Banners, Posters, Billboards"
                  className="w-full bg-brand-base border border-brand-accent rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image *</label>
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
                  disabled={submitting || uploading || !imageUrl}
                  className="bg-brand-primary hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add to Gallery'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setTitle('');
                    setDescription('');
                    setCategory('');
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

        {galleryItems.length === 0 ? (
          <div className="text-center py-12 bg-brand-secondary-light rounded-xl border border-brand-accent/30">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-400">No gallery items yet</p>
            <p className="text-sm text-gray-500 mt-1">Click "Add New Item" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div key={item.id} className="bg-brand-secondary-light rounded-xl overflow-hidden border border-brand-accent/30 hover:border-brand-primary/50 transition group">
                <div className="relative h-64 bg-brand-accent/20">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">{item.category}</span>
                    <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 text-sm font-medium transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}