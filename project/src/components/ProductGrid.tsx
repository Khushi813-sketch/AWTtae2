import { SlidersHorizontal, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import type { Product, Category } from '@/types';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  activeCategory: string;
  searchQuery: string;
  onQuickView: (product: Product) => void;
}

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'discount';

export default function ProductGrid({
  products,
  categories,
  activeCategory,
  searchQuery,
  onQuickView,
}: ProductGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    products.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'all') {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat) result = result.filter((p) => p.category_id === cat.id);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((p) => selectedTags.some((t) => p.tags.includes(t)));
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        result.sort((a, b) => {
          const da = a.mrp > 0 ? (a.mrp - a.price) / a.mrp : 0;
          const db = b.mrp > 0 ? (b.mrp - b.price) / b.mrp : 0;
          return db - da;
        });
        break;
      default:
        result.sort((a, b) => {
          const aBest = a.tags.includes('bestseller') ? 1 : 0;
          const bBest = b.tags.includes('bestseller') ? 1 : 0;
          return bBest - aBest;
        });
    }

    return result;
  }, [products, categories, activeCategory, searchQuery, selectedTags, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const activeCatName = activeCategory === 'all'
    ? 'All Products'
    : categories.find((c) => c.slug === activeCategory)?.name || 'Products';

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {searchQuery ? `Results for "${searchQuery}"` : activeCatName}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} items available</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg bg-white outline-none focus:border-emerald-400 cursor-pointer"
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Best Discount</option>
          </select>
        </div>
      </div>

      {/* Filter chips */}
      {showFilters && allTags.length > 0 && (
        <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">Filter by tags</p>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <X className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">No products found</h3>
          <p className="text-sm text-gray-500 mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
      )}
    </section>
  );
}
