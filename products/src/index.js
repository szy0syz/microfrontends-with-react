import faker from 'faker';

let products = '';

for (let index = 0; index < array.length; index++) {
  const name = faker.commerce.productName();
  products += `<div>${name}</div>`;
}

console.log(products);
