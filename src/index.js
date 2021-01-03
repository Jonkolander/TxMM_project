const request = require("superagent");
const cheerio = require("cheerio");
const fs = require("fs");

const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

const until_id = 4076000;
let current_id = 4075144;
(async () => {
  while (current_id <= until_id) {
    let result;
    try {
      result = await request
        .get(`https://untappd.com/b/-/${current_id}`)
        .set({ referer: "https://www.google.com/" })
        .send();
    } catch (error) {
      const retryAfter = error.response.headers["retry-after"];
      console.log(`Retry after ${retryAfter} seconds`);
      sleep(retryAfter * 1100);
      continue;
    }

    if (!result || !result.text) {
      current_id += 1;
      continue;
    }

    const $ = cheerio.load(result.text);

    const homebrew_tag = (
      $("p")
        .toArray()
        .find((p) => p.attribs.class === "style")
        .children.find((e) => e.name && e.name === "strong") || {}
    ).children;

    if (homebrew_tag) {
      console.error(`${current_id} is a homebrew. Skipping ...`);
      current_id += 1;
      sleep(5000);
      continue;
    }

    const n_ratings = parseInt(
      $("p")
        .toArray()
        .find((p) => p.attribs.class === "raters").children[0].data,
      10
    );

    if (n_ratings < 50) {
      console.error(
        `${current_id} does not have a sufficient amount of ratings. Skipping ...`
      );
      current_id += 1;
      sleep(5000);
      continue;
    }

    const beer_url_hd = $("meta")
      .toArray()
      .map((meta) => meta.attribs)
      .find((attribute) => attribute && attribute.property === "og:image")
      .content;

    if (!beer_url_hd) {
      console.error(`${current_id} does not contain a beer label url`);
      current_id += 1;
      sleep(5000);
      continue;
    }

    if (beer_url_hd && beer_url_hd.includes("badge-beer-default.png")) {
      console.error(
        `${current_id} has the default beer label image. Skipping ...`
      );
      current_id += 1;
      sleep(5000);
      continue;
    }

    const beer_label_image = await request.get(beer_url_hd).send();

    await fs.promises.writeFile(
      `folder/${current_id}.jpeg`,
      beer_label_image.body
    );
    console.log(`${current_id} is saved`);
    current_id += 1;
    sleep(5000);
  }
})();
