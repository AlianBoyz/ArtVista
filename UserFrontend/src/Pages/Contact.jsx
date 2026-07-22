import { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { AuthContext } from "../Context/AuthProvider";

const url = import.meta.env.VITE_BASE_URL;
const contactArt = "/artvista-auth/desi-art.png";

const watercolorBg = {
  backgroundColor: "#fbfbfb",
  backgroundImage:
    "radial-gradient(circle at 10% 20%, rgba(255, 183, 160, 0.35), transparent 26%), radial-gradient(circle at 86% 16%, rgba(123, 211, 230, 0.3), transparent 30%), radial-gradient(circle at 82% 78%, rgba(151, 222, 226, 0.28), transparent 30%), radial-gradient(circle at 28% 78%, rgba(255, 220, 199, 0.3), transparent 28%), linear-gradient(120deg, #fff7f1 0%, #ffffff 48%, #edfaff 100%)",
};

const Contact = () => {
  const { token, userId: contextUserId } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [form, setForm] = useState({
    subject: "",
    query: "",
  });
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    let currentUserId = contextUserId || localStorage.getItem("userId");
    let emailFromToken = "";
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded) {
          if (decoded.email) emailFromToken = decoded.email;
          if (decoded.sub && decoded.sub.includes("@")) emailFromToken = decoded.sub;
          if (decoded.name) setUserName(decoded.name);
          if (decoded.userId) currentUserId = decoded.userId;
        }
      } catch (e) {}
    }
    if (emailFromToken) setUserEmail(emailFromToken);

    if (currentUserId) {
      fetch(`${url}/users/${currentUserId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.data) {
            if (data.data.name) setUserName(data.data.name);
            if (data.data.email) setUserEmail(data.data.email);
          }
        })
        .catch(() => {});
    }
  }, [token, contextUserId]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    let currentUserId = contextUserId || localStorage.getItem("userId");
    let finalEmail = userEmail;
    let finalName = userName;

    if (token && !currentUserId) {
      try {
        const decoded = jwtDecode(token);
        if (decoded) {
          if (decoded.userId) currentUserId = decoded.userId;
          if (!finalEmail && decoded.email) finalEmail = decoded.email;
          if (!finalEmail && decoded.sub && decoded.sub.includes("@")) finalEmail = decoded.sub;
          if (!finalName && decoded.name) finalName = decoded.name;
        }
      } catch (e) {}
    }

    try {
      const response = await fetch(`${url}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          userId: currentUserId ? Number(currentUserId) : null,
          name: finalName || "User",
          email: finalEmail || "user@artvista.com",
          subject: form.subject || "User Complaint / Query",
          message: form.query,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setAlertInfo({ open: true, message: "Your complaint/message has been submitted to support!", severity: "success" });
        setForm({ subject: "", query: "" });
      } else {
        setAlertInfo({ open: true, message: data.message || "Failed to submit message", severity: "error" });
      }
    } catch (err) {
      setAlertInfo({ open: true, message: "Network error submitting message", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ ...watercolorBg, minHeight: "calc(100vh - 70px)", py: { xs: 4, md: 7 } }}>
      <Container maxWidth="lg">
        <Snackbar
          open={alertInfo.open}
          autoHideDuration={6000}
          onClose={() => setAlertInfo({ ...alertInfo, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={alertInfo.severity} onClose={() => setAlertInfo({ ...alertInfo, open: false })}>
            {alertInfo.message}
          </Alert>
        </Snackbar>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 430px" },
            alignItems: "center",
            gap: { xs: 4, md: 7 },
            mb: { xs: 4, md: 5 },
          }}
        >
          <Box sx={{ pl: { md: 4 } }}>
            <Typography variant="h1" sx={{ fontWeight: 800, color: "#151515", fontSize: { xs: "2.25rem", md: "3rem" }, mb: 1 }}>
              Contact Us
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 500, color: "#151515" }}>
              ArtVista Support & Complaints
            </Typography>
          </Box>
          <Box
            component="img"
            src={contactArt}
            alt="ArtVista contact"
            sx={{ width: "100%", height: { xs: 230, sm: 300 }, objectFit: "cover", display: "block", boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
          />
        </Box>

        <Paper
          elevation={0}
          sx={{
            maxWidth: 760,
            mx: "auto",
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 2,
            boxShadow: "0 16px 35px rgba(0,0,0,0.16)",
            bgcolor: "rgba(255,255,255,0.96)",
          }}
        >
          {userName && userEmail && (
            <Box sx={{ mb: 3, p: 2, bgcolor: "#f3f4f6", borderRadius: 1.5, border: "1px solid #e5e7eb" }}>
              <Typography variant="body2" color="text.secondary">Submitting complaint as:</Typography>
              <Typography fontWeight={700}>{userName} ({userEmail})</Typography>
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2.5 }}>
            <TextField label="Subject / Topic" name="subject" value={form.subject} onChange={handleChange} fullWidth placeholder="e.g. Order issue, Event inquiry" />
            <TextField
              label="Comment your query or complaint"
              name="query"
              value={form.query}
              onChange={handleChange}
              required
              fullWidth
              multiline
              minRows={5}
            />
            <Button type="submit" variant="contained" disabled={loading} sx={{ justifySelf: { xs: "stretch", sm: "start" }, minWidth: 180, py: 1.2, bgcolor: "#5146c9" }}>
              {loading ? "Submitting..." : "Send Message"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Contact;
