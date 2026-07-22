import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  CircularProgress,
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Divider
} from "@mui/material";
import { motion } from "framer-motion";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

const MotionBox = motion.create(Box);

const watercolorBg = {
  backgroundColor: "#fbfbfb",
  backgroundImage:
    "radial-gradient(circle at 10% 20%, rgba(255, 183, 160, 0.35), transparent 26%), radial-gradient(circle at 86% 16%, rgba(123, 211, 230, 0.3), transparent 30%), radial-gradient(circle at 82% 78%, rgba(151, 222, 226, 0.28), transparent 30%), radial-gradient(circle at 28% 78%, rgba(255, 220, 199, 0.3), transparent 28%), linear-gradient(120deg, #fff7f1 0%, #ffffff 48%, #edfaff 100%)",
};

function Checkout() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const paintingId = location.state?.paintingId;
  const eventId = location.state?.eventId;

  const [cart, setCart] = useState(null);
  const [singlePainting, setSinglePainting] = useState(null);
  const [singleEvent, setSingleEvent] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    pinCode: "",
    houseNumber: "",
    landmark: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("online");

  const [loading, setLoading] = useState(true);

  const cashfree = window.Cashfree ? window.Cashfree({ mode: "sandbox" }) : null;

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, paintingId, eventId]);

  const fetchData = async () => {
    try {
      const userRes = await fetch(`${url}/users/me`, { headers: { Authorization: `Bearer ${token}` } });
      const userData = await userRes.json();
      const user = userData.data;

      setForm({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
        pinCode: user.pinCode || "",
        houseNumber: user.houseNumber || "",
        landmark: user.landmark || ""
      });

      if (paintingId) {
        const paintRes = await fetch(`${url}/paintings/${paintingId}`);
        const paintData = await paintRes.json();
        setSinglePainting(paintData.data);
      } else if (eventId) {
        const eventRes = await fetch(`${url}/events/${eventId}`);
        const eventData = await eventRes.json();
        setSingleEvent(eventData.data);
      } else {
        const cartRes = await fetch(`${url}/carts/my-cart`, { headers: { Authorization: `Bearer ${token}` } });
        const cartData = await cartRes.json();
        setCart(cartData.data);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!paintingId && !eventId && (!cart || !cart.items || cart.items.length === 0)) {
      alert("Your cart is empty");
      return;
    }

    if (paymentMethod === "online") {
      await handleOnlinePayment();
    } else {
      await handleCODPayment();
    }
  };

  const handleOnlinePayment = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const amount = getTotalPrice();

      // 1. Create Cashfree Order in Backend
      let orderUrl = `${url}/cashfree/create-order?userId=${userId}&amount=${amount}`;
      const res = await fetch(orderUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to initiate online payment");
        return;
      }

      const { payment_session_id, order_id } = data.data;

      // 2. Open Cashfree Checkout
      if (!cashfree) {
        alert("Cashfree SDK not loaded");
        return;
      }

      cashfree.checkout({
        paymentSessionId: payment_session_id,
        returnUrl: `${window.location.origin}/home`
      }).then(async (result) => {
        if (result.error) {
          alert(result.error.message);
        } else if (result.redirect) {
          console.log("Redirecting...");
        } else {
          await finalizeOrder("ONLINE", order_id);
        }
      });

    } catch (err) {
      console.error(err);
      alert("Error during online payment initiation");
    }
  };

  const handleCODPayment = async () => {
    await finalizeOrder("COD", "COD-" + Math.random().toString(36).substr(2, 9).toUpperCase());
  };

  const finalizeOrder = async (pType, pId) => {
    try {
      const userId = localStorage.getItem("userId");
      
      if (eventId) {
        // Handle Event Registration
        const body = {
          userId: userId,
          eventId: eventId,
          paymentType: pType,
          paymentId: pId
        };
        const res = await fetch(`${url}/events/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });

        const data = await res.json();
        if (data.success) {
          if (data.data) {
            try {
              const existing = JSON.parse(localStorage.getItem("user_event_registrations") || "[]");
              existing.push(data.data);
              localStorage.setItem("user_event_registrations", JSON.stringify(existing));
            } catch (e) {
              console.error("Failed to save local registration record:", e);
            }
          }
          alert("Successfully registered for the event! Payment " + (pType === "COD" ? "Pending (COD)" : "Confirmed"));
          navigate("/events");
        } else {
          alert(data.message || "Registration failed");
        }
        return;
      }

      const body = {
        userId: userId,
        paymentType: pType,
        paymentId: pId
      };
      if (paintingId) {
        body.paintingId = paintingId;
      }

      const res = await fetch(`${url}/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.success) {
        if (pType === "COD") {
          alert("Order Placed Successfully! Thank you for shopping with ArtVista. Your Order ID: #" + data.data.id);
        } else {
          alert("Payment Confirmed! Order placed successfully! Your Order ID: #" + data.data.id);
        }
        navigate("/home");
      } else {
        alert(data.message || "Order finalization failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error finalizing order");
    }
  };

  const getTotalPrice = () => {
    if (singlePainting) {
      return singlePainting.price || 0;
    }
    if (singleEvent) {
      return singleEvent.price || 0;
    }
    const items = cart?.items || [];
    return items.reduce((total, item) => {
      const price = item.painting?.price || 0;
      const qty = item.quantity || 1;
      return total + (price * qty);
    }, 0);
  };

  if (!token) {
    return (
      <Box sx={{ bgcolor: 'white', minHeight: '100vh', pt: 15 }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">Login Required</Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>Please login to proceed with your purchase.</Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/login')} sx={{ px: 6, py: 1.5, bgcolor: '#4a41c1' }}>Login to Checkout</Button>
        </Container>
      </Box>
    );
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <CircularProgress />
    </Box>
  );

  const cartItems = cart?.items || [];

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
      {/* HERO SECTION */}
      <Box 
        sx={{ 
          ...watercolorBg,
          py: { xs: 4, md: 6 },
          borderBottom: '1px solid rgba(0,0,0,0.12)'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid item xs={12} md={7}>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 1, fontSize: { xs: '2rem', md: '2.7rem' } }}>
                Checkout
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 400, color: 'text.secondary' }}>
                ArtVista
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}>
                <img 
                  src="/artvista-auth/desi-art.png" 
                  alt="Decorative Art" 
                  style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        <Grid container spacing={4}>
          {/* ROW 1: BILLING & ITEMS */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 1, border: '1px solid #d9d9d9', height: '100%' }} elevation={0}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Billing Information</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Please enter your billing information</Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} size="small" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Address" name="address" value={form.address} onChange={handleChange} multiline rows={2} size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="City" name="city" value={form.city} onChange={handleChange} size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Zip code" name="pinCode" value={form.pinCode} onChange={handleChange} size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Land Mark" name="landmark" value={form.landmark} onChange={handleChange} size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="House No/ Flat No." name="houseNumber" value={form.houseNumber} onChange={handleChange} size="small" />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Checkbox defaultChecked size="small" />
                <Typography variant="body2" color="text.secondary">Save as shipping address</Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 1, border: '1px solid #d9d9d9', height: '100%' }} elevation={0}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>Order Summary</Typography>
              <Box sx={{ maxHeight: 350, overflowY: 'auto', pr: 1 }}>
                {singlePainting ? (
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Box sx={{ width: 70, height: 70, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={`${imageUrl}${singlePainting.imageUrl}`} alt={singlePainting.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{singlePainting.title || "Untitled"}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block">By {singlePainting.artist?.name || "Unknown"}</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 0.5 }}>₹ {(singlePainting.price || 0).toLocaleString()}</Typography>
                    </Box>
                  </Box>
                ) : singleEvent ? (
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Box sx={{ width: 70, height: 70, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={`${imageUrl}${singleEvent.imageUrl}`} alt={singleEvent.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{singleEvent.title || "Untitled"}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block">By {singleEvent.artist?.name || "Unknown"}</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 0.5 }}>₹ {(singleEvent.price || 0).toLocaleString()}</Typography>
                    </Box>
                  </Box>
                ) : (
                  cartItems.map((item, i) => (
                    <Box key={item.id || i} sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      <Box sx={{ width: 70, height: 70, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                        <img src={`${imageUrl}${item.painting?.imageUrl}`} alt={item.painting?.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.painting?.title || "Untitled"}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block">By {item.painting?.artist?.name || "Unknown"}</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 0.5 }}>₹ {(item.painting?.price || 0).toLocaleString()}</Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Paper>
          </Grid>

          {/* ROW 2: PAYMENT & TOTALS */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 1, border: '1px solid #d9d9d9', height: '100%' }} elevation={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Payment Method</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: 16 }} />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: 16 }} />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Please select your payment method</Typography>

              <Box sx={{ mb: 2 }}>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <Box sx={{ border: '1px solid #d9d9d9', borderRadius: 1, mb: 2, p: 1.5, display: 'flex', alignItems: 'center', bgcolor: paymentMethod === 'online' ? '#f0eeff' : '#fff', borderColor: paymentMethod === 'online' ? '#4a41c1' : '#d9d9d9' }}>
                      <FormControlLabel value="online" control={<Radio size="small" />} label={
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Online Payment</Typography>
                          <Typography variant="caption" color="text.secondary">Pay via Cashfree (Cards, UPI, Netbanking)</Typography>
                        </Box>
                      } />
                    </Box>

                    <Box sx={{ border: '1px solid #d9d9d9', borderRadius: 1, mb: 0, p: 1.5, display: 'flex', alignItems: 'center', bgcolor: paymentMethod === 'cod' ? '#f0eeff' : '#fff', borderColor: paymentMethod === 'cod' ? '#4a41c1' : '#d9d9d9' }}>
                      <FormControlLabel value="cod" control={<Radio size="small" />} label={
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Cash on Delivery (COD)</Typography>
                          <Typography variant="caption" color="text.secondary">Pay when you receive your order</Typography>
                        </Box>
                      } />
                    </Box>
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', mt: 2 }}>
                <Typography variant="caption">100% Satisfaction Guarantee</Typography>
                <Typography variant="caption">Fast and secure checkout</Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 1, border: '1px solid #d9d9d9', height: '100%' }} elevation={0}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>Order Summary</Typography>
              
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary" variant="body2">Subtotal</Typography>
                  <Typography sx={{ fontWeight: 700 }} variant="body2">₹ {getTotalPrice().toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary" variant="body2">Shipping</Typography>
                  <Typography sx={{ fontWeight: 700 }} variant="body2">Free</Typography>
                </Box>
              </Stack>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>₹ {getTotalPrice().toLocaleString()}</Typography>
              </Box>

              <Button 
                variant="contained" 
                fullWidth 
                size="large" 
                onClick={handleCheckout}
                sx={{ 
                  py: 1.2, 
                  borderRadius: 2, 
                  bgcolor: '#4a41c1',
                  fontSize: '1rem',
                  mb: 2,
                  '&:hover': { bgcolor: '#3932a1' }
                }}
              >
                Checkout
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: 16 }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: 16 }} />
              </Box>

              <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="caption" display="block">100% Satisfaction Guarantee</Typography>
                <Typography variant="caption" display="block">Fast and secure checkout</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Checkout;