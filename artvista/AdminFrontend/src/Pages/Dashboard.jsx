import "./Dashboard.css";

const stats = [
  {
    title: "Total Users",
    value: "25",
    tone: "rose",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
      </svg>
    ),
  },
  {
    title: "Total Paintings",
    value: "120",
    tone: "berry",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="m21 16-5.5-5.5L7 19" />
      </svg>
    ),
  },
  {
    title: "Total Events",
    value: "85",
    tone: "lavender",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </svg>
    ),
  },
  {
    title: "Total Sale",
    value: "$50",
    suffix: "/ mo",
    detail: "25,999",
    tone: "violet",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v18M16 7.5a3.5 3.5 0 0 0-3.5-2.5h-1A3.5 3.5 0 0 0 8 8.5 3.5 3.5 0 0 0 11.5 12h1A3.5 3.5 0 0 1 16 15.5 3.5 3.5 0 0 1 12.5 19h-1A3.5 3.5 0 0 1 8 16.5" />
      </svg>
    ),
  },
];

const Dashboard = () => {
  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <p className="dashboard-hero__eyebrow">Overview</p>
        <h1>Admin Dashboard</h1>
      </div>

      <div className="dashboard-stats">
        {stats.map((stat) => (
          <article
            key={stat.title}
            className={`dashboard-card dashboard-card--${stat.tone}`}
          >
            <div className="dashboard-card__icon">{stat.icon}</div>
            <div className="dashboard-card__content">
              <div className="dashboard-card__valueRow">
                <span className="dashboard-card__value">{stat.value}</span>
                {stat.suffix && (
                  <span className="dashboard-card__suffix">{stat.suffix}</span>
                )}
              </div>
              <h2>{stat.title}</h2>
              {stat.detail && <p>{stat.detail}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
