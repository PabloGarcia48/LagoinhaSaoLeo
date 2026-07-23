import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const galleryRoot = path.join(root, "assets", "fotos-cultos");
const outputFile = path.join(root, "data", "gallery.json");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const formatDate = (dateValue) => {
  const [year, month, day] = dateValue.split("-");

  if (!year || !month || !day) return dateValue;

  return `${day}/${month}/${year}`;
};

const getPhotoNumber = (filename) => {
  const match = filename.match(/_(\d+)\.[^.]+$/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
};

const folders = await readdir(galleryRoot, { withFileTypes: true });
const albums = [];

for (const folder of folders) {
  if (!folder.isDirectory()) continue;

  const date = folder.name;
  const folderPath = path.join(galleryRoot, date);
  const files = await readdir(folderPath, { withFileTypes: true });
  const photos = files
    .filter((file) => file.isFile())
    .filter((file) => imageExtensions.has(path.extname(file.name).toLowerCase()))
    .sort((first, second) => {
      const numberDifference = getPhotoNumber(first.name) - getPhotoNumber(second.name);
      return numberDifference || first.name.localeCompare(second.name);
    })
    .map((file) => ({
      src: `assets/fotos-cultos/${date}/${file.name}`,
      alt: `Culto de domingo em ${formatDate(date)}`,
    }));

  if (photos.length) {
    albums.push({
      date,
      title: "Culto de domingo",
      photos,
    });
  }
}

albums.sort((first, second) => second.date.localeCompare(first.date));

await writeFile(`${outputFile}`, `${JSON.stringify(albums, null, 2)}\n`);

console.log(
  `${albums.length} albuns, ${albums.reduce((total, album) => total + album.photos.length, 0)} fotos`
);
