'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Material {
  id: string;
  name: string;
  pricePerSqFt: number;
  imageUrl: string | null;
}

export default function OrderPage() {
  const [step, setStep] = useState(1);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [orderResult, setOrderResult] = useState<any>(null);

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
  const [specialNotes, setSpecialNotes] = useState('');
  const [finishingOptions, setFinishingOptions] = useState<string[]>([]); // Finishing Options State

  // Pre-select material from URL query
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const materialId = params.get('material');

    fetch('/api/materials')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load materials');
        return res.json();
      })
      .then((data) => {
        setMaterials(data);
        if (materialId) {
          const found = data.find((m: Material) => m.id === materialId);
          if (found) setSelectedMaterial(found);
        }
      })
      .catch(() => setError('Failed to load materials. Please check your connection and try again.'))
      .finally(() => setLoading(false));
  }, []);

  //Dynamic Price Calculation including Finishing Charges
  const FINISHING_PRICES: Record<string, number> = {
    'Eyelets': 15,
    'Pole Pockets': 20,
    'Gumming': 25
  };

  let finishingCost = 0;
  finishingOptions.forEach(opt => {
    finishingCost += FINISHING_PRICES[opt] * parseFloat(width || '0') * parseFloat(height || '0') * quantity;
  });

  const totalPrice = selectedMaterial && parseFloat(width) > 0 && parseFloat(height) > 0
    ? Math.round((selectedMaterial.pricePerSqFt * parseFloat(width) * parseFloat(height) * quantity + finishingCost) * 100) / 100
    : 0;

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!width || parseFloat(width) <= 0) errs.width = 'Width must be greater than 0';
    if (!height || parseFloat(height) <= 0) errs.height = 'Height must be greater than 0';
    if (quantity < 1) errs.quantity = 'Quantity must be at least 1';
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

    // Strict JPG Check
    const allowedTypes = ['image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      setValidationErrors({ file: 'Strictly JPG/JPEG images are accepted.' });
      return;
    }

    setValidationErrors({});
    setDesignFile(file);

    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setDesignUrl(data.url);
        toast.success('Design uploaded!');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch {
      toast.error('File upload failed.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep4()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          customerAddress: customerAddress || null,
          materialId: selectedMaterial!.id,
          widthFt: parseFloat(width),
          heightFt: parseFloat(height),
          quantity,
          designFileUrl: designUrl || null,
          specialNotes: specialNotes || null,
          finishingOptions, // Passing the options to backend
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrderResult(data);
        setStep(5);
        toast.success('Order placed successfully!');
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10 gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                s === step ? 'bg-brand-primary text-white' : s < step ? 'bg-green-600 text-white' : 'bg-brand-accent text-gray-500'
              }`}>
                {s < step ? '✓' : s}
              </div>
              {s < 5 && <div className={`w-8 h-0.5 ${s < step ? 'bg-green-600' : 'bg-brand-accent'}`} />}
            </div>
          ))}
        </div>

        {/* STEP 1: Material Selection */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Select Material</h2>
            {loading ? (
              <p className="text-center text-gray-400">Loading materials...</p>
            ) : materials.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>No materials available yet.</p>
                <Link href="/contact" className="text-brand-primary hover:underline mt-2 inline-block">Contact us for a quote</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {materials.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMaterial(m)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition bg-brand-secondary-light ${selectedMaterial?.id === m.id ? 'border-brand-primary' : 'border-transparent hover:border-brand-accent'}`}
                  >
                    {m.imageUrl && (
                      <div className="h-32 rounded-lg overflow-hidden mb-3 bg-brand-accent/20">
                        <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h3 className="font-bold text-white">{m.name}</h3>
                    <p className="text-brand-primary text-sm">PKR {m.pricePerSqFt.toLocaleString()}/sqft</p>
                  </div>
                ))}
              </div>
            )}
            <button
              disabled={!selectedMaterial}
              onClick={() => setStep(2)}
              className="w-full bg-brand-primary disabled:bg-gray-700 py-4 rounded-lg font-bold transition"
            >
              Next: Dimensions
            </button>
          </div>
        )}

        {/* STEP 2: Dimensions, Finishing & Price */}
        {step === 2 && (
          <div className="max-w-md mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-center mb-4">Dimensions & Options</h2>
            <p className="text-center text-gray-400 text-sm mb-6">Material: {selectedMaterial?.name} — PKR {selectedMaterial?.pricePerSqFt}/sqft</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Width (ft)</label>
                <input
                  type="number"
                  min="0.1" step="0.1"
                  className={`w-full bg-brand-secondary border rounded-lg px-4 py-3 outline-none transition text-white ${validationErrors.width ? 'border-red-500' : 'border-brand-accent focus:border-brand-primary'}`}
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
                {validationErrors.width && <p className="text-red-400 text-sm mt-1">{validationErrors.width}</p>}
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Height (ft)</label>
                <input
                  type="number"
                  min="0.1" step="0.1"
                  className={`w-full bg-brand-secondary border rounded-lg px-4 py-3 outline-none transition text-white ${validationErrors.height ? 'border-red-500' : 'border-brand-accent focus:border-brand-primary'}`}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
                {validationErrors.height && <p className="text-red-400 text-sm mt-1">{validationErrors.height}</p>}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Quantity</label>
              <input
                type="number" min="1"
                className="w-full bg-brand-secondary border border-brand-accent rounded-lg px-4 py-3 outline-none transition text-white focus:border-brand-primary"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            {/* NEW: Finishing Options UI */}
            <div className="pt-4 border-t border-brand-accent/30">
              <label className="block text-gray-400 mb-3 font-semibold">Finishing Options (Optional)</label>
              <div className="space-y-3">
                {Object.keys(FINISHING_PRICES).map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer group p-2 rounded hover:bg-brand-secondary transition">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-600 text-brand-primary focus:ring-brand-primary bg-brand-base"
                      checked={finishingOptions.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFinishingOptions([...finishingOptions, option]);
                        } else {
                          setFinishingOptions(finishingOptions.filter(o => o !== option));
                        }
                      }}
                    />
                    <span className="text-gray-300 group-hover:text-white transition flex-1">
                      {option} 
                    </span>
                    <span className="text-xs text-brand-primary font-mono">+PKR {FINISHING_PRICES[option]}/sqft</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Live Price Preview */}
            {totalPrice > 0 && (
              <div className="bg-brand-secondary-light p-4 rounded-xl border border-brand-primary/50 text-center shadow-lg">
                <p className="text-gray-400 text-sm">Estimated Total</p>
                <p className="text-4xl font-bold text-brand-primary my-1">PKR {totalPrice.toLocaleString()}</p>
                <p className="text-gray-500 text-xs">
                  {width} × {height} ft = {(parseFloat(width) * parseFloat(height)).toFixed(1)} sqft × {quantity} qty
                </p>
                {finishingOptions.length > 0 && (
                   <p className="text-green-400 text-xs mt-1">Includes finishing: {finishingOptions.join(', ')}</p>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(1)} className="flex-1 bg-gray-700 py-4 rounded-lg font-bold transition hover:bg-gray-600">Back</button>
              <button onClick={() => validateStep2() && setStep(3)} className="flex-1 bg-brand-primary py-4 rounded-lg font-bold transition hover:bg-green-700">
                Next: Upload Design
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: File Upload */}
        {step === 3 && (
          <div className="max-w-md mx-auto text-center space-y-6">
            <h2 className="text-2xl font-bold mb-2">Upload Your Design</h2>
            <p className="text-gray-400 text-sm mb-6">Upload your design file. <span className="text-brand-primary font-bold">Strictly JPG/JPEG only.</span> (Optional)</p>
            
            <div className={`border-2 border-dashed rounded-2xl p-12 bg-brand-secondary-light mb-4 ${validationErrors.file ? 'border-red-500' : 'border-brand-accent hover:border-brand-primary transition'}`}>
              <input type="file" id="order-file" className="hidden" accept="image/jpeg" onChange={handleFileUpload} />
              <label htmlFor="order-file" className="cursor-pointer block text-gray-300">
                {designUrl ? (
                  <div>
                    <svg className="w-12 h-12 text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-400 font-semibold">File Uploaded</p>
                    <p className="text-gray-500 text-sm mt-1">{designFile?.name}</p>
                  </div>
                ) : (
                  <div>
                    <svg className="w-12 h-12 text-brand-primary mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="font-medium text-lg">Click to Upload</p>
                    <p className="text-gray-500 text-sm mt-1">.JPG or .JPEG only (max 10MB)</p>
                  </div>
                )}
              </label>
            </div>
            {validationErrors.file && <p className="text-red-400 text-sm mb-4 font-semibold">{validationErrors.file}</p>}

            <div className="text-left mt-6">
              <label className="block text-gray-400 text-sm mb-2">Special Notes (optional)</label>
              <textarea
                rows={3}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full bg-brand-secondary border border-brand-accent rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary resize-none"
                placeholder="Any special instructions for your order..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(2)} className="flex-1 bg-gray-700 py-4 rounded-lg font-bold transition hover:bg-gray-600">Back</button>
              <button onClick={() => setStep(4)} className="flex-1 bg-brand-primary py-4 rounded-lg font-bold transition hover:bg-green-700">
                Next: Contact Info
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Contact Info */}
        {step === 4 && (
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">Your Contact Details</h2>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Name <span className="text-red-500">*</span></label>
              <input
                placeholder="Your full name"
                className={`w-full bg-brand-secondary border rounded-lg px-4 py-3 text-white ${validationErrors.customerName ? 'border-red-500' : 'border-brand-accent focus:border-brand-primary'} outline-none transition`}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              {validationErrors.customerName && <p className="text-red-400 text-sm mt-1">{validationErrors.customerName}</p>}
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Phone <span className="text-red-500">*</span></label>
              <input
                placeholder="+92 300 1234567"
                className={`w-full bg-brand-secondary border rounded-lg px-4 py-3 text-white ${validationErrors.customerPhone ? 'border-red-500' : 'border-brand-accent focus:border-brand-primary'} outline-none transition`}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
              {validationErrors.customerPhone && <p className="text-red-400 text-sm mt-1">{validationErrors.customerPhone}</p>}
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email (optional)</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-brand-secondary border border-brand-accent rounded-lg px-4 py-3 text-white outline-none transition focus:border-brand-primary"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Delivery Address (optional)</label>
              <textarea
                placeholder="Your delivery address"
                rows={2}
                className="w-full bg-brand-secondary border border-brand-accent rounded-lg px-4 py-3 text-white outline-none transition focus:border-brand-primary resize-none"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
            </div>

            {/* Order Summary Confirmation */}
            <div className="bg-brand-secondary-light p-4 rounded-xl border border-brand-accent/30 mt-4">
              <h3 className="text-white font-semibold mb-2">Order Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Material</span><span>{selectedMaterial?.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Size</span><span>{width} × {height} ft</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Quantity</span><span>{quantity}</span></div>
                {finishingOptions.length > 0 && (
                  <div className="flex justify-between"><span className="text-gray-400">Finishing</span><span className="text-right">{finishingOptions.join(', ')}</span></div>
                )}
                <div className="flex justify-between border-t border-brand-accent/30 pt-2 mt-2">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-brand-primary font-bold text-lg">PKR {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(3)} className="flex-1 bg-gray-700 py-4 rounded-lg font-bold transition hover:bg-gray-600">Back</button>
              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="flex-1 bg-brand-primary hover:bg-green-700 py-4 rounded-lg font-bold transition disabled:opacity-50"
              >
                {submitting ? 'Placing Order...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Confirmation */}
        {step === 5 && orderResult && (
          <div className="max-w-md mx-auto text-center">
            <div className="bg-brand-secondary-light p-8 rounded-2xl border border-green-500/30 shadow-lg">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Order Placed Successfully!</h2>
              <p className="text-gray-400 mb-6">Thank you. We have received your order and will contact you shortly for confirmation.</p>

              <div className="bg-brand-base p-5 rounded-xl mb-6 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Order Reference</span>
                  <span className="text-brand-primary font-mono font-bold">{orderResult.orderNumber?.slice(-8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Material</span>
                  <span className="text-white font-medium">{orderResult.material?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Size</span>
                  <span className="text-white font-medium">{orderResult.widthFt} × {orderResult.heightFt} ft</span>
                </div>
                {orderResult.finishingOptions && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Finishing</span>
                    <span className="text-white font-medium text-right">{orderResult.finishingOptions}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm border-t border-brand-accent/30 pt-3">
                  <span className="text-gray-400">Status</span>
                  <span className="text-yellow-400 font-semibold px-2 py-0.5 bg-yellow-400/10 rounded">Pending</span>
                </div>
                <div className="flex justify-between text-lg pt-1">
                  <span className="text-white font-bold">Total Due (COD)</span>
                  <span className="text-brand-primary font-bold">PKR {orderResult.totalPrice?.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href="/services" className="flex-1 bg-brand-primary py-3 rounded-lg font-bold text-center transition hover:bg-green-700 shadow-md">
                  Order More
                </Link>
                <Link href="/" className="flex-1 bg-gray-700 py-3 rounded-lg font-bold text-center transition hover:bg-gray-600">
                  Home
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}