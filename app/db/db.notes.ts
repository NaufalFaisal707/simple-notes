export type Notes = {
  note_id: string;
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

export const allNotes: Notes[] = [];
