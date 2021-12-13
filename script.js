function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// adiciona o resultado da consulta a API do mercado livre
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  const items = document.querySelector('.items');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')).addEventListener('click', addProduct);
  items.appendChild(section);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);

  return li;
}

// listagem de produtos "computador"
function listProducts() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => {
      const results = json.results;
      results.forEach(({ id, title, thumbnail, price }) => {
        createProductItemElement({ sku: id, name: title, image: thumbnail, price });
      });
    });
}

// adicionar produto 
function addProduct(event) {
  const itemID = getSkuFromProductItem(event.target.parentElement);

  fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then((response) => response.json())
  .then((json) => {
    const product = {
      sku: json.id,
      name: json.title,
      salePrice: json.price,
    };
    createCartItemElement(product);

  });  

}

// iniciar com a listagem de produtos
window.onload = () => {
  listProducts();
};