import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { ChevronLeft, NotebookText, SearchX } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Notes, NoteTheme } from "~/db/db.notes";
import { noteThemes } from "~/utils/note.themes";
import { twMerge } from "tailwind-merge";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { db } from "~/db/db.server";

export const meta: MetaFunction = ({ data }) => {
  if (data) {
    const { title } = data as Notes;

    return [{ title: title.split(/\s+/).slice(0, 6).join(" ") + "..." }];
  }

  return [{ title: "Catatan tidak di temukan" }];
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { theme } = Object.fromEntries(await request.formData()) as {
    theme: NoteTheme;
  };

  await db.notes.update({
    where: {
      note_id: params.noteId!,
    },
    data: {
      theme,
    },
  });

  return redirect("/" + params.noteId + "/theme");
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return await db.notes.findUnique({
    where: {
      note_id: params.noteId!,
    },
  });
};

export const ErrorBoundary = () => {
  return (
    <div className="w-svw h-svh max-w-screen-sm mx-auto flex flex-col relative">
      <div className="select-none opacity-60 grow flex flex-col items-center justify-center gap-4">
        <SearchX className="size-12" />
        <h1>Catatan tidak di temukan</h1>
        <Link to="/">
          <Button variant="outline" title="Kembali">
            Kembali
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default function PreviewNoteById() {
  const loaderData = useLoaderData<Notes>();

  const { text_color, bg_color } = noteThemes[loaderData.theme];

  return (
    <div
      className={twMerge(
        bg_color,
        "w-svw h-svh max-w-screen-sm mx-auto flex flex-col relative"
      )}
    >
      <div
        className={twMerge(
          text_color,
          "sticky top-0 p-4 flex items-center gap-2"
        )}
      >
        <Link to={"/" + loaderData.note_id}>
          <Button variant="outline" title="Kembali ke catatan">
            <ChevronLeft />
          </Button>
        </Link>

        <Link to="/">
          <Button variant="outline" title="Kembali ke halaman utama">
            <NotebookText />
          </Button>
        </Link>
      </div>

      <ScrollArea className="grow">
        <div className={twMerge(text_color, "p-4 flex flex-col gap-4 grow")}>
          <h1 className="text-lg capitalize font-semibold">
            {loaderData.title}
          </h1>

          <p
            className="whitespace-pre-wrap overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
            }}
          >
            {loaderData.content}
          </p>
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 p-4 bg-white">
        <ScrollArea>
          <div className="flex gap-4">
            {Object.entries(noteThemes).map(
              ([theme_name, theme_value], key) => {
                return (
                  <Form key={key} method="POST">
                    <Button
                      type="submit"
                      name="theme"
                      value={theme_name}
                      variant="outline"
                      className={twMerge(
                        theme_value.bg_color,
                        theme_value.text_color,
                        theme_value.bg_hover_color,
                        theme_value.text_hover_color,
                        "size-24 border rounded-md capitalize"
                      )}
                    >
                      {theme_name}
                    </Button>
                  </Form>
                );
              }
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
