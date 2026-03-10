import { useEffect, useState } from "react";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

const ManageEvents = () => {

  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [artistId, setArtistId] = useState("");
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {

    const response = await fetch(`${url}/events`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    setEvents(data.data);

  };

  const openAddModal = () => {

    setEditId(null);

    setTitle("");
    setDescription("");
    setPrice("");
    setLocation("");
    setDuration("");
    setEventDate("");
    setArtistId("");
    setImage(null);

    setShowModal(true);

  };

  const handleEdit = (event) => {

    setEditId(event.id);

    setTitle(event.title);
    setDescription(event.description);
    setPrice(event.price);
    setLocation(event.location);
    setDuration(event.duration);
    setEventDate(event.eventDate);
    setArtistId(event.artist?.id);

    setShowModal(true);

  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm("Delete this event?");

    if (!confirmDelete) return;

    await fetch(`${url}/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchEvents();

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("duration", duration);
    formData.append("eventDate", eventDate);
    formData.append("artistId", artistId);

    if (image) {
      formData.append("eventImage", image);
    }

    let endpoint = `${url}/events`;
    let method = "POST";

    if (editId) {
      endpoint = `${url}/events/${editId}`;
      method = "PUT";
    }

    const response = await fetch(endpoint, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {

      setShowModal(false);
      setEditId(null);

      fetchEvents();

    }

  };

  return (
    <div>

      <h1>Manage Events</h1>

      <button onClick={openAddModal}>
        Add Event
      </button>

      {showModal && (

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
            padding: "20px",
            width: "400px"
          }}>

            <h2>{editId ? "Edit Event" : "Add Event"}</h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <br /><br />

              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <br /><br />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <br /><br />

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <br /><br />

              <input
                type="text"
                placeholder="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />

              <br /><br />

              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />

              <br /><br />

              <input
                type="number"
                placeholder="Artist Id"
                value={artistId}
                onChange={(e) => setArtistId(e.target.value)}
              />

              <br /><br />

              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />

              <br /><br />

              <button type="submit">
                {editId ? "Update" : "Add"}
              </button>

              <button
                type="button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

            </form>

          </div>

        </div>

      )}

      <div style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        marginTop: "20px"
      }}>

        {events.map((e) => (

          <div
            key={e.id}
            style={{
              width: "250px",
              border: "1px solid gray",
              padding: "10px"
            }}
          >

            <img
              src={`${imageUrl}${e.imageUrl}`}
              alt={e.title}
              style={{ width: "100%" }}
            />

            <h3>{e.title}</h3>

            <p>by {e.artist?.name}</p>

            <p>Location: {e.location}</p>

            <p>Date: {e.eventDate}</p>

            <p>Price: ₹{e.price}</p>

            <br />

            <button onClick={() => handleEdit(e)}>
              Edit
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleDelete(e.id)}
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>
  );

};

export default ManageEvents;