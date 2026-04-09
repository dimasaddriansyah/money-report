import { HashRouter } from "react-router-dom";
import AppContent from "./AppContent";

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}