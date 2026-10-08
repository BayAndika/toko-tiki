import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createAuthClient, createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  let daftarProduk = [];
  let pesanError = null;

  try {
    const supabase = await createAuthClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (!error && data) {
      daftarProduk = data;
    } else {
      const serverClient = createServerClient();
      const { data: serverData, error: serverError } = await serverClient
        .from("produk")
        .select("*")
        .order("id", { ascending: true });

      if (serverError) {
        pesanError = serverError.message;
      } else {
        daftarProduk = serverData || [];
      }
    }
  } catch (err) {
    try {
      const serverClient = createServerClient();
      const { data: serverData, error: serverError } = await serverClient
        .from("produk")
        .select("*")
        .order("id", { ascending: true });

      if (serverError) {
        pesanError = serverError.message;
      } else {
        daftarProduk = serverData || [];
      }
    } catch {
      pesanError = err.message || "Gagal memuat produk dari database.";
    }
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      {pesanError ? (
        <div className="rounded-xl border border-garis bg-permukaan p-4 text-sm text-bahaya">
          Gagal memuat data produk: {pesanError}
        </div>
      ) : daftarProduk.length === 0 ? (
        <p className="py-6 text-teks-lembut">Belum ada produk</p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
