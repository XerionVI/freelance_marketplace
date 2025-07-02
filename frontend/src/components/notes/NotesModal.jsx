import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

function NotesModal({ show, onHide, notes, newNote, setNewNote, handleAddNote }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>File Notes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {notes.map((note, index) => (
            <div key={index}>
              <p><strong>{note.added_by}:</strong> {note.note}</p>
              <p><small>{new Date(note.added_at).toLocaleString()}</small></p>
              <hr />
            </div>
          ))}
        </div>
        <Form.Group controlId="addNote">
          <Form.Label>Add a Note</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddNote} className="mt-3">
          Add Note
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default NotesModal;