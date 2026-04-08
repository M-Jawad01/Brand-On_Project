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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchOrders(); 
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="min-h-screen bg-brand-base flex items-center justify-center text-brand-primary font-black text-xl tracking-widest animate-pulse">LOADING ORDERS...</div>;

  return (
    <div className="min-h-screen bg-brand-base p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-10 tracking-tighter uppercase border-b border-brand-accent/30 pb-4">Customer Orders</h1>
        
        <div className="grid gap-6">
          {orders.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-medium">No orders found yet.</div>
          ) : (
            orders.map((order: any) => (
              <div key={order.id} className="bg-brand-secondary-light p-8 rounded-xl border border-brand-accent/30 shadow-lg flex flex-col md:flex-row justify-between items-center hover:border-brand-primary/50 transition-all">
                
                <div className="flex-1 w-full mb-6 md:mb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] px-3 py-1 rounded border border-brand-primary/30 bg-brand-primary/10">
                      ORDER #{order.id.slice(-5)}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-white tracking-tight mb-1">{order.customerName}</h3>
                  <p className="text-gray-400 text-sm font-medium mb-1">Phone: {order.customerPhone || "N/A"}</p>
                  <p className="text-gray-400 text-sm font-medium mb-5">Address: {order.customerAddress || "N/A"}</p>
                  
                  <div className="bg-brand-base/50 p-4 rounded-lg border border-brand-accent/20 inline-block w-full md:w-auto">
                      <p className="text-sm text-gray-300 mb-1">Material: <span className="text-white font-bold">{order.material?.name || "Unknown"}</span></p>
                      <p className="text-sm text-gray-300">Size: {order.widthFt}ft x {order.heightFt}ft | Qty: {order.quantity}</p>
                  </div>
                  
                  <p className="text-4xl font-black text-brand-primary mt-6 tracking-tighter">৳{order.totalPrice}</p>
                </div>
                
                <div className="flex flex-wrap gap-3 w-full md:w-auto md:flex-col justify-end">
                  {order.status !== "CONFIRMED" && order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
                    <button onClick={() => updateStatus(order.id, "CONFIRMED")} className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-600/50 font-black text-[10px] tracking-[0.2em] py-3 px-6 rounded-lg transition-all uppercase">
                      CONFIRM ORDER
                    </button>
                  )}
                  {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
                    <button onClick={() => updateStatus(order.id, "COMPLETED")} className="bg-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white border border-brand-primary/50 font-black text-[10px] tracking-[0.2em] py-3 px-6 rounded-lg transition-all uppercase">
                      MARK DONE
                    </button>
                  )}
                  {order.status !== "CANCELLED" && order.status !== "COMPLETED" && (
                    <button onClick={() => updateStatus(order.id, "CANCELLED")} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 font-black text-[10px] tracking-[0.2em] py-3 px-6 rounded-lg transition-all uppercase">
                      CANCEL ORDER
                    </button>
                  )}
                  
                  <button onClick={() => deleteOrder(order.id)} className="bg-gray-800 text-gray-400 hover:bg-red-600 hover:text-white border border-gray-700 hover:border-red-600 font-black text-[10px] tracking-[0.2em] py-3 px-6 rounded-lg transition-all uppercase mt-2 md:mt-4">
                    DELETE ORDER
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case "PENDING": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
    case "CONFIRMED": return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    case "COMPLETED": return "bg-brand-primary/10 text-brand-primary border-brand-primary/30";
    case "CANCELLED": return "bg-red-500/10 text-red-500 border-red-500/30";
    default: return "bg-gray-500/10 text-gray-400 border-gray-500/30";
  }
}