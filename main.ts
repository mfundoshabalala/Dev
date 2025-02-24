import { exec } from "https://deno.land/x/exec@0.0.5/mod.ts";

const formats = [
  "JPEG",
  "PNG",
  "TIFF",
  "WEBP"
];

const sizes = [
  { width: 1200, height: 1200 },
  { width: 600, height: 600 },
  { width: 300, height: 300 },
  { width: 150, height: 150 }
];

if (import.meta.main) {
  await handlePermissionsAndConvertImages();
}

async function handlePermissionsAndConvertImages() {
  const readPermission = await Deno.permissions.request({ name: "read", path: "images" });
  const writePermission = await Deno.permissions.request({ name: "write", path: "converted_images" });

  if (readPermission.state === "granted" && writePermission.state === "granted") {
    await deleteConvertedImagesFolder();
    const fileNames = await getFileNamesFromDir("images");
    await convertImages(fileNames);
  } else {
    console.error("Required permissions not granted.");
  }
}

async function deleteConvertedImagesFolder() {
  try {
    await Deno.remove("converted_images", { recursive: true });
    console.log("Deleted existing converted_images folder.");
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      console.log("No existing converted_images folder to delete.");
    } else {
      console.error("Error deleting converted_images folder:", err);
    }
  }
}

export async function getFileNamesFromDir(dir: string) {
  try {
    const files = [];
    for await (const file of Deno.readDir(dir)) {
      files.push(file.name);
    }
    return files;
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err);
    return [];
  }
}

async function convertImages(fileNames: string[]) {
  for (const filename of fileNames) {
    const name = filename.split(".")[0];
    const outputDir = `converted_images/${name}`;
    await Deno.mkdir(outputDir, { recursive: true });
    for (const format of formats) {
      for (const size of sizes) {
        await convertImageWithGraphicsMagick(outputDir, format, filename, size.width, size.height);
      }
    }
  }
}

export async function convertImageWithGraphicsMagick(outputDir: string, format: string, filename: string, width: number, height: number) {
  const name = filename.split(".")[0];
  const output = `${outputDir}/${name}_${format}_${width}x${height}.${format.toLowerCase()}`;
  try {
    const command = `
      gm convert -verbose images/${filename} -format ${format} -resize ${width}x${height} -background none -gravity center -extent ${width}x${height} ${output}
    `;
    await exec(command);
    console.log(`Converted images/${filename} to ${output}`);
  } catch (err) {
    console.error(`Error converting images/${name}.${format} to ${output}:`, err);
  }
}

export async function convertImageWithImageMagick(outputDir: string, format: string, filename: string, width: number, height: number) {
  const name = filename.split(".")[0];
  const output = `${outputDir}/${name}_${format}_${width}x${height}.${format.toLowerCase()}`;
  try {
    const command = `
      convert images/${filename} -format ${format} -resize ${width}x${height} -background none -gravity center -extent ${width}x${height} ${output}
    `;
    await exec(command);
    console.log(`Converted images/${filename} to ${output}`);
  } catch (err) {
    console.error(`Error converting images/${name}.${format} to ${output}:`, err);
  }
}
