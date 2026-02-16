import React, { useState } from 'react';
import { Search, Plus, StickyNote } from 'lucide-react';

function App() {
  const [notes, setNotes] = useState([
    { id: 1, title: "Sample Note", content: "AI Search will work once the backend is live!" }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">AI Notes</h1>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400 size-5" />
            <input 
              type="text" 
              placeholder="AI Semantic Search..." 
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-500 cursor-pointer transition-colors">
            <Plus className="size-8 mb-2" />
            <span>Create New Note</span>
          </div>
          
          {notes.map(note => (
            <div key={note.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-3">
                <StickyNote className="text-blue-500 mr-2 size-5" />
                <h3 className="font-semibold text-gray-700">{note.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;