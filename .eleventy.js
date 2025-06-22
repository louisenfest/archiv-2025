const fs = require("fs");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("content/media");

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
