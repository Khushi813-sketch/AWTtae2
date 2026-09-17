import { Apple, Milk, Wheat, Cookie, Sparkles, Home, Flame, Coffee } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryShowcaseProps {
  categories: Category[];
  onSelect: (slug: string) => void;
}

const iconMap: Record<string, typeof Apple> = {
  Apple, Milk, Wheat, Cookie, Sparkles, Home, Flame, Coffee,
};

export default function CategoryShowcase({ categories, onSelect }: CategoryShowcaseProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Shop by Category</h2>
          <p className="text-sm text-gray-500 mt-0.5">Everything for your daily needs</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Apple;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.slug)}
              className="group flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center group-hover:from-emerald-100 group-hover:to-green-200 transition-colors">
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight group-hover:text-emerald-700 transition-colors">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
