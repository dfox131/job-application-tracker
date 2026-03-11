import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ApplicationFormPage from "./pages/ApplicationFormPage";

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <Link to="/">Dashboard</Link>
          <Link to="/new">Add Application</Link>
        </nav>

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/new" element={<ApplicationFormPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}