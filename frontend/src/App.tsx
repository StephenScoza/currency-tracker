import { lazy, Suspense, useEffect, useState } from "react";

const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard").then((module) => ({ default: module.AdminDashboard })),
);
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((module) => ({ default: module.Dashboard })),
);

const getRoute = () => (window.location.hash.replace("#", "") || "/");

const App = () => {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-12 text-slate-200">
          <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm font-semibold tracking-[0.16em] text-white shadow-glow">
            Loading Reaisify...
          </div>
        </main>
      }
    >
      {route.startsWith("/admin") ? <AdminDashboard /> : <Dashboard />}
    </Suspense>
  );
};

export default App;
