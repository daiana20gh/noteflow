import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-black overflow-hidden">
      <Navbar userName={session.name} />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
