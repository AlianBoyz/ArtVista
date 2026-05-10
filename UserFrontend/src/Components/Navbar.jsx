import { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Close, Logout, Menu, ShoppingCart, AccountCircle } from "@mui/icons-material";

const url = import.meta.env.VITE_BASE_URL;

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setUserName("");
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`${url}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUserName(data.data.name || "");
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Event", path: "/events" },
    { label: "Shop", path: "/paintings" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const NavButton = ({ item }) => (
    <Button
      component={Link}
      to={item.path}
      sx={{
        color: "#1f1f24",
        minHeight: 38,
        px: 1.6,
        fontSize: "0.86rem",
        fontWeight: isActive(item.path) ? 800 : 500,
        borderRadius: 1,
        bgcolor: isActive(item.path) ? "rgba(255,255,255,0.34)" : "transparent",
        "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
      }}
    >
      {item.label}
    </Button>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(210, 124, 124, 0.96)",
          color: "#1f1f24",
          borderBottom: "1px solid rgba(70,45,49,0.18)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 }, gap: 2 }}>
            <Box
              onClick={() => navigate("/home")}
              sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", minWidth: 0 }}
            >
              <Avatar sx={{ width: 34, height: 34, bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.14)" }}>
                <img src="/vite.svg" alt="ArtVista" style={{ width: 20 }} />
              </Avatar>
              <Typography variant="h6" noWrap sx={{ fontWeight: 800, color: "inherit", letterSpacing: 0 }}>
                ArtVista
              </Typography>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center", flex: 1, gap: 0.5 }}>
              {navItems.map((item) => (
                <NavButton key={item.path} item={item} />
              ))}
            </Box>

            <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.5 }}>
              <Tooltip title="Cart">
                <IconButton component={Link} to="/cart" sx={{ color: "#1f1f24" }}>
                  <ShoppingCart />
                </IconButton>
              </Tooltip>

              {/* USER PROFILE ON RIGHT */}
              {token && (
                <Avatar 
                  sx={{ 
                    width: 38, 
                    height: 38, 
                    bgcolor: "#5146c9", 
                    color: "white",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    border: "2px solid white",
                    mx: 1
                  }}
                >
                  {userName ? userName.charAt(0).toUpperCase() : <AccountCircle />}
                </Avatar>
              )}

              {token ? (
                <Tooltip title="Logout">
                  <IconButton onClick={handleLogout} sx={{ color: "#1f1f24", display: { xs: "none", sm: "inline-flex" } }}>
                    <Logout />
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/login")}
                  sx={{
                    display: { xs: "none", sm: "inline-flex" },
                    color: "#1f1f24",
                    borderColor: "rgba(31,31,36,0.45)",
                    bgcolor: "rgba(255,255,255,0.16)",
                  }}
                >
                  Login
                </Button>
              )}

              <IconButton onClick={() => setOpen(true)} sx={{ color: "#1f1f24", display: { xs: "inline-flex", md: "none" } }}>
                <Menu />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280, p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              ArtVista
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                selected={isActive(item.path)}
                onClick={() => setOpen(false)}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive(item.path) ? 800 : 500 }} />
              </ListItemButton>
            ))}
            <ListItemButton component={Link} to="/cart" onClick={() => setOpen(false)} sx={{ borderRadius: 1, mb: 0.5 }}>
              <ListItemText primary="Cart" />
            </ListItemButton>
            {token ? (
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1 }}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            ) : (
              <ListItemButton component={Link} to="/login" onClick={() => setOpen(false)} sx={{ borderRadius: 1 }}>
                <ListItemText primary="Login" />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
