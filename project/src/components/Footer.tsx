import { ShoppingCart, Instagram, Facebook, Twitter, Youtube, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const sections = [
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Press', 'Blog', 'Sustainability'],
    },
    {
      title: 'Help',
      links: ['Customer Support', 'Track Order', 'Delivery Information', 'Returns & Refunds', 'FAQs'],
    },
    {
      title: 'Shop',
      links: ['Fruits & Vegetables', 'Dairy & Bakery', 'Staples & Pantry', 'Snacks & Beverages', 'Personal Care'],
    },
    {
      title: 'Policies',
      links: ['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Cookie Policy', 'Vendor Guidelines'],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Get grocery deals in your inbox</h3>
            <p className="text-sm text-gray-400 mt-1">Weekly offers, seasonal discounts, and new arrivals.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-64 px-4 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 outline-none focus:border-emerald-400 transition-colors"
            />
            <button className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold text-white">SabziWala</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              Your trusted neighbourhood grocery partner. Fresh produce, quality staples, and daily essentials — delivered to your door across India.
            </p>
            <div className="flex gap-2 mt-4">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="grid sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-800">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>1800-123-4567 (Toll Free)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>support@sabziwala.in</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Bengaluru, Karnataka 560001</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">© 2026 SabziWala Retail Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>Made in India</span>
            <span>·</span>
            <span>FSSAI Lic. No. 10024031000XXX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
