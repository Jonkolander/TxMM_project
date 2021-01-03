const request = require("superagent");
const fs = require("fs");

const { sleep } = require("./utils");
const beerlabels = require("../beerlabels_final.json");

(async () => {
  for (let index = 0; index < beerlabels.length; index += 1) {
    const {
      untappd: { id },
      label_url,
    } = beerlabels[index];

    sleep(2000);

    console.log(
      `${index + 1}/${beerlabels.length}: ${beerlabels[index].label_url}`
    );

    const result = await request.get(label_url).send();
    fs.writeFileSync(`./beer_labels/${id}.png`, result.body);
  }
})();
