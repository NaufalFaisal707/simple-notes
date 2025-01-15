import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Notebook, NotebookText, Plus, SearchX } from "lucide-react";
import { useState } from "react";
import Container2xl from "~/components/container-2xl";
import { Input } from "~/components/ui/input";
import { getNotes, Note } from "~/db";
import { cn } from "~/lib/utils";

export const meta: MetaFunction = () => [
  { title: "Notes" },
  {
    name: "description",
    content: "Cobalah buat dan simpan catatan mu di sini!",
  },
];

export const clientLoader = async () => await getNotes();

export default function Home() {
  const loaderData = useLoaderData<typeof clientLoader>();

  const [namaCatatan, setNamaCatatan] = useState("");

  function cariCatatan() {
    return loaderData.filter((f) =>
      f.title.toLowerCase().includes(namaCatatan.toLowerCase()),
    );
  }

  const AllNotes = ({ className }: { className?: string }) => {
    if (cariCatatan().length === 0 && namaCatatan) {
      return (
        <div
          className={cn(
            className,
            "grid h-full place-content-center gap-4 text-neutral-400",
          )}
        >
          <SearchX className="mx-auto size-12" />
          <p>Tidak ditemukan hasil dari pencarian</p>
        </div>
      );
    }

    if (cariCatatan().length === 0) {
      return (
        <div
          className={cn(
            className,
            "grid h-full place-content-center gap-4 text-neutral-400",
          )}
        >
          <NotebookText className="mx-auto size-12" />
          <p>Belum ada catatan di sini</p>
        </div>
      );
    }

    return (
      <div
        className={cn(
          className,
          "grid grid-cols-2 gap-4 overflow-auto p-4 md:grid-cols-3",
        )}
      >
        {cariCatatan().map((m, key) => (
          <NoteCard key={key} note={m} />
        ))}
      </div>
    );
  };

  const NoteCard = ({ note }: { note: Note }) => {
    const { title, note_id } = note;

    return (
      <Link to={"/" + note_id} className="rounded-md border p-4">
        <h1
          className={cn(
            title ? "" : "text-neutral-400",
            "truncate font-semibold capitalize",
          )}
          title={title}
        >
          {title || "- tanpa judul -"}
        </h1>
      </Link>
    );
  };

  return (
    <Container2xl className="flex h-svh flex-col">
      {/* navbar */}
      <nav className="sticky top-0 flex justify-between gap-4 bg-white bg-opacity-80 p-4 backdrop-blur">
        <div className="hidden items-center gap-2 sm:flex">
          <Notebook />
          <h1 className="text-lg">Notes</h1>
        </div>

        <div className="flex w-full gap-4 sm:w-fit">
          <Input
            type="search"
            title="Cari Catatan"
            placeholder="Cari Catatan"
            className="truncate duration-150 ease-in-out"
            onChange={({ target }) => setNamaCatatan(target.value)}
          />

          <Button title="Buat Catatan" variant="outline" asChild>
            <Link to="/new">
              <Plus />
            </Link>
          </Button>
        </div>
      </nav>

      {/* All Notes */}
      <AllNotes className="select-none" />
    </Container2xl>
  );
}
