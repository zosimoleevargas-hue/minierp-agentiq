"use client";

import { navItems } from "@/lib/navigation";
import { usePathname } from "next/navigation";

export function AppHeader() {
  const pathname = usePathname();
  const current = navItems.find(
    (item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background px-6">
      <h1 className="text-lg font-semibold">{current?.label ?? "AGENTIQ"}</h1>
    </header>
  );
}
