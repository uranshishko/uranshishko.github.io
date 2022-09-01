var ghpages = require("gh-pages");

ghpages.publish(
  "public", // path to public directory
  {
    branch: "main",
    repo: "https://github.com/uranshishko/uranshishko.github.io", // Update to point to your repository
    user: {
      name: "Uran Shishko", // update to use your name
      email: "uraneshishko@gmail.com", // Update to use your email
    },
  },
  () => {
    console.log("Deploy Complete!");
  }
);
