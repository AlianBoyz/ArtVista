import { useEffect, useState } from "react";
import "./ManageEvents.css";

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
  const [totalSeats, setTotalSeats] = useState("");
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await fetch(`${url}/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    setTotalSeats("");
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
    setTotalSeats(event.totalSeats);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this event?");
    if (!confirmDelete) return;

    await fetch(`${url}/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    formData.append("totalSeats", totalSeats);

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
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      setShowModal(false);
      setEditId(null);
      fetchEvents();
    }
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

  return (
    <div className="events-page">
      <section className="events-header">
        <h1>Event Management</h1>

        <div className="events-searchRow">
          <div className="events-search">
            <input type="text" placeholder="Value" />
            <span className="events-search__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
          </div>

          <button className="events-addButton" onClick={openAddModal}>
            Add Event
          </button>
        </div>
      </section>

      {showModal && (
        <div className="events-modal">
          <div className="events-modal__panel">
            <h2>{editId ? "Edit Event" : "Add Event"}</h2>

            <form className="events-modal__form" onSubmit={handleSubmit}>
              <input
                className="events-modal__input"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                className="events-modal__input"
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="events-modal__grid">
                <input
                  className="events-modal__input"
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />

                <input
                  className="events-modal__input"
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />

                <input
                  className="events-modal__input"
                  type="text"
                  placeholder="Duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />

                <input
                  className="events-modal__input"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />

                <input
                  className="events-modal__input"
                  type="number"
                  placeholder="Artist Id"
                  value={artistId}
                  onChange={(e) => setArtistId(e.target.value)}
                />

                <input
                  className="events-modal__input"
                  type="number"
                  placeholder="Total Seats"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(e.target.value)}
                />
              </div>

              <label className="events-modal__file">
                <span>{image ? image.name : "Choose image"}</span>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>

              <div className="events-modal__actions">
                <button type="submit">{editId ? "Update" : "Add"}</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="events-tableWrap">
        <div className="events-tableHeader">
          <span>Events</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        <div className="events-tableBody">
          {events.map((event) => (
            <article className="events-row" key={event.id}>
              <div className="events-row__main">
                <img
                  src={`${imageUrl}${event.imageUrl}`}
                  alt={event.title}
                  className="events-row__image"
                />

                <div className="events-row__copy">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
              </div>

              <div className="events-row__date">{formatDate(event.eventDate)}</div>

              <div className="events-row__actions">
                <button
                  className="events-row__edit"
                  onClick={() => handleEdit(event)}
                >
                  Edit
                </button>

                <button
                  className="events-row__delete"
                  onClick={() => handleDelete(event.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ManageEvents;
