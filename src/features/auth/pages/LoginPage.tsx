import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/AuthService";
import { useAuth } from "../hooks/useAuth";
import cashflow from "../../../assets/cashflow.png"
import { toast } from "sonner";
import { Key02Icon, Mail01Icon, ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import TextField from "../../../shared/ui/TextField";

export default function LoginPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await login(email, password);

      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Error", {
        description: "Incorrect email or password!",
      });
    } finally {
      setLoading(false);
    }
  }

  function validate() {
    const newErrors = {
      email: "",
      password: "",
    };

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
      <img src={cashflow} alt="Banner" className="w-40 h-40 object-contain" />
      <form
        noValidate
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-lg rounded-xl bg-white p-8 shadow-lg space-y-4">

        <h1 className="text-2xl font-bold text-center">Login</h1>

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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-sm font-semibold p-3 text-white hover:bg-black/80 rounded-xl disabled:opacity-50 cursor-pointer">
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}