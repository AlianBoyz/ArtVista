import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

function Home() {

  const [paintings, setPaintings] = useState([]);
  const [events, setEvents] = useState([]);
  const [index, setIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    getPaintings();
    getEvents();
  }, []);

  const getPaintings = async () => {
    const res = await fetch(`${url}/paintings`);
    const json = await res.json();

    const random = json.data.sort(() => 0.5 - Math.random()).slice(0, 10);
    setPaintings(random);
  };

  const getEvents = async () => {
    const res = await fetch(`${url}/events`);
    const json = await res.json();

    const latest = json.data.slice(-3).reverse();
    setEvents(latest);
  };

  const next = () => {
    if (index + 5 < paintings.length) {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div style={{ padding: "40px" }}>

      {/* PAINTINGS SECTION */}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems:"center" }}>
        <h2>Featured Paintings</h2>
        <Link to="/paintings">View All</Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

        <button onClick={prev}>◀</button>

        <div style={{ display: "flex", gap: "20px" }}>
          {paintings.slice(index, index + 5).map((p) => (
            <div
              key={p.id}
              style={{ width: "200px", cursor: "pointer" }}
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

        <button onClick={next}>▶</button>

      </div>


      {/* EVENTS SECTION */}

      <div style={{ marginTop: "60px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems:"center" }}>
          <h2>Latest Events</h2>
          <Link to="/events">View All</Link>
        </div>

        <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>

          {events.map((e) => (
            <div
              key={e.id}
              style={{ width: "280px", cursor: "pointer" }}
              onClick={() => navigate(`/event/${e.id}`)}
            >

              <img
                src={`${imageUrl}${e.imageUrl}`}
                alt={e.title}
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
              />

              <h3>{e.title}</h3>

              <p>{e.location}</p>

              <p>{e.eventDate}</p>

              <p>₹{e.price}</p>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Home;