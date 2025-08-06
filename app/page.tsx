import Dashboard from "@/components/Dashboard";
import Image from "next/image";

export default function Home() {
  return (
   <main className="space-y-6 w-full mt-20 mr-10">
      <h1 className="text-2xl font-bold tracking-widest text-center uppercase ">Dashboard</h1>
      <Dashboard />
    </main>
  );
}
