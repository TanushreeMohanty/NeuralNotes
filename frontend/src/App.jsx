import React, { useState, useEffect } from "react";
import { Search, Plus, StickyNote, LogOut, Trash2 } from "lucide-react";
import api from "./api";
import Login from "./components/Login";
import Signup from "./components/Signup";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"),
  );
  // Added state to track the active user's name
  const [activeUser, setActiveUser] = useState(
    localStorage.getItem("username") || "User",
  );
  const [view, setView] = useState("login");
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // Track the note being edited

  const fetchNotes = async () => {
    try {
      const response = await api.get("/notes");
      setNotes(response.data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchNotes();
  }, [isAuthenticated]);

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      alert("Failed to delete note");
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      // Matches the query parameter style used in your Add Note function
      await api.put(
        `/notes/${editingNote.id}?title=${encodeURIComponent(editingNote.title)}&content=${encodeURIComponent(editingNote.content)}`,
      );
      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      alert("Error updating note");
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        `/notes?title=${encodeURIComponent(newNote.title)}&content=${encodeURIComponent(newNote.content)}`,
      );
      setNewNote({ title: "", content: "" });
      setShowAddForm(false);
      fetchNotes();
    } catch (err) {
      alert("Error saving note");
    }
  };

  // Updated Login Success to store username
  const onLoginSuccess = (username) => {
    localStorage.setItem("username", username); // Store username in localStorage
    setActiveUser(username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username"); // Clear username on logout
    setIsAuthenticated(false);
    setNotes([]);
  };

  if (!isAuthenticated) {
    return (
      <>
        {view === "login" ? (
          <Login
            // Pass the custom login success handler
            onLoginSuccess={onLoginSuccess}
            onToggleSignup={() => setView("signup")}
          />
        ) : (
          <Signup
            onSignupSuccess={() => setView("login")}
            onToggleLogin={() => setView("login")}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            {/* Added personalized greeting */}
            <h1 className="text-3xl font-bold text-gray-800">
              AI Notes for {activeUser} ✨
            </h1>
            <p className="text-sm text-pink-500 font-medium">
              Authentication active • Secure session
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={22} />
            </button>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400 size-5" />
              <input
                type="text"
                placeholder="Semantic search..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {showAddForm ? (
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-pink-200 animate-pop">
              <input
                className="w-full mb-2 font-bold text-lg outline-none"
                placeholder="Title"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
              />
              <textarea
                className="w-full text-gray-600 outline-none resize-none"
                placeholder="Write something..."
                rows="3"
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
              ></textarea>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAddNote}
                  className="bg-pink-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-pink-600 transition"
                >
                  Save Note
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setShowAddForm(true)}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-pink-400 hover:text-pink-500 cursor-pointer transition-all bg-white/50"
            >
              <Plus className="size-10 mb-2" />
              <span className="font-medium">Create New Note</span>
            </div>
          )}

          {notes.map((note) => (
            <div
              key={note.id}
              className={`note-card bg-white p-6 rounded-xl shadow-sm border relative group transition-all ${
                editingNote?.id === note.id
                  ? "editing shadow-lg border-pink-400 ring-2 ring-pink-100"
                  : "border-gray-100"
              }`}
            >
              {editingNote?.id === note.id ? (
                /* Edit Form Mode */
                <div className="space-y-2">
                  <input
                    className="w-full font-bold text-lg outline-none border-b border-pink-200 focus:border-pink-500 transition-colors"
                    value={editingNote.title}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, title: e.target.value })
                    }
                    placeholder="Note Title"
                  />
                  <textarea
                    className="w-full text-gray-600 outline-none resize-none focus:bg-pink-50/30 rounded p-1 transition-all"
                    value={editingNote.content}
                    onChange={(e) =>
                      setEditingNote({
                        ...editingNote,
                        content: e.target.value,
                      })
                    }
                    rows="3"
                    placeholder="Note Content"
                  ></textarea>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleUpdateNote}
                      className="bg-pink-500 text-white px-4 py-1.5 rounded-lg shadow-sm hover:bg-pink-600 active:scale-95 transition-all font-bold text-sm"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingNote(null)}
                      className="text-gray-400 text-sm hover:text-gray-600 font-medium px-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
                  {/* Container for Edit and Delete buttons */}
                  <div className="absolute top-4 right-4 flex items-center gap-3">
                    <button
                      onClick={() => setEditingNote(note)}
                      className="text-xs font-bold text-pink-500 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2 py-1 rounded-md transition-all shadow-sm"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      title="Delete Note"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center mb-3">
                    <StickyNote className="text-pink-500 mr-2 size-5" />
                    <h3 className="font-bold text-gray-800 pr-16">
                      {note.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relax">
                    {note.content}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
