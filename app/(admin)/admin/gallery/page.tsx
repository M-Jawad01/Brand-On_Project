'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  createdAt?: string;
}

export default function AdminGalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch gallery items
  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        setGalleryItems(data);
      } else {
        setError('Failed to fetch gallery items');
      }
    } catch (err) {
      setError('Error loading gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Handle image upload
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload', { 
        method: 'POST', 
        body: formData 
      });
      const data = await res.json();
      
      if (res.ok) {
        setImageUrl(data.url);
        setError('');
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Error uploading image');
    } finally {
      setUploading(false);
    }
  }

  // Handle add gallery item
  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !category || !imageUrl) {
      setError('Please fill in all fields and upload an image');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, imageUrl }),
      });

      if (res.ok) {
        // Reset form
        setTitle('');
        setCategory('');
        setImageUrl('');
        setShowAddForm(false);
        setError('');
        // Refresh gallery
        fetchGallery();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add item');
      }
    } catch (err) {
      setError('Error adding item');
    } finally {
      setSubmitting(false);
    }
  }

  // Handle delete item
  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const res = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Remove from local state
        setGalleryItems(galleryItems.filter(item => item.id !== id));
        setError('');
      } else {
        setError('Failed to delete item');
      }
    } catch (err) {
      setError('Error deleting item');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-base p-8">
        <div className="container mx-auto">
          <div className="text-center text-gray-400">Loading gallery...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-base">
      {/* Header */}
      <div className="bg-brand-secondary-light border-b border-brand-accent-dark">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Gallery Management</h1>
              <p className="text-sm text-gray-400 mt-1">
                Manage portfolio images
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-brand-primary hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              {showAddForm ? 'Cancel' : '+ Add New Item'}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-8 bg-brand-secondary-light rounded-xl p-6 border border-brand-accent/30">
            <h2 className="text-xl font-semibold text-white mb-4">Add New Gallery Item</h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-brand-base border border-brand-accent rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-brand-base border border-brand-accent rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-green-700"
                />
                {uploading && (
                  <p className="text-sm text-brand-primary mt-2">Uploading...</p>
                )}
                {imageUrl && (
                  <div className="mt-3">
                    <p className="text-sm text-green-400 mb-2">✓ Image uploaded</p>
                    <div className="relative h-32 w-32 rounded-lg overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
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
                    setCategory('');
                    setImageUrl('');
                    setError('');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Gallery Grid */}
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
              <div
                key={item.id}
                className="bg-brand-secondary-light rounded-xl overflow-hidden border border-brand-accent/30 hover:border-brand-primary/50 transition group"
              >
                {/* Image */}
                <div className="relative h-64 bg-brand-accent/20">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">
                      {item.category}
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                  {item.createdAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Added: {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}