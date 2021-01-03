const request = require("superagent");
const cheerio = require("cheerio");
const fs = require("fs");

const beerlabels = require("../beerlabels.json");

const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

const cookies = {
  authority: "untappd.com",
  "cache-control": "max-age=0",
  "upgrade-insecure-requests": "1",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "sec-fetch-site": "same-origin",
  "sec-fetch-mode": "navigate",
  "sec-fetch-user": "?1",
  "sec-fetch-dest": "document",
  referer: "https://untappd.com/search?q=",
  "accept-language": "nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6,la;q=0.5",
};

(async () => {
  for (let index = 0; index < beerlabels.length; index += 1) {
    const {
      untappd_id,
      name,
      annotation,
      brewery,
      label_url,
      checked,
    } = beerlabels[index];

    if (untappd_id) {
      continue;
    }

    console.log(`${index}: ${name} by ${brewery}`);
    const split = label_url.split("/");
    let search_term = decodeURI(split[split.length - 1]);

    search_term = search_term.replace(".jpg", "").split(" ");
    search_term.splice(-2);
    search_term = search_term.join(" ");
    search_term = `${brewery} ${search_term}`;

    /**
     * 1: name + annotation
     * 2: brewery + annotation
     * 3: name + brewery
     */
    let result;
    try {
      result = await request
        .get("https://untappd.com/search")
        .query({
          q: `${brewery} ${annotation}`,
          type: "beer",
          sort: "all",
        })
        .set(cookies)
        .send();
    } catch (error) {
      console.error("STOPPING!!!");
      break;
    }

    sleep(2000);

    const $ = cheerio.load(result.text);
    const beer_ids = $('p[class="name"]')
      .toArray()
      .map((e) => {
        const url = e.children[0].attribs.href;
        const split = url.split("/");
        const beer_id = parseInt(split[split.length - 1], 10);
        return { url, beer_id };
      });

    console.log("Results:", beer_ids);

    if (beer_ids.length === 0) {
      console.log("No occurences");
      continue;
    }

    beerlabels[index].untappd_id = beer_ids.map((e) => e.beer_id);
    beerlabels[index].checked = true;
    fs.writeFileSync("beerlabels.json", JSON.stringify(beerlabels));
  }
})();
