import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData);
      showToast("Account created successfully");
      navigate("/my-posts", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <section className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white">
            Create account
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            New accounts are created as normal users.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {[
            ["email", "Email", "email", "you@example.com"],
            ["username", "Username", "text", "yourname"],
            ["password", "Password", "password", "At least 6 characters"],
          ].map(([name, label, type, placeholder]) => (
            <label className="block" key={name}>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </span>
              <input
                name={name}
                type={type}
                value={formData[name]}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    [name]: event.target.value,
                  }))
                }
                required
                minLength={name === "password" ? 6 : undefined}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-800"
                placeholder={placeholder}
              />
            </label>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Login
          </Link>
        </p>
      </section>
    </div>
  );
}
