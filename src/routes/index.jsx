/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const BlogDetail = lazy(() => import("../pages/BlogDetail"));
const CreatePost = lazy(() => import("../pages/CreatePost"));
const MyPosts = lazy(() => import("../pages/MyPosts"));
const UserManagement = lazy(() => import("../pages/UserManagement"));

function LazyPage({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
          Loading page...
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <Home />
          </LazyPage>
        ),
      },
      {
        path: "login",
        element: (
          <LazyPage>
            <Login />
          </LazyPage>
        ),
      },
      {
        path: "signup",
        element: (
          <LazyPage>
            <Register />
          </LazyPage>
        ),
      },
      {
        path: "posts/:id",
        element: (
          <LazyPage>
            <BlogDetail />
          </LazyPage>
        ),
      },
      {
        path: "mypost",
        element: (
          <ProtectedRoute>
            <LazyPage>
              <MyPosts />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "create",
        element: (
          <ProtectedRoute>
            <LazyPage>
              <CreatePost />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "user-management",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <LazyPage>
              <UserManagement />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: (
          <div className="p-10 text-center text-xl font-bold">
            404 - Page not found
          </div>
        ),
      },
    ],
  },
]);
