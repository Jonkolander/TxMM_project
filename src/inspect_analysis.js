const fs = require("fs");
const _ = require("lodash");

const avg_color = require("../avg_color.json");
const chist = require("../chist.json");
const hog = require("../hog.json");

function std(array) {
  var avg = _.sum(array) / array.length;
  return Math.sqrt(
    _.sum(_.map(array, (i) => Math.pow(i - avg, 2))) / array.length
  );
}

(async () => {
  // placeholder
  console.log("Colour histogram:");

  for (let i = 0; i <= 5; i += 1) {
    const filtered = Object.entries(chist)
      .map((e) => ({
        id: e[0],
        rating: e[1].rating,
        cluster_id: e[1].cluster_id,
      }))
      .filter((e) => e.cluster_id === `${i}`)
      .map((e) => e.rating);

    const stats = [
      i,
      filtered.length,
      _.mean(filtered),
      std(filtered),
      _.min(filtered),
      _.max(filtered),
    ];
    console.log(stats.join(","));
  }

  console.log("");
  console.log("HOG:");

  for (let i = 0; i <= 5; i += 1) {
    const filtered = Object.entries(hog)
      .map((e) => ({
        id: e[0],
        rating: e[1].rating,
        cluster_id: e[1].cluster_id,
      }))
      .filter((e) => e.cluster_id === `${i}`)
      .map((e) => e.rating);

    const stats = [
      i,
      filtered.length,
      _.mean(filtered),
      std(filtered),
      _.min(filtered),
      _.max(filtered),
    ];
    console.log(stats.join(","));
  }
})();
