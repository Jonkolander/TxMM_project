const beerlabels = require("../beerlabels_final.json");
const fs = require("fs");

(async () => {
  // placeholder
  const filtered = beerlabels.filter((e) => e.ABV !== e.untappd.beer_abv);

  console.log(filtered[0]);
})();
