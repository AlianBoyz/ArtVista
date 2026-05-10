import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

const MotionDiv = motion.create("div");

const watercolorBg = {
  backgroundColor: "#fbfbfb",
  backgroundImage:
    "radial-gradient(circle at 10% 20%, rgba(255, 183, 160, 0.35), transparent 26%), radial-gradient(circle at 86% 16%, rgba(123, 211, 230, 0.3), transparent 30%), radial-gradient(circle at 82% 78%, rgba(151, 222, 226, 0.28), transparent 30%), radial-gradient(circle at 28% 78%, rgba(255, 220, 199, 0.3), transparent 28%), linear-gradient(120deg, #fff7f1 0%, #ffffff 48%, #edfaff 100%)",
};

function EventDetails() {
  const { login, token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [otherEvents, setOtherEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("choice");
  const [pendingAction, setPendingAction] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setEvent(null);
    setIsRegistered(false);
    getEvent();
    getOtherEvents();
    checkRegistrationStatus();
  }, [id, token]);

  useEffect(() => {
    if (token && pendingAction) {
      setShowModal(false);
      handleRegister();
      setPendingAction(null);
    }
  }, [token]);

  const getEvent = async () => {
    try {
      const res = await fetch(`${url}/events/${id}`);
      const json = await res.json();
      if (json.success) {
        setEvent(json.data);
      }
    } catch (err) {
      console.error("Error fetching event:", err);
    }
  };

  const checkRegistrationStatus = async () => {
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

    try {
      const res = await fetch(`${url}/events/${id}/is-registered?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setIsRegistered(json.data);
      }
    } catch (err) {
      console.error("Error checking registration status:", err);
    }
  };

  const getOtherEvents = async () => {
    try {
      const res = await fetch(`${url}/events`);
      const json = await res.json();
      if (json.success) {
        setOtherEvents(json.data.filter((item) => item.id.toString() !== id).slice(0, 2));
      }
    } catch (err) {
      console.error("Error fetching other events:", err);
    }
  };

  const checkLogin = (action) => {
    if (!token) {
      setShowModal(true);
      setPendingAction(action);
      setView("choice");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!checkLogin("register")) return;
    if (isRegistered) return;

    if (event.availableSeats <= 0) {
      alert("Booked! No seats available.");
      return;
    }

    navigate("/checkout", { state: { eventId: event.id } });
  };

  const handleLogin = async () => {
    const res = await fetch(`${url}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success && data.data?.token) {
      login(data.data.token, data.data.userId);
      setShowModal(false);
    } else {
      setError(data.message || "Invalid credentials");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch(`${url}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone }),
    });
    const data = await res.json();
    if (data.success) {
      login(data.data.token, data.data.userId);
      setShowModal(false);
    } else {
      setError(data.message);
    }
  };

  if (!event) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.35fr) minmax(300px, 0.8fr)" },
            gap: { xs: 4, md: 6 },
            alignItems: "start",
          }}
        >
          <MotionDiv initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Box
              component="img"
              src={`${imageUrl}${event.imageUrl}`}
              alt={event.title}
              sx={{
                width: "100%",
                height: { xs: 260, sm: 360, md: 420 },
                objectFit: "cover",
                display: "block",
              }}
            />
          </MotionDiv>

          <MotionDiv initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Box sx={{ pt: { md: 2 } }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.1rem", md: "3rem" },
                  lineHeight: 1.1,
                  fontWeight: 800,
                  color: "#202020",
                  mb: 0.8,
                }}
              >
                {event.title}
              </Typography>
              <Typography variant="h5" sx={{ color: "#202020", fontWeight: 400, mb: 2 }}>
                By {event.artist?.name || "ArtVista Artist"}
              </Typography>
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: "2rem", md: "2.7rem" }, fontWeight: 800, color: "#202020", mb: 3 }}
              >
                Rs {event.price}
              </Typography>

              <Box sx={{ color: "#202020", fontSize: "0.9rem", lineHeight: 2.1, fontWeight: 700, mb: 3 }}>
                <Box>Place : {event.location}</Box>
                <Box>Duration : {event.duration}</Box>
                <Box>date : {event.eventDate}</Box>
              </Box>

              <Button
                variant="contained"
                onClick={handleRegister}
                disabled={event.availableSeats <= 0 || isRegistered}
                sx={{
                  minWidth: 220,
                  py: 1.5,
                  borderRadius: 1,
                  bgcolor: event.availableSeats > 0 && !isRegistered ? "#5146c9" : "#bfbfbf",
                  "&:hover": {
                    bgcolor: event.availableSeats > 0 && !isRegistered ? "#4439b8" : "#bfbfbf",
                  },
                }}
              >
                {isRegistered ? "Registered" : event.availableSeats > 0 ? "Register" : "Booked"}
              </Button>
            </Box>
          </MotionDiv>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.25fr) minmax(300px, 0.85fr)" },
            gap: { xs: 4, md: 6 },
            mt: { xs: 4, md: 6 },
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#202020", mb: 1.5 }}>
              Details about Event
            </Typography>
            <Typography variant="body1" sx={{ color: "#333", lineHeight: 1.55, mb: 3 }}>
              {event.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"}
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 800, color: "#202020", mb: 1.5 }}>
              Prerequisites
            </Typography>
            <Typography variant="body1" sx={{ color: "#333", lineHeight: 1.55 }}>
              {event.prerequisites || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              border: "1px solid #d9d9d9",
              borderRadius: 1,
              alignSelf: "start",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#202020", mb: 3 }}>
              About Organizer
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "88px minmax(0, 1fr)", gap: 2.5, alignItems: "start" }}>
              <Box
                component="img"
                src={event.artist?.profileImage ? `${imageUrl}${event.artist.profileImage}` : "/artvista-auth/color-portrait.png"}
                alt={event.artist?.name || "Organizer"}
                sx={{ width: 88, height: 88, objectFit: "cover", borderRadius: 1 }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#202020", mb: 1 }}>
                  {event.artist?.name || "ArtVista Organizer"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#333", lineHeight: 1.45 }}>
                  {event.artist?.bio || "Lorem Ipsum is simply dummy printing and typesetting industry."}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              sx={{ mt: 3, color: "#b03c8d", borderColor: "#b03c8d", borderRadius: 1, minWidth: 180 }}
            >
              Events
            </Button>
          </Paper>
        </Box>
      </Container>

      <Box sx={{ ...watercolorBg, py: { xs: 4, md: 5 }, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#202020", mb: 3 }}>
            Other Events
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
              gap: { xs: 3, md: 6 },
            }}
          >
            {otherEvents.map((item) => (
              <Box
                key={item.id}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  navigate(`/events/${item.id}`);
                  window.scrollTo(0, 0);
                }}
              >
                <Box
                  component="img"
                  src={`${imageUrl}${item.imageUrl}`}
                  alt={item.title}
                  sx={{ width: "100%", height: { xs: 220, md: 280 }, objectFit: "cover", display: "block" }}
                />
                <Typography variant="h5" sx={{ fontWeight: 500, color: "#202020", mt: 1.2, mb: 0.4 }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" sx={{ display: "block", color: "#222", fontStyle: "italic" }}>
                  Join our {item.title.toLowerCase()} at this particular date and place
                </Typography>
              </Box>
            ))}

            {otherEvents.length === 0 && (
              <>
                <Box sx={{ cursor: "pointer" }}>
                  <Box
                    component="img"
                    src="/artvista-auth/desi-art.png"
                    alt="Art fair"
                    sx={{ width: "100%", height: { xs: 220, md: 280 }, objectFit: "cover", display: "block" }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 500, color: "#202020", mt: 1.2, mb: 0.4 }}>
                    Art fair
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", color: "#222", fontStyle: "italic" }}>
                    Join our art fair at this particular date and place
                  </Typography>
                </Box>
                <Box sx={{ cursor: "pointer" }}>
                  <Box
                    component="img"
                    src="/artvista-auth/login-art.png"
                    alt="Art camp"
                    sx={{ width: "100%", height: { xs: 220, md: 280 }, objectFit: "cover", display: "block" }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 500, color: "#202020", mt: 1.2, mb: 0.4 }}>
                    Art camp
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", color: "#222", fontStyle: "italic" }}>
                    Join our art camp at this particular date and place
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Container>
      </Box>

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          {view === "choice" ? "Sign in Required" : view === "login" ? "Login" : "Join ArtVista"}
        </DialogTitle>
        <DialogContent>
          {view === "choice" && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="body1" gutterBottom>
                Please login to register for this event
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
                <Button variant="contained" onClick={() => setView("login")}>
                  I have an account
                </Button>
                <Button variant="outlined" onClick={() => setView("signup")}>
                  I'm new here
                </Button>
              </Box>
            </Box>
          )}

          {view === "login" && (
            <Box sx={{ mt: 1 }}>
              <TextField fullWidth label="Email" margin="normal" onChange={(e) => setEmail(e.target.value)} />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              <Button fullWidth variant="contained" sx={{ mt: 3, py: 1.2 }} onClick={handleLogin}>
                Login
              </Button>
              <Typography variant="body2" sx={{ textAlign: "center", mt: 2, cursor: "pointer" }} onClick={() => setView("signup")}>
                New user? Create account
              </Typography>
            </Box>
          )}

          {view === "signup" && (
            <Box component="form" onSubmit={handleSignup} sx={{ mt: 1 }}>
              <TextField fullWidth label="Full Name" margin="normal" onChange={(e) => setName(e.target.value)} required />
              <TextField fullWidth label="Email" margin="normal" onChange={(e) => setEmail(e.target.value)} required />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <TextField fullWidth label="Phone" margin="normal" onChange={(e) => setPhone(e.target.value)} required />
              <Button fullWidth type="submit" variant="contained" sx={{ mt: 3, py: 1.2 }}>
                Sign Up
              </Button>
              <Typography variant="body2" sx={{ textAlign: "center", mt: 2, cursor: "pointer" }} onClick={() => setView("login")}>
                Already have an account? Login
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={() => setShowModal(false)} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EventDetails;
