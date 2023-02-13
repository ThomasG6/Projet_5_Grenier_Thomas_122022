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

        //Gestion du formulaire //

        // Sélection du bouton de commande
        const submitButton = document.querySelector(".cart__order__form__submit");

        // On écoute les clicks du bouton de commande
        submitButton.addEventListener("click", (event) => {
            event.preventDefault();

            // Récupération des valeures du formulaire
            const contact = {
                firstName: document.querySelector("#firstName").value,
                lastName: document.querySelector("#lastName").value,
                address: document.querySelector("#address").value,
                city: document.querySelector("#city").value,
                email: document.querySelector("#email").value
            }

            //on vérifier si le panier et vide
            if (totalPrice <= 0) {
                window.alert("Votre panier est vide");
                return;
            }
        
            //On besoin d'une fonction qui va valider un input, renvoyer le boolean qui va bien mais en bonus afficher le message d'erreur si nécessaire

            const isInputValid = (inputElementID, regex, errorMessage) => {
                //Il est aussi de bon ton de tester si l'input est vide 
                const inputElement = document.querySelector(inputElementID);
                const msgError = document.querySelector(inputElementID + "ErrorMsg");

                //Si inputElement.value est vide
                if (!inputElement.value) {
                msgError.textContent = "Veuillez entrer " + errorMessage.toLowerCase();
                return false;
                }

                //Si inputElement.value ne match pas la regex
                if (!regex.test(inputElement.value)){
                msgError.textContent = errorMessage + " est invalide";
                return false;
                }

                //Tout va bien, on efface le message d'erreur
                msgError.textContent = "";
                return true;
            }
            
            const nameRegex = /^([a-zA-Zàâäéèêëïîôöùûüç']{3,20})?([-]{0,1})?([a-zA-Zàâäéèêëïîôöùûüç']{3,20})$/;
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w]{2,}$/;
            const addressRegex = /^([0-9]{0,3}(([,. ]?){0,1}[a-zA-Zàâäéèêëïîôöùûüç' ]+))$/;
            let isFormValid = true;

            //on vérifier que tout les champs du formulaire est bien remplit
            isFormValid = isInputValid('#firstName', nameRegex, 'Votre prénom') && isFormValid;
            isFormValid = isInputValid('#lastName', nameRegex, 'Votre nom') && isFormValid;
            isFormValid = isInputValid('#address', addressRegex, 'Votre adresse') && isFormValid;
            isFormValid = isInputValid('#city', nameRegex, 'Votre ville') && isFormValid;
            isFormValid = isInputValid('#email', emailRegex, 'Votre email') && isFormValid;
        
            if (!isFormValid) {
                return;
            }

            const cart = getCart();

            const order = {
                contact,
                products: Object.values(cart).map((item) => item.id),
            };
        });
    })

    .catch(error => {
        alert(error.message);
    });
  
}
