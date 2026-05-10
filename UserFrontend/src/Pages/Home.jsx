import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  useEffect(() => {
    getPaintings();
    getEvents();
  }, []);

  const getPaintings = async () => {
    const res = await fetch(`${url}/paintings`);
    const json = await res.json();
    const random = json.data.sort(() => 0.5 - Math.random()).slice(0, 10);
    setPaintings(random);
  };

  const getEvents = async () => {
    const res = await fetch(`${url}/events`);
    const json = await res.json();
    const latest = json.data.slice().reverse().slice(0, 8);
    setEvents(latest);
  };

  return (
    <Box sx={{ bgcolor: "white" }}>
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
                {paintings.length > 0 && (
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 0,
                      overflow: "hidden",
                      width: { xs: "100%", sm: 330 },
                      mx: { xs: "auto", md: "auto" },
                      boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
                      border: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={`${imageUrl}${paintings[0].imageUrl}`}
                      alt="Featured Art"
                      sx={{ ...imageSx, height: { xs: 330, sm: 420 } }}
                    />
                    <Box
                      sx={{
                        px: 1.5,
                        py: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        bgcolor: "white",
                      }}
                    >
                      <Typography variant="caption" sx={{ minWidth: 0, fontWeight: 500 }} noWrap>
                        {paintings[0].title}
                      </Typography>
                      <Typography variant="caption" sx={{ flexShrink: 0, fontWeight: 800 }}>
                        Rs {paintings[0].price}
                      </Typography>
                    </Box>
                  </Card>
                )}
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
