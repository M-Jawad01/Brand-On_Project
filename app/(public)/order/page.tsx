'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Material {
  id: string;
  name: string;
  pricePerSqFt: number;
  imageUrl: string | null;
}

export default function OrderPage() {
  const [step, setStep] = useState(1);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Task 8.5
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({}); // Task 8.1

  // Form States
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designUrl, setDesignUrl] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Fetch Logic with Task 8.5 Error Handling
  useEffect(() => {
    fetch('/api/materials')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load materials');
        return res.json();
      })
      .then(setMaterials)
      .catch(() => setError('Failed to load materials. Please check your connection and try again.'));
  }, []);

  // Task 8.1: Validation Logic per Step
  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!width || parseFloat(width) <= 0) errs.width = "Width must be greater than 0";
    if (!height || parseFloat(height) <= 0) errs.height = "Height must be greater than 0";
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep4 = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = 'Name is required';
    if (!customerPhone.trim()) errs.customerPhone = 'Phone is required';
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Task 8.1: File Type Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setValidationErrors({ file: "Only JPG, PNG, and WebP images are accepted" });
      return;
    }

    setValidationErrors({});
    setDesignFile(file);
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) setDesignUrl(data.url);
    } catch {
      setError("File upload failed.");
    } finally {
      setLoading(false);
    }
  };

  // Task 8.5: Global Error UI
  if (error) {
    return (
      <div className="min-h-screen bg-brand-base flex flex-col items-center justify-center p-4">
        <div className="bg-brand-secondary-light p-8 rounded-2xl border border-red-500/30 text-center">
          <p className="text-red-400 text-lg mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-brand-primary text-white px-6 py-2 rounded-lg font-bold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-base text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Step Indicator (omitted for brevity, keep same as before) */}

        {/* STEP 1: Material Selection */}
        {step === 1 && (
          <div>
             <h2 className="text-3xl font-bold mb-8 text-center text-white">Select Material</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
               {materials.map((m) => (
                 <div 
                   key={m.id} 
                   onClick={() => setSelectedMaterial(m)}
                   className={⁠ cursor-pointer p-4 rounded-xl border-2 transition bg-brand-secondary-light ${selectedMaterial?.id === m.id ? 'border-brand-primary' : 'border-transparent'} ⁠}
                 >
                   <h3 className="font-bold text-white">{m.name}</h3>
                 </div>
               ))}
             </div>
             <button 
               disabled={!selectedMaterial} // Task 8.1 Requirement
               onClick={() => setStep(2)}
               className="w-full bg-brand-primary disabled:bg-gray-700 py-4 rounded-lg font-bold"
             >
               Next: Dimensions
             </button>
          </div>
        )}

        {/* STEP 2: Dimensions & Price with Validation */}
        {step === 2 && (
          <div className="max-w-md mx-auto space-y-6">
            <div>
              <label className="block text-gray-400 mb-2">Width (ft)</label>
              <input 
                type="number" 
                className={⁠ w-full bg-brand-secondary border rounded-lg px-4 py-3 outline-none transition ${validationErrors.width ? 'border-red-500' : 'border-brand-accent focus:border-brand-primary'} ⁠}
                value={width} 
                onChange={(e) => setWidth(e.target.value)} 
              />
              {validationErrors.width && <p className="text-red-400 text-sm mt-1">{validationErrors.width}</p>}
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Height (ft)</label>
              <input 
                type="number" 
                className={⁠ w-full bg-brand-secondary border rounded-lg px-4 py-3 outline-none transition ${validationErrors.height ? 'border-red-500' : 'border-brand-accent focus:border-brand-primary'} ⁠}
                value={height} 
                onChange={(e) => setHeight(e.target.value)} 
              />
              {validationErrors.height && <p className="text-red-400 text-sm mt-1">{validationErrors.height}</p>}
            </div>
            <button onClick={() => validateStep2() && setStep(3)} className="w-full bg-brand-primary py-4 rounded-lg font-bold">
              Next: Upload Design
            </button>
          </div>
        )}

        {/* STEP 3: File Upload with Type Check */}
        {step === 3 && (
          <div className="max-w-md mx-auto text-center">
            <div className={⁠ border-2 border-dashed rounded-2xl p-12 bg-brand-secondary-light mb-4 ${validationErrors.file ? 'border-red-500' : 'border-brand-accent'} ⁠}>
              <input type="file" id="order-file" className="hidden" onChange={handleFileUpload} />
              <label htmlFor="order-file" className="cursor-pointer text-gray-300">
                {designUrl ? "✅ File Uploaded" : "Click to Upload JPG/PNG/WebP"}
              </label>
            </div>
            {validationErrors.file && <p className="text-red-400 text-sm mb-4">{validationErrors.file}</p>}
            <button onClick={() => setStep(4)} className="w-full bg-brand-primary py-4 rounded-lg font-bold">Continue</button>
          </div>
        )}

        {/* STEP 4: Contact Info with Required Fields */}
        {step === 4 && (
          <div className="max-w-md mx-auto space-y-4">
            <div>
              <input 
                placeholder="Name" 
                className={⁠ w-full bg-brand-secondary border rounded-lg px-4 py-3 ${validationErrors.customerName ? 'border-red-500' : 'border-brand-accent'} ⁠}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              {validationErrors.customerName && <p className="text-red-400 text-sm mt-1">{validationErrors.customerName}</p>}
            </div>
            <div>
              <input 
                placeholder="Phone" 
                className={⁠ w-full bg-brand-secondary border rounded-lg px-4 py-3 ${validationErrors.customerPhone ? 'border-red-500' : 'border-brand-accent'} ⁠}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
              {validationErrors.customerPhone && <p className="text-red-400 text-sm mt-1">{validationErrors.customerPhone}</p>}
            </div>
            <button onClick={() => validateStep4() && setStep(5)} className="w-full bg-brand-primary py-4 rounded-lg font-bold">Place Order</button>
          </div>
        )}

        {/* STEP 5: Confirmation (Keep existing) */}

      </div>
    </div>
  );
}