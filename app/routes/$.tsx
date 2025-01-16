import { PanelsTopLeft } from "lucide-react";
import Container2xl from "~/components/container-2xl";

export default function UnknownPage() {
  return (
    <Container2xl className="flex h-svh flex-col">
      <div className="grid h-full place-content-center gap-2 text-center text-neutral-400">
        <PanelsTopLeft className="mx-auto size-12" />
        <p>Halaman Ini Tidak Terdaftar</p>
      </div>
    </Container2xl>
  );
}
