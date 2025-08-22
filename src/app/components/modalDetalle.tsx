"use client";

import { useEffect, useState } from "react";

type User = {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    picture: string;
    gender?: string;
    email: string;
    dateOfBirth?: string;
    phone?: string;
};

type UserDetailProps = {
    user: { id: string };
    onClose: () => void;
};

// Diccionarios de traducción
const titleMap: Record<string, string> = {
    mr: "Sr.",
    ms: "Sra.",
    miss: "Srta.",
    mrs: "Sra.",
};

const genderMap: Record<string, string> = {
    male: "Masculino",
    female: "Femenino",
    other: "Otro",
};

export default function UserDetail({ user, onClose }: UserDetailProps) {
    const [detail, setDetail] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDetail() {
            try {
                const res = await fetch(`https://dummyapi.io/data/v1/user/${user.id}`, {
                    headers: { "app-id": "63473330c1927d386ca6a3a5" },
                });
                const data = await res.json();
                setDetail(data);
            } catch (err) {
                console.error("Error cargando detalle:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchDetail();
    }, [user.id]);

    if (loading) {
        return <p className="text-black">Cargando detalle...</p>;
    }

    if (!detail) {
        return <p className="text-red-600">No se pudo cargar el detalle.</p>;
    }

    return (
        <div className="space-y-4 text-black p-4 max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4">
                <img
                    src={detail.picture}
                    alt={`${detail.firstName} ${detail.lastName}`}
                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border border-gray-400 shadow-sm object-cover"
                />
                <div className="text-center sm:text-left">
                    <h2 className="text-lg font-bold">
                        {detail.firstName} {detail.lastName}
                    </h2>
                    <p className="text-sm text-gray-600">{detail.email}</p>
                </div>
            </div>

            {/* Campos */}
            <div className="grid gap-3 text-sm">
                <Field label="Id" value={detail.id} />
                <Field label="Título" value={titleMap[detail.title] || detail.title || "—"} />
                <Field label="Nombres" value={detail.firstName} />
                <Field label="Apellidos" value={detail.lastName} />
                <Field label="Género" value={detail.gender ? genderMap[detail.gender] || detail.gender : "—"} />
                <Field
                    label="Fecha de nacimiento"
                    value={detail.dateOfBirth ? detail.dateOfBirth.slice(0, 10) : "—"}
                />
                <Field label="Teléfono" value={detail.phone || "—"} />
            </div>

            {/* Botón cerrar */}
            <div className="mt-6 flex justify-center sm:justify-end">
                <button
                    onClick={onClose}
                    className="rounded-lg bg-gray-700 px-5 py-2 text-white hover:bg-gray-800 w-full sm:w-auto"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="sm:w-40 text-sm font-semibold text-black">{label}:</span>
            <span className="flex-1 rounded-lg border border-gray-400 bg-gray-100 px-3 py-1 text-sm text-black shadow-sm break-words">
                {value}
            </span>
        </div>
    );
}