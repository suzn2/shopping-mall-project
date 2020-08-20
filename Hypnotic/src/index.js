const axios = require("axios");
const cheerio = require("cheerio");

// type이랑 xcode 필요
const category = {
  best: "type=P&xcode=006",
  outer: "type=X&xcode=001",
  top: "type=X&xcode=002",
  pants: "type=X&xcode=003",
  skirt: "type=O&xcode=016",
  bags: "type=M&xcode=008&mcode=006",
  shoes: "type=M&xcode=008&mcode=007",
};

function hypnotic() {}

axios
  .get(
    `http://www.hypnotic.co.kr/shop/shopbrand.html?${category.top}&sort=&page=1`
  )
  .then((res) => {
    //console.log(res);
    const $ = cheerio.load(res.data, { decodeEntities: true });
    const $item = $("#prdBrand > div > div > dl.item-list");

    let item_list = [];

    //console.log($item.children().length);
    //console.log($item.find("li.prd-price > s").text());  // s 를 붙이게 되면 할인된 것 중에 정상가로 나와 그냥 s있는거 찾고 있으면 할인된 가격 봄여주고 아니면 원래꺼

    //let ori_price = $item.find("li.prd-price > s").text(); // 세일하고 있으면 정상가를 보여주는 정보

    $item.each((i, element) => {
      const element_data = {
        shoppingmall_name: "여심저격 걸크러쉬룩 히프나틱",
        image: $(element).find("dt > a > img").attr("src"),
        title: $(element).find("dd > ul > li.prd-name").text(),
        price: $(element).find("dd > ul > li.prd-price").text().trim(),
        sold_out:
          $(element).find("dd > ul > li.prd-price > span").text() == "Sold Out"
            ? true
            : false,
      };
      item_list.push(element_data);
    });

    console.log(item_list, item_list.length);
  });
