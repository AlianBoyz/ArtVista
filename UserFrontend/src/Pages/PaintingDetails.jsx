import { useContext, useEffect, useMemo, useState } from "react";
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

function PaintingDetails() {
  const { login, token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [painting, setPainting] = useState(null);
  const [allPaintings, setAllPaintings] = useState([]);
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
    getPainting();
    getPaintings();
  }, [id]);

  useEffect(() => {
    if (token && pendingAction) {
      setShowModal(false);
      continueAction();
      setPendingAction(null);
    }
  }, [token]);

  const getPainting = async () => {
    const res = await fetch(`${url}/paintings/${id}`);
    const json = await res.json();
    setPainting(json.data);
  };

  const getPaintings = async () => {
    const res = await fetch(`${url}/paintings`);
    const json = await res.json();
    setAllPaintings(json.data || []);
  };

  const suggestions = useMemo(
    () => allPaintings.filter((item) => item.id?.toString() !== id).slice(0, 6),
    [allPaintings, id]
  );

  const checkLogin = (action) => {
    if (!token) {
      setShowModal(true);
      setPendingAction(action);
      setView("choice");
      return false;
    }
    return true;
  };

  const addToCart = async () => {
    if (!checkLogin("cart")) return;
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch(`${url}/carts/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          paintingId: painting.id,
          quantity: 1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        navigate("/cart");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const buyNow = () => {
    if (!checkLogin("buy")) return;
    navigate("/checkout", { state: { paintingId: painting.id } });
  };

  const continueAction = () => {
    if (!pendingAction) return;
    if (pendingAction === "cart") addToCart();
    if (pendingAction === "buy") buyNow();
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

  const handleSignup = async (event) => {
    event.preventDefault();
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

  if (!painting) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.1fr) minmax(320px, 0.9fr)" },
            gap: { xs: 4, md: 7 },
            alignItems: "start",
          }}
        >
          <MotionDiv initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Box
              component="img"
              src={`${imageUrl}${painting.imageUrl}`}
              alt={painting.title}
              sx={{
                width: "100%",
                maxHeight: { xs: 520, md: 660 },
                objectFit: "cover",
                display: "block",
                borderRadius: 1,
                boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
              }}
            />
          </MotionDiv>

          <MotionDiv initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Box sx={{ pt: { md: 9 } }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.2rem", md: "3rem" },
                  lineHeight: 1.1,
                  fontWeight: 800,
                  color: "#252525",
                  mb: 0.8,
                }}
              >
                {painting.title}
              </Typography>
              <Typography variant="h5" sx={{ color: "#252525", fontWeight: 400, mb: 2.2 }}>
                By {painting.artist.name}
              </Typography>
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: "2rem", md: "2.7rem" }, fontWeight: 800, color: "#252525", mb: 4 }}
              >
                Rs {painting.price}
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5, mb: 2.5 }}>
                <Button
                  variant="contained"
                  onClick={buyNow}
                  disabled={!painting.available}
                  sx={{ minWidth: 170, py: 1.4, borderRadius: 1, bgcolor: "#5146c9" }}
                >
                  {painting.available ? "Buy Now" : "SOLD"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={addToCart}
                  disabled={!painting.available}
                  sx={{ minWidth: 170, py: 1.4, borderRadius: 1, color: "#b03c8d", borderColor: "#b03c8d" }}
                >
                  Add to Cart
                </Button>
              </Box>

              <Box sx={{ color: "#252525", fontSize: "0.9rem", lineHeight: 1.9, fontWeight: 600 }}>
                <Box>Size : {painting.size}</Box>
                <Box>Medium : {painting.medium}</Box>
                <Box>Year : {painting.year}</Box>
              </Box>
            </Box>
          </MotionDiv>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.15fr) minmax(300px, 0.85fr)" },
            gap: { xs: 4, md: 6 },
            mt: { xs: 4, md: 6 },
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#252525", mb: 1.4 }}>
              About Painting
            </Typography>
            <Typography variant="body1" sx={{ color: "#333", lineHeight: 1.55, mb: 3 }}>
              {painting.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"}
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 800, color: "#252525", mb: 1.4 }}>
              Details
            </Typography>
            <Typography variant="body1" sx={{ color: "#333", lineHeight: 1.55 }}>
              {painting.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"}
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
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#252525", mb: 3 }}>
              About Artist
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "88px minmax(0, 1fr)", gap: 2.5, alignItems: "start" }}>
              <Box
                component="img"
                src={painting.artist.profileImage ? `${imageUrl}${painting.artist.profileImage}` : "/artvista-auth/color-portrait.png"}
                alt={painting.artist.name}
                sx={{ width: 88, height: 88, objectFit: "cover", borderRadius: 1 }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#252525", mb: 1 }}>
                  {painting.artist.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#333", lineHeight: 1.45 }}>
                  {painting.artist.bio || "Lorem Ipsum is simply dummy printing and typesetting industry."}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              sx={{ mt: 3, color: "#b03c8d", borderColor: "#b03c8d", borderRadius: 1 }}
            >
              Artist's Art Work
            </Button>
          </Paper>
        </Box>
      </Container>

      {suggestions.length > 0 && (
        <Box sx={{ ...watercolorBg, py: { xs: 3, md: 4 }, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#252525", mb: 2 }}>
              You might also like
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 2, md: 3 },
                overflowX: "auto",
                pb: 1,
                scrollSnapType: "x proximity",
              }}
            >
              {suggestions.map((item) => (
                <Box
                  key={item.id}
                  onClick={() => {
                    navigate(`/paintingDetails/${item.id}`);
                    window.scrollTo(0, 0);
                  }}
                  sx={{ flex: "0 0 auto", width: { xs: 150, sm: 180 }, cursor: "pointer", scrollSnapAlign: "start" }}
                >
                  <Box
                    component="img"
                    src={`${imageUrl}${item.imageUrl}`}
                    alt={item.title}
                    sx={{ width: "100%", height: { xs: 145, sm: 180 }, objectFit: "cover", display: "block", boxShadow: "0 5px 14px rgba(0,0,0,0.16)" }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, bgcolor: "white", px: 0.8, py: 0.6 }}>
                    <Typography variant="caption" noWrap sx={{ minWidth: 0, fontSize: "0.65rem" }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" sx={{ flexShrink: 0, fontWeight: 800, fontSize: "0.65rem" }}>
                      Rs {item.price}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: 800 }}>
          {view === "choice" ? "Sign in Required" : view === "login" ? "Login" : "Join ArtVista"}
        </DialogTitle>
        <DialogContent>
          {view === "choice" && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
                Please login or create an account to continue.
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              <TextField fullWidth label="Email" margin="normal" onChange={(event) => setEmail(event.target.value)} />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                onChange={(event) => setPassword(event.target.value)}
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
              <TextField fullWidth label="Full Name" margin="normal" onChange={(event) => setName(event.target.value)} required />
              <TextField fullWidth label="Email" margin="normal" onChange={(event) => setEmail(event.target.value)} required />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <TextField fullWidth label="Phone" margin="normal" onChange={(event) => setPhone(event.target.value)} required />
              <Button fullWidth type="submit" variant="contained" sx={{ mt: 3, py: 1.2 }}>
                Sign Up
              </Button>
              <Typography variant="body2" sx={{ textAlign: "center", mt: 2, cursor: "pointer" }} onClick={() => setView("login")}>
                Already have an account? Login
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setShowModal(false)} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PaintingDetails;
