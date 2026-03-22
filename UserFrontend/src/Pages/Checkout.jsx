import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_BASE_URL;

function Checkout() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: "",
    address: "",
    city: "",
    pinCode: "",
    houseNumber: "",
    landmark: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${url}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      const user = data.data;

      setForm({
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        pinCode: user.pinCode || "",
        houseNumber: user.houseNumber || "",
        landmark: user.landmark || ""
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${url}/users/me/address`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        alert("Address updated successfully");
        //navigate("/");
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating address");
    }
  };

  if (!token) {
    return <h2>Please login first</h2>;
  }

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "auto" }}>
      <h2>Checkout</h2>

      <input
        type="text"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="text"
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="text"
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="City"
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="number"
        name="pinCode"
        value={form.pinCode}
        onChange={handleChange}
        placeholder="Pincode"
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="text"
        name="houseNumber"
        value={form.houseNumber}
        onChange={handleChange}
        placeholder="House Number"
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="text"
        name="landmark"
        value={form.landmark}
        onChange={handleChange}
        placeholder="Landmark"
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "black",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Save & Continue
      </button>
    </div>
  );
}

export default Checkout;