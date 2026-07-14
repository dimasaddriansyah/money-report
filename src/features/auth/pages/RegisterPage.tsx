import { Mail01Icon, Key02Icon, ViewIcon, ViewOffSlashIcon, UserIcon, } from "hugeicons-react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import TextField from "../../../shared/ui/TextField";
import cashflow from "../../../assets/cashflow.png"
import { useAuth } from "../hooks/useAuth";
import { register } from "../services/AuthService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await register({ name, email, password });
      
      toast.success("Success", {
        description: (`Hello, Welcome ${name} 👋`)
      });

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error(err);
      toast.error("Error", {
        description: "Register failed!",
      });
    } finally {
      setLoading(false);
    }
  }

  function validate() {
    const newErrors = {
      name: "",
      email: "",
      password: "",
    };

    if (!name.trim()) {
      newErrors.name = "Full Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email format is invalid";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  }

  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center bg-slate-100">
      <img src={cashflow} alt="Banner" className="w-20 h-20 object-contain" />
      <form
        noValidate
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-lg rounded-xl bg-white p-8 shadow-lg space-y-4">
        <h1 className="m-0 text-2xl font-bold text-center">Register</h1>

        <TextField
          label="Full Name"
          type="text"
          leftIcon={<UserIcon size={20} className={errors.name ? "text-red-400" : "text-slate-400"} />}
          value={name}
          placeholder="John Doe"
          error={errors.name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({
              ...prev,
              name: "",
            }));
          }} />

        <TextField
          label="Email"
          type="email"
          leftIcon={<Mail01Icon size={20} className={errors.email ? "text-red-400" : "text-slate-400"} />}
          value={email}
          placeholder="demo@gmail.com"
          error={errors.email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({
              ...prev,
              email: "",
            }));
          }} />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          leftIcon={<Key02Icon size={20} className={errors.password ? "text-red-400" : "text-slate-400"} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer text-slate-400 hover:text-black">
              {showPassword ? (
                <ViewIcon size={20} className={errors.password ? "text-red-400" : "text-slate-400"} />
              ) : (
                <ViewOffSlashIcon size={20} className={errors.password ? "text-red-400" : "text-slate-400"} />
              )}
            </button>
          }
          value={password}
          placeholder="Input your password"
          error={errors.password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({
              ...prev,
              password: "",
            }));
          }} />

        <div className="flex flex-col items-center justify-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-sm font-semibold p-3 text-white hover:bg-black/80 rounded-xl disabled:opacity-50 cursor-pointer">
            {loading ? "Loading..." : "Register"}
          </button>
          <span className="text-sm text-slate-600">Already have account ?
            <Link
              to="/login"
              className="text-sm font-semibold text-blue-500 hover:text-blue-600 cursor-pointer pl-1">
              Login Now
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}