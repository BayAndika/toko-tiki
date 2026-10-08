"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAuthClient } from "@/lib/supabase";

// ─── Helpers ───────────────────────────────────────────────────────────────

async function getFormData(prevStateOrFormData, formDataArg) {
  const formData =
    formDataArg instanceof FormData
      ? formDataArg
      : prevStateOrFormData instanceof FormData
      ? prevStateOrFormData
      : null;
  return formData;
}

async function requireAdmin() {
  const supabase = await createAuthClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return { supabase: null, user: null, error: "Aksi ditolak: Anda harus login sebagai admin." };
  }
  return { supabase, user, error: null };
}

function extractProdukFromForm(formData) {
  const nama = formData.get("nama")?.toString().trim();
  const hargaRaw = formData.get("harga")?.toString().trim();
  const kategori = formData.get("kategori")?.toString().trim() || null;
  const foto_url = formData.get("foto_url")?.toString().trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString().trim() || null;

  if (!nama) return { error: "Nama produk wajib diisi." };
  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk harus berupa angka valid dan tidak boleh negatif." };
  }
  return { nama, harga, kategori, foto_url, deskripsi, error: null };
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function masukAdmin(prevStateOrFormData, formDataArg) {
  const formData = await getFormData(prevStateOrFormData, formDataArg);
  if (!formData) return { error: "Data formulir tidak valid." };

  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  if (!email || !password) return { error: "Email dan password wajib diisi." };

  let isSuccess = false;
  try {
    const supabase = await createAuthClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message === "Invalid login credentials") {
        return { error: "Email atau password salah." };
      }
      return { error: error.message || "Gagal masuk. Silakan periksa kembali data Anda." };
    }
    isSuccess = true;
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat memproses login." };
  }

  if (isSuccess) redirect("/admin");
}

export async function keluarAdmin() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevStateOrFormData, formDataArg) {
  const formData = await getFormData(prevStateOrFormData, formDataArg);
  if (!formData) return { error: "Data formulir tidak valid." };

  const passwordBaru = formData.get("password_baru")?.toString() || "";
  const konfirmasiPassword = formData.get("konfirmasi_password")?.toString() || "";

  if (!passwordBaru || !konfirmasiPassword) return { error: "Semua kolom password wajib diisi." };
  if (passwordBaru.length < 8) return { error: "Password baru minimal 8 karakter." };
  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password harus sama." };
  }

  try {
    const supabase = await createAuthClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: "Sesi tidak valid atau telah berakhir. Silakan login kembali." };
    }
    const { error: updateError } = await supabase.auth.updateUser({ password: passwordBaru });
    if (updateError) return { error: updateError.message || "Gagal mengganti password." };
    return { success: "Password berhasil diganti." };
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat mengganti password." };
  }
}

// ─── Produk ──────────────────────────────────────────────────────────────────

export async function tambahProduk(prevStateOrFormData, formDataArg) {
  const formData = await getFormData(prevStateOrFormData, formDataArg);
  if (!formData) return { error: "Data formulir tidak valid." };

  const { supabase, error: authErr } = await requireAdmin();
  if (authErr) return { error: authErr };

  const fields = extractProdukFromForm(formData);
  if (fields.error) return { error: fields.error };
  const { nama, harga, kategori, foto_url, deskripsi } = fields;

  let isSuccess = false;
  try {
    const { error: insertError } = await supabase.from("produk").insert({ nama, harga, kategori, foto_url, deskripsi });
    if (insertError) return { error: insertError.message || "Gagal menyimpan produk ke database." };
    isSuccess = true;
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat menambahkan produk." };
  }

  if (isSuccess) {
    revalidatePath("/admin");
    revalidatePath("/");
    redirect("/admin");
  }
}

export async function ubahProduk(id, prevStateOrFormData, formDataArg) {
  const formData = await getFormData(prevStateOrFormData, formDataArg);
  if (!formData) return { error: "Data formulir tidak valid." };

  const { supabase, error: authErr } = await requireAdmin();
  if (authErr) return { error: authErr };

  const fields = extractProdukFromForm(formData);
  if (fields.error) return { error: fields.error };
  const { nama, harga, kategori, foto_url, deskripsi } = fields;

  let isSuccess = false;
  try {
    const { error: updateError } = await supabase
      .from("produk")
      .update({ nama, harga, kategori, foto_url, deskripsi })
      .eq("id", id);
    if (updateError) return { error: updateError.message || "Gagal menyimpan perubahan ke database." };
    isSuccess = true;
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat mengubah produk." };
  }

  if (isSuccess) {
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/produk/${id}`);
    redirect("/admin");
  }
}

export async function hapusProduk(id) {
  const { supabase, error: authErr } = await requireAdmin();
  if (authErr) return { error: authErr };

  try {
    const { error: deleteError } = await supabase.from("produk").delete().eq("id", id);
    if (deleteError) return { error: deleteError.message || "Gagal menghapus produk." };
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat menghapus produk." };
  }
}

export async function buatDeskripsiAI(prevState, formData) {
  const { supabase, error: authErr } = await requireAdmin();
  if (authErr) return { error: authErr };

  const nama = formData.get("nama")?.toString().trim();
  const kategori = formData.get("kategori")?.toString().trim();
  if (!nama) return { error: "Nama produk wajib diisi terlebih dahulu." };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { error: "API key Gemini belum dikonfigurasi di environment variable." };

  try {
    const prompt = `Buat deskripsi singkat produk e-commerce dalam bahasa Indonesia yang menarik dan informatif (maksimal 2 kalimat) untuk produk bernama "${nama}"${kategori ? ` dengan kategori "${kategori}"` : ""}. Deskripsi harus menyebutkan keunggulan dan daya tarik produk.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return { error: `Gagal memanggil Gemini API: ${errText}` };
    }

    const json = await res.json();
    const deskripsi = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!deskripsi) return { error: "Gemini tidak menghasilkan deskripsi. Coba lagi." };

    return { deskripsi };
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat memanggil Gemini API." };
  }
}
