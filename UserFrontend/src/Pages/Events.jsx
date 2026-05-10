import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

const MotionDiv = motion.create("div");

const watercolorBg = {
  backgroundColor: "#fbfbfb",
  backgroundImage:
    "radial-gradient(circle at 10% 20%, rgba(255, 183, 160, 0.35), transparent 26%), radial-gradient(circle at 86% 16%, rgba(123, 211, 230, 0.3), transparent 30%), radial-gradient(circle at 82% 78%, rgba(151, 222, 226, 0.28), transparent 30%), radial-gradient(circle at 28% 78%, rgba(255, 220, 199, 0.3), transparent 28%), linear-gradient(120deg, #fff7f1 0%, #ffffff 48%, #edfaff 100%)",
};

const sectionTitleSx = {
  fontSize: "1.25rem",
  fontWeight: 800,
  color: "#171717",
  mb: 1.5,
};

const eventImageSx = {
  width: "100%",
  height: { xs: 210, sm: 230, md: 250 },
  objectFit: "cover",
  display: "block",
  bgcolor: "#efefef",
};

function Events() {
  const [allEvents, setAllEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrganizers, setSelectedOrganizers] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [sortBy, setSortBy] = useState("most-popular");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    const res = await fetch(`${url}/events`);
    const json = await res.json();
    setAllEvents(json.data);
  };

  const filtersData = useMemo(() => {
    const organizers = [];
    const places = new Set();
    const durations = new Set();
    const seenArtists = new Set();

    allEvents.forEach((event) => {
      if (event.artist && !seenArtists.has(event.artist.id)) {
        organizers.push(event.artist);
        seenArtists.add(event.artist.id);
      }
      if (event.location) places.add(event.location);
      if (event.duration) durations.add(event.duration);
    });

    return {
      organizers,
      places: Array.from(places),
      durations: Array.from(durations),
    };
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    let result = [...allEvents];

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      );
    }

    if (selectedOrganizers.length > 0) {
      result = result.filter((event) => event.artist && selectedOrganizers.includes(event.artist.id));
    }

    if (selectedPlaces.length > 0) {
      result = result.filter((event) => selectedPlaces.includes(event.location));
    }

    if (selectedDurations.length > 0) {
      result = result.filter((event) => selectedDurations.includes(event.duration));
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [allEvents, search, selectedOrganizers, selectedPlaces, selectedDurations, sortBy]);

  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredEvents.slice(start, start + itemsPerPage);
  }, [filteredEvents, page]);

  const toggleFilter = (list, setList, item) => {
    setList((prev) => (prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]));
    setPage(1);
  };

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh" }}>
      <Box
        sx={{
          ...watercolorBg,
          borderBottom: "1px solid rgba(0,0,0,0.12)",
          py: { xs: 4, md: 5 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 280px" },
              alignItems: "center",
              gap: { xs: 4, md: 8 },
            }}
          >
            <MotionDiv
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  color: "#171717",
                  fontSize: { xs: "2rem", md: "2.55rem" },
                  mb: 1,
                }}
              >
                Book Your Event
              </Typography>
              <Typography variant="body1" sx={{ color: "#222", mb: 3 }}>
                Book your next event with us
              </Typography>
              <TextField
                fullWidth
                placeholder="Value"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Search sx={{ fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 5,
                      bgcolor: "white",
                      height: 38,
                      fontSize: "0.85rem",
                    },
                  },
                }}
                sx={{ maxWidth: 380 }}
              />
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Box
                component="img"
                src="/artvista-auth/color-portrait.png"
                alt="Event artwork"
                sx={{
                  width: { xs: "100%", sm: 280 },
                  height: { xs: 260, sm: 280 },
                  objectFit: "cover",
                  display: "block",
                  mx: { xs: "auto", md: 0 },
                  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                }}
              />
            </MotionDiv>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, lg: 0 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "280px minmax(0, 1fr)" },
            alignItems: "start",
            gap: { xs: 3, md: 4 },
          }}
        >
          <Box
            component="aside"
            sx={{
              borderRight: { md: "1px solid rgba(0,0,0,0.18)" },
              pr: { md: 2.5 },
              py: { xs: 3, md: 4 },
            }}
          >
            <Box sx={{ pb: 2.5, mb: 2.5, borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
              <Typography sx={sectionTitleSx}>Organizers</Typography>
              <List
                disablePadding
                sx={{
                  display: { xs: "grid", sm: "grid", md: "block" },
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                  columnGap: 2,
                  maxHeight: { xs: 220, sm: 220, md: 245 },
                  overflowY: "auto",
                  pr: 0.5,
                  scrollbarWidth: "thin",
                  scrollbarColor: "#d28c86 transparent",
                  "&::-webkit-scrollbar": {
                    width: 6,
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#d28c86",
                    borderRadius: 999,
                  },
                }}
              >
                {filtersData.organizers.map((artist) => (
                  <ListItem key={artist.id} disablePadding sx={{ mb: 0.4 }}>
                    <ListItemButton
                      onClick={() => toggleFilter(selectedOrganizers, setSelectedOrganizers, artist.id)}
                      sx={{
                        minWidth: 0,
                        px: 0.5,
                        py: 0.35,
                        borderRadius: 1,
                        bgcolor: selectedOrganizers.includes(artist.id) ? "rgba(92, 107, 192, 0.1)" : "transparent",
                      }}
                    >
                      <ListItemAvatar sx={{ minWidth: 32 }}>
                        <Avatar
                          src={`${imageUrl}${artist.profileImage}`}
                          sx={{ width: 23, height: 23, fontSize: "0.72rem" }}
                        >
                          {artist.name[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={artist.name}
                        primaryTypographyProps={{ fontSize: "0.92rem", color: "#222", noWrap: true }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box sx={{ pb: 2.5, mb: 2.5, borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
              <Typography sx={sectionTitleSx}>Place</Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "1fr" },
                  gap: 0.3,
                }}
              >
                {filtersData.places.map((place) => (
                  <FormControlLabel
                    key={place}
                    control={
                      <Checkbox
                        size="small"
                        checked={selectedPlaces.includes(place)}
                        onChange={() => toggleFilter(selectedPlaces, setSelectedPlaces, place)}
                        sx={{ p: 0.65 }}
                      />
                    }
                    label={
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" noWrap sx={{ display: "block", color: "#222", lineHeight: 1.1 }}>
                          {place}
                        </Typography>
                        <Typography variant="caption" sx={{ display: "block", color: "text.secondary", lineHeight: 1.1 }}>
                          Description
                        </Typography>
                      </Box>
                    }
                    sx={{ ml: 0, mr: 0, alignItems: "flex-start", minWidth: 0 }}
                  />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography sx={sectionTitleSx}>Duration</Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "1fr" },
                  gap: 0.3,
                }}
              >
                {filtersData.durations.map((duration) => (
                  <FormControlLabel
                    key={duration}
                    control={
                      <Checkbox
                        size="small"
                        checked={selectedDurations.includes(duration)}
                        onChange={() => toggleFilter(selectedDurations, setSelectedDurations, duration)}
                        sx={{ p: 0.65 }}
                      />
                    }
                    label={
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" noWrap sx={{ display: "block", color: "#222", lineHeight: 1.1 }}>
                          {duration}
                        </Typography>
                        <Typography variant="caption" sx={{ display: "block", color: "text.secondary", lineHeight: 1.1 }}>
                          Description
                        </Typography>
                      </Box>
                    }
                    sx={{ ml: 0, mr: 0, alignItems: "flex-start", minWidth: 0 }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          <Box component="main" sx={{ minWidth: 0, py: { xs: 1, md: 4 }, pb: { xs: 5, md: 6 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "stretch", sm: "flex-end" },
                mb: 4,
              }}
            >
              <FormControl sx={{ width: { xs: "100%", sm: 220 } }}>
                <Select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  size="small"
                  sx={{
                    height: 34,
                    borderRadius: 1,
                    fontSize: "0.78rem",
                    bgcolor: "white",
                  }}
                >
                  <MenuItem value="most-popular">Sort By Most Popular</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                columnGap: { xs: 3, md: 5 },
                rowGap: { xs: 3, md: 4 },
              }}
            >
              <AnimatePresence mode="popLayout">
                {paginatedEvents.map((event, index) => (
                  <MotionDiv
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 18 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                  >
                    <Box sx={{ cursor: "pointer" }} onClick={() => navigate(`/events/${event.id}`)}>
                      <Box
                        component="img"
                        src={`${imageUrl}${event.imageUrl}`}
                        alt={event.title}
                        sx={eventImageSx}
                      />
                      <Typography variant="h5" sx={{ fontWeight: 500, color: "#171717", mt: 1.2, mb: 0.4 }}>
                        {event.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ display: "block", color: "#222", fontStyle: "italic", lineHeight: 1.4 }}
                      >
                        Join our {event.title.toLowerCase()} at this particular date and place
                      </Typography>
                    </Box>
                  </MotionDiv>
                ))}
              </AnimatePresence>
            </Box>

            {filteredEvents.length === 0 && (
              <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h6" color="text.secondary">
                  No events found matching your criteria.
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <Pagination
                count={Math.ceil(filteredEvents.length / itemsPerPage)}
                page={page}
                onChange={(event, value) => setPage(value)}
                shape="rounded"
                sx={{
                  "& .MuiPagination-ul": {
                    justifyContent: "center",
                    gap: 0.5,
                  },
                  "& .MuiPaginationItem-root": {
                    border: "1px solid #c13b95",
                    color: "#c13b95",
                    bgcolor: "white",
                    borderRadius: 1,
                    minWidth: 34,
                    height: 34,
                  },
                  "& .Mui-selected": {
                    bgcolor: "#5c3fd1 !important",
                    color: "white",
                    borderColor: "#5c3fd1",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Events;
