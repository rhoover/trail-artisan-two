// Plugins
import eleventySass from "eleventy-sass";
import pluginRev from "eleventy-plugin-rev";
import { minify } from "terser";

// Filters
import { dateFormatter } from "./src/_eleventy/filters/date-format.js";
import { jsonToString } from "./src/_eleventy/filters/artisan-to-string.js";

// Shortcodes
 import { fileName } from "./src/_eleventy/shortcodes/filename-to-title.js";
 import { lastModified } from "./src/_eleventy/shortcodes/lastModified.js";
 import { createData } from "./src/_eleventy/shortcodes/structured-data.js";

// Utilities
import { sassOptions } from "./src/_eleventy/utilities/sassCompileOptions.js";
import { htmlMinifier } from "./src/_eleventy/utilities/minify-html.js";
import { getServiceWorkerData } from "./src/_eleventy/utilities/serviceWorkerData.js";

export default async function(eleventyConfig) {

  ////////////////////////////////////////////////////
  // Watch Javascript File Changes, and Minimize
  ////////////////////////////////////////////////////

  // folder to keep an eye on
  eleventyConfig.addWatchTarget("./src/js/inline/");
  // let'er rip
  eleventyConfig.addFilter("jsmin", async function (code) {
    let minified = await minify(code);
    return minified.code;
	});

  ////////////////////////////////////////////////////
  // Pass Throughs
  ////////////////////////////////////////////////////

  ['src/img', 'src/server', {'src/js/packages': 'js/packages/'}, {"src/fonts": "fonts"}].forEach(filesFromPath =>
    eleventyConfig.addPassthroughCopy(filesFromPath)
  );
  eleventyConfig.addPassthroughCopy('robots.txt');
  eleventyConfig.addPassthroughCopy('favicon.ico');
  eleventyConfig.addPassthroughCopy('manifest.webmanifest');
  eleventyConfig.addPassthroughCopy('src/all-artisan-data');
  eleventyConfig.addPassthroughCopy('artisans-service-worker-min.js');
  eleventyConfig.addPassthroughCopy({'src/_data/*.json': 'artisan-types-data'});

  ////////////////////////////////////////////////////
  // Plugins
  ////////////////////////////////////////////////////

  // let eleventy handle compiling sass
  eleventyConfig.addPlugin(eleventySass, sassOptions);
  // revision the css filename
  eleventyConfig.addPlugin(pluginRev);

  ////////////////////////////////////////////////////
  // Filters
  ////////////////////////////////////////////////////

  // date formatter...duh
  eleventyConfig.addFilter("dateFormat", dateFormatter);
  
  // artisan object for detail page
  eleventyConfig.addFilter("stringFromArtisanObject", jsonToString);

  ////////////////////////////////////////////////////
  // Shortcodes
  ////////////////////////////////////////////////////

  eleventyConfig.addShortcode("nametotitle", fileName);

  // find the last modified file info to publish as 'updated' in schema data and sitemap
  eleventyConfig.addShortcode("lastModifiedSchemaShortCode", lastModified);
  
  // json-ld data creation
  eleventyConfig.addShortcode("schemaDataShortCode", createData);

  ////////////////////////////////////////////////////
  // Utilities
  ////////////////////////////////////////////////////

  // minify html for production build
  eleventyConfig.addTransform("htmlmin", htmlMinifier);

  //create json file for service worker
  eleventyConfig.on("eleventy.after", getServiceWorkerData);


}; // end export

export const config = {
  dir: {
    input: "src",
    output: "dist"
  },
  htmlTemplateEngine: "njk",
  templateFormats: ["html", "njk"]
};
