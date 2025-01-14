import { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Notebook, NotebookText, Plus, SearchX } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Notes } from "~/db/db.notes";
import { db } from "~/db/db.server";
import { noteThemes } from "~/utils/note.themes";

export const meta: MetaFunction = () => {
  return [{ title: "Notes App" }];
};

export const loader = async () => {
  return await db.notes.findMany();
};

export default function IndexNotes() {
  const loaderData = useLoaderData<Notes[]>();

  const [cariJudulNote, setCariJudulNote] = useState("");

  function filterNotes() {
    return loaderData.filter((f) => {
      return f.title.toLowerCase().includes(cariJudulNote.toLowerCase());
    });
  }

  const RenderNotes = () => {
    if (filterNotes().length === 0 && cariJudulNote) {
      return (
        <div className="select-none opacity-60 grow flex flex-col items-center justify-center gap-4">
          <SearchX className="size-12" />
          <h1>Tidak di temukan hasil dari pencarian</h1>
        </div>
      );
    }

    if (filterNotes().length === 0) {
      return (
        <div className="select-none opacity-60 grow flex flex-col items-center justify-center gap-4">
          <NotebookText className="size-12" />
          <h1>Belum ada catatan di sini</h1>
        </div>
      );
    }

    return (
      <ScrollArea>
        <div className="grid sm:grid-cols-3 grid-cols-2 flex-wrap gap-4 p-4 overflow-auto">
          {filterNotes().map((m, key) => {
            return <NoteCard notes_data={m} key={key} />;
          })}
        </div>
      </ScrollArea>
    );
  };

  const NoteCard = ({ notes_data }: { notes_data: Notes }) => {
    const { text_color, bg_color } = noteThemes[notes_data.theme];

    return (
      <Link
        to={"/" + notes_data.note_id}
        className={twMerge(
          text_color,
          bg_color,
          "rounded-md p-4 grid gap-2 shadow border"
        )}
      >
        <h1
          title={notes_data.title.split(/\s+/).slice(0, 6).join(" ") + "..."}
          className="capitalize font-semibold truncate"
        >
          {notes_data.title}
        </h1>
        <p
          title={notes_data.content.split(/\s+/).slice(0, 15).join(" ") + "..."}
          className="text-sm whitespace-pre-wrap overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {notes_data.content}
        </p>
      </Link>
    );
  };

  return (
    <div className="w-svw h-svh max-w-screen-sm mx-auto flex flex-col relative">
      <div className="sticky top-0 p-4 flex items-center gap-4 justify-between bg-white">
        <div className="md:flex gap-2 truncate hidden select-none items-center">
          <Notebook className="min-w-fit" />
          <h1 className="text-lg">Notes App</h1>
        </div>

        <div className="flex gap-2 md:w-fit w-full">
          <Input
            onChange={({ target }) => setCariJudulNote(target.value)}
            title="cari catatan"
            placeholder="Cari catatan"
            type="search"
          />

          <Link to="/create" className="hidden md:block">
            <Button title="buat catatan baru">
              <Plus />
            </Button>
          </Link>
        </div>
      </div>

      <RenderNotes />

      <Link
        to="/create"
        className="md:hidden block absolute bottom-10 right-10 shadow-lg"
      >
        <Button title="buat catatan baru">
          <Plus />
        </Button>
      </Link>
    </div>
  );
}
