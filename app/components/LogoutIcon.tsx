"use client";

import Link from "next/link";
import { RxExit } from "react-icons/rx";

export default function LogoutIcon() {
  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <Link href="/" className="flex items-center gap-3" onClick={handleLogout}>
      <RxExit />
      Salir
    </Link>
  );
}
