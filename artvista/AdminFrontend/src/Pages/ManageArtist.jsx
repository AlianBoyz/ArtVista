import { useEffect, useState } from "react";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

const ManageArtist = () => {

  const [artists, setArtists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {

    const response = await fetch(`${url}/artists`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    setArtists(data.data);

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

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm("Delete this artist?");

    if (!confirmDelete) return;

    await fetch(`${url}/artists/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchArtists();

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
      method: method,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {

      setShowModal(false);
      setEditId(null);

      fetchArtists();

    }

  };

  return (
    <div>

      <h1>Manage Artists</h1>

      <button onClick={openAddModal}>
        Add Artist
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

            <h2>{editId ? "Edit Artist" : "Add Artist"}</h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                placeholder="Artist Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <br /><br />

              <textarea
                placeholder="Artist Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
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
                style={{ marginLeft: "10px" }}
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

        {artists.map((artist) => (

          <div
            key={artist.id}
            style={{
              width: "250px",
              border: "1px solid gray",
              padding: "10px"
            }}
          >

            <img
              src={`${imageUrl}${artist.profileImage}`}
              alt={artist.name}
              style={{ width: "100%" }}
            />

            <h3>{artist.name}</h3>

            <p>{artist.bio}</p>

            <br />

            <button onClick={() => handleEdit(artist)}>
              Edit
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleDelete(artist.id)}
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>
  );

};

export default ManageArtist;