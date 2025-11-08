import { useState } from 'react'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { fmtDate } from '@/utils/dates'
import { uid } from '@/utils/id'
import type { Note } from '@/types'

interface NotesSectionProps {
  notes: Note[]
  onUpdateNotes: (notes: Note[]) => void
}

/**
 * Notes section for rehearsal workspace
 */
export function NotesSection({ notes, onUpdateNotes }: NotesSectionProps) {
  const [newNote, setNewNote] = useState('')
  const [editing, setEditing] = useState<string | null>(null)

  const handleAddNote = () => {
    if (!newNote.trim()) return

    const note: Note = {
      id: uid('note'),
      content: newNote,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    onUpdateNotes([...notes, note])
    setNewNote('')
  }

  const handleUpdateNote = (id: string, content: string) => {
    onUpdateNotes(
      notes.map((n) =>
        n.id === id ? { ...n, content, updatedAt: Date.now() } : n
      )
    )
    setEditing(null)
  }

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Delete this note?')) {
      onUpdateNotes(notes.filter((n) => n.id !== id))
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Notes</h3>

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-3 rounded-lg bg-white/5 border border-white/10"
          >
            {editing === note.id ? (
              <div className="space-y-2">
                <Textarea
                  value={note.content}
                  onChange={(e) =>
                    onUpdateNotes(
                      notes.map((n) =>
                        n.id === note.id ? { ...n, content: e.target.value } : n
                      )
                    )
                  }
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleUpdateNote(note.id, note.content)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm whitespace-pre-wrap mb-2">{note.content}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs opacity-40">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(note.id)}
                      className="text-xs opacity-60 hover:opacity-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-xs opacity-60 hover:opacity-100 text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Add a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={3}
        />
        <Button onClick={handleAddNote} disabled={!newNote.trim()}>
          Add Note
        </Button>
      </div>
    </div>
  )
}
