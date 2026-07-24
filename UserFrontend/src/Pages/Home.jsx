import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { useToast } from "../Context/ToastProvider";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { motion } from "framer-motion";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

const MotionDiv = motion.create("div");

const watercolorBg = {
  backgroundColor: "#fbfbfb",
  backgroundImage:
    "radial-gradient(circle at 10% 20%, rgba(255, 183, 160, 0.35), transparent 26%), radial-gradient(circle at 86% 16%, rgba(123, 211, 230, 0.3), transparent 30%), radial-gradient(circle at 82% 78%, rgba(151, 222, 226, 0.28), transparent 30%), radial-gradient(circle at 28% 78%, rgba(255, 220, 199, 0.3), transparent 28%), linear-gradient(120deg, #fff7f1 0%, #ffffff 48%, #edfaff 100%)",
};

const sectionHeaderSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 2,
  mb: 3,
};

const scrollRowSx = {
  display: "flex",
  gap: { xs: 2.5, md: 4 },
  overflowX: "auto",
  pb: 1.5,
  scrollSnapType: "x proximity",
  scrollbarWidth: "thin",
  scrollbarColor: "#d28c86 transparent",
  "&::-webkit-scrollbar": {
    height: 8,
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#d28c86",
    borderRadius: 999,
  },
};

const imageSx = {
  width: "100%",
  objectFit: "cover",
  display: "block",
  bgcolor: "#f3f3f3",
};

