import { useEffect, useState } from "react";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Dashboard } from "./pages/Dashboard";

const getRoute = () => (window.location.hash.replace("#", "") || "/");

const App = () => {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return route.startsWith("/admin") ? <AdminDashboard /> : <Dashboard />;
};

export default App;
