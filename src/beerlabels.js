const request = require("superagent");
const cheerio = require("cheerio");
const _ = require("lodash");
const fs = require("fs");

(async () => {
  const result = await request
    .get(`https://beerlabels.nl/index_htm_files/Etikettenopnaam.html`)
    .send();

  const $ = cheerio.load(result.text);
  const fonts = $("font")
    .toArray()
    .map((element) => $(element).text());

  fonts.splice(0, 9);

  const label_information = _.chunk(fonts, 8).map((label) => ({
    untappd_id: null,
    checked: false,
    name: label[0],
    annotation: label[1],
    year: parseInt(label[3], 10),
    ABV: parseFloat(label[4].replace(",", ".").replace(" ", ""), 10),
    brewery: label[6],
    label_url: label[7]
      ? encodeURI(`https://beerlabels.nl/index_htm_files/${label[7]}`)
      : null,
  }));

  const filtered_labels = label_information.filter(
    (e) => e.year >= 2018 && e.label_url !== null
  );
  const brewery_count = new Map();

  const final_list = [];
  for (const label of filtered_labels) {
    const count = brewery_count.get(label.brewery);
    if (!count) {
      brewery_count.set(label.brewery, 1);
    } else {
      brewery_count.set(label.brewery, count + 1);
    }

    if (brewery_count.get(label.brewery) <= 3) {
      final_list.push(label);
    }
  }

  console.log(final_list.length);

  fs.writeFileSync("beerlabels.json", JSON.stringify(final_list));
})();
