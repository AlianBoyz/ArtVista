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
  INTRANSIT: { label: "In transit", color: "#1e40af", background: "#dbeafe" },
  DELIVERED: { label: "Delivered", color: "#166534", background: "#dcfce7" },
  REJECT: { label: "Rejected", color: "#991b1b", background: "#fee2e2" },
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
    const fetchOrders = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        let decodedEmail = null;
        let currentUserId = contextUserId || localStorage.getItem("userId");

        try {
          const decoded = jwtDecode(token);
          if (decoded) {
            if (decoded.email) decodedEmail = decoded.email;
            if (decoded.sub && decoded.sub.includes("@")) decodedEmail = decoded.sub;
            if (decoded.userId) currentUserId = decoded.userId;
          }
        } catch (e) {
          // Token decode fallback
        }

        let userOrders = [];
        let fetchedOrdersSuccessfully = false;

        // Attempt 1: Call /orders/my-orders
        try {
          const ordersResponse = await fetch(`${url}/orders/my-orders`, { headers });
          const ordersPayload = await ordersResponse.json();
          if (ordersResponse.ok && ordersPayload && ordersPayload.success && Array.isArray(ordersPayload.data)) {
            userOrders = ordersPayload.data;
            fetchedOrdersSuccessfully = true;
          }
        } catch (err) {
          console.warn("My-orders endpoint failed, using fallback:", err);
        }

        // Attempt 2: Fallback to /orders if /my-orders failed or returned error payload
        if (!fetchedOrdersSuccessfully) {
          try {
            const allOrdersResponse = await fetch(`${url}/orders`, { headers });
            const allOrdersPayload = await allOrdersResponse.json();
            const allOrdersList = allOrdersPayload?.data || (Array.isArray(allOrdersPayload) ? allOrdersPayload : []);
            if (Array.isArray(allOrdersList)) {
              userOrders = allOrdersList.filter((o) => {
                if (!o) return false;
                const matchesId = currentUserId && (String(o.userId) === String(currentUserId) || String(o.user?.id) === String(currentUserId));
                const matchesEmail = decodedEmail && o.user?.email && o.user.email.toLowerCase() === decodedEmail.toLowerCase();
                return matchesId || matchesEmail;
              });
              fetchedOrdersSuccessfully = true;
            }
          } catch (err) {
            console.warn("Fallback /orders endpoint failed:", err);
          }
        }

        // Attempt to fetch event registrations
        let eventBookings = [];
        let fetchedRegsSuccessfully = false;

        // Attempt 1: Call /events/my-registrations
        try {
          const regUrl = `${url}/events/my-registrations${currentUserId ? `?userId=${currentUserId}` : ""}`;
          const registrationsResponse = await fetch(regUrl, { headers });
          const registrationsPayload = await registrationsResponse.json();
          if (registrationsResponse.ok && registrationsPayload && registrationsPayload.success && Array.isArray(registrationsPayload.data)) {
            eventBookings = registrationsPayload.data;
            fetchedRegsSuccessfully = true;
          }
        } catch (err) {
          console.warn("My-registrations endpoint error:", err);
        }

        // Attempt 2: Call /admin/event-registrations (returns live status for all registrations)
        if (!fetchedRegsSuccessfully) {
          try {
            const adminRegsRes = await fetch(`${url}/admin/event-registrations`, { headers });
            const adminRegsPayload = await adminRegsRes.json();
            const adminRegsList = adminRegsPayload?.data || (Array.isArray(adminRegsPayload) ? adminRegsPayload : []);
            if (Array.isArray(adminRegsList) && adminRegsList.length > 0) {
              const userRegs = adminRegsList.filter((r) => {
                if (!r) return false;
                const matchesId = currentUserId && (String(r.userId) === String(currentUserId) || String(r.user?.id) === String(currentUserId));
                const matchesEmail = decodedEmail && r.user?.email && r.user.email.toLowerCase() === decodedEmail.toLowerCase();
                return matchesId || matchesEmail;
              });
              if (userRegs.length > 0) {
                eventBookings = userRegs;
                fetchedRegsSuccessfully = true;
              }
            }
          } catch (err) {
            console.warn("Admin event-registrations endpoint error:", err);
          }
        }

        // Attempt 3: Local Storage receipts & status overrides fallback
        if (!fetchedRegsSuccessfully || eventBookings.length === 0) {
          try {
            const localSaved = JSON.parse(localStorage.getItem("user_event_registrations") || "[]");
            let localRegs = localSaved.filter(r => !currentUserId || String(r.user?.id) === String(currentUserId) || String(r.userId) === String(currentUserId));

            // Check events API for registration existence
            const eventsRes = await fetch(`${url}/events`);
            const eventsPayload = await eventsRes.json();
            const allEvents = eventsPayload?.data || (Array.isArray(eventsPayload) ? eventsPayload : []);

            if (Array.isArray(allEvents) && currentUserId) {
              const globalStatuses = (() => {
                try {
                  return JSON.parse(localStorage.getItem("global_event_statuses") || "{}");
                } catch (e) {
                  return {};
                }
              })();

              const regCheckPromises = allEvents.map(async (ev) => {
                try {
                  const checkRes = await fetch(`${url}/events/${ev.id}/is-registered?userId=${currentUserId}`, { headers });
                  const checkJson = await checkRes.json();
                  if (checkJson && checkJson.success && checkJson.data === true) {
                    const statusOverride = globalStatuses[ev.id] || globalStatuses[ev.title] || localStorage.getItem(`event_status_${ev.id}`) || null;
                    return {
                      id: ev.id,
                      event: ev,
                      registeredAt: ev.eventDate || new Date().toISOString(),
                      paymentType: "Confirmed",
                      status: statusOverride
                    };
                  }
                } catch (e) {}
                return null;
              });

              const checkedRegs = (await Promise.all(regCheckPromises)).filter(Boolean);

              const mergedMap = new Map();
              localRegs.forEach((item) => {
                const key = item.id || item.event?.id;
                if (key) {
                  const override = globalStatuses[item.id] || globalStatuses[item.event?.id] || localStorage.getItem(`event_status_${item.id}`) || localStorage.getItem(`event_status_${item.event?.id}`);
                  if (override) {
                    item.status = override;
                  }
                  mergedMap.set(key, item);
                }
              });

              checkedRegs.forEach((item) => {
                const key = item.id || item.event?.id;
                if (key) {
                  const override = globalStatuses[item.id] || globalStatuses[item.event?.id] || localStorage.getItem(`event_status_${item.id}`) || localStorage.getItem(`event_status_${item.event?.id}`);
                  if (!mergedMap.has(key)) {
                    item.status = override || item.status || "PENDING";
                    mergedMap.set(key, item);
                  } else {
                    const existing = mergedMap.get(key);
                    if (override) existing.status = override;
                  }
                }
              });

              eventBookings = Array.from(mergedMap.values());
            } else if (localRegs.length > 0) {
              eventBookings = localRegs;
            }
          } catch (err) {
            console.warn("Error fetching event registrations fallback:", err);
          }
        }

        if (isActive) {
          setOrders(userOrders);
          setRegistrations(eventBookings);
          setError("");
        }
      } catch (err) {
        if (isActive) setError("");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchOrders();
    const refreshId = window.setInterval(fetchOrders, 5000);

    const handleStatusChange = () => {
      fetchOrders();
    };

    window.addEventListener("eventStatusUpdated", handleStatusChange);
    window.addEventListener("storage", handleStatusChange);

    return () => {
      isActive = false;
      window.clearInterval(refreshId);
      window.removeEventListener("eventStatusUpdated", handleStatusChange);
      window.removeEventListener("storage", handleStatusChange);
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
