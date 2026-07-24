import { useEffect, useState } from "react";
import "./Dashboard.css";

const url = import.meta.env.VITE_BASE_URL;

const createStats = ({ users, paintings, events, sales }) => [
  {
    title: "Total Users",
    value: users === null ? "\u2014" : users.toLocaleString("en-IN"),
    tone: "rose",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" /></svg>,
  },
  {
    title: "Total Paintings",
    value: paintings === null ? "\u2014" : paintings.toLocaleString("en-IN"),
    tone: "berry",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="m21 16-5.5-5.5L7 19" /></svg>,
  },
  {
    title: "Total Events",
    value: events === null ? "\u2014" : events.toLocaleString("en-IN"),
    tone: "lavender",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>,
  },
  {
    title: "Total Sales",
    value: sales === null ? "\u2014" : `\u20B9${sales.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`,
    tone: "violet",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M16 7.5a3.5 3.5 0 0 0-3.5-2.5h-1A3.5 3.5 0 0 0 8 8.5 3.5 3.5 0 0 0 11.5 12h1A3.5 3.5 0 0 1 16 15.5 3.5 3.5 0 0 1 12.5 19h-1A3.5 3.5 0 0 1 8 16.5" /></svg>,
  },
];

const Dashboard = () => {
  const [summary, setSummary] = useState({ users: null, paintings: null, events: null, sales: null });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    let isActive = true;

    const loadSummary = async () => {
      // Primary: Call dedicated fast /admin/stats endpoint
      try {
        const response = await fetch(`${url}/admin/stats`, { headers });
        if (response.ok) {
          const payload = await response.json();
          if (payload && payload.success && payload.data && isActive) {
            setSummary({
              users: payload.data.users ?? 0,
              paintings: payload.data.paintings ?? 0,
              events: payload.data.events ?? 0,
              sales: payload.data.sales ?? 0,
            });
            return;
          }
        }
      } catch (err) {
        console.warn("Dedicated stats endpoint error, trying fallback:", err);
      }

      // Secondary Fallback: Multi-endpoint collection fetch
      try {
        const fetchSafe = async (ep) => {
          try {
            const res = await fetch(`${url}${ep}`, { headers });
            const json = await res.json();
            const rawData = json.data || (Array.isArray(json) ? json : []);
            return Array.isArray(rawData) ? rawData : (rawData.content || []);
          } catch (e) {
            return [];
          }
        };

        const [users, paintings, events, orders] = await Promise.all([
          fetchSafe("/users"),
          fetchSafe("/paintings"),
          fetchSafe("/events"),
          fetchSafe("/admin/orders"),
        ]);

        const sales = orders
          .filter((o) => o.orderStatus !== "REJECT" && o.orrderStatus !== "REJECT")
          .reduce((total, o) => total + Number(o.totalAmount || 0), 0);

        if (isActive) {
          setSummary({ users: users.length, paintings: paintings.length, events: events.length, sales });
        }
      } catch (error) {
        console.error("Dashboard summary could not be loaded", error);
      }
    };

    loadSummary();
    const refreshId = window.setInterval(loadSummary, 15000);
    return () => {
      isActive = false;
      window.clearInterval(refreshId);
    };
  }, []);

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <p className="dashboard-hero__eyebrow">Overview</p>
        <h1>Admin Dashboard</h1>
      </div>

      <div className="dashboard-stats">
        {createStats(summary).map((stat) => (
          <article key={stat.title} className={`dashboard-card dashboard-card--${stat.tone}`}>
            <div className="dashboard-card__icon">{stat.icon}</div>
            <div className="dashboard-card__content">
              <div className="dashboard-card__valueRow">
                <span className="dashboard-card__value">{stat.value}</span>
              </div>
              <h2>{stat.title}</h2>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
