
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api/notes";

const emptyForm = {
  title: "",
  subject: "",
  description: "",
  semester: "",
  uploadedBy: "",
  fileUrl: ""
};

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchNotes(query = "") {
    try {
      setLoading(true);

      const response = await fetch(
        `${API}?search=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Could not load notes");
      }

      setNotes(await response.json());
    } catch (error) {
      setMessage("Cannot connect to backend. Please start the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes("");
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    // Check all required fields before sending anything to the backend.
    if (
      !form.title.trim() ||
      !form.subject.trim() ||
      !form.description.trim() ||
      !form.semester.trim() ||
      !form.uploadedBy.trim() ||
      !form.fileUrl.trim()
    ) {
      setMessage(
        "Error: Please fill in all fields, including the Notes File Link. Nothing was uploaded."
      );
      return;
    }

    // Check that the notes link is a valid HTTP or HTTPS URL.
    try {
      const url = new URL(form.fileUrl.trim());

      if (url.protocol !== "http:" && url.protocol !== "https:") {
        setMessage("Error: Enter a valid HTTP or HTTPS notes link.");
        return;
      }
    } catch {
      setMessage("Error: Please enter a valid Notes File Link.");
      return;
    }

    try {
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...form,
            title: form.title.trim(),
            subject: form.subject.trim(),
            description: form.description.trim(),
            semester: form.semester.trim(),
            uploadedBy: form.uploadedBy.trim(),
            fileUrl: form.fileUrl.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save note.");
      }

      setMessage(
        editingId
          ? "Note updated successfully!"
          : "Note uploaded successfully!"
      );

      setForm(emptyForm);
      setEditingId(null);
      await fetchNotes(search);
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  }

  function handleEdit(note) {
    setForm({
      title: note.title || "",
      subject: note.subject || "",
      description: note.description || "",
      semester: note.semester || "",
      uploadedBy: note.uploadedBy || "",
      fileUrl: note.fileUrl || ""
    });

    setEditingId(note._id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete note.");
      }

      setMessage("Note deleted successfully!");
      await fetchNotes(search);
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    await fetchNotes(search);
  }

  function cancelEdit() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">📚 OpenNotes</div>
        <p>Learn together. Share knowledge. Grow together.</p>
      </header>

      <main className="container">
        <section className="hero">
          <h1>Welcome to OpenNotes</h1>
          <p>
            Your collaborative platform for sharing academic notes
            and helping students learn together.
          </p>
        </section>

        <section className="form-card">
          <h2>{editingId ? "Edit Notes" : "Upload Academic Notes"}</h2>

          <form onSubmit={handleSubmit}>
            <label>Note Title *</label>
            <input
              name="title"
              placeholder="Enter note title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <label>Subject *</label>
            <input
              name="subject"
              placeholder="Example: DBMS"
              value={form.subject}
              onChange={handleChange}
              required
            />

            <label>Description *</label>
            <textarea
              name="description"
              placeholder="Describe your notes"
              value={form.description}
              onChange={handleChange}
              required
            />

            <label>Semester *</label>
            <input
              name="semester"
              placeholder="Example: Semester 3"
              value={form.semester}
              onChange={handleChange}
              required
            />

            <label>Uploaded By *</label>
            <input
              name="uploadedBy"
              placeholder="Enter your name"
              value={form.uploadedBy}
              onChange={handleChange}
              required
            />

            <label>Notes File Link *</label>
            <input
              name="fileUrl"
              type="url"
              placeholder="Paste your PDF or notes link"
              value={form.fileUrl}
              onChange={handleChange}
              required
            />

            <div className="form-buttons">
              <button type="submit" className="primary-btn">
                {editingId ? "Update Notes" : "Upload Notes"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {message && (
            <p
              className="message"
              role="alert"
              style={
                message.startsWith("Error:")
                  ? {
                      color: "#a51d1d",
                      backgroundColor: "#fde7e7",
                      border: "1px solid #f5b7b7"
                    }
                  : {}
              }
            >
              {message}
            </p>
          )}
        </section>

        <section className="notes-section">
          <h2>Available Academic Notes</h2>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              placeholder="Search by title or subject..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button type="submit" className="primary-btn">
              Search
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setSearch("");
                fetchNotes("");
              }}
            >
              Show All
            </button>
          </form>

          {loading ? (
            <p>Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="empty">
              No notes found. Upload the first academic note!
            </p>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <article className="note-card" key={note._id}>
                  <span className="subject-tag">{note.subject}</span>
                  <h3>{note.title}</h3>

                  <p>{note.description}</p>

                  <p>
                    <strong>Semester:</strong> {note.semester}
                  </p>

                  <p>
                    <strong>Uploaded by:</strong> {note.uploadedBy}
                  </p>

                  <p className="date">
                    Uploaded:{" "}
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>

                  <div className="note-actions">
                    <a
                      className="view-btn"
                      href={note.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Notes
                    </a>

                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => handleEdit(note)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDelete(note._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>OpenNotes © 2026 | Open-Source Academic Notes Sharing Platform</p>
      </footer>
    </div>
  );
}

export default App;
