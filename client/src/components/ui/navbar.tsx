"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/ui/logout";

export function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname === path
      ? "rounded-md bg-gray-950/50 px-3 py-2 text-xl font-bold text-white"
      : "rounded-md px-3 py-2 text-xl font-bold text-gray-300 hover:bg-white/5 hover:text-white";

  return (
    <nav className="relative bg-indigo-800 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link
                  href="/tasks"
                  aria-current="page"
                  className={linkClass("/tasks")}
                >
                  Tasks
                </Link>
                <Link href="/schedule" className={linkClass("/schedule")}>
                  Schedule
                </Link>
                <Link href="/focus" className={linkClass("/focus")}>
                  Focus
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"></div>
        </div>
      </div>
    </nav>
  );
}
