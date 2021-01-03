const beerlabels = require("../beerlabels_final.json");
const fs = require("fs");

(async () => {
  // placeholder
  const filtered = beerlabels.sort(
    (a, b) => b.untappd.beer_rating - a.untappd.beer_rating
  );

  console.log(filtered.length);
})();
