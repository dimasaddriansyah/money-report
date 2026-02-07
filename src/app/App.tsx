import { HashRouter } from "react-router-dom";
import AppRoutes from "./Routes";
import BottomNav from "../components/layout/BottomNav";

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
      <BottomNav />
    </HashRouter>
  );
}
