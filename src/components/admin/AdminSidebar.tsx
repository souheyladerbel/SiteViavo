"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";
import { adminNavigationItems } from "@/config/admin-navigation";

type AdminSidebarProps = {
  admin: {
    name: string;
    email: string;
    role: string;
  };
};

export default function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname();

  const visibleItems = adminNavigationItems.filter((item) => {
    if (item.superAdminOnly && admin.role !== "SUPER_ADMIN") {
      return false;
    }

    return true;
  });

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-gray-200 bg-white lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          <p className="mt-1 text-sm text-gray-500">Gestion du système</p>
        </div>

        <div className="border-b border-gray-200 px-6 py-4">
          <p className="text-sm font-semibold text-gray-900">{admin.name}</p>
          <p className="mt-1 truncate text-xs text-gray-500">{admin.email}</p>
          <span className="mt-3 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {admin.role}
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-5">
          {visibleItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}