import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/90">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.svg"
            alt="QuickBlog"
            className="h-9 w-9 object-cover object-left"
          />
          <span className="text-[22px] font-bold tracking-tight text-slate-900 dark:text-white">
            Quickblog
          </span>
        </Link>

        <nav className="flex items-center gap-5">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/my-posts" className={linkClass}>
              My Posts
            </NavLink>
          )}
          {isAuthenticated && (
            <NavLink to="/posts/new" className={linkClass}>
              New Post
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/users" className={linkClass}>
              User Management
            </NavLink>
          )}
          <button
            onClick={toggleTheme}
            className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300 sm:inline-block">
                {user.username}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 dark:border-gray-800 dark:text-gray-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-indigo-600 px-7 py-2.5 text-sm font-semibold text-white"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
