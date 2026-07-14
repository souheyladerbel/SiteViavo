"use client";

import Link from "next/link";
import { useState } from "react";
import type {
  ClientCategoryNavItem,
  ClientSiteSettings,
} from "@/types/client";

type ClientHeaderProps = {
  settings: ClientSiteSettings;
  categories: ClientCategoryNavItem[];
};

function SearchIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 8.25h10.5l.75 12H6l.75-12ZM9 8.25a3 3 0 0 1 6 0"
      />
    </svg>
  );
}

export default function ClientHeader({
  settings,
  categories,
}: ClientHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const visibleCategories = categories.slice(0, 5);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 lg:px-10">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="h-12 w-auto object-contain"
              />
            ) : (
              <span className="font-serif text-4xl italic tracking-tight text-black">
                Viavo
              </span>
            )}
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium uppercase tracking-wide text-gray-800 lg:flex">
            <Link href="/products" className="transition hover:text-black">
              Nouveautés
            </Link>

            {visibleCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="transition hover:text-black"
              >
                {category.name}
              </Link>
            ))}

            <Link href="/products?bestSeller=true" className="transition hover:text-black">
              Best Sellers
            </Link>

            <Link
              href="/products?promotion=true"
              className="text-red-600 transition hover:text-red-700"
            >
              Promotions
            </Link>
          </nav>
        </div>

        <div className="hidden items-center gap-5 text-gray-900 lg:flex">
          <Link
            href="/search"
            aria-label="Recherche"
            className="transition hover:text-gray-500"
          >
            <SearchIcon />
          </Link>

          <Link
            href="/account"
            aria-label="Compte client"
            className="transition hover:text-gray-500"
          >
            <UserIcon />
          </Link>

          <Link
            href="/cart"
            aria-label="Panier"
            className="relative transition hover:text-gray-500"
          >
            <CartIcon />

            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[11px] font-semibold text-white">
              0
            </span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-900 lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <span className="text-xl">{isMenuOpen ? "×" : "☰"}</span>
        </button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-gray-100 bg-white px-5 py-5 lg:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium uppercase tracking-wide text-gray-900">
            <Link href="/products" onClick={() => setIsMenuOpen(false)}>
              Nouveautés
            </Link>

            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}

            <Link
              href="/products?bestSeller=true"
              onClick={() => setIsMenuOpen(false)}
            >
              Best Sellers
            </Link>

            <Link
              href="/products?promotion=true"
              onClick={() => setIsMenuOpen(false)}
              className="text-red-600"
            >
              Promotions
            </Link>

            <div className="mt-4 flex items-center gap-5 border-t border-gray-100 pt-5">
              <Link href="/search" onClick={() => setIsMenuOpen(false)}>
                Recherche
              </Link>

              <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                Panier
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}