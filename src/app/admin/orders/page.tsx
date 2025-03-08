"use client";

import { useEffect, useState } from 'react';

interface Order {
  id: string;
  request_id: string;
  printer_id: string;
  status: string;
  price: number;
  payment_status: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update the order status in the local state
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error('Failed to update order status:', response.status);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Request ID</th>
            <th className="px-4 py-2">Printer ID</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Payment Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border px-4 py-2">{order.request_id}</td>
              <td className="border px-4 py-2">{order.printer_id}</td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2">{order.price}</td>
              <td className="border px-4 py-2">{order.payment_status}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => handleStatusChange(order.id, 'pending')}
                >
                  Pending
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => handleStatusChange(order.id, 'accepted')}
                >
                  Accepted
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleStatusChange(order.id, 'rejected')}
                >
                  Rejected
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}