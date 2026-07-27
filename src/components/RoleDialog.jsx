import { ShieldCheck, UserRound, X } from "lucide-react";
import { useEffect, useRef } from "react";

const roles = [
  { value: "user", label: "User", Icon: UserRound },
  { value: "admin", label: "Admin", Icon: ShieldCheck },
];

export default function RoleDialog({
  user,
  role,
  saving,
  onClose,
  onRoleChange,
  onSave,
}) {
  const cancelButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!user) return undefined;

    cancelButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) onCloseRef.current();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [saving, user]);

  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end bg-slate-950/50 p-4 sm:items-center sm:justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-role-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="change-role-title"
              className="text-xl font-bold text-slate-950 dark:text-white"
            >
              Change User Role
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Select the new role for <strong>{user.username}</strong>.
            </p>
          </div>
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close change role dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <label
          className="mt-6 block text-sm font-semibold text-slate-900 dark:text-white"
          htmlFor="user-role"
        >
          Select role
        </label>
        <div className="relative mt-2">
          <select
            id="user-role"
            value={role}
            onChange={(event) => onRoleChange(event.target.value)}
            disabled={saving}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-3 pr-11 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-indigo-950"
          >
            {roles.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ShieldCheck className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving || role === user.role}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
