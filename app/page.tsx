import { prisma } from "@/lib/prisma";

export default async function Home() {
  let dbStatus = "Not tested";
  try {
    // Safe read-only check: query database version or tables list safely without modifying anything
    const result = await prisma.$queryRaw`SELECT VERSION() as version`;
    dbStatus = `Connected successfully! MySQL Version: ${(result as any)[0].version}`;
  } catch (error: any) {
    dbStatus = `Connection failed: ${error.message}`;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-stone-950 text-stone-100">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-400 mb-4">
          Chittagong Trail
        </h1>
        <p className="text-stone-400 mb-8 max-w-xl">
          A personal journal of touring Chittagong — places I visit, stories I find, and everything in between.
        </p>
        <div className="p-6 bg-stone-900 border border-stone-800 rounded-xl shadow-xl">
          <h2 className="text-lg font-semibold text-stone-200 mb-2">Foundation Status</h2>
          <ul className="space-y-2 text-stone-300">
            <li>✅ Next.js App Router (TypeScript & Tailwind)</li>
            <li>✅ Prisma ORM configured</li>
            <li>✅ GSAP installed</li>
            <li>Database Connection: <span className="font-semibold text-emerald-400">{dbStatus}</span></li>
          </ul>
        </div>
      </div>
    </main>
  );
}
