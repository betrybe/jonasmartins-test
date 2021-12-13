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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

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
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

  // listagem de produtos "computador"
  function listProducts() {
    const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    const headers = { headers: { Accept: 'application/json' } };
  
    fetch(url, headers)
      .then((response) => response.json())
      .then((json) => {
        const jsonResults = json.results;
        console.log(jsonResults);
        jsonResults.forEach(({ id, title, thumbnail, price }) => {
          createProductItemElement({ sku: id, name: title, image: thumbnail, price });
        });
    });
  }

  window.onload = () => { 
    listProducts();
  };