function Home() {
  const [paintings, setPaintings] = useState([]);
  const [events, setEvents] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [featuredHomeItem, setFeaturedHomeItem] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  useEffect(() => {
    if (!featuredHomeItem && (paintings.length > 0 || events.length > 0)) {
      const combined = [
        ...paintings.map((p) => ({ ...p, itemType: "PAINTING" })),
        ...events.map((e) => ({ ...e, itemType: "EVENT" })),
      ];
      if (combined.length > 0) {
        const randomIndex = Math.floor(Math.random() * combined.length);
        setFeaturedHomeItem(combined[randomIndex]);
      }
    }
  }, [paintings, events]);

  // ── Cashfree post-payment order finalization ──────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cashfreeOrderId = params.get("order_id");
    if (!cashfreeOrderId) return;

    const raw = sessionStorage.getItem("cashfree_pending_order");
    if (!raw) return;

    let pending;
    try { pending = JSON.parse(raw); } catch { return; }

    sessionStorage.removeItem("cashfree_pending_order");
    // Clean URL
    window.history.replaceState({}, "", "/home");

    finalizeCashfreeOrder(pending, cashfreeOrderId);
  }, [location.search]);

  const finalizeCashfreeOrder = async (pending, cashfreeOrderId) => {
    const authToken = token || localStorage.getItem("token");
    if (!authToken) return;

    try {
      if (pending.eventId) {
        // Event registration
        const body = {
          eventId: pending.eventId,
          paymentType: "ONLINE",
          paymentId: cashfreeOrderId,
        };
        const res = await fetch(`${url}/events/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success) {
          setPaymentSuccess("Event registration successful! Payment confirmed.");
          setTimeout(() => navigate("/orders"), 2500);
        } else {
          showToast(data.message || "Failed to complete event registration.", "error");
        }
      } else {
        // Painting / cart order
        const body = { paymentType: "ONLINE", paymentId: cashfreeOrderId };
        if (pending.paintingId) body.paintingId = pending.paintingId;

        const res = await fetch(`${url}/orders/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success) {
          setPaymentSuccess(`Order placed! Your Order ID: #${data.data?.id || cashfreeOrderId}`);
          setTimeout(() => navigate("/orders"), 2500);
        } else {
          showToast(data.message || "Failed to finalize order.", "error");
        }
      }
    } catch (err) {
      console.error("Failed to finalize Cashfree order:", err);
      showToast("Payment was received but order could not be saved. Please contact support.", "error");
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    getPaintings();
    getEvents();
  }, []);

  const getPaintings = async () => {
    try {
      const res = await fetch(`${url}/paintings?page=0&size=8`);
      const json = await res.json();
      const list = json?.data?.content || (Array.isArray(json?.data) ? json.data.slice(0, 8) : []);
      setPaintings(list);
    } catch (e) {
      console.error("Failed to fetch home paintings:", e);
    }
  };

  const getEvents = async () => {
    try {
      const res = await fetch(`${url}/events?page=0&size=6`);
      const json = await res.json();
      const list = json?.data?.content || (Array.isArray(json?.data) ? json.data.slice(0, 6) : []);
      setEvents(list);
    } catch (e) {
      console.error("Failed to fetch home events:", e);
    }
  };

  return (
    <Box sx={{ bgcolor: "white" }}>
      {/* Payment Success Banner */}
      {paymentSuccess && (
        <Box
          sx={{
            position: "fixed",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            bgcolor: "#166534",
            color: "#fff",
            px: 4,
            py: 2,
            borderRadius: 3,
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          ✅ {paymentSuccess} &nbsp;
          <span style={{ fontWeight: 400, fontSize: "0.85rem", opacity: 0.85 }}>
            Redirecting to orders...
          </span>
        </Box>
      )}
      <Box
        sx={{
          ...watercolorBg,
          minHeight: { xs: "auto", md: 420 },
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          pt: { xs: 5, md: 6 },
          pb: { xs: 5, md: 6 },
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }} sx={{ alignItems: "center" }}>
            <Grid item xs={12} md={6}>
              <MotionDiv
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    color: "#171717",
                    fontWeight: 800,
                    fontSize: { xs: "2rem", sm: "2.35rem", md: "2.7rem" },
                    lineHeight: 1.16,
                    mb: 1.5,
                    maxWidth: 540,
                  }}
                >
                  Discover Stunning Artwork & Events
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 3, color: "#222", maxWidth: 500, lineHeight: 1.55 }}
                >
                  Explore a curated collection of exquisite paintings and stay updated with the most vibrant art events happening around you.
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                  <Button variant="contained" onClick={() => navigate("/events")} sx={{ minWidth: 150 }}>
                    See Events
                  </Button>
                  <Button variant="outlined" onClick={() => navigate("/paintings")} sx={{ minWidth: 150 }}>
                    Visit Shop
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Value"
                  size="small"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Search sx={{ fontSize: 18 }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 0,
                        bgcolor: "white",
                        height: 38,
                        fontSize: "0.85rem",
                      },
                    },
                  }}
                  sx={{ maxWidth: 400 }}
                />
              </MotionDiv>
            </Grid>

            <Grid item xs={12} md={6}>
              <MotionDiv
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <Box
                  onClick={() => {
                    if (featuredHomeItem) {
                      if (featuredHomeItem.itemType === "EVENT") {
                        navigate(`/events/${featuredHomeItem.id}`);
                      } else {
                        navigate(`/paintingDetails/${featuredHomeItem.id}`);
                      }
                    }
                  }}
                  sx={{
                    display: "inline-block",
                    position: "relative",
                    borderRadius: "8px",
                    overflow: "hidden",
                    maxWidth: { xs: "100%", sm: 510 },
                    maxHeight: 450,
                    mx: { xs: "auto", md: "auto" },
                    cursor: featuredHomeItem ? "pointer" : "default",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 14px 32px rgba(0,0,0,0.22)",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={
                      featuredHomeItem?.imageUrl
                        ? `${imageUrl}${featuredHomeItem.imageUrl}`
                        : "/artvista-auth/desi-art.png"
                    }
                    alt={featuredHomeItem?.title || "Featured Item"}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: 450,
                      width: "auto",
                      height: "auto",
                      display: "block",
                      borderRadius: "8px",
                    }}
                  />
                  {featuredHomeItem && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 70%, transparent 100%)",
                        p: 2,
                        color: "white",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          lineHeight: 1.25,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          mb: 0.5,
                        }}
                      >
                        {featuredHomeItem.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: "#fbbf24",
                          fontSize: "0.9rem",
                          display: "block",
                        }}
                      >
                        ₹{featuredHomeItem.price ? Number(featuredHomeItem.price).toLocaleString("en-IN") : "0"}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </MotionDiv>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
        <Box sx={sectionHeaderSx}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: "#171717" }}>
            Trending Pieces
          </Typography>
          <Button component={Link} to="/paintings" sx={{ color: "#4a41c1", fontWeight: 700, textTransform: "none" }}>
            View All
          </Button>
        </Box>

        <Box sx={scrollRowSx}>
          {paintings.map((p, i) => (
            <MotionDiv
              key={p.id}
              whileHover={{ y: -6 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ flex: "0 0 auto", scrollSnapAlign: "start" }}
            >
              <Card
                elevation={0}
                onClick={() => navigate(`/paintingDetails/${p.id}`)}
                sx={{
                  width: { xs: 170, sm: 200 },
                  cursor: "pointer",
                  borderRadius: 0,
                  overflow: "hidden",
                  boxShadow: "0 5px 16px rgba(0,0,0,0.16)",
                  border: "1px solid #e7e7e7",
                  bgcolor: "white",
                }}
              >
                <CardMedia
                  component="img"
                  image={`${imageUrl}${p.imageUrl}`}
                  alt={p.title}
                  sx={{ ...imageSx, height: { xs: 170, sm: 230 } }}
                />
                <Box sx={{ px: 1, py: 0.8, display: "flex", justifyContent: "space-between", gap: 1 }}>
                  <Typography variant="caption" sx={{ minWidth: 0, fontSize: "0.66rem" }} noWrap>
                    {p.title}
                  </Typography>
                  <Typography variant="caption" sx={{ flexShrink: 0, fontSize: "0.66rem", fontWeight: 800 }}>
                    Rs {p.price}
                  </Typography>
                </Box>
              </Card>
            </MotionDiv>
          ))}
        </Box>
      </Container>

      <Box sx={{ ...watercolorBg, py: { xs: 4, md: 5 }, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <Container maxWidth="lg">
          <Box sx={sectionHeaderSx}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#171717" }}>
              Upcoming Events
            </Typography>
            <Button component={Link} to="/events" sx={{ color: "#4a41c1", fontWeight: 700, textTransform: "none" }}>
              View All
            </Button>
          </Box>

          <Box sx={scrollRowSx}>
            {events.map((e, i) => (
              <MotionDiv
                key={e.id}
                whileHover={{ y: -6 }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ flex: "0 0 auto", scrollSnapAlign: "start" }}
              >
                <Box
                  onClick={() => navigate(`/events/${e.id}`)}
                  sx={{
                    width: { xs: 300, sm: 390 },
                    cursor: "pointer",
                    bgcolor: "transparent",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={`${imageUrl}${e.imageUrl}`}
                    alt={e.title}
                    sx={{
                      ...imageSx,
                      height: { xs: 190, sm: 250 },
                      boxShadow: "0 5px 16px rgba(0,0,0,0.14)",
                    }}
                  />
                  <Box sx={{ px: 1.5, pt: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 500, color: "#171717" }} noWrap>
                        {e.title}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#4a41c1", flexShrink: 0 }}>
                        Register
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", color: "#252525", fontStyle: "italic", mt: 0.6 }}
                      noWrap
                    >
                      Join our {e.title.toLowerCase()} at this particular date and place
                    </Typography>
                  </Box>
                </Box>
              </MotionDiv>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
