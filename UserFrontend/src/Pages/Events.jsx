import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

function Events() {

  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {

    const res = await fetch(`${url}/events`);

    const json = await res.json();

    setEvents(json.data);

  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>All Events</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>

        {events.map((e) => (

          <div
            key={e.id}
            style={{ width: "260px", cursor: "pointer" }}
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
  );
}

export default Events;