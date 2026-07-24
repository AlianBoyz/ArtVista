import { createContext, useState, useEffect, useRef, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

// Inactivity timeout: 30 minutes (in ms)
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
// Warning shown 2 minutes before inactivity logout
const INACTIVITY_WARN_BEFORE_MS = 2 * 60 * 1000;

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // Auto-logout warning dialog state
  const [showWarning, setShowWarning] = useState(false);
  // What triggered warning: "inactivity" | "expiry"
  const [warningReason, setWarningReason] = useState("inactivity");
  // Seconds remaining in the warning countdown
  const [countdown, setCountdown] = useState(120);

  const tokenExpiryTimerRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const inactivityWarnTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // ─── Core logout ────────────────────────────────────────────────────────────
  const logout = useCallback((reason = "manual") => {
    clearAllTimers();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminName");
    setToken(null);
    setRole(null);
    setUserId(null);
    setShowWarning(false);

    // Redirect to appropriate login page
    const currentPath = window.location.pathname;
    if (currentPath.startsWith("/admin")) {
      window.location.href = "/admin/login";
    } else {
      window.location.href = "/login";
    }
  }, []);

  // ─── Clear all timers ───────────────────────────────────────────────────────
  const clearAllTimers = () => {
    clearTimeout(tokenExpiryTimerRef.current);
    clearTimeout(inactivityTimerRef.current);
    clearTimeout(inactivityWarnTimerRef.current);
    clearInterval(countdownIntervalRef.current);
  };

  // ─── Start countdown for warning modal ──────────────────────────────────────
  const startCountdown = (seconds) => {
    setCountdown(seconds);
    clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ─── Token expiry auto-logout ────────────────────────────────────────────────
  const scheduleTokenExpiryLogout = useCallback(
    (decodedToken) => {
      if (!decodedToken?.exp) return;
      const nowMs = Date.now();
      const expiryMs = decodedToken.exp * 1000;
      const msUntilExpiry = expiryMs - nowMs;

      if (msUntilExpiry <= 0) {
        // Token already expired
        logout("expiry");
        return;
      }

      clearTimeout(tokenExpiryTimerRef.current);
      const warnMs = Math.max(msUntilExpiry - INACTIVITY_WARN_BEFORE_MS, 0);

      // Show warning before expiry
      tokenExpiryTimerRef.current = setTimeout(() => {
        const secondsLeft = Math.floor((expiryMs - Date.now()) / 1000);
        setWarningReason("expiry");
        setShowWarning(true);
        startCountdown(Math.min(secondsLeft, 120));

        // Hard logout at exact expiry
        setTimeout(() => {
          logout("expiry");
        }, expiryMs - Date.now());
      }, warnMs);
    },
    [logout]
  );

  // ─── Inactivity timer ────────────────────────────────────────────────────────
  const resetInactivityTimer = useCallback(() => {
    if (!localStorage.getItem("token")) return;

    clearTimeout(inactivityTimerRef.current);
    clearTimeout(inactivityWarnTimerRef.current);

    // Hide warning if user becomes active again
    setShowWarning((prev) => {
      if (prev && warningReason === "inactivity") return false;
      return prev;
    });

    // Warn 2 minutes before inactivity logout
    inactivityWarnTimerRef.current = setTimeout(() => {
      setWarningReason("inactivity");
      setShowWarning(true);
      startCountdown(120);
    }, INACTIVITY_TIMEOUT_MS - INACTIVITY_WARN_BEFORE_MS);

    // Actual logout after full inactivity period
    inactivityTimerRef.current = setTimeout(() => {
      logout("inactivity");
    }, INACTIVITY_TIMEOUT_MS);
  }, [logout, warningReason]);

  // ─── Attach / detach activity listeners ─────────────────────────────────────
  useEffect(() => {
    if (!token) return;

    const handler = () => resetInactivityTimer();
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, handler, { passive: true }));

    resetInactivityTimer(); // kick off initial timer

    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, handler));
      clearAllTimers();
    };
  }, [token, resetInactivityTimer]);

  // ─── On mount: restore session ───────────────────────────────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);

        // Check if already expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          logout("expiry");
          return;
        }

        setToken(storedToken);
        setUserId(storedUserId);
        setRole(decoded.role);
        scheduleTokenExpiryLogout(decoded);
      } catch (e) {
        console.error("Invalid token on mount — logging out");
        logout("invalid");
      }
    }
  }, []);

  // ─── Login ───────────────────────────────────────────────────────────────────
  const login = (newToken, newUserId) => {
    localStorage.setItem("token", newToken);
    if (newUserId) {
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);
    }
    setToken(newToken);
    try {
      const decoded = jwtDecode(newToken);
      setRole(decoded.role);
      scheduleTokenExpiryLogout(decoded);
    } catch (e) {
      console.error("Invalid token on login");
    }
  };

  // ─── Stay logged in (user clicked "Stay Logged In") ─────────────────────────
  const stayLoggedIn = () => {
    setShowWarning(false);
    clearInterval(countdownIntervalRef.current);
    if (warningReason === "inactivity") {
      resetInactivityTimer();
    }
  };

  // ─── Warning modal ───────────────────────────────────────────────────────────
  const warningModal = showWarning ? (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "36px 40px",
          maxWidth: 420,
          width: "90%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          textAlign: "center",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: warningReason === "expiry" ? "#fee2e2" : "#fef3c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
            fontSize: 30,
          }}
        >
          {warningReason === "expiry" ? "🔒" : "⏱️"}
        </div>

        <h2 style={{ margin: "0 0 8px", fontSize: "1.3rem", color: "#111", fontWeight: 700 }}>
          {warningReason === "expiry" ? "Session Expiring Soon" : "Are you still there?"}
        </h2>
        <p style={{ color: "#555", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 10px" }}>
          {warningReason === "expiry"
            ? "Your session token is about to expire. You will be automatically logged out."
            : "You've been inactive for a while. You will be automatically logged out for security."}
        </p>

        {/* Countdown */}
        <div
          style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            color: countdown <= 30 ? "#dc2626" : "#d97706",
            margin: "14px 0 22px",
            letterSpacing: 2,
          }}
        >
          {String(Math.floor(countdown / 60)).padStart(2, "0")}:
          {String(countdown % 60).padStart(2, "0")}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {warningReason === "inactivity" && (
            <button
              onClick={stayLoggedIn}
              style={{
                padding: "12px 28px",
                borderRadius: 10,
                border: "none",
                background: "#1976d2",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
              }}
            >
              Stay Logged In
            </button>
          )}
          <button
            onClick={() => logout("manual")}
            style={{
              padding: "12px 28px",
              borderRadius: 10,
              border: "1.5px solid #e5e7eb",
              background: "#f9fafb",
              color: "#333",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <AuthContext.Provider value={{ token, role, userId, login, logout }}>
      {warningModal}
      {children}
    </AuthContext.Provider>
  );
};