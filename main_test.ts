import { assertEquals } from "https://deno.land/std@0.110.0/testing/asserts.ts";
import { getFileNamesFromDir, convertImageWithGraphicsMagick } from "./main.ts";

Deno.test("getFileNamesFromDir should return file names from directory", async () => {
  const dir = "test_images";
  await Deno.mkdir(dir, { recursive: true });
  await Deno.writeTextFile(`${dir}/test1.jpg`, "test");
  await Deno.writeTextFile(`${dir}/test2.png`, "test");

  const fileNames = await getFileNamesFromDir(dir);
  assertEquals(fileNames.length, 2);
  assertEquals(fileNames.includes("test1.jpg"), true);
  assertEquals(fileNames.includes("test2.png"), true);

  await Deno.remove(dir, { recursive: true });
});

Deno.test("convertImageWithMagick should convert image to specified format and size", async () => {
  const inputDir = "test_images";
  const outputDir = "test_converted_images";
  await Deno.mkdir(inputDir, { recursive: true });
  await Deno.writeTextFile(`${inputDir}/test.jpg`, "test");

  await Deno.mkdir(outputDir, { recursive: true });
  await convertImageWithGraphicsMagick(outputDir, "PNG", "test.jpg", 300, 300);

  const outputFile = `${outputDir}/test_PNG_300x300.png`;
  const fileExists = await Deno.stat(outputFile).then(() => true).catch(() => false);
  assertEquals(fileExists, true);

  await Deno.remove(inputDir, { recursive: true });
  await Deno.remove(outputDir, { recursive: true });
});
