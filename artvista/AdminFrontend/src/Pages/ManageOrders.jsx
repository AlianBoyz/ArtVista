import { useEffect, useState } from "react";
import "./ManageOrders.css";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
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
              <button onClick={() => updateStatus("ACCEPT")}>Accept</button>
              <button onClick={() => updateStatus("REJECT")}>Reject</button>
              <button onClick={() => updateStatus("INTRANSIT")}>In Transit</button>
              <button onClick={() => updateStatus("DELIVERED")}>Delivered</button>
              <button style={{ backgroundColor: "#ba6daf" }} onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
