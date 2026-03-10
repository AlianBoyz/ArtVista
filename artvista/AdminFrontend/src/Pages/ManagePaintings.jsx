import { useEffect, useState } from "react";
import "./ManagePaintings.css";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

const ManagePaintings = () => {
  const [paintings, setPaintings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [medium, setMedium] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [artistId, setArtistId] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPaintings();
  }, []);

  const fetchPaintings = async () => {
    const response = await fetch(`${url}/paintings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setPaintings(data.data);
  };

  const openAddModal = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setSize("");
    setMedium("");
    setYear("");
    setPrice("");
    setArtistId("");
    setImage(null);
    setShowModal(true);
  };

  const handleEdit = (painting) => {
    setEditId(painting.id);
    setTitle(painting.title);
    setDescription(painting.description);
    setSize(painting.size);
    setMedium(painting.medium);
    setYear(painting.year);
    setPrice(painting.price);
    setArtistId(painting.artist?.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this painting?");
    if (!confirmDelete) return;

    await fetch(`${url}/paintings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchPaintings();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("size", size);
    formData.append("medium", medium);
    formData.append("year", year);
    formData.append("price", price);
    formData.append("artistId", artistId);

    if (image) {
      formData.append("paintingImage", image);
    }

    let endpoint = `${url}/paintings`;
    let method = "POST";

    if (editId) {
      endpoint = `${url}/paintings/${editId}`;
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
      fetchPaintings();
    }
  };

  const formatPrice = (value) => {
    if (value === null || value === undefined || value === "") return "";
    return `Rs ${Number(value).toLocaleString("en-IN")}`;
  };

  return (
    <div className="paintings-page">
      <section className="paintings-header">
        <h1>Paintings Management</h1>

        <div className="paintings-searchRow">
          <div className="paintings-search">
            <input type="text" placeholder="Value" />
            <span className="paintings-search__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
          </div>

          <button className="paintings-addButton" onClick={openAddModal}>
            Add Paintings
          </button>
        </div>
      </section>

      {showModal && (
        <div className="paintings-modal">
          <div className="paintings-modal__panel">
            <h2>{editId ? "Edit Painting" : "Add Painting"}</h2>

            <form className="paintings-modal__form" onSubmit={handleSubmit}>
              <input
                className="paintings-modal__input"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                className="paintings-modal__input"
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="paintings-modal__grid">
                <input
                  className="paintings-modal__input"
                  type="text"
                  placeholder="Size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />

                <input
                  className="paintings-modal__input"
                  type="text"
                  placeholder="Medium"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                />

                <input
                  className="paintings-modal__input"
                  type="number"
                  placeholder="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />

                <input
                  className="paintings-modal__input"
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />

                <input
                  className="paintings-modal__input"
                  type="number"
                  placeholder="Artist Id"
                  value={artistId}
                  onChange={(e) => setArtistId(e.target.value)}
                />
              </div>

              <label className="paintings-modal__file">
                <span>{image ? image.name : "Choose image"}</span>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>

              <div className="paintings-modal__actions">
                <button type="submit">{editId ? "Update" : "Add"}</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="paintings-tableWrap">
        <div className="paintings-tableHeader">
          <span>Paintings</span>
          <span>Price</span>
          <span>Actions</span>
        </div>

        <div className="paintings-tableBody">
          {paintings.map((painting) => (
            <article className="paintings-row" key={painting.id}>
              <div className="paintings-row__main">
                <img
                  src={`${imageUrl}${painting.imageUrl}`}
                  alt={painting.title}
                  className="paintings-row__image"
                />

                <div className="paintings-row__copy">
                  <h3>{painting.title}</h3>
                  <p>
                    By {painting.artist?.name || "Unknown Artist"}
                  </p>
                </div>
              </div>

              <div className="paintings-row__price">
                {formatPrice(painting.price)}
              </div>

              <div className="paintings-row__actions">
                <button
                  className="paintings-row__edit"
                  onClick={() => handleEdit(painting)}
                >
                  Edit
                </button>

                <button
                  className="paintings-row__delete"
                  onClick={() => handleDelete(painting.id)}
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

export default ManagePaintings;
