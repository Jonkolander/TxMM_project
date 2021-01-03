const beerlabels = require("../beerlabels_final.json");
const fs = require("fs");

(async () => {
  console.log(beerlabels.length);
  for (let i = 0; i < 6; i += 1) {
    const filtered = beerlabels.filter(
      (e) => (e.untappd_id || []).length === i
    );
    console.log(`Amount of beers with ${i} occurences:`, filtered.length);
  }
})();
