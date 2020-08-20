const axios = require("axios");
const cheerio = require("cheerio");

let PAGE_URL;

const category = {
  "best-50": 64,
  outer: 49,
  top: 50,
  bottom: 51,
  pants: 77,
  skirt: 57,
  onepiece: 65,
  shoesbag: 52,
};

// 해당 카테고리가 몇 페이지까지 있는 지 확인 (마지막 페이지를 return 해줌)
function aLittleBeatPage(item) {
  let category_value = category[item];

  PAGE_URL = `http://alittle-b.com/category/${item}/${category_value}/?`;

  return axios.get(PAGE_URL).then((res) => {
    let last_page;

    const $ = cheerio.load(res.data);
    const $page = $(
      "div.xans-element-.xans-product.xans-product-normalpaging.ec-base-paginate a.last"
    );
    $page.each((i, element) => {
      //console.log($(element).attr("href").slice(6));
      last_page = $(element).attr("href").slice(6);
    });

    return last_page;
  });
}

const detailData = async (last_page) => {
  let page_num = 1;
  let total_item_list = [];

  while (page_num <= last_page) {
    await axios.get(`${PAGE_URL}page=${page_num}`).then((res) => {
      //console.log(res);
      const $ = cheerio.load(res.data);
      const $item = $(
        "div.xans-element-.xans-product.xans-product-normalpackage div ul .ovr.xans-record-"
      );

      let page_item_list = [];

      $item.each((i, element) => {
        // let price = $(element).find(".description ul li span").eq(1).text();
        let price = $(element)
          .find(".description ul")
          .children()
          .last()
          .find("span")
          .eq(1)
          .text();

        const element_data = {
          shoppingmall_name: "always 어리틀빗!",
          image: $(element).find(".thumbnail a img").attr("src"),
          title: $(element).find(".description .name a span").text(),
          price: price == "bye" ? "Sold Out" : price,
          sold_out: price == "bye" ? true : false,
        };
        page_item_list.push(element_data);
      });

      total_item_list.push(...page_item_list);
      //console.log(page_num, total_item_list, total_item_list.length);
    });
    page_num++;
  }

  return total_item_list;
};

aLittleBeatPage("best-50")
  .then((last_page) => detailData(last_page))
  .then((list) => console.log(list, list.length));
