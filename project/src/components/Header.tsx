import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, MapPin, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Category } from '@/types';

interface HeaderProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigate: (page: string) => void;
}

const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

export default function Header({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onNavigate,
}: HeaderProps) {
  const { totalItems, setCartOpen } = useCart();
  const [cityOpen, setCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedCity = localStorage.getItem('grocery-city');
    if (savedCity) setSelectedCity(savedCity);
  }, []);

  useEffect(() => {
    localStorage.setItem('grocery-city', selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-emerald-900 text-emerald-50 text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <p className="hidden sm:block">Free delivery on orders above ₹500 · Same-day delivery in select cities</p>
          <p className="sm:hidden">Free delivery above ₹500</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('orders')} className="hover:text-white transition-colors">
              My Orders
            </button>
            <span className="hidden sm:inline">Help · 1800-123-4567</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className={`bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 sm:gap-6 h-16">
            {/* Logo */}
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-lg font-bold text-emerald-800 leading-none">SabziWala</span>
                <span className="block text-[10px] text-gray-500 leading-none mt-0.5">Daily Groceries, Delivered</span>
              </div>
            </button>

            {/* Location selector */}
            <div className="relative shrink-0" ref={cityRef}>
              <button
                onClick={() => setCityOpen(!cityOpen)}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                <div className="text-left hidden md:block">
                  <span className="block text-[10px] text-gray-500 leading-none">Deliver to</span>
                  <span className="block text-sm font-semibold text-gray-800 leading-none mt-0.5">{selectedCity}</span>
                </div>
                <span className="md:hidden text-sm font-semibold text-gray-800">{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {cityOpen && (
                <div className="absolute top-full mt-1 left-0 bg-white rounded-xl shadow-xl border border-gray-100 py-2 w-48 z-50">
                  <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase">Select City</p>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setCityOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 transition-colors ${
                        selectedCity === city ? 'text-emerald-700 font-semibold bg-emerald-50' : 'text-gray-700'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search for dal, atta, oil, vegetables..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shrink-0"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold text-sm">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 text-emerald-900 text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -mr-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Category nav - desktop */}
        <nav className="hidden lg:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1 h-12 overflow-x-auto">
              <button
                onClick={() => onCategoryChange('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.slug)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeCategory === cat.slug
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Category nav - mobile */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              <button
                onClick={() => {
                  onCategoryChange('all');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeCategory === 'all'
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onCategoryChange(cat.slug);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeCategory === cat.slug
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
