"use client";

import { useState, useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAI } from "@/app/admin/actions";

// FormProdukAI = FormProduk yang sudah punya fitur generate deskripsi AI (US-14)
// dan mendukung props action/state/isPending (US-08).
export default function FormProduk({
  produk = {},
  labelTombol,
  action,
  state,
  isPending = false,
}) {
  const [deskripsiLokal, setDeskripsiLokal] = useState(produk.deskripsi || "");
  const [namaLokal, setNamaLokal] = useState(produk.nama || "");
  const [kategoriLokal, setKategoriLokal] = useState(produk.kategori || "");
  const [aiState, aiAction, aiPending] = useActionState(buatDeskripsiAI, null);

  // Sync AI result to textarea
  const deskripsiValue = aiState?.deskripsi ?? deskripsiLokal;

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      {state?.error && (
        <div className="rounded-xl border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {state.error}
        </div>
      )}
      <Input
        label="Nama produk"
        name="nama"
        defaultValue={produk.nama}
        required
        onChange={(e) => setNamaLokal(e.target.value)}
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        defaultValue={produk.kategori}
        onChange={(e) => setKategoriLokal(e.target.value)}
      />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url}
      />

      {/* Deskripsi + tombol AI */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold">Deskripsi</span>
          <form action={aiAction} className="contents">
            <input type="hidden" name="nama" value={namaLokal} />
            <input type="hidden" name="kategori" value={kategoriLokal} />
            <button
              type="submit"
              disabled={aiPending}
              className="rounded-md border border-garis px-3 py-1 text-xs font-semibold text-teks-lembut hover:border-utama hover:text-utama disabled:opacity-50"
            >
              {aiPending ? "Membuat..." : "✨ Buat dengan AI"}
            </button>
          </form>
        </div>
        {aiState?.error && (
          <p className="text-xs text-bahaya">{aiState.error}</p>
        )}
        <textarea
          name="deskripsi"
          rows={4}
          value={deskripsiValue}
          onChange={(e) => setDeskripsiLokal(e.target.value)}
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
