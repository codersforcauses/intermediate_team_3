"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/ui/logout";

export function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname === path
      ? "rounded-md px-3 py-2 text-xl font-bold text-white bg-black/25"
      : "rounded-md px-3 py-2 text-xl font-bold text-gray-300 hover:bg-white/25 hover:text-white";

  return (
    <nav className="flex bg-indigo-500 px-5 py-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
      <div className="flex w-full flex-1 items-center justify-center gap-4 sm:items-stretch sm:justify-start">
        <Link href="/tasks" aria-current="page" className={linkClass("/tasks")}>
          Tasks
        </Link>
        <Link href="/schedule" className={linkClass("/schedule")}>
          Schedule
        </Link>
        <Link href="/focus" className={linkClass("/focus")}>
          Focus
        </Link>
        <div className="w-full"></div>
        <LogoutButton />
      </div>
    </nav>
  );
}
