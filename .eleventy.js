const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "content/media": "media" });

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
    dir: { input: "src", output: "_site" },
  };
};
