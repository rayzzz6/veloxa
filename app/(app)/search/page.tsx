import { Sidebar } from "@/components/Sidebar";
import { SearchPanel } from "@/components/SearchPanel";

export default function SearchPage() {
  return (
    <div className="flex">
      <Sidebar active="/search" />
      <main className="flex-1 min-h-screen px-8 pb-16">
        <SearchPanel />
      </main>
    </div>
  );
}
