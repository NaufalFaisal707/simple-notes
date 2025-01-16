import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Link,
  MetaFunction,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { ChevronLeft, Save } from "lucide-react";
import { useRef } from "react";
import Container2xl from "~/components/container-2xl";
import { Input } from "~/components/ui/input";
import { getNoteById, updateNoteById } from "~/db";
import { redirect } from "@remix-pwa/sw";

export const meta: MetaFunction = () => [{ title: "Edit Catatan" }];

export const clientAction = async ({
  request,
  params,
}: ClientActionFunctionArgs) => {
  const { noteId } = params as { noteId: string };

  if (request.method !== "PUT") {
    return Response.json(null, { status: 405, statusText: "gk bolejh" });
  }

  const { title, content } = Object.fromEntries(await request.formData()) as {
    title: string;
    content: string;
  };

  await updateNoteById(noteId, {
    ...(title ? { title } : {}),
    ...(content ? { content } : {}),
  });

  return redirect("/" + noteId);
};

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const { noteId } = params as { noteId: string };

  const targetNote = await getNoteById(noteId);

  if (!targetNote) {
    throw Response.json(null, { status: 404, statusText: "ngawor" });
  }

  return targetNote;
};

export const ErrorBoundary = () => {
  return <h1>Error kang!</h1>;
};

export default function EditNote() {
  const loaderData = useLoaderData<typeof clientLoader>();

  const fetcher = useFetcher();

  const formRef = useRef<HTMLFormElement | null>(null);

  function updateNote() {
    fetcher.submit(formRef.current!, { method: "PUT" });
  }

  return (
    <Container2xl className="flex h-svh flex-col">
      {/* navbar */}
      <nav className="sticky top-0 flex select-none items-center justify-between gap-4 bg-white p-4">
        <Button variant="outline" asChild title="Semua Catatan">
          <Link to="/">
            <ChevronLeft />
          </Link>
        </Button>

        <h1>Edit Catatan</h1>

        <Button variant="outline" title="Simpan Catatan" onClick={updateNote}>
          <Save />
        </Button>
      </nav>

      {/* Note Form */}
      <fetcher.Form ref={formRef} className="flex h-full flex-col gap-4 p-4">
        <Input
          defaultValue={loaderData.title}
          name="title"
          placeholder="Judul"
          className="outline-0"
        />
        <Textarea
          defaultValue={loaderData.content}
          name="content"
          spellCheck="false"
          placeholder="Ketik Catatan"
          className="h-full resize-none whitespace-pre-line outline-0"
        />
      </fetcher.Form>
    </Container2xl>
  );
}
