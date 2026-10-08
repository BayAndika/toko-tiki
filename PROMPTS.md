# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:** Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Halaman katalog (`/`) berhasil menampilkan daftar produk langsung dari database Supabase secara server-side.
- Menggunakan komponen `KartuProduk` tanpa mengubah styling.
- Jika database kosong, menampilkan teks "Belum ada produk".
- Jika terjadi error saat memuat data, menampilkan pesan error yang jelas di halaman.
- Komponen `CatatanBelumAktif` telah dihapus dari halaman katalog.

**Perbaikan:**
- Membuat modul koneksi server Supabase di `lib/supabase/server.js` dan re-export di `lib/supabase/index.js` menggunakan `SUPABASE_URL` dan `SUPABASE_SECRET_KEY`.
- Menambahkan `export const dynamic = "force-dynamic"` di `app/page.jsx` agar data katalog selalu diperbarui saat ada perubahan di database.
- Menghapus impor dan penggunaan `produkContoh` dari `lib/data-contoh.js`.

## US-02 Detail produk

**Prompt:** Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
- Halaman detail produk (`/produk/[id]`) berhasil mengambil data satu produk secara server-side dari tabel `produk` di Supabase berdasarkan parameter URL `id`.
- Tampilan detail produk (gambar, kategori, nama, format rupiah, deskripsi, dan tombol WhatsApp) tetap terjaga.
- Jika produk tidak ditemukan di database atau ID tidak valid, fungsi `notFound()` dipanggil sehingga menampilkan halaman 404.
- Komponen `CatatanBelumAktif` telah dihapus dari halaman detail produk.

**Perbaikan:**
- Mengganti pencarian data statis `cariProdukContoh(id)` dengan query Supabase `.from("produk").select("*").eq("id", id).maybeSingle()`.
- Menambahkan penanganan fallback yang memicu `notFound()` jika produk tidak ditemukan atau query bermasalah.

## US-03 Pesan via WhatsApp

**Prompt:** Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
- Komponen `TombolWhatsApp` telah diubah menjadi tautan `<a>` dengan styling tombol yang sama persis seperti sebelumnya.
- Tautan membuka `https://wa.me/<nomor>?text=<pesan>` ke nomor telepon yang dikonfigurasi di `lib/toko.js`.
- Pesan otomatis terisi dengan nama produk dan harga produk dalam format rupiah (`formatRupiah`), serta telah di-encode dengan `encodeURIComponent`.
- Tautan terbuka di tab baru menggunakan atribut `target="_blank"` dan `rel="noopener noreferrer"`.
- CatatanBelumAktif yang menyebut US-03 di halaman detail produk telah dibersihkan.

**Perbaikan:**
- Mengubah elemen `<button>` menjadi elemen `<a>` di `components/TombolWhatsApp.jsx`.
- Mengimpor `toko` dari `lib/toko.js` dan fungsi `formatRupiah` dari `lib/format.js` untuk menyusun template teks WhatsApp.
- Memastikan link WhatsApp aman dan ramah pengguna dengan target tab baru.

## US-04 Login admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
