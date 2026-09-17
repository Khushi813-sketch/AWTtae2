import { useState, useEffect, useCallback } from 'react';
import { CartProvider, useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategoryShowcase from '@/components/CategoryShowcase';
import PromoBanner from '@/components/PromoBanner';
import ProductGrid from '@/components/ProductGrid';
import QuickViewModal from '@/components/QuickViewModal';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import OrdersPage from '@/components/OrdersPage';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';

function GroceryApp() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState('home');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [catRes, prodRes] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
    ]);
    if (catRes.data) setCategories(catRes.data as Category[]);
    if (prodRes.data) setProducts(prodRes.data as Product[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setCurrentPage('home');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopNow = () => {
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {currentPage === 'orders' ? (
          <OrdersPage onBack={() => handleNavigate('home')} />
        ) : (
          <>
            <Hero onShopNow={handleShopNow} />
            <CategoryShowcase categories={categories} onSelect={handleCategoryChange} />
            <PromoBanner onSelect={handleCategoryChange} />

            {loading ? (
              <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                      <div className="aspect-square bg-gray-200" />
                      <div className="p-3 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-5 bg-gray-200 rounded w-1/2" />
                        <div className="h-8 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <ProductGrid
                products={products}
                categories={categories}
                activeCategory={activeCategory}
                searchQuery={searchQuery}
                onQuickView={setQuickViewProduct}
              />
            )}
          </>
        )}
      </main>

      <Footer />

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      <CartDrawerController />
    </div>
  );
}

function CartDrawerController() {
  const { isCartOpen, setCartOpen } = useCart();
  return <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />;
}

export default function App() {
  return (
    <CartProvider>
      <GroceryApp />
      <CartDrawerController />
    </CartProvider>
  );
}
