const axios = require("axios");
const cheerio = require("cheerio");

const category = {
  best: 57,
  outer: 26,
  top: 27,
  bottom: 43,
  pants: 64,
  skirt: 65,
  bags: 60,
  shoes: 67,
};

function threeTimesPage(item) {
  let category_value = category[item];

  return axios
    .get(`https://threetimes.kr/product/list2.html?cate_no=${category_value}`)
    .then((res) => {
      //console.log(res);
      const $ = cheerio.load(res.data);
      const $item = $("ul.prdList.column3 li .box");

      let item_list = [];

      $item.each((i, element) => {
        // 할인한 물건은 children이 3개임.
        let price_type =
          $(element).find("ul li.xans-record-").length == 3 ? 1 : 0;

        const element_data = {
          shoppingmall_name: "threetimes",
          image: $(element).find(".thumbnail a img").attr("src"),
          title: $(element).find(".name a").children().last().text(),
          price: $(element)
            .find("ul li")
            .eq(price_type)
            .find("span")
            .eq(1)
            .text(),
          sold_out:
            $(element).find(".status .icon img").length == 1 ? true : false,
        };
        item_list.push(element_data);
      });

      console.log(want_item, ": ", item_list);
    });
}

threeTimesPage("best");
