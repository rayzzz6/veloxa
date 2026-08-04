import { Sidebar } from "@/components/Sidebar";
import { ArtistStudio } from "@/components/ArtistStudio";

export default function ArtistPage() {
  return (
    <div className="flex">
      <Sidebar active="/artist" />
      <main className="flex-1 min-h-screen px-8 pb-16">
        <ArtistStudio />
      </main>
    </div>
  );
}
