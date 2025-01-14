import { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { db } from "~/db/db.server";

export const action = async ({ params }: ActionFunctionArgs) => {
  await db.notes.delete({
    where: {
      note_id: params.noteId!,
    },
  });

  return redirect("/");
};

export const loader = () => {
  return redirect("/");
};
