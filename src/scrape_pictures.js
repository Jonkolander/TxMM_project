const request = require("superagent");
const fs = require("fs");

const { sleep } = require("./utils");
const beerlabels = require("../beerlabels_final.json");

(async () => {
  for (let index = 0; index < beerlabels.length; index += 1) {
    const {
      untappd: { id },
      label_url,
      checked,
    } = beerlabels[index];

    if (checked) {
      continue;
    }

    sleep(250);

    console.log(`${index + 1}/${beerlabels.length}`);

    let result;
    try {
      result = await request.get(label_url).send();
    } catch (error) {
      console.log(`Cannot find: ${label_url}`);
      continue;
    }

    fs.writeFileSync(`./beer_labels/${id}.png`, result.body);
    beerlabels[index].checked = true;
    fs.writeFileSync("beerlabels_final.json", JSON.stringify(beerlabels));
  }
})();
