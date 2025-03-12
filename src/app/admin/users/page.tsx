"use client";

import { useEffect, useState } from "react";
import useApi from "@/app/hooks/useApi";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { User, Role } from "@/app/types"; // Import Role as well
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";

const paginationModel = { page: 0, pageSize: 10 };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { apiCall, data, loading, error } = useApi<User[]>();
  const Router = useRouter();

  // api actions
  const handleDelete = async (id: string) => {
    const response = await apiCall(`/api/users?id=${id}`, "DELETE");
    if (response) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const getUserOrdersCount = async (user_id: string) => {
    const response = await apiCall(`/api/orders?user_id=${user_id}`, "GET");
    if (response?.data) {
      return response.data.length;
    } else {
      return 0;
    }
  };

  const getUserGigsCount = async (user_id: string) => {
    const response = await apiCall(`/api/gigs?user_id=${user_id}`, "GET");
    if (response?.data) {
      return response.data.length;
    } else {
      return 0;
    }
  };

  const fetchUsersWithCounts = async () => {
    const response = await apiCall("/api/users", "GET");
    if (response?.data) {
      const usersWithCounts = await Promise.all(
        response.data.map(async (user) => {
          const ordersCount = await getUserOrdersCount(user.id);
          const gigsCount = await getUserGigsCount(user.id);
          return { ...user, ordersCount, gigsCount };
        })
      );
      setUsers(usersWithCounts);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, sortable: false },
    {
      field: "fullName",
      headerName: "Full name",
      description: "Full Name",
      width: 150,
      valueGetter: (value, row) =>
        `${row.first_name || ""} ${row.last_name || ""}`,
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 130,
      valueGetter: (value) => new Date(value).toLocaleDateString(),
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 130,
      valueGetter: (value) => new Date(value).toLocaleDateString(),
    },
    {
      field: "active_at",
      headerName: "Active At",
      width: 130,
      valueGetter: (value) => new Date(value).toLocaleDateString(),
    },
    {
      field: "role",
      headerName: "Role",
      type: "string",
      width: 130,
    },
    {
      field: "active",
      headerName: "Active",
      type: "boolean",
      width: 130,
    },
    {
      field: "ordersCount",
      headerName: "Orders",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="View"
          onClick={() => {
            Router.push(`/admin/orders?user_id=${params.id}`);
          }}
        />,
      ],
      width: 120,
    },
    {
      field: "gigsCount",
      headerName: "Gigs",
      type: "number",
      width: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => {}}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => {
            handleDelete(params.id.toString());
          }}
        />,
      ],
      width: 130,
    },
  ];

  useEffect(() => {
    fetchUsersWithCounts();
  }, [apiCall]);

  // const handleCreate = async (newUser: Omit<User, "id">) => {
  //   const {
  //     apiCall: apiCallCreate,
  //     data: createdUser,
  //     loading: creating,
  //     error: createError,
  //   } = useApi<User>();
  //   const response = await apiCallCreate("/api/users", "POST", newUser);
  //   if (response?.data) {
  //     setUsers([...users, response.data]);
  //   }
  // };

  // const handleUpdate = async (updatedUser: User) => {
  //   const response = await apiCall(`/api/users?id=${updatedUser.id}`, 'PUT', updatedUser);
  //   if (response?.data) {
  //     setUsers(
  //       users.map((user:User) =>
  //         user.id === updatedUser.id ? (response.data:ApiResponse) : user
  //       )
  //     );
  //   }
  // };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[10, 25, 50, 100]}
          sx={{ border: 2, borderColor: "divider" }}
          loading={loading}
        />
      </Paper>
    </div>
  );
}
