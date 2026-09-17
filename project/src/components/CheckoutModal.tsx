import { X, Check, MapPin, CreditCard, Wallet, Banknote } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import type { OrderItem } from '@/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { items, subtotal, deliveryFee, total } = useCart();
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod',
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError(null);
    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      setError('Please fill all required fields');
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setLoading(true);
    const orderItems: OrderItem[] = items.map((item) => ({
      product_id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      unit: item.product.unit,
    }));

    const { data, error: dbError } = await supabase.from('orders').insert({
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email || null,
      delivery_address: form.address,
      city: form.city,
      pincode: form.pincode,
      items: orderItems,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      payment_method: form.paymentMethod,
      status: 'placed',
    }).select().single();

    setLoading(false);

    if (dbError) {
      setError('Something went wrong placing your order. Please try again.');
      return;
    }

    setOrderId(data.id);
    setStep('success');
  };

  const handleClose = () => {
    setStep('details');
    setOrderId(null);
    setError(null);
    setForm({ name: '', phone: '', email: '', address: '', city: '', pincode: '', paymentMethod: 'cod' });
    onClose();
  };

  const paymentMethods = [
    { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive' },
    { id: 'upi', label: 'UPI Payment', icon: Wallet, desc: 'GPay, PhonePe, Paytm' },
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {step !== 'success' && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
            <h2 className="text-lg font-bold text-gray-900">
              {step === 'details' ? 'Delivery Details' : 'Payment Method'}
            </h2>
            <button onClick={handleClose} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step indicator */}
        {step !== 'success' && (
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-50">
            <div className={`flex items-center gap-1.5 ${step === 'details' ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'details' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <span className="text-xs font-medium">Details</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200" />
            <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'payment' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <span className="text-xs font-medium">Payment</span>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Delivering to your address</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-600">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full mt-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Phone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit mobile"
                  maxLength={10}
                  className="w-full mt-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Email (optional)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full mt-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-600">Delivery Address *</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="House no, street, area, landmark"
                  rows={2}
                  className="w-full mt-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">City *</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. Mumbai"
                  className="w-full mt-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Pincode *</label>
                <input
                  type="tel"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  className="w-full mt-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Items ({items.length})</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Delivery fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-1.5 border-t border-gray-200">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-rose-500 font-medium">{error}</p>
            )}

            <button
              onClick={() => {
                if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
                  setError('Please fill all required fields');
                  return;
                }
                if (!/^\d{10}$/.test(form.phone)) { setError('Please enter a valid 10-digit phone number'); return; }
                if (!/^\d{6}$/.test(form.pincode)) { setError('Please enter a valid 6-digit pincode'); return; }
                setError(null);
                setStep('payment');
              }}
              className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all active:scale-95"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="p-5 space-y-4">
            <div className="space-y-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setForm({ ...form, paymentMethod: method.id })}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      form.paymentMethod === method.id
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${form.paymentMethod === method.id ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                      <Icon className={`w-5 h-5 ${form.paymentMethod === method.id ? 'text-emerald-600' : 'text-gray-500'}`} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-semibold text-gray-800">{method.label}</p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${form.paymentMethod === method.id ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`}>
                      {form.paymentMethod === method.id && <Check className="w-3 h-3 text-white mx-auto mt-0.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Delivery fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-1.5 border-t border-gray-200">
                <span>Total Payable</span>
                <span>₹{total}</span>
              </div>
            </div>

            {error && <p className="text-sm text-rose-500 font-medium">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setStep('details')}
                className="px-5 py-3 text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all active:scale-95 disabled:opacity-60"
              >
                {loading ? 'Placing Order...' : `Place Order · ₹${total}`}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4 animate-[bounce_1s_ease-in-out]">
              <Check className="w-10 h-10 text-emerald-600" strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Order Placed!</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
              Thank you for your order. We'll deliver your groceries to your doorstep soon.
            </p>

            <div className="mt-5 p-4 bg-gray-50 rounded-xl text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono font-semibold text-gray-800 text-xs">
                  {orderId ? orderId.slice(0, 8).toUpperCase() : ''}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-bold text-gray-900">₹{total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment</span>
                <span className="font-medium text-gray-800">
                  {form.paymentMethod === 'cod' ? 'Cash on Delivery' : form.paymentMethod === 'upi' ? 'UPI' : 'Card'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery to</span>
                <span className="font-medium text-gray-800">{form.city}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Expected delivery: 90 minutes · You'll receive updates on {form.phone}
            </p>

            <button
              onClick={handleClose}
              className="w-full mt-5 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all active:scale-95"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
