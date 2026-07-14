"use client";

import { type ReactNode, useEffect } from "react";

type AdminModalProps = {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
};

export default function AdminModal({
  title,
  description,
  children,
  onClose,
}: AdminModalProps) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            {description ? (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-2xl leading-none text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}