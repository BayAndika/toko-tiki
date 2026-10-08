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

**Prompt:** Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
- Login admin berhasil dibuat memakai Supabase Auth dengan `@supabase/ssr` dan cookie.
- Proses login ditangani melalui Server Action `masukAdmin` di `app/admin/actions.js` yang tersambung ke form `app/admin/login/page.jsx`.
- Login berhasil mengarahkan pengguna ke `/admin`, sedangkan login gagal menampilkan pesan error yang jelas di halaman login.
- Tombol "Keluar" di `components/NavAdmin.jsx` berfungsi mengakhiri sesi auth dengan `keluarAdmin` Server Action dan kembali ke `/admin/login`.
- Tampilan form login dan navigasi admin dipertahankan tanpa perubahan visual.
- `CatatanBelumAktif` telah dihapus dari halaman login.

**Perbaikan:**
- Membuat modul `lib/supabase/auth.js` menggunakan `createServerClient` dari `@supabase/ssr` dan `cookies` dari `next/headers`.
- Menghubungkan form login dengan `useActionState` untuk menampilkan pesan kesalahan autentikasi secara interaktif tanpa kehilangan data input formulir.
- Membungkus tombol "Keluar" dengan `<form action={keluarAdmin}>` agar mengeksekusi Server Action secara bersih tanpa mengubah layout `NavAdmin`.

## US-05 Ganti password

**Prompt:** Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Server Action `gantiPassword` dibuat di `app/admin/actions.js` dan terhubung dengan form di `app/admin/password/page.jsx`.
- Melakukan verifikasi login di server (`supabase.auth.getUser()`) sebelum mengganti password.
- Melakukan validasi server: password baru wajib minimal 8 karakter dan harus cocok dengan konfirmasi password.
- Menampilkan pesan berhasil jika password berhasil diganti atau pesan error jika validasi/eksekusi gagal.
- Tampilan form dipertahankan dan `CatatanBelumAktif` telah dihapus.

**Perbaikan:**
- Mengimplementasikan `updateUser({ password: passwordBaru })` pada Server Action dengan pengecekan sesi aktif admin.
- Menghubungkan form dengan `useActionState` untuk menampilkan pesan feedback (sukses/gagal) secara reaktif.
- Menghapus komponen `CatatanBelumAktif` dari `app/admin/password/page.jsx`.

## US-06 Proteksi halaman admin

**Prompt:** Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
- File `proxy.js` di root proyek berhasil dibuat untuk melindungi rute `/admin` menggunakan Next.js 16 Proxy (pengganti `middleware.js`).
- Semua rute `/admin` (seperti `/admin`, `/admin/password`, `/admin/produk/baru`, dll.) kecuali `/admin/login` wajib memiliki sesi login Supabase Auth; pengguna tanpa sesi login otomatis dialihkan ke `/admin/login`.
- Setiap Server Action yang mengubah data (misalnya `gantiPassword`) memastikan sesi admin diverifikasi di server sebelum mengeksekusi perubahan.
- Komponen `CatatanBelumAktif` telah dihapus dari halaman `/admin`.

**Perbaikan:**
- Mengimplementasikan `proxy.js` dengan `@supabase/ssr` `createServerClient` dan pemeriksaan `supabase.auth.getUser()`.
- Menambahkan pemeriksaan path agar rute `/admin/login` tetap dapat diakses publik tanpa pengalihan berulang (infinite redirect).
- Menghapus komponen `CatatanBelumAktif` dari `app/admin/page.jsx`.

## Debugging dan fitur bonus

### US-07 List Produk [SENDIRI]

**Prompt:** Ubah app/admin/page.jsx agar daftar produk pada halaman admin mengambil data langsung dari tabel "produk" di database Supabase secara server-side, bukan memakai lib/data-contoh.js. Tampilkan produk dengan TabelProduk yang sudah ada. Jika gagal mengambil data, tampilkan pesan error yang jelas. Jika tabel kosong, tampilkan tulisan "Belum ada produk". Isi database toko disesuaikan dengan katalog produk plushie brainrot (seperti Plushie Tung Tung Tung Sahur).

**Hasil:**
- Halaman admin (`/admin`) berhasil memuat dan menampilkan seluruh daftar produk secara dinamis langsung dari tabel `produk` di database Supabase.
- Tampilan tabel daftar produk menggunakan komponen `TabelProduk` tetap rapi dengan foto, nama, kategori, harga rupiah, dan tombol aksi (Ubah, Hapus).
- Seluruh isi katalog toko di database diperbarui menjadi tema merchandise plushie brainrot (seperti Plushie Tung Tung Tung Sahur, Plushie Tralalero Tralala, Plushie Skibidi Toilet Sigma, dll.).
- Halaman tidak lagi bergantung pada data contoh di `lib/data-contoh.js`.

**Perbaikan:**
- Mengubah fungsi `HalamanAdmin` di `app/admin/page.jsx` menjadi async Server Component dan memanggil Supabase untuk query `.from("produk").select("*").order("id", { ascending: true })`.
- Menambahkan fallback andal ke `createServerClient()` jika ada kendala pembacaan sesi di server component.
- Menghapus impor `produkContoh` dari `lib/data-contoh.js`.
- Memperbarui data produk di Supabase menjadi variasi plushie brainrot yang kreatif dan konsisten.

### US-08 Tambah produk [SENDIRI]

**Prompt:** Buat fitur tambah produk baru dari halaman admin yang terkunci login. Sambungkan form di app/admin/produk/baru/page.jsx ke Server Action tambahProduk di app/admin/actions.js. Pastikan aksi memeriksa login admin di server sebelum menyimpan ke tabel produk di Supabase. Setelah berhasil, alihkan kembali ke /admin dan perbarui tampilan katalog. Hapus CatatanBelumAktif dari halaman tambah produk.

**Hasil:**
- Form di `/admin/produk/baru` berhasil menyimpan produk baru ke database Supabase melalui Server Action `tambahProduk`.
- Aksi tambah produk terlindungi login di server: memverifikasi sesi admin (`supabase.auth.getUser()`) sebelum melakukan operasi insert ke database.
- Melakukan validasi input nama dan harga (wajib berupa angka valid non-negatif).
- Setelah produk berhasil disimpan, halaman otomatis dialihkan kembali ke `/admin` dan cache diperbarui dengan `revalidatePath`.
- Banner `CatatanBelumAktif` telah dihapus dari halaman tambah produk.

**Perbaikan:**
- Mengembangkan Server Action `tambahProduk` di `app/admin/actions.js` dengan proteksi autentikasi server-side dan validasi input.
- Memperbarui `components/FormProduk.jsx` agar mendukung props `action`, `state`, dan `isPending` untuk menampilkan pesan feedback dan status pengiriman.
- Menghubungkan `app/admin/produk/baru/page.jsx` menggunakan `useActionState` dan menghapus komponen `CatatanBelumAktif`.
