const fs = require("fs");

module.exports = function(eleventyConfig) {
  // statische Dateien durchreichen
  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("content/media");

  // Mediensammlung fürs Archiv erzeugen
  eleventyConfig.addCollection("mediaFiles", function(collectionApi) {
    const mediaDir = "content/media";
    return fs.readdirSync(mediaDir).map(name => {
      return {
        url: `/media/${name}`,
        name
      };
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
