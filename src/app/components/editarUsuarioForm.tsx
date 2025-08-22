"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  picture: string;
  email: string;
  gender?: string;
  dateOfBirth?: string;
  phone?: string;
};

type Props = {
  user: { id: string };
  onSubmit: (id: string, data: Partial<User>) => Promise<void>;
  onCancel: () => void;
};

export default function UserEditForm({ user, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<Partial<User> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`https://dummyapi.io/data/v1/user/${user.id}`, {
          headers: { "app-id": "63473330c1927d386ca6a3a5" },
        });

        if (!res.ok) throw new Error("No se pudo cargar el usuario");
        const data: User = await res.json();
        setForm(data);
      } catch (err) {
        console.error("Error cargando detalle:", err);
        alert("Error al cargar el usuario.");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [user.id]);

  if (loading) return <p className="text-black">Cargando usuario...</p>;
  if (!form) return <p className="text-red-600">No se pudo cargar el usuario.</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!form.firstName || !/^[a-zA-Z\s]+$/.test(form.firstName)) {
      alert("El nombre es obligatorio y solo puede contener letras.");
      return;
    }

    if (!form.lastName || !/^[a-zA-Z\s]+$/.test(form.lastName)) {
      alert("El apellido es obligatorio y solo puede contener letras.");
      return;
    }

    if (!form.email || !form.email.includes("@")) {
      alert("El correo electrónico es obligatorio y debe ser válido.");
      return;
    }

    if (form.phone && !/^[0-9]+$/.test(form.phone)) {
      alert("El teléfono solo puede contener números.");
      return;
    }

    try {
      await onSubmit(user.id, form);
      alert("✅ Usuario actualizado correctamente.");
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("❌ Error al guardar el usuario.");
    }
  };

  // Fecha máxima = hoy
  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-black">
      {/* ID (solo lectura) */}
      <div>
        <label className="block text-sm font-medium">ID</label>
        <input
          name="id"
          value={form.id}
          disabled
          className="w-full rounded border px-2 py-1 bg-gray-100 text-gray-700"
        />
      </div>

      {/* Imagen editable */}
      <div>
        <label className="block text-sm font-medium">Foto (URL)</label>
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <img
            src={form.picture}
            alt="avatar"
            className="h-16 w-16 rounded-full border object-cover"
          />
          <input
            name="picture"
            type="url"
            value={form.picture}
            onChange={handleChange}
            placeholder="Ingresa URL de la imagen"
            className="flex-1 rounded border px-2 py-1"
          />
        </div>
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-medium">Título</label>
        <select
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full rounded border px-2 py-1"
        >
          <option value="">Seleccione...</option>
          <option value="mr">Mr</option>
          <option value="ms">Ms</option>
          <option value="mrs">Mrs</option>
          <option value="miss">Miss</option>
          <option value="dr">Dr</option>
        </select>
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium">Nombres</label>
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
          className="w-full rounded border px-2 py-1"
        />
      </div>

      {/* Apellido */}
      <div>
        <label className="block text-sm font-medium">Apellidos</label>
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
          className="w-full rounded border px-2 py-1"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium">Correo electrónico</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded border px-2 py-1"
        />
      </div>

      {/* Género */}
      <div>
        <label className="block text-sm font-medium">Género</label>
        <select
          name="gender"
          value={form.gender || ""}
          onChange={handleChange}
          className="w-full rounded border px-2 py-1"
        >
          <option value="">—</option>
          <option value="male">Masculino</option>
          <option value="female">Femenino</option>
          <option value="other">Otro</option>
        </select>
      </div>

      {/* Fecha de nacimiento */}
      <div>
        <label className="block text-sm font-medium">Fecha de nacimiento</label>
        <input
          name="dateOfBirth"
          type="date"
          max={today}
          value={form.dateOfBirth ? form.dateOfBirth.slice(0, 10) : ""}
          onChange={handleChange}
          className="w-full rounded border px-2 py-1"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-medium">Teléfono</label>
        <input
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
          className="w-full rounded border px-2 py-1"
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}