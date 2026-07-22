import { useEffect, useState } from "react";
import "./ManageArtist.css";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

const ManageUsers = () => {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`${url}/admin/complaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success && Array.isArray(data.data)) {
        setComplaints(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch complaints:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (complaint) => {
    const nextStatus = complaint.status === "ADDRESSED" ? "PENDING" : "ADDRESSED";
    try {
      const response = await fetch(`${url}/admin/complaints/${complaint.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (response.ok) {
        fetchComplaints();
        if (selectedComplaint && selectedComplaint.id === complaint.id) {
          setSelectedComplaint({ ...selectedComplaint, status: nextStatus });
        }
      }
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return Number.isNaN(date.getTime())
      ? dateStr
      : date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const filteredComplaints = complaints.filter((c) => {
    const term = search.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.subject && c.subject.toLowerCase().includes(term)) ||
      (c.message && c.message.toLowerCase().includes(term))
    );
  });

  return (
    <div className="artists-page">
      <section className="artists-header">
        <h1>User Management & Complaints</h1>

        <div className="artists-searchRow">
          <div className="artists-search">
            <input
              type="text"
              placeholder="Search user, email, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="artists-search__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
          </div>
        </div>
      </section>

      {selectedComplaint && (
        <div className="artists-modal">
          <div className="artists-modal__panel" style={{ maxWidth: 600 }}>
            <h2>Complaint / Query Details</h2>
            <div style={{ marginTop: 15, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={
                    selectedComplaint.user?.profileImage
                      ? `${imageUrl}${selectedComplaint.user.profileImage}`
                      : "/artvista-auth/color-portrait.png"
                  }
                  alt={selectedComplaint.name}
                  className="artists-row__image"
                  style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>{selectedComplaint.name}</h3>
                  <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>{selectedComplaint.email}</p>
                </div>
              </div>

              <div>
                <strong>Subject:</strong> {selectedComplaint.subject || "General Query"}
              </div>
              <div>
                <strong>Submitted On:</strong> {formatDate(selectedComplaint.createdAt)}
              </div>

              <div
                style={{
                  background: "#f9fafb",
                  padding: 15,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  maxHeight: 250,
                  overflowY: "auto",
                  overflowX: "hidden",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5,
                }}
              >
                {selectedComplaint.message}
              </div>

              <div className="artists-modal__actions" style={{ marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedComplaint)}
                  style={{
                    backgroundColor: selectedComplaint.status === "ADDRESSED" ? "#059669" : "#d97706",
                  }}
                >
                  {selectedComplaint.status === "ADDRESSED" ? "Mark as Pending" : "Mark as Addressed"}
                </button>
                <button type="button" onClick={() => setSelectedComplaint(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="artists-tableWrap">
        <div
          className="artists-tableHeader"
          style={{ gridTemplateColumns: "220px minmax(0, 1fr) 260px" }}
        >
          <span>User Info</span>
          <span>Message Preview</span>
          <span>Status & Actions</span>
        </div>

        <div className="artists-tableBody">
          {loading ? (
            <div style={{ padding: 30, textAlign: "center" }}>Loading complaints...</div>
          ) : filteredComplaints.length === 0 ? (
            <div style={{ padding: 30, textAlign: "center", color: "#666" }}>No complaints found.</div>
          ) : (
            filteredComplaints.map((complaint) => {
              const preview =
                complaint.message && complaint.message.length > 80
                  ? complaint.message.substring(0, 80) + "..."
                  : complaint.message;

              const isAddressed = complaint.status === "ADDRESSED";

              return (
                <article
                  className="artists-row"
                  key={complaint.id}
                  style={{ gridTemplateColumns: "220px minmax(0, 1fr) 260px" }}
                >
                  <div className="artists-row__main" style={{ gridTemplateColumns: "44px minmax(0, 1fr)" }}>
                    <img
                      src={
                        complaint.user?.profileImage
                          ? `${imageUrl}${complaint.user.profileImage}`
                          : "/artvista-auth/color-portrait.png"
                      }
                      alt={complaint.name}
                      className="artists-row__image"
                      style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
                    />

                    <div className="artists-row__copy" style={{ minWidth: 0 }}>
                      <h3 style={{ fontSize: "1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {complaint.name}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "#666", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {complaint.email}
                      </p>
                    </div>
                  </div>

                  <div
                    className="artists-row__details"
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      overflow: "hidden",
                      minWidth: 0,
                    }}
                  >
                    {complaint.subject && (
                      <strong style={{ display: "block", marginBottom: 2 }}>{complaint.subject}</strong>
                    )}
                    <span>{preview}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedComplaint(complaint)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#5146c9",
                        fontWeight: 700,
                        cursor: "pointer",
                        marginLeft: 6,
                        textDecoration: "underline",
                        padding: 0,
                        display: "inline-block",
                      }}
                    >
                      View Full
                    </button>
                  </div>

                  <div className="artists-row__actions" style={{ gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 12,
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        backgroundColor: isAddressed ? "#dcfce7" : "#fef3c7",
                        color: isAddressed ? "#15803d" : "#b45309",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isAddressed ? "Addressed" : "Pending"}
                    </span>

                    <button
                      className="artists-row__edit"
                      onClick={() => handleToggleStatus(complaint)}
                      style={{
                        backgroundColor: isAddressed ? "#f3f4f6" : "#5146c9",
                        color: isAddressed ? "#374151" : "#fff",
                        whiteSpace: "nowrap",
                        minWidth: 120,
                      }}
                    >
                      {isAddressed ? "Mark Pending" : "Mark Addressed"}
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default ManageUsers;