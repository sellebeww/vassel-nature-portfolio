import fs from "node:fs";
import path from "node:path";
import type { GalleryPhoto } from "@/data/galleries";

/** Server-only file resolution keeps empty slots from making broken image requests.
 * New files appear on refresh in development; rebuild to include them in production.
 */
export function resolveGalleryPhotos(photos: GalleryPhoto[]): GalleryPhoto[] {
  const publicRoot = path.join(process.cwd(), "public");
  return photos.map((photo) => {
    const source = photo.src || photo.expectedSrc || "";
    if (!source.startsWith("/images/")) return { ...photo, src: "" };
    const candidates = photo.src ? [source] : [source, ...["webp", "png", "jpeg"].map((ext) => source.replace(/\.[^.]+$/, `.${ext}`))];
    const found = candidates.find((candidate) => {
      const file = path.resolve(publicRoot, `.${candidate}`);
      return file.startsWith(`${publicRoot}${path.sep}`) && fs.existsSync(file) && fs.statSync(file).isFile();
    });
    return { ...photo, src: found || "" };
  });
}
