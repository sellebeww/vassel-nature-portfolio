# Screenshot proyek

Masukkan screenshot proyek asli di sini:

- `project-1.jpg`
- `project-2.jpg`
- `project-3.jpg`
- `project-4.jpg`

Ekstensi `.webp`, `.png`, dan `.jpeg` juga dikenali dengan nama dasar yang sama. Gunakan screenshot landscape yang sudah dikompres.

Di `src/data/galleries.ts`, edit `projectGallery` untuk nama, keterangan singkat, alt text, dan tautan proyek. Semua slot saat ini mengarah ke URL asli yang Anda berikan: https://github.com/sellebeww. Ganti `href` hanya jika ada URL repository proyek yang sebenarnya.

Contoh satu entri (ganti nilai contoh dengan data proyek yang benar):

```ts
{
  id: "PROJECT_PLACEHOLDER_1",
  src: "/images/projects/project-1.jpg",
  alt: "Deskripsi screenshot proyek Anda",
  affiliation: "Nama proyek Anda",
  caption: "Keterangan singkat proyek Anda",
  placeholder: "Your project screenshot here",
  href: "https://github.com/sellebeww",
}
```

Refresh di development; build/deploy ulang untuk produksi. Foto dapat diperbesar, dan pengunjung dapat melanjutkan ke GitHub dari kartu maupun penampil foto. Tidak ada proyek atau screenshot fiktif yang diisi.
