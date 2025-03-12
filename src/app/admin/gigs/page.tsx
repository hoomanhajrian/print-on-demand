"use client";

import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Gig } from "@/app/types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const paginationModel = { page: 0, pageSize: 10 };

export default function AdminGigsPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [totalGigs, setTotalGigs] = useState(0);
  const [activeGigs, setActiveGigs] = useState(0);
  const [inactiveGigs, setInactiveGigs] = useState(0);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await fetch("/api/gigs");
        const data = await response.json();
        setGigs(data);
        calculateCounts(data);
      } catch (error) {
        console.error("Error fetching gigs:", error);
      }
    };

    fetchGigs();
  }, []);

  const calculateCounts = (gigs: Gig[]) => {
    const total = gigs.length;
    const active = gigs.filter((gig) => gig.active).length;
    const inactive = gigs.filter((gig) => !gig.active).length;

    setTotalGigs(total);
    setActiveGigs(active);
    setInactiveGigs(inactive);
  };

  const handleStatusChange = async (gigId: string, newStatus: boolean) => {
    try {
      const response = await fetch(`/api/gigs?id=${gigId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: newStatus }),
      });

      if (response.ok) {
        // Update the gig status in the local state
        const updatedGigs = gigs.map((gig) =>
          gig.id === gigId ? { ...gig, active: newStatus } : gig
        );
        setGigs(updatedGigs);
        calculateCounts(updatedGigs);
      } else {
        console.error("Failed to update gig status:", response.status);
      }
    } catch (error) {
      console.error("Error updating gig status:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, sortable: false },
    { field: "title", headerName: "Name", width: 150 },
    { field: "description", headerName: "Description", width: 250 },
    { field: "price", headerName: "Price", width: 130 },
    { field: "imageUrl", headerName: "Image URL", width: 250 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleStatusChange(params.id.toString(), true)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Deactivate"
          onClick={() => handleStatusChange(params.id.toString(), false)}
        />,
      ],
      width: 130,
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Gigs</h1>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Total Gigs</h2>
          <p className="text-2xl">{totalGigs}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Active Gigs</h2>
          <p className="text-2xl">{activeGigs}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Inactive Gigs</h2>
          <p className="text-2xl">{inactiveGigs}</p>
        </div>
      </div>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={gigs}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[10, 25, 50, 100]}
          sx={{ border: 2, borderColor: "divider" }}
        />
      </Paper>
    </div>
  );
}
