import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

// Color config per type
const TOAST_CONFIG = {
  success: {
    bg: "linear-gradient(135deg, #065f46, #047857)",
    border: "#10b981",
    icon: "✅",
    label: "Success",
  },
  error: {
    bg: "linear-gradient(135deg, #7f1d1d, #991b1b)",
    border: "#ef4444",
    icon: "❌",
    label: "Error",
  },
  warning: {
    bg: "linear-gradient(135deg, #78350f, #92400e)",
    border: "#f59e0b",
    icon: "⚠️",
    label: "Warning",
  },
  info: {
    bg: "linear-gradient(135deg, #1e3a8a, #1e40af)",
    border: "#3b82f6",
    icon: "ℹ️",
    label: "Info",
  },
};

let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);

  // ── Show a toast notification ─────────────────────────────────────────────
  const showToast = useCallback((message, type = "info", duration = 4000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // ── Show a confirm dialog ─────────────────────────────────────────────────
  const showConfirm = useCallback((message, onConfirm, options = {}) => {
    setConfirmDialog({ message, onConfirm, ...options });
  }, []);

  const handleConfirm = () => {
    if (confirmDialog?.onConfirm) confirmDialog.onConfirm();
    setConfirmDialog(null);
  };

  const handleCancel = () => {
    if (confirmDialog?.onCancel) confirmDialog.onCancel();
    setConfirmDialog(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {/* ── Toast Stack ────────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          top: 84,
          right: 20,
          zIndex: 999998,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => {
          const cfg = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
          return (
            <div
              key={toast.id}
              style={{
                background: cfg.bg,
                color: "#fff",
                padding: "14px 18px 14px 16px",
                borderRadius: 14,
                boxShadow: `0 8px 32px rgba(0,0,0,0.28), 0 0 0 1px ${cfg.border}33`,
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                minWidth: 290,
                maxWidth: 420,
                fontSize: "0.92rem",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.5,
                borderLeft: `4px solid ${cfg.border}`,
                pointerEvents: "all",
                animation: "toastSlideIn 0.32s cubic-bezier(.22,.68,0,1.2) both",
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{cfg.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, opacity: 0.75, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>
                  {cfg.label}
                </div>
                {toast.message}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  fontSize: 20,
                  lineHeight: 1,
                  padding: "0 2px",
                  flexShrink: 0,
                  marginTop: -2,
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Confirm Dialog ────────────────────────────────────────────────── */}
      {confirmDialog && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(5px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "36px 40px",
              maxWidth: 400,
              width: "90%",
              boxShadow: "0 24px 70px rgba(0,0,0,0.25)",
              textAlign: "center",
              fontFamily: "'Inter', sans-serif",
              animation: "toastSlideIn 0.25s ease both",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
                fontSize: 28,
              }}
            >
              🗑️
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "1.2rem", fontWeight: 700, color: "#111" }}>
              {confirmDialog.title || "Confirm Delete"}
            </h3>
            <p style={{ color: "#6b7280", marginBottom: 26, fontSize: "0.95rem", lineHeight: 1.55 }}>
              {confirmDialog.message}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: "11px 26px",
                  borderRadius: 10,
                  border: "1.5px solid #e5e7eb",
                  background: "#f9fafb",
                  color: "#374151",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: "11px 26px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 14px rgba(220,38,38,0.35)",
                }}
              >
                {confirmDialog.confirmLabel || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(50px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
