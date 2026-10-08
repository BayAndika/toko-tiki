"use client";

import { useActionState } from "react";
import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProdukUbah from "@/components/FormProdukUbah";
import { ubahProduk } from "@/app/admin/actions";

// US-09: ubah produk dari database, terkunci login.
// Komponen ini menerima produk dari Server Component parent.
export default function FormUbahProdukClient({ produk }) {
  const ubahAction = ubahProduk.bind(null, produk.id);
  const [state, formAction, isPending] = useActionState(ubahAction, null);

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProdukUbah
        produk={produk}
        action={formAction}
        state={state}
        isPending={isPending}
        labelTombol="Simpan perubahan"
      />
    </div>
  );
}

