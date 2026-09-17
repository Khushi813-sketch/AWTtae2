import { X, Plus, Minus, Trash2, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import CheckoutModal from './CheckoutModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, subtotal, deliveryFee, total, clearCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const FREE_DELIVERY_THRESHOLD = 500;
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
  const progress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[56] w-full sm:max-w-md bg-white shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
            {items.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Your cart is empty</h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">Add some fresh groceries to get started</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Free delivery progress */}
            <div className="px-5 py-3 bg-emerald-50 border-b border-emerald-100">
              {remaining > 0 ? (
                <p className="text-xs text-emerald-700 mb-1.5">
                  Add <span className="font-bold">₹{remaining}</span> more for FREE delivery
                </p>
              ) : (
                <p className="text-xs text-emerald-700 mb-1.5 font-medium flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> You've unlocked FREE delivery!
                </p>
              )}
              <div className="h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">{item.product.brand}</p>
                    <h4 className="text-sm font-semibold text-gray-800 truncate">{item.product.name}</h4>
                    <p className="text-xs text-gray-500">{item.product.unit}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-sm font-bold text-gray-900">
                        ₹{item.product.price * item.quantity}
                      </span>
                      {item.product.mrp > item.product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{item.product.mrp * item.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-gray-300 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1 bg-white border border-emerald-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 transition-colors active:scale-90"
                      >
                        <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </button>
                      <span className="text-xs font-bold text-emerald-800 w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 transition-colors active:scale-90 disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="w-full py-2 text-xs text-gray-400 hover:text-rose-500 font-medium transition-colors"
              >
                Clear cart
              </button>
            </div>

            {/* Summary */}
            <div className="border-t border-gray-100 px-5 py-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery fee</span>
                {deliveryFee === 0 ? (
                  <span className="font-medium text-emerald-600">FREE</span>
                ) : (
                  <span className="font-medium">₹{deliveryFee}</span>
                )}
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <button
                onClick={() => setCheckoutOpen(true)}
                className="w-full py-3 mt-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all active:scale-95 shadow-md hover:shadow-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => {
          clearCart();
          setCheckoutOpen(false);
          onClose();
        }}
      />
    </>
  );
}
