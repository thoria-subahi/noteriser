const apiHost = 'http://localhost:3000';
const apiNotes = `${apiHost}/api/notes`;

// Handle form submission for creating or updating a note
const handleFormSubmit = async (e) => {
  e.preventDefault();
  
  const noteId = document.getElementById('noteId').value;
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  const noteData = { title, content };
  const url = noteId ? `${apiNotes}/${noteId}` : apiNotes;
  const method = noteId ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(noteData)
  });

  const note = await res.json();

  if (noteId) {
    document.getElementById(noteId).remove();
    document.getElementById('submitButton').textContent = 'Add Note';
  }

  displayNote(note, true);
  resetForm();
};

// Fetch all notes from the server
const fetchNotes = async () => {
  const res = await fetch(apiNotes);
  const notes = await res.json();
  notes.reverse().forEach(note => displayNote(note, false));
};

// Display a single note on the page
const displayNote = (note, prepend) => {
  const notesDiv = document.getElementById('notes');
  const noteDiv = document.createElement('div');
  noteDiv.id = note._id;
  noteDiv.className = 'bg-white p-4 rounded-md shadow-md flex justify-between items-start';
  noteDiv.innerHTML = `
    <div>
      <h2 class="text-xl font-semibold text-blue-600">${note.title}</h2>
      <p class="text-white-300 mt-2">${note.content}</p>
    </div>
    <div class="flex space-x-2">
      <button onclick="editNote('${note._id}', '${note.title}', '${note.content}')" class="bg-white text-gray-500 hover:text-black px-4 py-2 rounded mt-2">
        <i class="fas fa-pen"></i>
      </button>
      <button onclick="deleteNote('${note._id}')" class="bg-white text-gray-500 hover:text-black px-4 py-2 rounded mt-2">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  prepend ? notesDiv.prepend(noteDiv) : notesDiv.appendChild(noteDiv);
};

// Delete a note
const deleteNote = async (id) => {
  await fetch(`${apiNotes}/${id}`, { method: 'DELETE' });
  document.getElementById(id).remove();
};

// Edit a note
const editNote = (id, title, content) => {
  document.getElementById('noteId').value = id;
  document.getElementById('title').value = title;
  document.getElementById('content').value = content;
  document.getElementById('submitButton').textContent = 'Update Note';
  document.getElementById('cancelButton').classList.remove('hidden');
};

// Reset the form to its initial state
const resetForm = () => {
  document.getElementById('noteForm').reset();
  document.getElementById('noteId').value = '';
  document.getElementById('submitButton').textContent = 'Add Note';
  document.getElementById('cancelButton').classList.add('hidden');
};

// Event Listeners
document.getElementById('noteForm').addEventListener('submit', handleFormSubmit);
document.getElementById('cancelButton').addEventListener('click', resetForm);

// Fetch and display notes on page load
fetchNotes();