import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/AuthService";
import { useAuth } from "../hooks/useAuth";
import cashflow from "../../../assets/cashflow.png"
import { toast } from "sonner";
import { Key02Icon, Mail01Icon, ViewIcon, ViewOffSlashIcon } from "hugeicons-react";

export default function LoginPage() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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

  return (
    <div className="flex flex-col gap-8 min-h-screen items-center justify-center bg-slate-100">
      <img src={cashflow} alt="Banner" className="w-20 h-20" />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-lg  rounded-xl bg-white p-8 shadow-lg space-y-4">

        <h1 className="text-2xl font-bold text-center">Login</h1>

        <div id="email" className="flex-1">
          <label className="block text-sm font-medium text-black mb-1">Email</label>
          <div
            className="relative flex items-center justify-center">
            <div className="absolute left-4 pointer-events-none"><Mail01Icon className="text-slate-400" size={20} /></div>
            <input
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className={`block w-full ps-13 pe-3 py-3 text-base rounded-xl border ${email ? "text-black" : "text-slate-400"} bg-white! border-slate-300 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-slate-400 transition appearance-none`}
              placeholder="demo@gmail.com"
              required />
          </div>
        </div>

        <div id="password" className="flex-1">
          <label className="block text-sm font-medium text-black mb-1">Password</label>

          <div className="relative flex items-center">
            <div className="absolute left-4 pointer-events-none"><Key02Icon className="text-slate-400" size={20} /></div>

            <input
              value={password}
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              className={`block w-full ps-13 pe-13 py-3 text-base rounded-xl border bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-slate-400 transition
                 ${password ? "text-black" : "text-slate-400"}`}
              placeholder="Input your password"
              required/>

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 text-slate-400 hover:text-black cursor-pointer">
              {showPassword ? (
                <ViewIcon size={20} />
              ) : (
                <ViewOffSlashIcon size={20} />
              )}
            </button>

          </div>
        </div>

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