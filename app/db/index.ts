import { openDB, DBSchema } from "idb";

export interface NoteDBSchema extends DBSchema {
  note: {
    key: string;
    value: Note;
  };
}

export type Note = {
  title: string;
  content: string;
  theme: NoteTheme;
};

export type NoteTheme =
  | "default"
  | "orange"
  | "yellow"
  | "blue"
  | "teal"
  | "rose";

const db_name = "note-db";
const db_collection = "note";

async function idb() {
  return await openDB<NoteDBSchema>(db_name, 1, {
    upgrade(db) {
      db.createObjectStore(db_collection, { keyPath: "note_id" });
    },
  });
}

export async function addNote(value: Note) {
  return (await idb()).add(db_collection, value);
}

export async function getNotes() {
  return (await idb()).getAll(db_collection);
}

export async function getNoteById(id: string) {
  return (await idb()).get(db_collection, id);
}

export async function deleteNoteById(id: string) {
  return (await idb()).delete(db_collection, id);
}
