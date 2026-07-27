import { useEffect, useState } from "react";
import { KeyRound, Trash2 } from "lucide-react";
import ConfirmDialog from "../components/ConfirmDialog";
import RoleDialog from "../components/RoleDialog";
import { deleteUser, getUsers, updateUserRole } from "../services/userService";
import { useToast } from "../context/ToastContext";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("user");
  const [savingRole, setSavingRole] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState("");
  const { showToast } = useToast();

  const loadUsers = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      setError("");
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

  const openRoleDialog = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
  };

  const handleRoleSave = async () => {
    if (!selectedUser || selectedRole === selectedUser.role) return;

    setSavingRole(true);
    try {
      setError("");
      await updateUserRole(selectedUser.id, selectedRole);
      setSelectedUser(null);
      await loadUsers(false);
      showToast("User role updated");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingRole(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeletingUserId(userToDelete.id);
      setError("");
      await deleteUser(userToDelete.id);
      await loadUsers(false);
      setUserToDelete(null);
      showToast("User deleted successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingUserId("");
    }
  };

  return (
    <section className="mx-auto max-w-6xl space-y-7 px-5 py-8 sm:px-8 sm:py-12">
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-3 text-3xl font-extrabold text-gray-950 dark:text-white sm:text-4xl">
          <span aria-hidden="true" className="text-4xl leading-none">
            🧩
          </span>
          <span className="text-blue-600 dark:text-blue-400">
            User Management
          </span>
        </h1>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading users...</div>
      ) : error ? null : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <table className="min-w-[720px] w-full text-left text-sm">
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
                <tr key={user.id}>
                  <td className="px-5 py-4 font-semibold text-gray-950 dark:text-white">
                    {user.username}
                  </td>
                  <td className="px-5 py-4 text-gray-500">{user.email}</td>
                  <td className="px-5 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => openRoleDialog(user)}
                        className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-50 text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-950"
                        aria-label={`Change role for ${user.username}`}
                        title="Change role"
                      >
                        <KeyRound className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setUserToDelete(user)}
                        disabled={deletingUserId === user.id}
                        className="grid h-10 w-10 place-items-center rounded-lg bg-red-500 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`Delete ${user.username}`}
                        title="Delete user"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RoleDialog
        user={selectedUser}
        role={selectedRole}
        saving={savingRole}
        onClose={() => !savingRole && setSelectedUser(null)}
        onRoleChange={setSelectedRole}
        onSave={handleRoleSave}
      />
      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="Delete user?"
        message={`"${userToDelete?.username || ""}" and their posts will be permanently deleted.`}
        loading={deletingUserId === userToDelete?.id}
        onClose={() => !deletingUserId && setUserToDelete(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}

function RoleBadge({ role }) {
  const isAdmin = role === "admin";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        isAdmin
          ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
          : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
      }`}
    >
      {role}
    </span>
  );
}
