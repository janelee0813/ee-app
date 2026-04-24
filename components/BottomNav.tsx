"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, PenLine, BarChart2, RefreshCw } from "lucide-react";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/study", label: "암기", icon: BookOpen },
  { href: "/blank-test", label: "빈칸", icon: PenLine },
  { href: "/progress", label: "진도", icon: BarChart2 },
  { href: "/review", label: "복습", icon: RefreshCw },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#F8F7F2] border-t border-stone-200">
      <div className="flex max-w-lg mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
                isActive ? "text-blue-700" : "text-stone-400 hover:text-stone-600"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className={`text-[10px] font-medium ${isActive ? "text-blue-700" : "text-stone-400"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* safe area */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
