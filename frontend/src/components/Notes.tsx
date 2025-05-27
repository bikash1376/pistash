import { useState, type ChangeEvent } from "react";

interface Note {
  text: string;
}

function Notes() {
  const [note, setNote] = useState("");
  const [noteList, setNoteList] = useState<Note[]>([]);

  function handleNote(e: ChangeEvent<HTMLInputElement>) {
    setNote(e.target.value);
  }

  function handleAddNote() {
    if (note.trim() === "") return; // Prevent adding empty notes
    setNoteList([...noteList, { text: note }]);
    setNote("");
  }

  function handleEditNote(index: number) {
    const updatedText = prompt("Edit note:", noteList[index].text);
    if (updatedText === null || updatedText.trim() === "") return;

    setNoteList(
      noteList.map((note, i) => (i === index ? { ...note, text: updatedText } : note))
    );
  }

  function handleDeleteNote(index: number) {
    setNoteList(noteList.filter((_, i) => i !== index));
  }

  return (
    <div>
      <input type="text" value={note} onChange={handleNote} />
      <button onClick={handleAddNote}>Add</button>

      <div>
        <ul>
          {noteList.map((note, index) => (
            <li key={index}>
              {note.text}
              <button onClick={() => handleEditNote(index)}>Edit</button>
              <button onClick={() => handleDeleteNote(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Notes;