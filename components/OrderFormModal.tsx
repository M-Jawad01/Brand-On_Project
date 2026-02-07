'use client';

import { useState } from 'react';
import { Service } from '@/lib/data/mockServices';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  selectedSize: string;
}

export default function OrderFormModal({ isOpen, onClose, service, selectedSize }: OrderFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designRequirements: '',
    specialInstructions: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Order submitted:', { formData, uploadedFiles, service, selectedSize });
    alert('Order submitted successfully! We will contact you shortly.');
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-brand-secondary rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-brand-secondary border-b border-brand-accent p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Order Custom Design</h2>
            <p className="text-gray-400 text-sm mt-1">{service.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Selected Size Display */}
          <div className="bg-brand-accent p-4 rounded-lg">
            <p className="text-sm text-gray-400">Selected Size:</p>
            <p className="text-lg font-semibold text-white">{selectedSize || 'Not selected'}</p>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Your Information</h3>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-brand-base border border-brand-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary"
                placeholder="Enter your name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-brand-base border border-brand-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-brand-base border border-brand-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary"
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>
          </div>

          {/* Design Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Design Details</h3>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Design Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.designRequirements}
                onChange={(e) => setFormData({ ...formData, designRequirements: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-brand-base border border-brand-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary resize-none"
                placeholder="Describe your design requirements, colors, text, images, etc."
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Upload Design Files (Optional)
              </label>
              <div className="border-2 border-dashed border-brand-accent rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.ai,.psd"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-400 text-sm">Click to upload design files</p>
                  <p className="text-gray-500 text-xs mt-1">PNG, JPG, PDF, AI, PSD up to 10MB</p>
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-brand-accent p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-white text-sm">{file.name}</span>
                        <span className="text-gray-400 text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Special Instructions
              </label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-brand-base border border-brand-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary resize-none"
                placeholder="Any additional notes or requirements..."
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t border-brand-accent">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-brand-accent hover:bg-brand-base text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-brand-primary hover:bg-green-700 text-white font-bold rounded-lg transition"
            >
              Submit Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
