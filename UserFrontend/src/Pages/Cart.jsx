import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ShoppingBag } from "@mui/icons-material";
import { AuthContext } from "../Context/AuthProvider";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

const watercolorBg = {
  backgroundColor: "#fbfbfb",
  backgroundImage:
    "radial-gradient(circle at 10% 20%, rgba(255, 183, 160, 0.35), transparent 26%), radial-gradient(circle at 86% 16%, rgba(123, 211, 230, 0.3), transparent 30%), radial-gradient(circle at 82% 78%, rgba(151, 222, 226, 0.28), transparent 30%), radial-gradient(circle at 28% 78%, rgba(255, 220, 199, 0.3), transparent 28%), linear-gradient(120deg, #fff7f1 0%, #ffffff 48%, #edfaff 100%)",
};

function Cart() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${url}/carts/my-cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json && json.success) {
        setCart(json.data);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      const res = await fetch(`${url}/carts/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json && json.success) {
        fetchCart();
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const getTotalPrice = () => {
    const items = cart?.items || [];
    return items.reduce((total, item) => {
      const price = item?.painting?.price || 0;
      const qty = item?.quantity || 1;
      return total + price * qty;
    }, 0);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!token) {
    return (
      <Box sx={{ bgcolor: "white", minHeight: "100vh", pt: 15 }}>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <ShoppingBag sx={{ fontSize: 80, color: "text.secondary", mb: 3 }} />
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Your cart is empty
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
            Please login to view your cart items and start shopping.
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate("/login")} sx={{ px: 6, py: 1.5, bgcolor: "#4a41c1" }}>
            Login Now
          </Button>
        </Container>
      </Box>
    );
  }

  const cartItems = cart?.items || [];

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh" }}>
      <Box sx={{ ...watercolorBg, py: { xs: 4, md: 6 }, borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 440px" },
              alignItems: "center",
              gap: { xs: 4, md: 7 },
            }}
          >
            <Box sx={{ pl: { md: 4 } }}>
              <Typography variant="h2" sx={{ fontWeight: 800, color: "#1a1a1a", fontSize: { xs: "2rem", md: "2.7rem" } }}>
                Your Painting Cart
              </Typography>
            </Box>
            <Box
              component="img"
              src="/artvista-auth/landing-sky.jpeg"
              alt="Decorative Art"
              sx={{ width: "100%", height: { xs: 200, sm: 250 }, objectFit: "cover", display: "block", boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        {cartItems.length === 0 ? (
          <Paper sx={{ p: { xs: 4, md: 8 }, textAlign: "center", borderRadius: 1, bgcolor: "#fdfbfb" }} elevation={0}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Your cart is currently empty.
            </Typography>
            <Button variant="contained" sx={{ mt: 3, px: 4, py: 1.5, bgcolor: "#4a41c1" }} onClick={() => navigate("/paintings")}>
              Start Shopping
            </Button>
          </Paper>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 320px" },
                gap: { xs: 3, md: 2.5 },
                alignItems: "start",
              }}
            >
              <Paper sx={{ borderRadius: 1, overflow: "hidden", border: "1px solid #d9d9d9" }} elevation={0}>
                <Box
                  sx={{
                    display: { xs: "none", sm: "grid" },
                    gridTemplateColumns: "1fr 150px",
                    px: 4,
                    py: 2,
                    borderBottom: "1px solid #d9d9d9",
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 500, textAlign: "center" }}>
                    Products
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 500, textAlign: "center" }}>
                    Price
                  </Typography>
                </Box>

                {cartItems.map((item, index) => (
                  <Box key={item?.id || index}>
                    <Box
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        display: "grid",
                        gridTemplateColumns: { xs: "74px minmax(0, 1fr)", sm: "80px minmax(0, 1fr) 150px" },
                        gap: { xs: 1.5, sm: 2 },
                        alignItems: "center",
                      }}
                    >
                      <Box
                        component="img"
                        src={`${imageUrl}${item?.painting?.imageUrl}`}
                        alt={item?.painting?.title}
                        sx={{ width: { xs: 74, sm: 80 }, height: { xs: 90, sm: 95 }, objectFit: "cover", display: "block" }}
                      />

                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h5" noWrap sx={{ fontWeight: 800, color: "#202020", fontSize: { xs: "1.25rem", sm: "1.45rem" }, mb: 0.2 }}>
                          {item?.painting?.title || "Untitled"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#222", mb: 1 }}>
                          By {item?.painting?.artist?.name || "Unknown Artist"}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleRemove(item?.id)}
                          sx={{
                            bgcolor: "#5146c9",
                            textTransform: "none",
                            borderRadius: 1,
                            px: 2.5,
                            py: 0.4,
                            fontSize: "0.78rem",
                            "&:hover": { bgcolor: "#4439b8" },
                          }}
                        >
                          Remove
                        </Button>
                      </Box>

                      <Typography
                        variant="h5"
                        sx={{
                          gridColumn: { xs: "1 / -1", sm: "auto" },
                          justifySelf: { xs: "end", sm: "center" },
                          fontWeight: 800,
                          fontSize: { xs: "1.25rem", sm: "1.45rem" },
                        }}
                      >
                        Rs {(item?.painting?.price || 0).toLocaleString()}
                      </Typography>
                    </Box>
                    {index < cartItems.length - 1 && <Divider />}
                  </Box>
                ))}
              </Paper>

              <Paper sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 1, border: "1px solid #d9d9d9" }} elevation={0}>
                <Typography variant="h5" sx={{ fontWeight: 500, mb: 3 }}>
                  Order Summary
                </Typography>

                <Stack spacing={1.7} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Rs {getTotalPrice().toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Shipping
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Free
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 2.5 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}>
                  <Typography variant="body1">Total</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    Rs {getTotalPrice().toLocaleString()}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/checkout")}
                  sx={{ py: 0.9, borderRadius: 1, bgcolor: "#4a41c1", fontSize: "0.9rem", mb: 2, "&:hover": { bgcolor: "#3932a1" } }}
                >
                  Checkout
                </Button>

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mb: 1.5, flexWrap: "wrap" }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: 20 }} />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: 20 }} />
                </Box>

                <Typography variant="caption" sx={{ display: "block", textAlign: "center", color: "text.secondary" }}>
                  100% Satisfaction Guarantee
                </Typography>
              </Paper>
            </Box>

            <Box
              sx={{
                mt: 2.5,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) 170px", md: "minmax(0, 1fr) 170px 320px" },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                placeholder="Enter Coupon Code"
                size="small"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 }, bgcolor: "white" }}
              />
              <Button variant="contained" sx={{ borderRadius: 1, bgcolor: "#4a41c1", "&:hover": { bgcolor: "#3932a1" } }}>
                Apply
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/paintings")}
                sx={{ borderRadius: 1, borderColor: "#ba6daf", color: "#ba6daf", "&:hover": { borderColor: "#a5599a", bgcolor: "rgba(186, 109, 175, 0.04)" } }}
              >
                Continue Shopping
              </Button>
            </Box>
          </>
        )}
      </Container>

      <Box sx={{ ...watercolorBg, minHeight: { xs: 260, md: 520 }, borderTop: "1px solid rgba(0,0,0,0.08)" }} />
    </Box>
  );
}

export default Cart;
