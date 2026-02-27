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
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // --- AUTO-CALCULATION LOGIC ---
  const calculatePricing = () => {
    let sqFt = 0;
    let finalPrice = service.baseRate; // Default to base rate

    if (selectedSize) {
      // Regex to find two numbers separated by 'x', 'X', '×', or '*' (e.g., "4x8 ft" or "4 * 8")
      const match = selectedSize.match(/(\d+(?:\.\d+)?)\s*[xX×*]\s*(\d+(?:\.\d+)?)/);
      
      if (match) {
        const width = parseFloat(match[1]);
        const height = parseFloat(match[2]);
        sqFt = width * height;
        finalPrice = sqFt * service.baseRate; // sqFt * per_sq_ft_price
      }
    }

    return { sqFt, finalPrice };
  };

  const { sqFt, finalPrice } = calculatePricing();
  // ------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          serviceId: service.id,
          selectedSize: selectedSize, 
          totalPrice: finalPrice, // Sending the dynamically calculated price
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Order submitted successfully! We will contact you shortly.');
        onClose(); 
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Strictly enforcing JPG formats in frontend (Client Requirement)
      const newFiles = Array.from(e.target.files).filter(file => 
        file.type === 'image/jpeg' || file.type === 'image/jpg'
      );
      
      if (newFiles.length !== e.target.files.length) {
        alert("Please upload only JPG/JPEG files.");
      }
      
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-brand-secondary-light rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-brand-accent-dark/50 shadow-2xl">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-brand-secondary-light border-b border-brand-accent-dark p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Order Custom Design</h2>
            <p className="text-brand-primary text-sm mt-1">{service.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* --- PRICING & SIZE DISPLAY SECTION --- */}
          <div className="bg-brand-accent/50 p-5 rounded-lg border border-brand-accent grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Selected Size:</p>
              <p className="text-lg font-semibold text-white">{selectedSize || 'Not selected'}</p>
              {sqFt > 0 && (
                <p className="text-xs text-brand-primary mt-1">Total: {sqFt} Sq. Ft.</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Price:</p>
              <p className="text-2xl font-bold text-brand-primary">PKR {finalPrice.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">(@ PKR {service.baseRate}/sq.ft)</p>
            </div>
          </div>
          {/* -------------------------------------- */}

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Your Information</h3>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name <span className="text-red-500">*</span></label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-brand-base border border-brand-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary" placeholder="Enter your name" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email <span className="text-red-500">*</span></label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 bg-brand-base border border-brand-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Phone <span className="text-red-500">*</span></label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 bg-brand-base border border-brand-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary" placeholder="+92 300 1234567" />
              </div>
            </div>
          </div>

          {/* Design Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Design Details</h3>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Design Requirements <span className="text-red-500">*</span></label>
              <textarea required value={formData.designRequirements} onChange={(e) => setFormData({ ...formData, designRequirements: e.target.value })} rows={4} className="w-full px-4 py-2 bg-brand-base border border-brand-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary resize-none" placeholder="Describe your design requirements, colors, text, images, etc." />
            </div>

            {/* Design Upload (Restricted to JPG as per requirements) */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Upload Design Files (JPG Only)</label>
              <div className="border-2 border-dashed border-brand-accent rounded-lg p-6 text-center hover:border-brand-primary transition">
                <input type="file" multiple accept=".jpg,.jpeg,image/jpeg" onChange={handleFileUpload} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <svg className="w-12 h-12 text-brand-primary mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-white font-medium text-sm">Click to upload JPG files</p>
                  <p className="text-gray-500 text-xs mt-1">Strictly .jpg or .jpeg formats only</p>
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-brand-base p-3 rounded-lg border border-brand-accent/50">
                      <div className="flex items-center gap-3">
                        <span className="bg-brand-primary/20 text-brand-primary text-xs font-bold px-2 py-1 rounded">JPG</span>
                        <span className="text-white text-sm truncate max-w-[200px]">{file.name}</span>
                        <span className="text-gray-400 text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-400 hover:text-red-300 transition">
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
              <label className="block text-sm text-gray-400 mb-2">Special Instructions</label>
              <textarea value={formData.specialInstructions} onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })} rows={2} className="w-full px-4 py-2 bg-brand-base border border-brand-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary resize-none" placeholder="Any additional notes or requirements..." />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t border-brand-accent">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 bg-brand-accent hover:bg-brand-secondary text-white rounded-lg transition">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 bg-brand-primary hover:bg-green-700 text-white font-bold rounded-lg transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Processing...' : `Pay PKR ${finalPrice.toLocaleString()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}