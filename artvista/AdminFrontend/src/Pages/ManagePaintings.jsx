import { useEffect, useState } from "react";

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
        Authorization: `Bearer ${token}`
      }
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
        Authorization: `Bearer ${token}`
      }
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
      method: method,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {

      setShowModal(false);
      setEditId(null);

      fetchPaintings();

    }

  };

  return (
    <div>

      <h1>Manage Paintings</h1>

      <button onClick={openAddModal}>
        Add Painting
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

            <h2>{editId ? "Edit Painting" : "Add Painting"}</h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text" placeholder="Title" value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <br /><br />

              <input
                type="text" placeholder="Description" value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <br /><br />

              <input
                type="text" placeholder="Size" value={size}
                onChange={(e) => setSize(e.target.value)}
              />

              <br /><br />

              <input
                type="text" placeholder="Medium" value={medium}
                onChange={(e) => setMedium(e.target.value)}
              />

              <br /><br />

              <input
                type="number" placeholder="Year" value={year}
                onChange={(e) => setYear(e.target.value)}
              />

              <br /><br />

              <input
                type="number" placeholder="Price" value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <br /><br />

              <input
                type="number" placeholder="Artist Id" value={artistId}
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

        {paintings.map((p) => (

          <div
            key={p.id}
            style={{
              width: "250px",
              border: "1px solid gray",
              padding: "10px"
            }}
          >

            <img
              src={`${imageUrl}${p.imageUrl}`}
              alt={p.title}
              style={{ width: "100%" }}
            />

            <h3>{p.title}</h3>

            <p>by {p.artist?.name}</p>

            <p>Size: {p.size}</p>

            <p>Price: ₹{p.price}</p>
            
            <br />

            <button onClick={() => handleEdit(p)}>
              Edit
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleDelete(p.id)}
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>
  );

};

export default ManagePaintings;