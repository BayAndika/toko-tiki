"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);

  const namaProduk = produk?.nama || "produk";
  const hargaSatuan = produk?.harga ?? 0;
  const totalHarga = hargaSatuan * jumlah;

  const pesan = `Halo, saya ingin memesan ${jumlah}x ${namaProduk} (${formatRupiah(hargaSatuan)}/pcs) dengan total ${formatRupiah(totalHarga)}.`;
  const urlWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-3">
      {/* Pilih jumlah */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold">Jumlah:</span>
        <div className="flex items-center gap-1 rounded-lg border border-garis">
          <button
            type="button"
            onClick={() => setJumlah((j) => Math.max(1, j - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-l-lg text-lg font-bold hover:bg-permukaan"
            aria-label="Kurangi jumlah"
          >
            −
          </button>
          <span className="min-w-[2rem] text-center font-semibold">{jumlah}</span>
          <button
            type="button"
            onClick={() => setJumlah((j) => j + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-r-lg text-lg font-bold hover:bg-permukaan"
            aria-label="Tambah jumlah"
          >
            +
          </button>
        </div>
        {jumlah > 1 && (
          <span className="text-sm text-teks-lembut">
            Total: {formatRupiah(totalHarga)}
          </span>
        )}
      </div>

      {/* Tombol pesan */}
      <a
        href={urlWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp
      </a>
    </div>
  );
}
