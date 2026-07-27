import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logoimg.png";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData);
      showToast("Login successful");
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-xl bg-white p-5 shadow-2xl sm:p-8">
      <div className="mb-6 flex justify-center sm:mb-8">
        <Link to="/" aria-label="QuickBlog home">
          <img src={logo} alt="QuickBlog" className="h-14 w-auto sm:h-16" />
        </Link>
      </div>

      {error && (
        <div
          className="mb-5 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600"
          role="alert"
        >
          {error}
        </div>
      )}

      <form className="space-y-3.5 sm:space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="sr-only">Email</span>
          <input
            type="email"
            value={formData.email}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, email: event.target.value }))
            }
            required
            autoComplete="email"
            className="h-11 w-full rounded-lg border border-slate-200 bg-indigo-50 px-4 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:h-12 sm:text-base"
            placeholder="Email"
          />
        </label>

        <label className="block">
          <span className="sr-only">Password</span>
          <input
            type="password"
            value={formData.password}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
            required
            autoComplete="current-password"
            className="h-11 w-full rounded-lg border border-slate-200 bg-indigo-50 px-4 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:h-12 sm:text-base"
            placeholder="Password"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:text-base"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 sm:mt-8">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-indigo-600 transition hover:text-indigo-500"
        >
          Signup
        </Link>
      </p>
    </section>
  );
}
