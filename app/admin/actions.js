"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAuthClient } from "@/lib/supabase";

export async function masukAdmin(prevStateOrFormData, formDataArg) {
  const formData =
    formDataArg instanceof FormData
      ? formDataArg
      : prevStateOrFormData instanceof FormData
      ? prevStateOrFormData
      : null;

  if (!formData) {
    return { error: "Data formulir tidak valid." };
  }

  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  let isSuccess = false;
  try {
    const supabase = await createAuthClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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

  if (isSuccess) {
    redirect("/admin");
  }
}

export async function keluarAdmin() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevStateOrFormData, formDataArg) {
  const formData =
    formDataArg instanceof FormData
      ? formDataArg
      : prevStateOrFormData instanceof FormData
      ? prevStateOrFormData
      : null;

  if (!formData) {
    return { error: "Data formulir tidak valid." };
  }

  const passwordBaru = formData.get("password_baru")?.toString() || "";
  const konfirmasiPassword = formData.get("konfirmasi_password")?.toString() || "";

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password harus sama." };
  }

  try {
    const supabase = await createAuthClient();

    // Pastikan admin sedang login
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Sesi tidak valid atau telah berakhir. Silakan login kembali." };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordBaru,
    });

    if (updateError) {
      return { error: updateError.message || "Gagal mengganti password." };
    }

    return { success: "Password berhasil diganti." };
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat mengganti password." };
  }
}

export async function tambahProduk(prevStateOrFormData, formDataArg) {
  const formData =
    formDataArg instanceof FormData
      ? formDataArg
      : prevStateOrFormData instanceof FormData
      ? prevStateOrFormData
      : null;

  if (!formData) {
    return { error: "Data formulir tidak valid." };
  }

  // 1. Verifikasi login admin di server
  const supabase = await createAuthClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Aksi ditolak: Anda harus login sebagai admin." };
  }

  // 2. Ambil dan validasi data produk
  const nama = formData.get("nama")?.toString().trim();
  const hargaRaw = formData.get("harga")?.toString().trim();
  const kategori = formData.get("kategori")?.toString().trim() || null;
  const foto_url = formData.get("foto_url")?.toString().trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString().trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk harus berupa angka valid dan tidak boleh negatif." };
  }

  // 3. Simpan ke database Supabase
  let isSuccess = false;
  try {
    const { error: insertError } = await supabase.from("produk").insert({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    });

    if (insertError) {
      return { error: insertError.message || "Gagal menyimpan produk ke database." };
    }

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
