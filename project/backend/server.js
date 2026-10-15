const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Note = require("./models/Note");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the OpenNotes API!");
});

// GET: Display all notes
app.get("/api/notes", async (req, res) => {
  try {
    const search = req.query.search || "";

    const notes = await Note.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } }
      ]
    }).sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Could not fetch notes" });
  }
});

// POST: Upload a new note
app.post("/api/notes", async (req, res) => {
  try {
    const {
      title,
      subject,
      description,
      semester,
      uploadedBy,
      fileUrl
    } = req.body;

    if (!title || !title.trim() || !subject || !subject.trim()) {
      return res.status(400).json({
        message: "Title and subject are required"
      });
    }

    const note = await Note.create({
      title: title.trim(),
      subject: subject.trim(),
      description,
      semester,
      uploadedBy,
      fileUrl
    });

    res.status(201).json({
      message: "Note uploaded successfully",
      note
    });
  } catch (error) {
    console.error("Error uploading note:", error);
    res.status(500).json({ message: "Could not upload note" });
  }
});

// PUT: Update an existing note
app.put("/api/notes/:id", async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({
      message: "Note updated successfully",
      note: updatedNote
    });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(400).json({ message: "Could not update note" });
  }
});

// DELETE: Delete a note
app.delete("/api/notes/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(400).json({ message: "Could not delete note" });
  }
});

// Connect to MongoDB and start the server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`OpenNotes backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();