import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipboardList, LogOut, Moon, Plus, Sun, UserRound, UsersRound } from "lucide-react";
import logo from "../../assets/logoimg.png";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { showToast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    showToast("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="relative z-50 border-b border-slate-100 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" aria-label="QuickBlog home" className="inline-flex shrink-0">
          <img src={logo} alt="QuickBlog" className="h-10 w-auto sm:h-12" />
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            to="/posts/new"
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 sm:px-5"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
            <span className="hidden sm:inline">Create Blog</span>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? "Use light theme" : "Use dark theme"}
            className="grid h-10 w-10 place-items-center rounded-md text-slate-900 transition hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
          >
            {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            <span className="sr-only">Toggle theme</span>
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-expanded={isMenuOpen}
                aria-label="Open user menu"
                className="grid h-11 w-11 place-items-center rounded-md border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <UserRound className="h-6 w-6" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <MenuLink to="/my-posts" icon={ClipboardList} onClick={() => setIsMenuOpen(false)}>
                    My Posts
                  </MenuLink>
                  {isAdmin && (
                    <MenuLink to="/admin/users" icon={UsersRound} onClick={() => setIsMenuOpen(false)}>
                      User Management
                    </MenuLink>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              aria-label="Login"
              className="grid h-11 w-11 place-items-center rounded-md border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <UserRound className="h-6 w-6" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuLink({ to, icon: Icon, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
