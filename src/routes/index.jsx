import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // Đưa MainLayout bọc ở ngoài cùng làm khung chung
    children: [
      {
        index: true, // Khi vào đường dẫn '/' thì ruột sẽ là trang Home
        element: <Home />,
      },
      {
        path: 'login', // Lưu ý: làm children thì không cần dấu gạch chéo / ở đầu nữa bồ nhé
        element: <Login />,
      },
      {
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: '*',
        element: <div className="p-10 text-center font-bold text-xl">404 - Không tìm thấy trang bồ ơi! 🔍</div>,
      }
    ]
  }
]);