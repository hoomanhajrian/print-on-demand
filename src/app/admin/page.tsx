"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalGigs: 0,
  });

  useEffect(() => {
    // Fetch data from your API endpoints
    const fetchMetrics = async () => {
      try {
        const usersResponse = await fetch("/api/users");
        const usersData = await usersResponse.json();
        const ordersResponse = await fetch("/api/orders");
        const ordersData = await ordersResponse.json();
        const gigsResponse = await fetch("/api/gigs");
        const gigsData = await gigsResponse.json();

        setMetrics({
          totalUsers: usersData.length,
          totalOrders: ordersData.length,
          totalGigs: gigsData.length,
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl">{metrics.totalUsers}</p>
        </div>
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p className="text-3xl">{metrics.totalOrders}</p>
        </div>
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold">Total Gigs</h2>
          <p className="text-3xl">{metrics.totalGigs}</p>
        </div>
      </div>
    </div>
  );
}
