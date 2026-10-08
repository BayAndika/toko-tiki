"use client";

import { useState, useMemo } from "react";
import KartuProduk from "@/components/KartuProduk";

export default function KatalogKlien({ daftarProduk }) {
  const [pencarian, setPencarian] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const daftarKategori = useMemo(() => {
    const semua = daftarProduk.map((p) => p.kategori).filter(Boolean);
    return ["Semua", ...Array.from(new Set(semua)).sort()];
  }, [daftarProduk]);

  const produkTampil = useMemo(() => {
    return daftarProduk.filter((p) => {
      const cocokKategori =
        kategoriAktif === "Semua" || p.kategori === kategoriAktif;
      const cocokPencarian =
        pencarian.trim() === "" ||
        p.nama.toLowerCase().includes(pencarian.toLowerCase());
      return cocokKategori && cocokPencarian;
    });
  }, [daftarProduk, kategoriAktif, pencarian]);

  return (
    <div className="flex flex-col gap-5">
      {/* Kolom pencarian */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Cari produk..."
          value={pencarian}
          onChange={(e) => setPencarian(e.target.value)}
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none sm:max-w-xs"
        />
        {/* Filter kategori */}
        <div className="flex flex-wrap gap-2">
          {daftarKategori.map((kat) => (
            <button
              key={kat}
              type="button"
              onClick={() => setKategoriAktif(kat)}
              className={`rounded-full border px-3 py-1 text-sm font-semibold transition-colors ${
                kategoriAktif === kat
                  ? "border-utama bg-utama text-white"
                  : "border-garis bg-latar text-teks hover:border-utama hover:text-utama"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
      </div>

      {/* Hasil */}
      {produkTampil.length === 0 ? (
        <p className="text-teks-lembut">
          Tidak ada produk yang cocok dengan pencarian atau filter kategori.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {produkTampil.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}

