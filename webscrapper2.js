const fetch = require("node-fetch");
const fs = require("fs");
const os = require("os");
const JSDOM = require("jsdom").JSDOM;

let url = "https://www.100saco.pt";
let content = "category;produto;unit;price;quantity;total" + os.EOL;
fs.writeFileSync("100saco2.csv", content);
let counter = 1;
fetch(url + "/loja-online")
  .then((resp) => resp.text())
  .then((text1) => {
    let dom = new JSDOM(text1);
    let { document } = dom.window;
    [...document.querySelectorAll(".link-categoria")].map((category) => {
      fetch(url + category.getAttribute("href"))
        .then((resp) => resp.text())
        .then((text) => {
          let dom1 = new JSDOM(text);
          let categoryDocument = dom1.window;
          console.log(url + category.getAttribute("href"));
          let productsNames = [
            ...categoryDocument.document.querySelectorAll(".text-produtos"),
          ].map((a) => a.textContent);
          let productsPrices = [
            ...categoryDocument.document.querySelectorAll(".preco-producto"),
          ].map((a) => a.textContent);
          let productsFormatPrices = [
            ...categoryDocument.document.querySelectorAll(".formato-price"),
          ].map((a) => a.textContent);

          for (
            let prod_index = 0;
            prod_index < productsPrices.length;
            prod_index++
          ) {
            let nome = productsNames[prod_index];
            let preco = productsPrices[prod_index];
            let format = productsFormatPrices[prod_index].split("/")[1];
            content = `${category.textContent};${nome};${preco};${format};;;${os.EOL}`;
            try {
              fs.appendFileSync("100saco2.csv", content);
            } catch (error) {
              console.log(error);
            }
          }
        });
    });
  });

// for (let i = 1; i <= 11; i++) {
//   fetch(url + i)
//     .then((resp) => resp.text())
//     .then((text) => {
//       let dom = new JSDOM(text);
//       let { document } = dom.window;
//       console.log(url + i);
//       let productsNames = [...document.querySelectorAll(".text-produtos")].map(
//         (a) => a.textContent
//       );
//       let productsPrices = [
//         ...document.querySelectorAll(".preco-producto"),
//       ].map((a) => a.textContent);
//       let productsFormatPrices = [
//         ...document.querySelectorAll(".formato-price"),
//       ].map((a) => a.textContent);
//       console.log(productsNames.length);
//       for (
//         let prod_index = 0;
//         prod_index < productsPrices.length;
//         prod_index++
//       ) {
//         let nome = productsNames[prod_index];
//         let preco = productsPrices[prod_index];
//         let format = productsFormatPrices[prod_index].split("/")[1];
//         content += `${nome};${preco};${format};;;${os.EOL}`;
//       }
//       if (counter == 11) fs.writeFileSync("100saco.csv", content);
//       counter++;
//     });
// }
