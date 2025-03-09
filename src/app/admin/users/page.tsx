"use client";

import { useEffect, useState } from 'react';
import useApi from '@/app/hooks/useApi';
import { User, Role,ApiResponse } from '@/app/types'; // Import Role as well

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { apiCall, data, loading, error } = useApi<User[]>();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await apiCall('/api/users', 'GET');
      if (response?.data) {
        setUsers(response.data);
      }
    };

    fetchUsers();
  }, [apiCall]);

  const handleCreate = async (newUser: Omit<User, 'id'>) => {
    const { apiCall: apiCallCreate, data: createdUser, loading: creating, error: createError } = useApi<User>();
    const response = await apiCallCreate('/api/users', 'POST', newUser);
    if (response?.data) {
      setUsers([...users, response.data]);
    }
  };

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

  const handleDelete = async (id: string) => {
    const response = await apiCall(`/api/users?id=${id}`, 'DELETE');
    if (response) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Users</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {/* DataTable, CreateForm, EditForm, DeleteButton components go here */}
    </div>
  );
}