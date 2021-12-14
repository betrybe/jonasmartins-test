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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getCartItens() {
  return document.querySelector('.cart__items');
}

function setSumPrice(price) {
  const sumPrice = Number(localStorage.getItem('sumPrice')) + Number(price);
  localStorage.setItem('sumPrice', sumPrice);
}

function getSumPrice() {
  const totalPrice = document.querySelector('.total-price');
  const sumPrice = localStorage.getItem('sumPrice');
  if (sumPrice == null) {
    totalPrice.innerHTML = '0';
  } else {
    totalPrice.innerHTML = `${sumPrice}`;
  }
}

function cartItemClickListener(event, price) {
  const totalPrice = Number(localStorage.getItem('sumPrice'));
  event.target.remove();
  localStorage.clear();
  localStorage.setItem('itemsCart', getCartItens().innerHTML);
  localStorage.setItem('sumPrice', totalPrice - price);
  getSumPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, salePrice));
  getCartItens().appendChild(li);
  localStorage.setItem('itemsCart', getCartItens().innerHTML);
  return li;
}

function addCartItem(event) {
  const itemID = getSkuFromProductItem(event.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then((response) => response.json())
  .then((json) => {
    const item = {
      sku: json.id,
      name: json.title,
      salePrice: json.price,
    };
    createCartItemElement(item);
    setSumPrice(item.salePrice);
    getSumPrice();
  });  
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  const items = document.querySelector('.items');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addCartItem);
  items.appendChild(section);
  return section;
}

function getItemsAPI() {
  const items = document.querySelector('.items');
  items.appendChild(createCustomElement('span', 'loading', 'loading...'));
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => {
      document.querySelector('.loading').remove();
      json.results.forEach(({ id, title, thumbnail, price }) => {
        createProductItemElement({ sku: id, name: title, image: thumbnail, price });
      });
    });  
}

function getItemsStoreLocal() {
  const store = localStorage.getItem('itemsCart');
  getCartItens().innerHTML = store;
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((elements) => elements.addEventListener('click', cartItemClickListener));
}

function initSumPrice() {
  const cart = document.querySelector('.cart');
  cart.appendChild(createCustomElement('span', 'price', 'Preco Total: $'));
  const sumPrice = localStorage.getItem('sumPrice');
  if (sumPrice == null) {
    cart.appendChild(createCustomElement('span', 'total-price', '0'));
  } else {
    cart.appendChild(createCustomElement('span', 'total-price', `${sumPrice}`));
  } 
}

function emptyCart() {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', () => {
    getCartItens().innerHTML = '';
    localStorage.clear();
    getSumPrice();
  });
}

window.onload = () => { 
  getItemsAPI();
  getItemsStoreLocal();
  emptyCart();
  initSumPrice();
};