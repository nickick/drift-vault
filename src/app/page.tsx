import { Header } from "./Header";
import { Vaulted } from "./Vault";

export default function Home() {
  return (
    <div className="max-h-screen overflow-auto">
      <Header />
      <main className="flex flex-col items-center justify-between px-12 max-w-between-lg-xl mx-auto">
        <Vaulted />
      </main>
      <footer className="max-w-between-lg-xl mx-auto px-12 pb-6 text-slate-gray">
        <div>All materials © {new Date().getFullYear()} Isaac Wright</div>
        <div></div>
      </footer>
    </div>
  );
}
