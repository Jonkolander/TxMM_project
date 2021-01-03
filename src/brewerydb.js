const request = require("superagent");
const fs = require("fs");

const API_KEY = "6a3ac324d48edac474417bab5926b70b";

const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

let total = [];

(async () => {
  for (let page = 1; page <= 23; page += 1) {
    console.log("Page:", page);
    const result = await request
      .get(`https://api.brewerydb.com/v2/beers`)
      .query({ key: API_KEY, p: page })
      .send();

    const temp = result.body.data
      .map((e) => (e.labels || {}).large)
      .filter((e) => e !== null && e !== undefined);

    total = [...total, ...temp];
  }

  fs.writeFileSync("brewerydb.json", JSON.stringify(total));
})();
