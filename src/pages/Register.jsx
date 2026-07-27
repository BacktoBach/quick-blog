import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logoimg.png";
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
      navigate("/mypost", { replace: true });
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
        {[
          ["email", "Email", "email", "Email", "email"],
          ["username", "Username", "text", "Username", "username"],
          [
            "password",
            "Password",
            "password",
            "Password (at least 6 characters)",
            "new-password",
          ],
        ].map(([name, label, type, placeholder, autoComplete]) => (
          <label className="block" key={name}>
            <span className="sr-only">{label}</span>
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
              autoComplete={autoComplete}
              className="h-11 w-full rounded-lg border border-slate-200 bg-indigo-50 px-4 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:h-12 sm:text-base"
              placeholder={placeholder}
            />
          </label>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:text-base"
        >
          {loading ? "Creating..." : "Signup"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 sm:mt-8">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-indigo-600 transition hover:text-indigo-500"
        >
          Login
        </Link>
      </p>
    </section>
  );
}
