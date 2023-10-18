import { Header } from "./Header";
import { Vaulted } from "./Vault";

export default function Home() {
  return (
    <div className="max-h-screen overflow-auto">
      <Header />
      <main className="flex flex-col items-center justify-between px-12 max-w-screen-lg mx-auto">
        <Vaulted />
      </main>
    </div>
  );
}
