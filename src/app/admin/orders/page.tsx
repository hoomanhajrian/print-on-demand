"use client";

import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Order {
  id: string;
  client_id: string;
  printer_id: string;
  status: string;
  price: number;
  payment_status: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const paginationModel = { page: 0, pageSize: 10 };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        setOrders(data);
        calculateCounts(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const calculateCounts = (orders: Order[]) => {
    const pending = orders.filter((order) => order.status === "pending").length;
    const accepted = orders.filter(
      (order) => order.status === "accepted"
    ).length;
    const rejected = orders.filter(
      (order) => order.status === "rejected"
    ).length;

    setPendingCount(pending);
    setAcceptedCount(accepted);
    setRejectedCount(rejected);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update the order status in the local state
        const updatedOrders = orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        calculateCounts(updatedOrders);
      } else {
        console.error("Failed to update order status:", response.status);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, sortable: false },
    { field: "client_id", headerName: "Client ID", width: 150 },
    { field: "printer_id", headerName: "Printer ID", width: 150 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "price", headerName: "Price", width: 130 },
    { field: "payment_status", headerName: "Payment Status", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleStatusChange(params.id.toString(), "pending")}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Accept"
          onClick={() => handleStatusChange(params.id.toString(), "accepted")}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Reject"
          onClick={() => handleStatusChange(params.id.toString(), "rejected")}
        />,
      ],
      width: 130,
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Pending Orders</h2>
          <p className="text-2xl">{pendingCount}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Accepted Orders</h2>
          <p className="text-2xl">{acceptedCount}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Rejected Orders</h2>
          <p className="text-2xl">{rejectedCount}</p>
        </div>
      </div>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={orders}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[10, 25, 50, 100]}
          sx={{ border: 2, borderColor: "divider" }}
        />
      </Paper>
    </div>
  );
}
