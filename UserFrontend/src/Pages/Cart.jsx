import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

function Cart() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${url}/carts/my-cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setCart(data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    if (!cart) return 0;

    let total = 0;

    cart.items.forEach((item) => {
      total += item.painting.price * item.quantity;
    });

    return total;
  };


  if (!token) {
    return <h2>Please login first</h2>;
  }

 
  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ display: "flex", gap: "40px", padding: "40px" }}>
      <div style={{ flex: 2 }}>
        <h2>Your Cart</h2>

        {cart.items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              padding: "15px"
            }}
          >
            <img
              src={`${imageUrl}${item.painting.imageUrl}`}
              alt={item.painting.title}
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />

            <div>
              <h3>{item.painting.title}</h3>
              <p>Artist: {item.painting.artist.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          flex: 1,
          border: "1px solid #ddd",
          padding: "20px",
          height: "fit-content"
        }}
      >
        <h2>Summary</h2>
        <p>Total Items: {cart.items.length}</p>
        <h3>Total Price: ₹{getTotalPrice()}</h3>

        <button
          style={{ marginTop: "20px", width: "100%" }}
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;