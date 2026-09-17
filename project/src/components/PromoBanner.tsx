import { useState, useEffect } from 'react';

const banners = [
  {
    title: 'Fresh Vegetables',
    subtitle: 'Farm to home in 24 hours',
    cta: 'Shop Now',
    slug: 'fruits-vegetables',
    bg: 'from-green-500 to-emerald-600',
    image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Pantry Essentials',
    subtitle: 'Up to 25% off on staples & masalas',
    cta: 'Grab Deals',
    slug: 'staples-pantry',
    bg: 'from-amber-500 to-orange-600',
    image: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Tea & Coffee',
    subtitle: 'Start your day fresh',
    cta: 'Explore',
    slug: 'tea-coffee',
    bg: 'from-rose-500 to-pink-600',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

interface PromoBannerProps {
  onSelect: (slug: string) => void;
}

export default function PromoBanner({ onSelect }: PromoBannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="relative h-44 sm:h-56 rounded-2xl overflow-hidden">
        {banners.map((banner, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <div className={`relative h-full bg-gradient-to-r ${banner.bg} flex items-center overflow-hidden`}>
              <div className="flex-1 px-6 sm:px-10 z-10">
                <h3 className="text-xl sm:text-3xl font-bold text-white">{banner.title}</h3>
                <p className="text-sm sm:text-base text-white/80 mt-1">{banner.subtitle}</p>
                <button
                  onClick={() => onSelect(banner.slug)}
                  className="mt-3 px-5 py-2 text-sm font-semibold text-gray-900 bg-white hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
                >
                  {banner.cta}
                </button>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30">
                <img src={banner.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.bg} opacity-40`} />
            </div>
          </div>
        ))}

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
