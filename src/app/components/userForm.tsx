"use client";
import { useState } from "react";

type UserPayload = {
  title: string;
  firstName: string;
  lastName: string;
  picture: string;
  gender: string;
  email: string;
  dateOfBirth: string;
  phone: string;
};

export default function UserForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<UserPayload>;
  onSubmit: (data: UserPayload) => Promise<void>; // ahora devolvemos void, no Response
  onCancel: () => void;
}) {
  const [form, setForm] = useState<UserPayload>({
    title: initial?.title || "",
    firstName: initial?.firstName || "",
    lastName: initial?.lastName || "",
    picture: initial?.picture || "",
    gender: initial?.gender || "",
    email: initial?.email || "",
    dateOfBirth: initial?.dateOfBirth || "",
    phone: initial?.phone || "",
  });

  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof UserPayload, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(form.firstName)) {
      alert("❌ El nombre solo puede contener letras.");
      return;
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(form.lastName)) {
      alert("❌ El apellido solo puede contener letras.");
      return;
    }
    if (!/^[0-9]+$/.test(form.phone)) {
      alert("❌ El teléfono solo puede contener números.");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(form);

      alert("✅ Usuario guardado exitosamente.");
      setForm({
        title: "",
        firstName: "",
        lastName: "",
        picture: "",
        gender: "",
        email: "",
        dateOfBirth: "",
        phone: "",
      });
      onCancel();
    } catch (err: any) {
      alert(`❌ Error: ${err?.message || "No se pudo guardar el usuario"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full max-w-md mx-auto p-2 sm:p-4">
      <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
        {/* Título */}
        <label className="text-sm font-medium block">
          Título *
          <select
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
          >
            <option value="">Seleccione...</option>
            <option value="mr">Mr</option>
            <option value="ms">Ms</option>
            <option value="mrs">Mrs</option>
            <option value="miss">Miss</option>
            <option value="dr">Dr</option>
          </select>
        </label>

        {/* Nombres */}
        <label className="text-sm font-medium block">
          Nombres *
          <input
            required
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </label>

        {/* Apellidos */}
        <label className="text-sm font-medium block">
          Apellidos *
          <input
            required
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </label>

        {/* Imagen */}
        <label className="text-sm font-medium block">
          Imagen (URL) *
          <input
            type="url"
            required
            value={form.picture}
            onChange={(e) => update("picture", e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </label>

        {/* Género */}
        <label className="text-sm font-medium block">
          Género *
          <select
            required
            value={form.gender}
            onChange={(e) => update("gender", e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Seleccione...</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="other">Otro</option>
          </select>
        </label>

        {/* Email */}
        <label className="text-sm font-medium block">
          Correo electrónico *
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </label>

        {/* Fecha nacimiento */}
        <label className="text-sm font-medium block">
          Fecha de nacimiento *
          <input
            type="date"
            max={today}
            required
            value={form.dateOfBirth}
            onChange={(e) => update("dateOfBirth", e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </label>

        {/* Teléfono */}
        <label className="text-sm font-medium block">
          Teléfono *
          <input
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </label>

        {/* Botones */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}