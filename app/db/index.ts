import { openDB, DBSchema } from "idb";

const db_name = "note-db";
const db_collection = "note";

export interface NoteDBSchema extends DBSchema {
  [db_name]: {
    key: string;
    value: string;
  };
  [db_collection]: {
    value: Note;
    key: string;
    indexes: { note_id: string };
  };
}

export type Note = {
  note_id?: string;
  title?: string;
  content?: string;
  theme?: NoteTheme;
  created_at?: string | number | Date;
  update_at?: string | number | Date;
};

export type NoteTheme =
  | "default"
  | "orange"
  | "yellow"
  | "blue"
  | "teal"
  | "rose";

async function idb() {
  return await openDB<NoteDBSchema>(db_name, 1, {
    upgrade(db) {
      const store = db.createObjectStore(db_collection, { keyPath: "note_id" });
      store.createIndex("note_id", "note_id");
    },
  });
}

export async function addNote(value: Note) {
  const note_id = new Date().getTime() + "";
  const created_at = new Date();
  const update_at = new Date();

  return (await idb()).add(db_collection, {
    ...value,
    theme: "default",
    note_id,
    created_at,
    update_at,
  });
}

export async function getNotes() {
  return (await idb()).getAll(db_collection);
}

export async function getNoteById(id: string) {
  return (await idb()).get(db_collection, id);
}

export async function updateNoteById(
  note_id: string,
  { title, content }: { title?: string; content?: string },
) {
  const update_at = new Date();

  return (await idb()).put(db_collection, {
    note_id,
    title,
    content,
    update_at,
  });
}

export async function deleteNoteById(note_id: string) {
  return (await idb()).delete(db_collection, note_id);
}
