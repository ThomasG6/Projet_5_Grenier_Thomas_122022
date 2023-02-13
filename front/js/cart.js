const cart = getCart(); // conversion du local storage
const cartDom = document.querySelector('#cart__items');
const priceItems = document.querySelector("#totalPrice");
const quantityItems = document.querySelector("#totalQuantity");

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
    })

    .catch(error => {
        alert(error.message);
    });
  
}


