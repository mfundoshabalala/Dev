import { exec } from "https://deno.land/x/exec/mod.ts";

const formats = ["JPEG", "PNG", "TGA", "SGI", "BMP", "PSD", "AVS", "CMYK", "DCX", "DIB", "DPX", "FAX", "FITS", "GRAY", "GIF", "JBIG", "JNG", "MIFF", "MONO", "MNG", "MTV", "OTB", "P7", "PALM", "PCD", "PCX", "PDB", "PICON", "PNM", "RGB", "RGBA", "SUN", "TIFF", "UYVY", "VICAR", "VIFF", "WBMP", "XWD", "YUV", "PDF", "EPS", "WEBP"];

async function convertImages() {
  const outputDir = "converted_images";
  await Deno.mkdir(outputDir, { recursive: true });

  for (const format of formats) {
    const output = `${outputDir}/shoprite_${format}_1200x1200.${format.toLowerCase()}`;
    await exec(`gm convert -resize 1200x1200 -format ${format} images/shoprite.png ${output}`);
    console.log(`Converted images/shoprite.png to ${output}`);
  }
}

if (import.meta.main) {
  convertImages();
}
