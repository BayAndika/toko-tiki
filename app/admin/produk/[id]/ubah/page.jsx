import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import FormUbahProdukClient from "./FormUbahProdukClient";

// US-09: halaman ubah produk, mengambil data dari Supabase.
export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  let produk = null;
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!error && data) produk = data;
  } catch {
    produk = null;
  }

  if (!produk) notFound();

  return <FormUbahProdukClient produk={produk} />;
}
