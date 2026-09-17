import { Truck, Clock, Shield, Leaf } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
}

export default function Hero({ onShopNow }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 py-10 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full mb-4">
              Now serving 10+ Indian cities
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Fresh groceries at your <span className="text-emerald-600">doorstep</span> in 90 minutes
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
              From fresh vegetables and dairy to staples and household essentials — everything you need, delivered from your neighbourhood stores.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={onShopNow}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-200 active:scale-95"
              >
                Start Shopping
              </button>
              <button className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl border border-gray-200 transition-all hover:shadow-md active:scale-95">
                Explore Offers
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">90 min Express</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">Farm Fresh</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">Quality Assured</span>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="hidden lg:block relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Fresh groceries"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent" />
            </div>
            {/* Floating cards */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-[float_3s_ease-in-out_infinite]">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">100% Fresh</p>
                <p className="text-xs text-gray-500">Sourced daily</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-[float_3s_ease-in-out_infinite_0.5s]">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Truck className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">₹0 Delivery</p>
                <p className="text-xs text-gray-500">Above ₹500</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
