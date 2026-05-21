// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "ReplyFlow - AI Customer Support Assistant",
  description: "Generate customer support replies instantly using AI.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950 text-slate-100">
  <div className="flex min-h-screen">
    {/* Sidebar */}
    <aside className="hidden border-r border-slate-800 bg-slate-950/80 backdrop-blur-sm p-4 sm:flex sm:w-64 sm:flex-col">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold shadow-sm">
          AI
        </div>
        <span className="text-sm font-semibold tracking-tight">
          ReplyFlow
        </span>
      </div>

      <nav className="flex-1 space-y-1 text-xs">
        <button className="flex w-full items-center justify-between rounded-lg bg-slate-900/80 px-3 py-2 text-left text-slate-100 shadow-sm shadow-slate-950/40">
          <span>Assistant</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </button>
      </nav>

      <div className="mt-6 border-t border-slate-800 pt-4 text-[11px] text-slate-500">
        <p>Built by Your Name</p>
      </div>
    </aside>

    {/* Main content */}
    <main className="flex-1">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-8">
        {/* Top bar */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight"> 
              AI Customer Support Assistant
            </h1>
            <p className="mt-1 text-xs text-slate-400">
               Handle customer support 10x faster with AI.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300 shadow-sm shadow-slate-950/40"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Workspace</span>
          </button>
        </header>

        {/* Page content */}
        {children}
      </div>
    </main>
  </div>
</body>
    </html>
  );
}