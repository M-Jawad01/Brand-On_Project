"use client";
import { useState, useEffect } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders");
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });
    if (res.ok) fetchOrders();
  };

  if (loading) return <div className="p-10 text-center text-indigo-600 font-bold text-xl">Loading Orders...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Customer Orders</h1>
        <button onClick={fetchOrders} className="text-sm bg-white border px-3 py-1 rounded shadow-sm hover:bg-gray-100">Refresh List</button>
      </div>

      <div className="grid gap-6">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No orders found yet!</p>
        ) : (
          orders.map((order: any) => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-md border-l-8 flex flex-col md:flex-row justify-between items-start md:items-center border-indigo-500">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-indigo-100 text-indigo-700">Order #{order.id.slice(-5)}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{order.customerName} <span className="text-sm font-normal text-gray-500">({order.phone})</span></h3>
                <p className="text-sm text-gray-600 mt-1">Material: <span className="font-semibold">{order.material?.name}</span> | Size: {order.width}" x {order.height}" | Qty: {order.quantity}</p>
                <p className="text-indigo-600 font-bold mt-2 text-lg">Total: ${order.totalPrice}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                <button onClick={() => updateStatus(order.id, "CONFIRMED")} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">Confirm Order</button>
                <button onClick={() => updateStatus(order.id, "COMPLETED")} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">Mark Done</button>
                <button onClick={() => updateStatus(order.id, "CANCELLED")} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition">Cancel</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}