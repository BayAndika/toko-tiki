import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const namaProduk = produk?.nama || "produk";
  const hargaProduk = produk?.harga != null ? formatRupiah(produk.harga) : "";
  const pesan = `Halo, saya ingin memesan ${namaProduk} seharga ${hargaProduk}.`;
  const urlWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <a
      href={urlWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
    >
      Pesan via WhatsApp
    </a>
  );
}
