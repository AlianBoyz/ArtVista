import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { LocalShipping, ReceiptLong, ShoppingBag } from "@mui/icons-material";
import { AuthContext } from "../Context/AuthProvider";

const url = import.meta.env.VITE_BASE_URL;
const imageBase = import.meta.env.VITE_IMAGE_BASE_URL || "";

const getImageSrc = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) return path;
  return `${imageBase}${path}`;
};

const statusStyles = {
  PENDING: { label: "Pending", color: "#9a6700", background: "#fff3cd" },
  ACCEPT: { label: "Accepted", color: "#14532d", background: "#dcfce7" },
  ACCEPTED: { label: "Accepted", color: "#14532d", background: "#dcfce7" },
  INTRANSIT: { label: "In transit", color: "#1e40af", background: "#dbeafe" },
  DELIVERED: { label: "Delivered", color: "#166534", background: "#dcfce7" },
  REJECT: { label: "Rejected", color: "#991b1b", background: "#fee2e2" },
  REJECTED: { label: "Rejected", color: "#991b1b", background: "#fee2e2" },
};

const formatDate = (value) => {
  if (!value) return "Order date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const getOrderStatus = (order) => order.orderStatus || order.orrderStatus || "PENDING";
const getRegistrationStatus = (registration) => registration.status || registration.registrationStatus || registration.orderStatus || "PENDING";

function Orders() {
  const { token, userId: contextUserId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return undefined;
    }

    let isActive = true;
    const fetchAllData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Painting Orders
        const ordersPromise = fetch(`${url}/orders/my-orders`, { headers })
          .then((res) => res.json())
          .then((data) => (data && data.success && Array.isArray(data.data) ? data.data : []))
          .catch(() => []);

        // 2. Fetch Event Registrations
        const registrationsPromise = fetch(`${url}/events/my-registrations`, { headers })
          .then((res) => res.json())
          .then((data) => (data && data.success && Array.isArray(data.data) ? data.data : []))
          .catch(() => []);

        const [fetchedOrders, fetchedRegistrations] = await Promise.all([
          ordersPromise,
          registrationsPromise,
        ]);

        if (isActive) {
          setOrders(fetchedOrders);
          setRegistrations(fetchedRegistrations);
          setError("");
        }
      } catch (err) {
        console.error("Error loading user orders:", err);
        if (isActive) setError("Unable to load orders. Please try again.");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchAllData();

    // Auto-refresh every 6 seconds so status updates live when admin modifies status
    const intervalId = window.setInterval(fetchAllData, 6000);

    const handleFocus = () => fetchAllData();
    window.addEventListener("focus", handleFocus);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [token, contextUserId]);

  if (loading) {
    return <Box sx={{ minHeight: "75vh", display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  }

  if (!token) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <ReceiptLong sx={{ fontSize: 72, color: "#5146c9", mb: 2 }} />
        <Typography variant="h4" fontWeight={800}>View your orders</Typography>
        <Typography sx={{ color: "text.secondary", mt: 1, mb: 3 }}>Please sign in to check your order status.</Typography>
        <Button variant="contained" onClick={() => navigate("/login")} sx={{ bgcolor: "#5146c9" }}>Login</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <LocalShipping sx={{ color: "#5146c9", fontSize: 32 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: "2rem", sm: "2.5rem" } }}>My Orders</Typography>
        </Box>
        <Typography sx={{ color: "text.secondary", mb: 4 }}>Your order status updates automatically when the admin processes your order.</Typography>

        {error && <Paper sx={{ p: 2, mb: 2, color: "#991b1b", bgcolor: "#fee2e2" }} elevation={0}>{error}</Paper>}

        {!error && orders.length === 0 && registrations.length === 0 ? (
          <Paper sx={{ p: { xs: 4, sm: 7 }, textAlign: "center", border: "1px solid #e5e7eb" }} elevation={0}>
            <ShoppingBag sx={{ fontSize: 64, color: "#5146c9", mb: 2 }} />
            <Typography variant="h5" fontWeight={700}>No orders yet</Typography>
            <Typography sx={{ color: "text.secondary", mt: 1, mb: 3 }}>Discover a piece of art you love.</Typography>
            <Button variant="contained" onClick={() => navigate("/paintings")} sx={{ bgcolor: "#5146c9" }}>Browse Paintings</Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {orders.map((order) => {
              const status = getOrderStatus(order);
              const statusStyle = statusStyles[status] || statusStyles.PENDING;
              return (
                <Paper key={order.id} elevation={0} sx={{ overflow: "hidden", border: "1px solid #e5e7eb", borderRadius: 2 }}>
                  <Box sx={{ p: { xs: 2, sm: 2.5 }, display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center", flexWrap: "wrap", bgcolor: "#fff" }}>
                    <Box>
                      <Typography fontWeight={800}>Order #{order.id}</Typography>
                      <Typography variant="body2" color="text.secondary">Placed on {formatDate(order.createdAt)}</Typography>
                    </Box>
                    <Chip label={statusStyle.label} sx={{ bgcolor: statusStyle.background, color: statusStyle.color, fontWeight: 800 }} />
                  </Box>
                  <Divider />
                  <Stack spacing={2} sx={{ p: { xs: 2, sm: 2.5 } }}>
                    {(order.items || []).map((item) => {
                      const itemImg = item.painting?.imageUrl || item.painting?.image || item.event?.imageUrl || item.event?.image;
                      const itemTitle = item.painting?.title || item.event?.title || "Order item";
                      const itemPrice = Number(item.price || item.painting?.price || 0).toLocaleString("en-IN");
                      return (
                        <Box key={item.id} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          {itemImg && (
                            <Box
                              component="img"
                              src={getImageSrc(itemImg)}
                              alt={itemTitle}
                              sx={{ width: 60, height: 60, borderRadius: 1.5, objectFit: "cover", border: "1px solid #e5e7eb", flexShrink: 0 }}
                            />
                          )}
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography fontWeight={700}>{itemTitle}</Typography>
                            {item.painting?.artist?.name && (
                              <Typography variant="body2" color="text.secondary">By {item.painting.artist.name}</Typography>
                            )}
                          </Box>
                          <Typography fontWeight={800}>Rs {itemPrice}</Typography>
                        </Box>
                      );
                    })}
                    <Divider sx={{ my: 0.5 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" color="text.secondary">Payment: {order.paymentType || "—"}</Typography>
                      <Typography fontWeight={800}>Total: Rs {Number(order.totalAmount || 0).toLocaleString("en-IN")}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              );
            })}
            {registrations.length > 0 && (
              <Typography variant="h5" sx={{ fontWeight: 800, pt: orders.length ? 2 : 0 }}>
                Event Bookings
              </Typography>
            )}
            {registrations.map((registration) => {
              const status = getRegistrationStatus(registration);
              const statusStyle = statusStyles[status.toUpperCase()] || statusStyles.PENDING;
              const eventImg = registration.event?.imageUrl || registration.event?.image;
              const eventTitle = registration.event?.title || "Event booking";
              const eventFee = Number(registration.event?.price || 0).toLocaleString("en-IN");

              return (
                <Paper key={`event-${registration.id}`} elevation={0} sx={{ overflow: "hidden", border: "1px solid #e5e7eb", borderRadius: 2 }}>
                  <Box sx={{ p: { xs: 2, sm: 2.5 }, display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center", flexWrap: "wrap", bgcolor: "#fff" }}>
                    <Box>
                      <Typography fontWeight={800}>{eventTitle}</Typography>
                      <Typography variant="body2" color="text.secondary">Booked on {formatDate(registration.registeredAt)}</Typography>
                    </Box>
                    <Chip label={statusStyle.label} sx={{ bgcolor: statusStyle.background, color: statusStyle.color, fontWeight: 800 }} />
                  </Box>
                  <Divider />
                  <Box sx={{ p: { xs: 2, sm: 2.5 }, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                    {eventImg && (
                      <Box
                        component="img"
                        src={getImageSrc(eventImg)}
                        alt={eventTitle}
                        sx={{ width: 60, height: 60, borderRadius: 1.5, objectFit: "cover", border: "1px solid #e5e7eb", flexShrink: 0 }}
                      />
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                      {registration.event?.location && (
                        <Typography variant="body2" color="text.secondary">Location: {registration.event.location}</Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">Payment: {registration.paymentType || "Not specified"}</Typography>
                    </Box>
                    <Typography fontWeight={800}>Event fee: Rs {eventFee}</Typography>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Container>
    </Box>
  );
}

export default Orders;
