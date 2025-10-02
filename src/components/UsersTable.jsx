import React, { useEffect, useState } from "react";
import { getUsers, updateUser, deleteUser } from "../services/users";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [fields, setFields] = useState({});

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No auth token; users table will not load");
      return;
    }
    load();
  }, []);

  const onEdit = (u) => {
    const uid = u.id ?? u._id;
    setEditingId(uid);
    setFields({
      firstName: u.firstName ?? "",
      lastName: u.lastName ?? "",
      email: u.email ?? "",
      phoneNumber: u.phoneNumber ?? "",
      parentPhoneNumber: u.parentPhoneNumber ?? "",
      role: u.role ?? "",
    });
  };

  const onCancel = () => {
    setEditingId(null);
    setFields({});
  };

  const onChange = (name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async (userId) => {
    try {
      await updateUser(userId, fields);
      setUsers((prev) => prev.map((u) => (u._id === userId || u.id === userId ? { ...u, ...fields } : u)));
      onCancel();
    } catch (e) {
      console.error(e);
      alert("Failed to update user");
    }
  };

  const onDelete = async (userId) => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => (u._id ?? u.id) !== userId));
    } catch (e) {
      console.error(e);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-white">Users</h2>
        <button className="bg-gray-200 px-3 py-1 rounded" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && Array.isArray(users) && (
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">First Name</th>
              <th className="p-2 border">Last Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Parent Phone</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {users.map((u) => {
              const uid = u.id ?? u._id;
              const isEditing = editingId === uid;
              return (
                <tr key={uid} className="border-b">
                  <td className="p-2 border text-xs">{uid}</td>
                  <td className="p-2 border">
                    {isEditing ? (
                      <input className="border px-2 py-1 w-full" value={fields.firstName} onChange={(e) => onChange("firstName", e.target.value)} />
                    ) : (
                      u.firstName
                    )}
                  </td>
                  <td className="p-2 border">
                    {isEditing ? (
                      <input className="border px-2 py-1 w-full" value={fields.lastName} onChange={(e) => onChange("lastName", e.target.value)} />
                    ) : (
                      u.lastName
                    )}
                  </td>
                  <td className="p-2 border">
                    {isEditing ? (
                      <input className="border px-2 py-1 w-full" value={fields.email} onChange={(e) => onChange("email", e.target.value)} />
                    ) : (
                      u.email
                    )}
                  </td>
                  <td className="p-2 border">
                    {isEditing ? (
                      <input className="border px-2 py-1 w-full" value={fields.phoneNumber} onChange={(e) => onChange("phoneNumber", e.target.value)} />
                    ) : (
                      u.phoneNumber
                    )}
                  </td>
                  <td className="p-2 border">
                    {isEditing ? (
                      <input className="border px-2 py-1 w-full" value={fields.parentPhoneNumber} onChange={(e) => onChange("parentPhoneNumber", e.target.value)} />
                    ) : (
                      u.parentPhoneNumber
                    )}
                  </td>
                  <td className="p-2 border">
                    {isEditing ? (
                      <input className="border px-2 py-1 w-full" value={fields.role} onChange={(e) => onChange("role", e.target.value)} />
                    ) : (
                      u.role
                    )}
                  </td>
                  <td className="p-2 border space-x-2">
                    {isEditing ? (
                      <>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => onSave(uid)}>Save</button>
                        <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={onCancel}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => onEdit(u)}>Edit</button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => onDelete(uid)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersTable;


