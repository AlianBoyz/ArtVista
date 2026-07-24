import { useEffect, useState } from "react";
import { useToast } from "../../Context/ToastProvider";
import "./ManageArtist.css";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

const ManageArtist = () => {
  const { showToast, showConfirm } = useToast();
  const [artists, setArtists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchArtists(0, true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
        hasMore &&
        !loading
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchArtists(nextPage, false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, loading]);

  const fetchArtists = async (pageNum = 0, reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`${url}/artists?page=${pageNum}&size=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success && data.data) {
        const newItems = data.data.content || [];
        const isLast = data.data.last ?? true;

        setArtists((prev) => (reset ? newItems : [...prev, ...newItems]));
        setHasMore(!isLast);
      }
    } catch (err) {
      console.error("Error fetching artists:", err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setName("");
    setBio("");
    setImage(null);
    setShowModal(true);
  };

  const handleEdit = (artist) => {
    setEditId(artist.id);
    setName(artist.name);
    setBio(artist.bio);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    showConfirm("Are you sure you want to delete this artist? This action cannot be undone.", async () => {
      await fetch(`${url}/artists/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Artist deleted successfully.", "success");
      setPage(0);
      fetchArtists(0, true);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);

    if (image) {
      formData.append("profileImage", image);
    }

    let endpoint = `${url}/artists`;
    let method = "POST";

    if (editId) {
      endpoint = `${url}/artists/${editId}`;
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
      setPage(0);
      fetchArtists(0, true);
    }
  };

  return (
    <div className="artists-page">
      <section className="artists-header">
        <h1>Artist Management</h1>

        <div className="artists-searchRow">
          <div className="artists-search">
            <input type="text" placeholder="Value" />
            <span className="artists-search__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
          </div>

          <button className="artists-addButton" onClick={openAddModal}>
            Add Artist
          </button>
        </div>
      </section>

      {showModal && (
        <div className="artists-modal">
          <div className="artists-modal__panel">
            <h2>{editId ? "Edit Artist" : "Add Artist"}</h2>

            <form className="artists-modal__form" onSubmit={handleSubmit}>
              <input
                className="artists-modal__input"
                type="text"
                placeholder="Artist Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                className="artists-modal__textarea"
                placeholder="Artist Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />

              <label className="artists-modal__file">
                <span>{image ? image.name : "Choose image"}</span>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>

              <div className="artists-modal__actions">
                <button type="submit">{editId ? "Update" : "Add"}</button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="artists-tableWrap">
        <div className="artists-tableHeader">
          <span>Artists</span>
          <span>Details</span>
          <span>Actions</span>
        </div>

        <div className="artists-tableBody">
          {artists.map((artist) => (
            <article className="artists-row" key={artist.id}>
              <div className="artists-row__main">
                <img
                  src={`${imageUrl}${artist.profileImage}`}
                  alt={artist.name}
                  className="artists-row__image"
                />

                <div className="artists-row__copy">
                  <h3>{artist.name}</h3>
                </div>
              </div>

              <div className="artists-row__details">{artist.bio}</div>

              <div className="artists-row__actions">
                <button
                  className="artists-row__edit"
                  onClick={() => handleEdit(artist)}
                >
                  Edit
                </button>

                <button
                  className="artists-row__delete"
                  onClick={() => handleDelete(artist.id)}
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

export default ManageArtist;
