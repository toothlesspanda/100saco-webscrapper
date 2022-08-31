const fetch = require("node-fetch");
const fs = require("fs");
const os = require("os");
const JSDOM = require("jsdom").JSDOM;

let url = "https://www.100saco.pt/loja-todos-os-produtos?488f58cb_page=";
let content = "produto;unit;price;quantity;total" + os.EOL;
let counter = 1;
for (let i = 1; i <= 11; i++) {
  fetch(url + i)
    .then((resp) => resp.text())
    .then((text) => {
      let dom = new JSDOM(text);
      let { document } = dom.window;
      console.log(url + i);
      let productsNames = [...document.querySelectorAll(".text-produtos")].map(
        (a) => a.textContent
      );
      let productsPrices = [
        ...document.querySelectorAll(".preco-producto"),
      ].map((a) => a.textContent);
      let productsFormatPrices = [
        ...document.querySelectorAll(".formato-price"),
      ].map((a) => a.textContent);
      console.log(productsNames.length);
      for (
        let prod_index = 0;
        prod_index < productsPrices.length;
        prod_index++
      ) {
        let nome = productsNames[prod_index];
        let preco = productsPrices[prod_index];
        let format = productsFormatPrices[prod_index].split("/")[1];
        content += `${nome};${preco};${format};;;${os.EOL}`;
      }
      if (counter == 11) fs.writeFileSync("100saco.csv", content);
      counter++;
    });
}
