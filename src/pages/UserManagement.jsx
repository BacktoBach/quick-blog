import { useEffect, useState } from 'react';
import { deleteUser, getUsers, updateUserRole } from '../api/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      setUsers(await getUsers());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    getUsers()
      .then((data) => {
        if (mounted) setUsers(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleRole = async (user) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await updateUserRole(user.id || user._id, nextRole);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (user) => {
    const ok = window.confirm(`Delete user "${user.username}" and their posts?`);
    if (!ok) return;

    try {
      await deleteUser(user.id || user._id);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">Admin-only route for role changes and account deletion.</p>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">{error}</div>}

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading users...</div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800">
              <tr>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((user) => (
                <tr key={user.id || user._id}>
                  <td className="px-5 py-4 font-semibold text-gray-950 dark:text-white">{user.username}</td>
                  <td className="px-5 py-4 text-gray-500">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {user.role}
                    </span>
                  </td>
                  <td className="space-x-4 px-5 py-4 text-right">
                    <button onClick={() => handleRole(user)} className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Toggle role
                    </button>
                    <button onClick={() => handleDelete(user)} className="font-semibold text-red-600 hover:text-red-500">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

