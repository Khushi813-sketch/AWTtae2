import { Plus, Minus, Star, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
      {/* Image */}
      <div
        className="relative aspect-square bg-gray-50 cursor-pointer overflow-hidden"
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-bold text-white bg-rose-500 rounded-md">
            {discount}% OFF
          </span>
        )}
        {product.tags.includes('bestseller') && (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold text-amber-900 bg-amber-300 rounded-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-900" />
            Bestseller
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-400 font-medium mb-0.5">{product.brand}</p>
        <h3
          className="text-sm font-semibold text-gray-800 line-clamp-2 cursor-pointer hover:text-emerald-600 transition-colors leading-snug"
          onClick={() => onQuickView(product)}
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-xs text-gray-500">{product.unit}</span>
          {product.tags.includes('organic') && (
            <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
              <Tag className="w-3 h-3" /> Organic
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
          )}
        </div>

        {/* Add to cart / quantity controls */}
        <div className="mt-3 flex-1 flex items-end">
          {quantity === 0 ? (
            <button
              onClick={() => addItem(product)}
              disabled={product.stock === 0}
              className="w-full py-2 text-sm font-semibold text-emerald-600 border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          ) : (
            <div className="w-full flex items-center justify-between bg-emerald-50 border-2 border-emerald-300 rounded-xl overflow-hidden">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="p-2.5 text-emerald-700 hover:bg-emerald-100 transition-colors active:scale-90"
              >
                <Minus className="w-4 h-4" strokeWidth={2.5} />
              </button>
              <span className="text-sm font-bold text-emerald-800">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                disabled={quantity >= product.stock}
                className="p-2.5 text-emerald-700 hover:bg-emerald-100 transition-colors active:scale-90 disabled:opacity-40"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
