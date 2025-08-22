"use client";
import { useEffect, useState, useMemo } from "react";
import Modal from "./components/Modal";
import UserForm from "./components/userForm";
import UserEditForm from "./components/editarUsuarioForm";
import UserDetail from "./components/modalDetalle";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

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

type Paged<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const titleEs: Record<string, string> = {
    mr: "Sr.",
    ms: "Sra.",
    mrs: "Sra.",
    miss: "Srta.",
    dr: "Dr./Dra.",
  };

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(
        `https://dummyapi.io/data/v1/user?page=${page}&limit=${limit}`,
        { headers: { "app-id": "63473330c1927d386ca6a3a5" } }
      );
      const data: Paged<User> = await res.json();

      // 🔥 Invertimos el orden para que los más nuevos queden arriba
      setUsers(data.data.reverse());
      setTotal(data.total);
    } catch (err) {
      console.error("Error cargando usuarios", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, limit]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q)
    );
  }, [users, query]);

  async function createUser(data: Partial<User>) {
    try {
      if (!data.firstName || !data.lastName || !data.email) {
        alert("Debes llenar nombre, apellido y email.");
        return;
      }

      const res = await fetch("https://dummyapi.io/data/v1/user/create", {
        method: "POST",
        headers: {
          "app-id": "63473330c1927d386ca6a3a5",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Error en la creación del usuario");
      }

      setShowCreate(false);
      load();
    } catch (err) {
      console.error("Error creando usuario", err);
      alert("No se pudo crear el usuario. Revisa la consola.");
    }
  }

  async function updateUser(id: string, data: Partial<User>) {
    try {
      const res = await fetch(`https://dummyapi.io/data/v1/user/${id}`, {
        method: "PUT",
        headers: {
          "app-id": "63473330c1927d386ca6a3a5",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Error actualizando usuario");
      }

      setEditingUser(null);
      load();
    } catch (err) {
      console.error("Error actualizando usuario", err);
      alert("No se pudo actualizar el usuario. Revisa la consola.");
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      const res = await fetch(`https://dummyapi.io/data/v1/user/${id}`, {
        method: "DELETE",
        headers: { "app-id": "63473330c1927d386ca6a3a5" },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Error eliminando usuario");
      }

      load();
    } catch (err) {
      console.error("Error eliminando usuario", err);
      alert("No se pudo eliminar el usuario.");
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6">
      {/* Header */}
      <header className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-2xl font-bold">Listado de usuarios</h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre o email"
            className="w-full sm:w-64 rounded-xl border px-3 py-2 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={() => setShowCreate(true)}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 w-full sm:w-auto"
          >
            Crear Usuario
          </button>
        </div>
      </header>

      {/* Tabla */}
      {loading && <p>Cargando...</p>}

      <div className="overflow-x-auto rounded-[15px] border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm sm:text-base">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <tr>
              <th className="p-2 text-left">Id</th>
              <th className="p-2 text-left">Nombres y apellidos</th>
              <th className="p-2 text-left">Foto</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2 max-w-[80px] sm:max-w-none text-ellipsis overflow-hidden break-words">
                  <div
                    className="break-words overflow-hidden sm:overflow-visible sm:whitespace-normal"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as any,
                    }}
                    title={u.id}
                  >
                    {u.id}
                  </div>
                </td>


                <td className="p-2">
                  {titleEs[u.title?.toLowerCase() || ""]} {u.firstName} {u.lastName}
                </td>

                <td className="p-2">
                  <img
                    src={u.picture}
                    alt={`${u.firstName} ${u.lastName}`}
                    className="h-8 w-8 sm:h-12 sm:w-12 rounded-full"
                  />
                </td>

                <td className="p-2">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => setSelectedUser(u)}
                      title="Ver usuario"
                      className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>

                    <button
                      onClick={() => setEditingUser(u)}
                      title="Editar usuario"
                      className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white hover:bg-orange-600"
                    >
                      <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>

                    <button
                      onClick={() => deleteUser(u.id)}
                      title="Eliminar usuario"
                      className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="rounded border px-3 py-1 disabled:opacity-50 w-full sm:w-auto"
        >
          Anterior
        </button>

        <span className="text-sm sm:text-base">
          Página {page + 1} de {Math.max(totalPages, 1)}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, Math.max(totalPages, 1) - 1))}
          disabled={page + 1 >= totalPages}
          className="rounded border px-3 py-1 disabled:opacity-50 w-full sm:w-auto"
        >
          Siguiente
        </button>
      </div>

      {/* Modales */}
      <Modal open={!!selectedUser} onClose={() => setSelectedUser(null)} title="Detalle de usuario">
        {selectedUser && (
          <UserDetail user={{ id: selectedUser.id }} onClose={() => setSelectedUser(null)} />
        )}
      </Modal>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Crear Usuario">
        <UserForm onSubmit={createUser} onCancel={() => setShowCreate(false)} />
      </Modal>

      <Modal open={!!editingUser} onClose={() => setEditingUser(null)} title="Editar Usuario">
        {editingUser && (
          <UserEditForm
            user={{ id: editingUser.id }}
            onSubmit={updateUser}
            onCancel={() => setEditingUser(null)}
          />
        )}
      </Modal>
    </main>
  );
}