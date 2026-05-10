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

function Paintings() {
  const [allPaintings, setAllPaintings] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState("most-popular");
  const [page, setPage] = useState(1);
  const itemsPerPage = 16;

  const navigate = useNavigate();

  useEffect(() => {
    getPaintings();
  }, []);

  const getPaintings = async () => {
    const res = await fetch(`${url}/paintings`);
    const json = await res.json();
    setAllPaintings(json.data);
  };

  const filtersData = useMemo(() => {
    const artists = [];
    const types = new Set();
    const seenArtists = new Set();

    allPaintings.forEach((painting) => {
      if (!seenArtists.has(painting.artist.id)) {
        artists.push(painting.artist);
        seenArtists.add(painting.artist.id);
      }
      types.add(painting.medium);
    });

    return { artists, types: Array.from(types) };
  }, [allPaintings]);

  const filteredPaintings = useMemo(() => {
    let result = [...allPaintings];

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (painting) =>
          painting.title.toLowerCase().includes(query) ||
          painting.artist.name.toLowerCase().includes(query)
      );
    }

    if (selectedArtists.length > 0) {
      result = result.filter((painting) => selectedArtists.includes(painting.artist.id));
    }

    if (selectedTypes.length > 0) {
      result = result.filter((painting) => selectedTypes.includes(painting.medium));
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [allPaintings, search, selectedArtists, selectedTypes, sortBy]);

  const paginatedPaintings = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredPaintings.slice(start, start + itemsPerPage);
  }, [filteredPaintings, page]);

  const handleArtistToggle = (id) => {
    setSelectedArtists((prev) => (prev.includes(id) ? prev.filter((artistId) => artistId !== id) : [...prev, id]));
    setPage(1);
  };

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]));
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
              gridTemplateColumns: { xs: "1fr", md: "1fr 320px" },
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
                Shop Original Art
              </Typography>
              <Typography variant="body1" sx={{ color: "#222", mb: 3 }}>
                Purchase original artwork from talented artists
              </Typography>
              <TextField
                fullWidth
                placeholder="Search for art..."
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
                sx={{ maxWidth: 400 }}
              />
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Box
                component="img"
                src="/artvista-auth/desi-art.png"
                alt="Original artwork"
                sx={{
                  width: { xs: "100%", sm: 320 },
                  height: { xs: 250, sm: 280 },
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
              <Typography sx={sectionTitleSx}>Artists</Typography>
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
                {filtersData.artists.map((artist) => (
                  <ListItem key={artist.id} disablePadding sx={{ mb: 0.4 }}>
                    <ListItemButton
                      onClick={() => handleArtistToggle(artist.id)}
                      sx={{
                        minWidth: 0,
                        px: 0.5,
                        py: 0.35,
                        borderRadius: 1,
                        bgcolor: selectedArtists.includes(artist.id) ? "rgba(92, 107, 192, 0.1)" : "transparent",
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

            <Box>
              <Typography sx={sectionTitleSx}>Type</Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "1fr" },
                  gap: 0.4,
                }}
              >
                {filtersData.types.map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        size="small"
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeToggle(type)}
                        sx={{ p: 0.65 }}
                      />
                    }
                    label={
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" noWrap sx={{ display: "block", color: "#222", lineHeight: 1.2 }}>
                          {type}
                        </Typography>
                        <Typography variant="caption" sx={{ display: "block", color: "text.secondary", lineHeight: 1.1 }}>
                          Medium
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
                justifyContent: { xs: "stretch", sm: "space-between" },
                alignItems: { xs: "stretch", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 4,
              }}
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#171717" }}>
                  Paintings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filteredPaintings.length} found
                </Typography>
              </Box>

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
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },
                columnGap: { xs: 3, md: 3 },
                rowGap: { xs: 3, md: 4 },
              }}
            >
              <AnimatePresence mode="popLayout">
                {paginatedPaintings.map((painting, index) => (
                  <MotionDiv
                    key={painting.id}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 18 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                  >
                    <Box sx={{ cursor: "pointer" }} onClick={() => navigate(`/paintingDetails/${painting.id}`)}>
                      <Box
                        component="img"
                        src={`${imageUrl}${painting.imageUrl}`}
                        alt={painting.title}
                        sx={{
                          width: "100%",
                          height: { xs: 260, sm: 250, md: 230 },
                          objectFit: "cover",
                          display: "block",
                          bgcolor: "#efefef",
                          boxShadow: "0 5px 16px rgba(0,0,0,0.12)",
                        }}
                      />
                      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1.5, mt: 1.2 }}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="h6" noWrap sx={{ fontWeight: 600, color: "#171717", lineHeight: 1.25 }}>
                            {painting.title}
                          </Typography>
                          <Typography variant="caption" noWrap sx={{ display: "block", color: "text.secondary" }}>
                            By {painting.artist.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ flexShrink: 0, fontWeight: 800, color: "#171717", pt: 0.25 }}>
                          Rs {painting.price}
                        </Typography>
                      </Box>
                    </Box>
                  </MotionDiv>
                ))}
              </AnimatePresence>
            </Box>

            {filteredPaintings.length === 0 && (
              <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h6" color="text.secondary">
                  No paintings found matching your criteria.
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <Pagination
                count={Math.ceil(filteredPaintings.length / itemsPerPage)}
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

export default Paintings;
