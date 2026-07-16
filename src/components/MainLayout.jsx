import { useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function MainLayout() {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // ĐỒNG BỘ MÀU NỀN BODY
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#030712';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#fcfcfd';
    }
  }, [isDark]);

  const linkClass = ({ isActive }) =>
    `transition-colors text-[15px] font-medium py-1.5 ${
      isActive 
        ? 'text-[#4f46e5] dark:text-indigo-400' 
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
    }`;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-[#fcfcfd] text-gray-900 font-sans antialiased transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-6">
          
          {/* ================= LOGO MIX GIỮA ICON CŨ & TEXT MỚI ================= */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 select-none">
            <div className="w-9 h-9 overflow-hidden flex items-center justify-start">
              <img 
                src="/logo.svg" 
                alt="Logo" 
                className="h-9 max-w-none object-contain object-left" 
              />
            </div>
            <span className="text-[22px] font-bold tracking-tight text-slate-900 dark:text-white transition-colors">
              Quickblog
            </span>
          </Link>
          {/* =================================================================== */}

          {/* MENU ĐIỀU HƯỚNG */}
          <nav className="flex items-center gap-6">
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
            {isAdmin && (
              <NavLink to="/admin" className={linkClass}>
                Admin
              </NavLink>
            )}

            {/* NÚT ĐỔI THEME */}
            <button
              onClick={toggleTheme}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>

            {/* PHẦN ĐĂNG NHẬP / ĐĂNG XUẤT */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline-block rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-600 border border-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-[#4f46e5] px-[28px] py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* PHẦN NỘI DUNG CHÍNH */}
      <main className="w-full bg-[#fcfcfd] transition-colors duration-300 dark:bg-gray-950">
        <Outlet />
      </main>
    </div>
  );
}