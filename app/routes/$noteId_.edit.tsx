import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { PencilLine, Save, SearchX } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Notes } from "~/db/db.notes";
import { db } from "~/db/db.server";

export const meta: MetaFunction = () => {
  return [{ title: "Edit Catatan" }];
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const { title, content } = Object.fromEntries(await request.formData()) as {
    title: string;
    content: string;
  };

  await db.notes.update({
    where: {
      note_id: params.noteId!,
    },
    data: {
      title,
      content,
    },
  });

  return redirect("/" + params.noteId!);
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

export default function EditNoteById() {
  const loaderData = useLoaderData<Notes>();

  return (
    <div className="w-svw h-svh max-w-screen-sm mx-auto flex flex-col relative">
      <div className="sticky top-0 p-4 flex items-center gap-4 justify-between">
        <div className="flex items-center gap-2 truncate select-none">
          <PencilLine className="min-w-fit" />
          <h1 className="text-lg">Edit Catatan</h1>
        </div>
      </div>

      <Form method="POST" className="grow p-4 flex flex-col gap-4">
        <Input
          required
          minLength={1}
          maxLength={64}
          name="title"
          placeholder="Judul"
          defaultValue={loaderData.title}
        />

        <Textarea
          required
          minLength={1}
          maxLength={300}
          name="content"
          placeholder="Isi catatan"
          spellCheck="false"
          style={{ whiteSpace: "pre-line" }}
          defaultValue={loaderData.content}
        />

        <div className="flex gap-2 self-end">
          <Link to={"/" + loaderData.note_id}>
            <Button variant="outline" type="button">
              Batalkan
            </Button>
          </Link>
          <Button type="submit">
            <Save />
            <span>Simpan catatan</span>
          </Button>
        </div>
      </Form>
    </div>
  );
}
