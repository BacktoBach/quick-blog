import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-600 to-cyan-500 px-4 py-8 sm:px-6 sm:py-12">
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}
