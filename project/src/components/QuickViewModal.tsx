import { X, Plus, Minus, Star, Truck, Shield, Leaf } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { items, addItem, updateQuantity, setCartOpen } = useCart();

  if (!product) return null;

  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleBuyNow = () => {
    if (quantity === 0) addItem(product);
    setCartOpen(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-gray-100 flex items-center justify-center shadow-sm transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="grid sm:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square sm:aspect-auto bg-gray-50">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover sm:rounded-l-2xl" />
            {discount > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-sm font-bold text-white bg-rose-500 rounded-md">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-5 sm:p-6 flex flex-col">
            <p className="text-xs text-gray-400 font-medium">{product.brand}</p>
            <h2 className="text-xl font-bold text-gray-900 mt-1">{product.name}</h2>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${star <= 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">4.0 (based on 128 reviews)</span>
            </div>

            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
              {discount > 0 && <span className="text-sm text-gray-400 line-through">₹{product.mrp}</span>}
              <span className="text-sm text-gray-500">/ {product.unit}</span>
            </div>

            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{product.description}</p>

            {/* Info badges */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="flex flex-col items-center gap-1 p-2 bg-emerald-50 rounded-lg">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] text-emerald-700 font-medium text-center">90 min delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 bg-green-50 rounded-lg">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="text-[10px] text-green-700 font-medium text-center">Farm fresh</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 bg-blue-50 rounded-lg">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] text-blue-700 font-medium text-center">Quality checked</span>
              </div>
            </div>

            {/* Stock info */}
            <p className={`text-xs mt-3 font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {product.stock > 0 ? `In stock: ${product.stock} units available` : 'Currently out of stock'}
            </p>

            {/* Actions */}
            <div className="mt-auto pt-5 space-y-3">
              {quantity === 0 ? (
                <>
                  <button
                    onClick={() => addItem(product)}
                    disabled={product.stock === 0}
                    className="w-full py-3 text-sm font-semibold text-emerald-600 border-2 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl transition-all active:scale-95 disabled:opacity-40"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className="w-full py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all active:scale-95 disabled:opacity-40"
                  >
                    Buy Now
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-emerald-50 border-2 border-emerald-300 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-3 text-emerald-700 hover:bg-emerald-100 transition-colors active:scale-90"
                    >
                      <Minus className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                    <span className="text-base font-bold text-emerald-800">{quantity} in cart</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="p-3 text-emerald-700 hover:bg-emerald-100 transition-colors active:scale-90 disabled:opacity-40"
                    >
                      <Plus className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                  </div>
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all active:scale-95"
                  >
                    Go to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
