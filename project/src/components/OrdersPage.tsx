import { useState } from 'react';
import { Search, Package, Clock, Check, Truck, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';

interface OrdersPageProps {
  onBack: () => void;
}

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  placed: { label: 'Order Placed', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  confirmed: { label: 'Confirmed', icon: Check, color: 'text-amber-600', bg: 'bg-amber-50' },
  out_for_delivery: { label: 'Out for Delivery', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
  delivered: { label: 'Delivered', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  cancelled: { label: 'Cancelled', icon: X, color: 'text-rose-500', bg: 'bg-rose-50' },
};

export default function OrdersPage({ onBack }: OrdersPageProps) {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!/^\d{10}$/.test(phone)) return;
    setLoading(true);
    setSearched(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', phone)
      .order('created_at', { ascending: false });
    setLoading(false);
    if (!error && data) setOrders(data as Order[]);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={onBack} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium mb-4">
        ← Back to Shopping
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Track Your Orders</h1>
      <p className="text-sm text-gray-500 mb-5">Enter your phone number to see your order history</p>

      <div className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit phone number"
            maxLength={10}
            className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || phone.length !== 10}
          className="px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Find Orders'}
        </button>
      </div>

      {searched && orders && orders.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">No orders found</h3>
          <p className="text-sm text-gray-500 mt-1">No orders associated with this phone number</p>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = statusConfig[order.status] || statusConfig.placed;
            const StatusIcon = config.icon;
            const date = new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
                  <div>
                    <p className="text-xs text-gray-400">Order ID</p>
                    <p className="text-sm font-mono font-bold text-gray-800">{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg}`}>
                    <StatusIcon className={`w-4 h-4 ${config.color}`} />
                    <span className={`text-xs font-semibold ${config.color}`}>{config.label}</span>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <p className="text-xs text-gray-400 mb-3">{date}</p>

                  <div className="space-y-2 mb-3">
                    {(order.items as Array<{ name: string; quantity: number; unit: string }>).map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.name} × {item.quantity}</span>
                        <span className="text-gray-500">{item.unit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                    <div className="text-sm">
                      <span className="text-gray-500">Total: </span>
                      <span className="font-bold text-gray-900">₹{order.total}</span>
                      <span className="text-gray-400 text-xs ml-2">
                        ({order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method})
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{order.city}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
