const fs = require("fs");
const _ = require("lodash");

const beerlabels = require("../beerlabels.json");

(async () => {
  // placeholder
  const filtered = beerlabels
    .filter((e) => e.untappd.beer_style.includes("Stout - Imperial / Double"))
    .map((e) => e.untappd.beer_rating);

  console.log(filtered.length);
  console.log(_.mean(filtered));
})();
