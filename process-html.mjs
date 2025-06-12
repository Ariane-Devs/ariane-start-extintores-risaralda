import fs from "node:fs/promises";
import { globby } from "globby";
import { minify } from "html-minifier-terser";

try {
  // Get all HTML files from the output directory
  const path = "./dist";
  const files = await globby(`${path}/**/*.html`);

  console.log(`Found ${files.length} HTML files to process`);

  await Promise.all(
    files.map(async (file) => {
      try {
        console.log("Processing file:", file);
        let html = await fs.readFile(file, "utf-8");

        // Minify the HTML
        html = await minify(html, {
          removeComments: true,
          preserveLineBreaks: true,
          collapseWhitespace: true,
          minifyJS: true,
        });
        await fs.writeFile(file, html);
        console.log("Successfully processed:", file);
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
        throw error;
      }
    }),
  );

  console.log("HTML processing completed successfully");
} catch (error) {
  console.error("Fatal error in HTML processing:", error);
  process.exit(1);
}
