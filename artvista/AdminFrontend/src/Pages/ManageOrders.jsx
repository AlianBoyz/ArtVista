import { useEffect, useState } from "react";

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
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    setOrders(data.data);

  };

  const openProcessModal = (order) => {

    setSelectedOrder(order);
    setShowModal(true);

  };

  const updateStatus = async (status) => {

    await fetch(`${url}/orders/${selectedOrder.id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status: status
      })
    });

    setShowModal(false);
    fetchOrders();

  };

  return (
    <div>

      <h1>Manage Orders</h1>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        marginTop: "20px"
      }}>

        {orders.map((o) => (

          <div
            key={o.id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              display: "flex",
              justifyContent: "space-between"
            }}
          >

            <div>

              <h3>Order #{o.id}</h3>

              <p><b>User:</b> {o.user?.name}</p>

              <p><b>Date:</b> {o.createdAt}</p>

              <p><b>Payment:</b> {o.paymentType}</p>

              <p><b>Status:</b> {o.orrderStatus}</p>

            </div>

            <div>

              <button onClick={() => openProcessModal(o)}>
                Process
              </button>

            </div>

          </div>

        ))}

      </div>


      {showModal && selectedOrder && (

        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>

          <div style={{
            background: "white",
            padding: "30px",
            width: "800px",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>

            <h2>Order Details</h2>

            <h3>User Info</h3>

            <p><b>Name:</b> {selectedOrder.user?.name}</p>
            <p><b>Email:</b> {selectedOrder.user?.email}</p>
            <p><b>Phone:</b> {selectedOrder.user?.phone}</p>
            <p><b>City:</b> {selectedOrder.user?.city}</p>
            <p><b>Address:</b> {selectedOrder.user?.houseNumber}</p>

            <hr />

            <h3>Order Items</h3>

            {selectedOrder.items.map((item) => (

              <div
                key={item.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                  display: "flex",
                  gap: "15px"
                }}
              >

                {item.painting && (

                  <>
                    <img
                      src={`${imageUrl}${item.painting.imageUrl}`}
                      style={{ width: "120px" }}
                    />

                    <div>
                      <h4>{item.painting.title}</h4>
                      <p>Artist: {item.painting.artist?.name}</p>
                      <p>Price: ₹{item.price}</p>
                      <p>Type: {item.itemType}</p>
                    </div>
                  </>

                )}

              </div>

            ))}

            <hr />

            <h3>Total: ₹{selectedOrder.totalAmount}</h3>

            <br />

            <div style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap"
            }}>

              <button onClick={() => updateStatus("ACCEPTED")}>
                Accept
              </button>

              <button onClick={() => updateStatus("REJECTED")}>
                Reject
              </button>

              <button onClick={() => updateStatus("INTRANSIT")}>
                In Transit
              </button>

              <button onClick={() => updateStatus("DELIVERED")}>
                Delivered
              </button>

              <button
                onClick={() => setShowModal(false)}
                style={{ marginLeft: "20px" }}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );

};

export default ManageOrders;