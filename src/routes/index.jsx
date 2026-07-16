import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminDashboard from '../pages/AdminDashboard';
import BlogDetail from '../pages/BlogDetail';
import CreatePost from '../pages/CreatePost';
import MyPosts from '../pages/MyPosts';
import UserManagement from '../pages/UserManagement';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'blog/:id', element: <BlogDetail /> },
      {
        path: 'my-posts',
        element: (
          <ProtectedRoute>
            <MyPosts />
          </ProtectedRoute>
        ),
      },
      {
        path: 'posts/new',
        element: (
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute roles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <div className="p-10 text-center text-xl font-bold">404 - Page not found</div>,
      },
    ],
  },
]);
