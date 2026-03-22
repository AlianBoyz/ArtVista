import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

function Paintings() {

  const [paintings, setPaintings] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getPaintings();
  }, []);

  const getPaintings = async () => {

    const res = await fetch(`${url}/paintings`);

    const json = await res.json();

    setPaintings(json.data);

  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>All Paintings</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>

        {paintings.map((p) => (

          <div
            key={p.id}
            style={{ width: "220px", cursor: "pointer" }}
            onClick={() => navigate(`/paintingDetails/${p.id}`)}
          >

            <img
              src={`${imageUrl}${p.imageUrl}`}
              alt={p.title}
              style={{ width: "100%", height: "220px", objectFit: "cover" }}
            />

            <h4>{p.title}</h4>

            <p>by {p.artist.name}</p>

            <p>₹{p.price}</p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Paintings;