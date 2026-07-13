import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function MainLayout() {
  const { isDark, toggleTheme } = useTheme();

  return (
    // Sử dụng trực tiếp class dark: của Tailwind v4
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md transition-colors dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6">
          
          {/* LOGO */}
          <Link to="/" className="text-xl font-black tracking-wider text-indigo-600 dark:text-indigo-400">
            QUICK<span className="text-gray-800 dark:text-gray-200">BLOG</span>
          </Link>

          {/* MENU */}
          <nav className="flex items-center gap-6 font-medium text-sm">
            <Link to="/" className="hover:text-indigo-500 transition">Trang chủ</Link>
            <Link to="/admin" className="hover:text-indigo-500 transition">Admin</Link>
            <Link to="/login" className="hover:text-indigo-500 transition">Đăng nhập</Link>

            {/* NÚT ĐỔI THEME */}
            <button
              onClick={toggleTheme}
              className="ml-2 rounded-lg p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
          </nav>

        </div>
      </header>

      {/* RENDER NỘI DUNG CÁC TRANG CON */}
      <main className="mx-auto max-w-7xl p-6">
        <Outlet />
      </main>
    </div>
  );
}