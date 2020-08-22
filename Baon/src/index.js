const axios = require("axios"); // 브라우저와 Node 환경에서 사용하는 Promise 기반의 HTTP Client로 사이트의 HTML을 가져올 때 사용하는 라이브러리
const cheerio = require("cheerio"); // Axios의 결과로 받은 데이터에서 필요한 데이터를 추출하는데 사용하는 라이브러리

const category = {
  best: 132,
  outer: 33,
  top: 34,
  bottom: 35,
  pants: 45,
  skirt: 46,
  dress: 36,
  acc: 37,
};

function baon(cate_name) {
  let cate_no = category[cate_name];

  return axios
    .get(`https://ba-on.com/product/list.html?cate_no=${cate_no}`)
    .then((res) => {
      let item_list = [];
      const $ = cheerio.load(res.data);
      const $item = $(
        "#contents > div.xans-element-.xans-product.xans-product-normalpackage > div > ul div"
      );

      $item.each(function (idx, element) {
        const detail = {
          site: "baon",
          img: $(element).find(".item_img a img").attr("src"),
          title: $(element).find(".item_name li a span").text(),
          price: $(element)
            .find(".item ul:nth-child(3) li:last-child > span")
            .text(),
        };

        item_list.push(detail);
      });

      console.log(item_list);
    });
}

baon("outer");
