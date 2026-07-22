import { useEffect, useState } from "react";
import "./ManageOrders.css";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
    fetchEventRegistrations();
  }, []);

  const fetchOrders = async () => {
    const response = await fetch(`${url}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setOrders(data.data);
  };

  const fetchEventRegistrations = async () => {
    const response = await fetch(`${url}/admin/event-registrations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setEventRegistrations(data.data || []);
  };

  const openProcessModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const updateStatus = async (status) => {
    await fetch(`${url}/admin/orders/${selectedOrder.id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: status,
      }),
    });

    setShowModal(false);
    fetchOrders();
  };

  const updateRegistrationStatus = async (status) => {
    try {
      const statusUpper = status.toUpperCase();
      await fetch(`${url}/admin/event-registrations/${selectedRegistration.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: statusUpper }),
      });

      if (selectedRegistration) {
        const regId = selectedRegistration.id;
        const eventId = selectedRegistration.event?.id;
        if (regId) localStorage.setItem(`event_status_${regId}`, statusUpper);
        if (eventId) localStorage.setItem(`event_status_${eventId}`, statusUpper);

        try {
          const globalStatuses = JSON.parse(localStorage.getItem("global_event_statuses") || "{}");
          if (regId) globalStatuses[regId] = statusUpper;
          if (eventId) globalStatuses[eventId] = statusUpper;
          localStorage.setItem("global_event_statuses", JSON.stringify(globalStatuses));
        } catch (e) {}

        try {
          const saved = JSON.parse(localStorage.getItem("user_event_registrations") || "[]");
          const updated = saved.map((r) => {
            if (r.id === regId || r.event?.id === eventId) {
              return { ...r, status: statusUpper };
            }
            return r;
          });
          localStorage.setItem("user_event_registrations", JSON.stringify(updated));
        } catch (e) {
          console.error("Local registration status sync error:", e);
        }

        window.dispatchEvent(new CustomEvent("eventStatusUpdated", { detail: { id: regId, eventId, status: statusUpper } }));
      }
    } catch (e) {
      console.error("Failed updating event registration status:", e);
    }

    setSelectedRegistration(null);
    fetchEventRegistrations();
  };

  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  const formatPrice = (value) => {
    if (value === null || value === undefined || value === "") return "";
    return `Rs ${Number(value).toLocaleString("en-IN")}`;
  };

  return (
    <div className="orders-page">
      <section className="orders-header">
        <h1>Order Management</h1>

        <div className="orders-searchRow">
          <div className="orders-search">
            <input type="text" placeholder="Value" />
            <span className="orders-search__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
          </div>
        </div>
      </section>

      <section className="orders-tableWrap">
        <div className="orders-tableHeader">
          <span>Event Booking</span>
          <span>Date</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        <div className="orders-tableBody">
          {eventRegistrations.map((registration) => (
            <article className="orders-row" key={`event-${registration.id}`}>
              <div className="orders-row__main">
                <div className="orders-row__copy">
                  <h3>{registration.event?.title || "Event booking"}</h3>
                  <p>User: {registration.user?.name}</p>
                  <p>Payment: {registration.paymentType || "Not specified"}</p>
                </div>
              </div>

              <div className="orders-row__date">{formatDate(registration.registeredAt)}</div>
              <div className="orders-row__status">{registration.status}</div>
              <div className="orders-row__actions">
                <button className="orders-row__process" onClick={() => setSelectedRegistration(registration)}>
                  Process
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="orders-tableWrap">
        <div className="orders-tableHeader">
          <span>Order</span>
          <span>Date</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        <div className="orders-tableBody">
          {orders.map((order) => (
            <article className="orders-row" key={order.id}>
              <div className="orders-row__main">
                <div className="orders-row__copy">
                  <h3>Order #{order.id}</h3>
                  <p>User: {order.user?.name}</p>
                  <p>Payment: {order.paymentType}</p>
                </div>
              </div>

              <div className="orders-row__date">{formatDate(order.createdAt)}</div>

              <div className="orders-row__status">
                {order.orderStatus || order.orrderStatus}
              </div>

              <div className="orders-row__actions">
                <button
                  className="orders-row__process"
                  onClick={() => openProcessModal(order)}
                >
                  Process
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {showModal && selectedOrder && (
        <div className="orders-modal">
          <div className="orders-modal__panel">
            <h2>Order Details</h2>

            <h3>User Info</h3>

            <div className="orders-modal__infoGrid">
              <p><b>Name:</b> {selectedOrder.user?.name}</p>
              <p><b>Email:</b> {selectedOrder.user?.email}</p>
              <p><b>Address:</b> {selectedOrder.user?.address}</p>
              <p><b>Phone:</b> {selectedOrder.user?.phone}</p>
              <p><b>Zip Code:</b> {selectedOrder.user?.zipCode}</p>
              <p><b>City:</b> {selectedOrder.user?.city}</p>
              <p><b>House Number:</b> {selectedOrder.user?.houseNumber}</p>
              <p><b>Landmark:</b> {selectedOrder.user?.landmark}</p>
              <p><b>Order Date:</b> {selectedOrder.order?.date}</p>
              <p><b>Payment Type:</b> {selectedOrder.order?.paymentType}</p>
              <p><b>Payment ID:</b> {selectedOrder.order?.paymentId}</p>
            </div>
            <hr />

            <h3>Order Items</h3>

            {selectedOrder.items.map((item) => (
              <div key={item.id} className="orders-modal__item">
                {item.painting && (
                  <>
                    <img
                      src={`${imageUrl}${item.painting.imageUrl}`}
                      alt={item.painting.title}
                      className="orders-modal__itemImage"
                    />

                    <div className="orders-modal__itemCopy">
                      <h4>{item.painting.title}</h4>
                      <p>Artist: {item.painting.artist?.name}</p>
                      <p>Price: {formatPrice(item.price)}</p>
                      <p>Type: {item.itemType}</p>
                    </div>
                  </>
                )}
              </div>
            ))}

            <hr />

            <h3>Total: {formatPrice(selectedOrder.totalAmount)}</h3>

            <br />

            <div className="orders-modal__actions">
              <button className="orders-modal__action orders-modal__action--primary" onClick={() => updateStatus("ACCEPT")}>Accept</button>
              <button className="orders-modal__action orders-modal__action--reject" onClick={() => updateStatus("REJECT")}>Reject</button>
              <button className="orders-modal__action orders-modal__action--primary" onClick={() => updateStatus("INTRANSIT")}>In Transit</button>
              <button className="orders-modal__action orders-modal__action--primary" onClick={() => updateStatus("DELIVERED")}>Delivered</button>
              <button className="orders-modal__action orders-modal__action--danger" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {selectedRegistration && (
        <div className="orders-modal">
          <div className="orders-modal__panel">
            <h2>Event Booking Details</h2>
            <div className="orders-modal__infoGrid">
              <p><b>Event:</b> {selectedRegistration.event?.title}</p>
              <p><b>Event date:</b> {formatDate(selectedRegistration.event?.eventDate)}</p>
              <p><b>User:</b> {selectedRegistration.user?.name}</p>
              <p><b>Email:</b> {selectedRegistration.user?.email}</p>
              <p><b>Payment type:</b> {selectedRegistration.paymentType || "Not specified"}</p>
              <p><b>Payment ID:</b> {selectedRegistration.paymentId || "Not available"}</p>
              <p><b>Booking status:</b> {selectedRegistration.status}</p>
              <p><b>Event fee:</b> {formatPrice(selectedRegistration.event?.price)}</p>
            </div>

            <div className="orders-modal__actions">
              <button className="orders-modal__action orders-modal__action--primary" onClick={() => updateRegistrationStatus("ACCEPT")}>Accept</button>
              <button className="orders-modal__action orders-modal__action--reject" onClick={() => updateRegistrationStatus("REJECT")}>Reject</button>
              <button className="orders-modal__action orders-modal__action--danger" onClick={() => setSelectedRegistration(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
