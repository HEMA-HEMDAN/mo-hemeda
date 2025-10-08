import React, { useEffect, useState, useCallback } from "react";
import { getUsers, updateUser, deleteUser } from "../../services/users";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [fields, setFields] = useState({});
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const filteredUsers = Array.isArray(users)
    ? users.filter((u) => (u.role || "").toLowerCase() === "user")
    : [];

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsers(10, page);
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No auth token; users table will not load");
      return;
    }
    load();
  }, [load]);

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
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId || u.id === userId ? { ...u, ...fields } : u
        )
      );
      onCancel();
    } catch (e) {
      console.error(e);
      alert("Failed to update user");
    } finally {
      setEditingId(null);
      toast.success("User updated successfully");
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
    } finally {
      toast.success("User deleted successfully");
    }
  };
  return (
    <section className="min-h-screen w-full  my-20 overflow-hidden lg:flex lg:flex-col lg:items-center lg:justify-center">
      <button
        onClick={() => navigate("/admin")}
        className="text-blue-600 hover:text-blue-800 font-medium mb-2 flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          User Management
        </h1>
        <p className="text-white/70 text-md lg:text-lg leading-relaxed">
          Manage student accounts and information
        </p>
      </div>

      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              📚 Students
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-1 rounded-full text-xs font-semibold">
              Page: {page}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm lg:text-lg px-2 py-3 lg:px-6 lg:py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={load}
              disabled={loading}
            >
              {loading ? "🔄 Loading..." : "🔄 Refresh"}
            </button>
            <button
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-sm lg:text-lg px-2 py-3 lg:px-6 lg:py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={loading || page === 1}
            >
              ⬅️ Prev 10
            </button>
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm lg:text-lg px-2 py-3 lg:px-6 lg:py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
            >
              ➡️ Next 10
            </button>
          </div>
        </div>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                Loading users...
              </p>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 dark:border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400 font-medium">
              ⚠️ {error}
            </p>
          </div>
        )}
        {!loading && !error && Array.isArray(users) && (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <tr>
                    {/* <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th> */}
                    <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      👤 First Name
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      👤 Last Name
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      📧 Email
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      📱 Phone
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      👨‍👩‍👧‍👦 Parent Phone
                    </th>
                    {/* <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      🎭 Role
                    </th> */}
                    <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      ⚙️ Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((u) => {
                    const uid = u.id ?? u._id;
                    const isEditing = editingId === uid;
                    return (
                      <tr
                        key={uid}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                          isEditing ? "bg-blue-50 dark:bg-blue-900/20" : ""
                        }`}
                      >
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{uid}</td> */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              value={fields.firstName}
                              onChange={(e) =>
                                onChange("firstName", e.target.value)
                              }
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {u.firstName || "-"}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              value={fields.lastName}
                              onChange={(e) =>
                                onChange("lastName", e.target.value)
                              }
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {u.lastName || "-"}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              value={fields.email}
                              onChange={(e) =>
                                onChange("email", e.target.value)
                              }
                            />
                          ) : (
                            <div className="text-sm text-gray-900 dark:text-white">
                              {u.email || "-"}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              value={fields.phoneNumber}
                              onChange={(e) =>
                                onChange("phoneNumber", e.target.value)
                              }
                            />
                          ) : (
                            <div className="text-sm text-gray-900 dark:text-white">
                              {u.phoneNumber || "-"}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              value={fields.parentPhoneNumber}
                              onChange={(e) =>
                                onChange("parentPhoneNumber", e.target.value)
                              }
                            />
                          ) : (
                            <div className="text-sm text-gray-900 dark:text-white">
                              {u.parentPhoneNumber || "-"}
                            </div>
                          )}
                        </td>
                        {/* <td className="px-4 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              value={fields.role}
                              onChange={(e) => onChange("role", e.target.value)}
                            />
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              {u.role || "user"}
                            </span>
                          )}
                        </td> */}
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <button
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium text-sm"
                                onClick={() => onSave(uid)}
                              >
                                💾 Save
                              </button>
                              <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium text-sm"
                                onClick={onCancel}
                              >
                                ❌ Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-medium text-sm"
                                onClick={() => onEdit(u)}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium text-sm"
                                onClick={() => onDelete(uid)}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4 w-full overflow-x-auto">
              {filteredUsers.map((u) => {
                const uid = u.id ?? u._id;
                const isEditing = editingId === uid;
                return (
                  <div
                    key={uid}
                    className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-4 transition-all duration-200 w-full overflow-x-auto ${
                      isEditing
                        ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "hover:shadow-xl"
                    }`}
                  >
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {u.firstName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {u.firstName || "Unknown"} {u.lastName || "User"}
                          </h3>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {u.role || "user"}
                          </span>
                        </div>
                      </div>
                      {!isEditing && (
                        <div className="flex items-center gap-2">
                          <button
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
                            onClick={() => onEdit(u)}
                          >
                            ✏️
                          </button>
                          <button
                            className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200"
                            onClick={() => onDelete(uid)}
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Mobile Content */}
                    <div className="space-y-3">
                      {/* Email */}
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500 dark:text-gray-400 text-sm w-16">
                          📧 Email:
                        </span>
                        {isEditing ? (
                          <input
                            className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                            value={fields.email}
                            onChange={(e) => onChange("email", e.target.value)}
                          />
                        ) : (
                          <span className="text-sm text-gray-900 dark:text-white flex-1">
                            {u.email || "-"}
                          </span>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500 dark:text-gray-400 text-sm w-16">
                          📱 Phone:
                        </span>
                        {isEditing ? (
                          <input
                            className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                            value={fields.phoneNumber}
                            onChange={(e) =>
                              onChange("phoneNumber", e.target.value)
                            }
                          />
                        ) : (
                          <span className="text-sm text-gray-900 dark:text-white flex-1">
                            {u.phoneNumber || "-"}
                          </span>
                        )}
                      </div>

                      {/* Parent Phone */}
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500 dark:text-gray-400 text-sm w-16">
                          👨‍👩‍👧‍👦 Parent:
                        </span>
                        {isEditing ? (
                          <input
                            className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                            value={fields.parentPhoneNumber}
                            onChange={(e) =>
                              onChange("parentPhoneNumber", e.target.value)
                            }
                          />
                        ) : (
                          <span className="text-sm text-gray-900 dark:text-white flex-1">
                            {u.parentPhoneNumber || "-"}
                          </span>
                        )}
                      </div>

                      {/* Name Fields - Only show when editing */}
                      {isEditing && (
                        <>
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-500 dark:text-gray-400 text-sm w-16">
                              👤 First:
                            </span>
                            <input
                              className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                              value={fields.firstName}
                              onChange={(e) =>
                                onChange("firstName", e.target.value)
                              }
                            />
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-500 dark:text-gray-400 text-sm w-16">
                              👤 Last:
                            </span>
                            <input
                              className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                              value={fields.lastName}
                              onChange={(e) =>
                                onChange("lastName", e.target.value)
                              }
                            />
                          </div>
                          {/* <div className="flex items-center space-x-3">
                            <span className="text-gray-500 dark:text-gray-400 text-sm w-16">
                              🎭 Role:
                            </span>
                            <input
                              className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                              value={fields.role}
                              onChange={(e) => onChange("role", e.target.value)}
                            />
                          </div> */}
                        </>
                      )}
                    </div>

                    {/* Mobile Action Buttons */}
                    {isEditing && (
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium text-sm"
                          onClick={() => onSave(uid)}
                        >
                          💾 Save Changes
                        </button>
                        <button
                          className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium text-sm"
                          onClick={onCancel}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AdminUsers;
