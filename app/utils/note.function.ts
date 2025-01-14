import { allNotes, NoteTheme } from "~/db/db.notes";

export function addNote({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const createNoteId = new Date().getTime() + "";

  allNotes.push({ note_id: createNoteId, title, content, theme: "default" });

  return true;
}

export function getNote() {
  return allNotes;
}

export function getNoteById(note_id: string) {
  const targetNote = allNotes.find((f) => f.note_id === note_id);
  if (targetNote) {
    return targetNote;
  }

  throw "can't find notes id";
}

export function updateNoteById(
  note_id: string,
  {
    title,
    content,
    theme,
  }: { title?: string; content?: string; theme?: NoteTheme }
) {
  const targetNote = allNotes.findIndex((f) => f.note_id === note_id);

  if (targetNote !== -1) {
    const note = allNotes[targetNote];

    allNotes[targetNote] = {
      ...note,
      ...(title ? { title } : {}),
      ...(content ? { content } : {}),
      ...(theme ? { theme } : {}),
    };

    return true;
  }

  throw "error update note id";
}

export function deleteNoteById(note_id: string) {
  const targetNote = allNotes.findIndex((f) => f.note_id === note_id);

  if (targetNote !== -1) {
    allNotes.splice(targetNote, 1);
  }

  return true;
}
