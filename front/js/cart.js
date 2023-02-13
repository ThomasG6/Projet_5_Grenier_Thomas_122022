const cart = getCart(); // conversion du local storage
const cartDom = document.querySelector('#cart__items');
const priceItems = document.querySelector("#totalPrice");
const quantityItems = document.querySelector("#totalQuantity");

//initialisation
priceItems.textContent = 0;
quantityItems.textContent = 0;

function update(id, newQuantity, price) {
  // Update item
  const newCart = getCart();
  newCart[id].quantity = newQuantity;
  localStorage.setItem('cart', JSON.stringify(newCart));

  // Update total values
  let newTotalPrice = 0;
  let newTotalQuantity = 0;

  for (const idItem in newCart) {
    newTotalQuantity += newCart[idItem].quantity;
    newTotalPrice += price * newCart[idItem].quantity;
  }

  quantityItems.textContent = newTotalQuantity;
  priceItems.textContent = newTotalPrice;
}

for (const itemId in cart) {

  const kanap = cart[itemId];

  fetch("http://localhost:3000/api/products/" + kanap.id)
    .then(response => {
        if (response.ok) {
        return response.json();
        }

        if (response.status === 404) {
        throw new Error("La page n'a pas été trouvé");
        }

        throw new Error('Serveur injoignable');
    })
    .then(responseBody => {
        // création des balises
        let article = document.createElement("article");
        let itemImg = document.createElement("div");
        let img = document.createElement("img");

        let itemContent = document.createElement("div");
        let itemContentDescription = document.createElement("div");

        let title = document.createElement("h2");
        let color = document.createElement("p");
        let price = document.createElement("p");

        let itemContentSettings = document.createElement("div");
        let itemContentSettingsQuantity = document.createElement("div");
        let quantity = document.createElement("p");
        let input = document.createElement("input");
        let itemContentSettingsDelete = document.createElement("div");
        let deleteItem = document.createElement("p");

        //insertion des éléments
        article.classList.add("cart__item");
        article.dataset.id = kanap.id;
        article.dataset.color = kanap.color;

        itemImg.classList.add("cart__item__img");
        img.src = responseBody.imageUrl;
        img.atl = responseBody.altTxt;
        
        itemContent.classList.add("cart__item__content");
        itemContentDescription.classList.add("cart__item__content__description");
        title.textContent = responseBody.name;
        color.textContent = kanap.color;
        price.textContent = responseBody.price * kanap.quantity + " €";

        itemContentSettings.classList.add("cart__item__content__settings");
        itemContentSettingsQuantity.classList.add("cart__item__content__settings__quantity");
        quantity.textContent = "Qté :";

        input.classList.add("itemQuantity");
        input.type = "number";
        input.name = "itemQuantity";
        input.min = "1";
        input.max = "100";
        input.value = kanap.quantity;
        
        itemContentSettingsDelete.classList.add("cart__item__content__settings__delete");
        deleteItem.classList.add("deleteItem");
        deleteItem.textContent = "Supprimer";

        priceItems.textContent = Number(priceItems.textContent) + responseBody.price * kanap.quantity;
        quantityItems.textContent = Number(quantityItems.textContent) + kanap.quantity;

        //affichage des élements 
        itemContentSettingsDelete.appendChild(deleteItem);
        itemContentSettingsQuantity.appendChild(quantity);
        itemContentSettingsQuantity.appendChild(input);
        itemContentSettings.appendChild(itemContentSettingsQuantity);
        itemContentSettings.appendChild(itemContentSettingsDelete);
        itemContentDescription.appendChild(title);
        itemContentDescription.appendChild(color);
        itemContentDescription.appendChild(price);
        itemContent.appendChild(itemContentDescription);
        itemContent.appendChild(itemContentSettings);
        itemImg.appendChild(img);
        article.appendChild(itemImg);
        article.appendChild(itemContent);
        cartDom.appendChild(article);

        //modification de la quantité du produit
    input.addEventListener("change", (event) => {
        const newQuantity = Number(event.target.value); // this.value
        if (newQuantity > 0 && newQuantity <= 100) {
          update(itemId, newQuantity, responseBody.price);
          price.textContent = responseBody.price * newQuantity + " €";
          return true;
        } else {
          alert("Veuillez rentrer une quantité comprise entre 0 et 100");
          return false;
        }
      });
  
      //sélection des références de tous les deleteItem
      deleteItem.addEventListener("click", () => {
        const itemToDelete = deleteItem.closest(".cart__item");
        const idToDelete = itemToDelete.dataset.id + itemToDelete.dataset.color;
        const newCart = getCart();
        delete newCart[idToDelete];
        localStorage.setItem('cart', JSON.stringify(newCart));
        itemToDelete.remove();
        alert("Cette article à bien été supprimée du panier");
      });
    })

    .catch(error => {
        alert(error.message);
    });
  
}


