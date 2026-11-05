import { Strings } from "./types"

export const id: Strings = {
  site: {
    name: "pustaka-terbuka",
    description:
      "Katalog perpustakaan terbuka dari data publik. Tanpa akun, tanpa pelacakan.",
  },
  nav: {
    label: "Halaman",
    home: "Beranda",
    books: "Buku",
    search: "Cari",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    theme: "Ganti tema terang atau gelap",
  },
  language: {
    label: "Bahasa",
  },
  skipToContent: "Lompat ke konten",
  landing: {
    title: "Katalog perpustakaan terbuka",
    subtitle:
      "Cari buku dari data publik Open Library, tanpa akun dan tanpa pelacakan.",
    explore: "Jelajahi buku",
    seeAll: "Lihat semua",
  },
  subjects: {
    indonesia: "Indonesia",
    education: "Pendidikan",
    fiction: "Fiksi",
    history: "Sejarah",
    science: "Sains",
    children: "Anak-anak",
  },
  books: {
    heading: "Koleksi buku",
    subject: "Subjek",
  },
  search: {
    title: "Cari buku",
    placeholder: "mis. Pramoedya",
    help: "Masukkan judul, nama penulis, atau ISBN untuk mencari di Open Library.",
    submit: "Cari",
    results: (keyword) => `Hasil pencarian: ${keyword}`,
    found: (count) => `${count} buku ditemukan`,
  },
  book: {
    back: "Kembali",
    notFound: "Buku tidak ditemukan",
    notFoundBody: "Buku yang kamu cari tidak ada di Open Library.",
    firstPublished: "Terbit pertama",
    openLibraryId: "ID Open Library",
    viewOnOpenLibrary: "Lihat di Open Library",
    description: "Deskripsi",
  },
  pagination: {
    label: "Halaman hasil",
    previous: "Sebelumnya",
    next: "Berikutnya",
    page: (page) => `Halaman ${page}`,
  },
  footer: {
    description:
      "Katalog perpustakaan terbuka dari data publik. Tanpa akun, tanpa pelacakan.",
    sourceCode: "Kode sumber",
    sources: "Sumber data",
    openLibraryData: "Data dan sampul buku: Open Library",
    openLibraryLicence: "Lisensi data Open Library",
  },
  close: "Tutup",
  loadFailed: "Gagal memuat data dari Open Library.",
}
