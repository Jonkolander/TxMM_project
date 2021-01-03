const request = require("superagent");
const cheerio = require("cheerio");
const fs = require("fs");
const beerlabels = require("../beerlabels_final.json");

const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

(async () => {
  for (let index = 0; index < beerlabels.length; index += 1) {
    const {
      untappd: { id },
      checked,
    } = beerlabels[index];

    if (checked) {
      continue;
    }

    console.log(`${index + 1}/${beerlabels.length}`);

    const result = await request.get(`https://untappd.com/b/-/${id}`).send();
    sleep(3000);

    const $ = cheerio.load(result.text);

    const beer_name = $('div[class="name"]').find("h1").text();
    const beer_brewery = $('p[class="brewery"]').find("a").text();
    const beer_style = $('p[class="style"]').text();
    const beer_abv = parseInt($('p[class="abv"]').text(), 10) || 0;
    const beer_rating = parseFloat(
      $('span[class="num"]').text().replace("(", "").replace(")", ""),
      10
    );
    const beer_raters = parseInt(
      $('p[class="raters"]').text().replace(",", ""),
      10
    );

    beerlabels[index].checked = true;
    beerlabels[index].untappd = {
      id,
      beer_name,
      beer_brewery,
      beer_style,
      beer_rating,
      beer_raters,
      beer_abv,
    };

    fs.writeFileSync("beerlabels_final.json", JSON.stringify(beerlabels));
  }
})();
