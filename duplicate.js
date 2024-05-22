const products = [
  {
    title: "wet ass pussy",
    link: "abc",
  },
  {
    title: "wet ass pussy",
    link: "def",
  },
  {
    title: "wet ass pussy",
    link: "ghi",
  },
  {
    title: "wet ass pussy",
    link: "abc",
  },
];

function addNewProduct(newProduct) {
  const existingProduct = products.find(
    (product) => product.link === newProduct.link
  );
  if (!existingProduct) {
  }
}

addNewProduct({ title: "shitbag", link: "jjs" });
addNewProduct({ title: "polite", link: "def" });

console.error(products);
