"use client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_id");

    router.push("/login");
  }

  return (
    <button
      onClick={logout}
      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
    >
      Logout
    </button>
  );
}
