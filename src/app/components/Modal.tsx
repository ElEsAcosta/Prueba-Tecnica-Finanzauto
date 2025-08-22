"use client";

import { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose} // 👉 Cierra al hacer click en el fondo
    >
      {/* Contenedor del modal */}
      <div
        className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg text-black"
        onClick={(e) => e.stopPropagation()} // 👉 Evita cerrar si clickeas dentro
      >
        {/* Header con título y botón de cierre */}
        <div className="mb-4 flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </div>
  );
}