//function pour tester si la quantité choisis par l'utilisateur est valide
function testQuantity(quantityToAdd, quantityInCart, isProductAlreadyInCart = false) {
    if (isProductAlreadyInCart && quantityInCart + quantityToAdd > 100) {
        alert("Vous avez déjà ce produit dans votre panier, vous ne pouvez pas commander plus de 100");
        return false;
    } else {
        if (quantityToAdd > 0 && quantityToAdd <= 100) {
            return true;
        } else {
            alert("Veuillez rentrer une quantité comprise entre 0 et 100");
            return false;
        }
    }
}

//fonction pour tester si la couleur choisis par l'utilisateur est valide
function testColor(color, colorsList){
    if (colorsList.includes(color)){
        return true;
    } else {
     alert("Veuillez choisir une couleur");
    }
}

//verification si l'url contient un paramètre ID
const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);
let productId;

//récuperation de l'ID du produit
if (searchParams.has('id')){
    productId = searchParams.get("id");
}

//on récupère les données de l'api correspondant a l'id du produit
fetch("http://localhost:3000/api/products/" + productId)
    .then(response => {
        //traitement de la réponse
        //tester si on obtient la reponse attendu
        if (response.ok) {
            // on sait que tout va bien testant quand le code de reponse est >= 200 ou si response.ok
            return response.json();
        }

        //Sinon on vérifie que le produit existe
        if (response.status === 404) {
            throw new Error("Le produit n'existe pas");
        }

    })
    .then(kanap => {
        //traitement des données de la reponse 
        //création des balises
        const img = document.createElement("img");

        //insertion des éléments
        img.src= kanap.imageUrl;
        img.alt= kanap.altTxt;

        //affichage des éléments
        document.querySelector(".item__img").appendChild(img);
        document.querySelector("#title").textContent= kanap.name;
        document.querySelector("#price").textContent= kanap.price;
        document.querySelector("#description").textContent= kanap.description;

        //affichage des couleurs
        for (color of kanap.colors){
            let option = document.createElement("option");
            option.value= color;
            option.textContent = color;
            document.querySelector("#colors").appendChild(option);
        }

        //délaration variable
        const btnAddToCart = document.querySelector("#addToCart"); // bouton panier

        //event bouton ajout au panier
        btnAddToCart.addEventListener("click", (event) => {
            event.preventDefault();

            const cart = getCart();//Notre objet représantant le panier
            
            //récuperation des valeurs du formulaire
            const product = {
                id : kanap._id,
                quantity: Number(document.querySelector("#quantity").value),
                color : document.querySelector("#colors").value
            }

            const productKey = product.id + product.color;

            const isProductAlreadyInCart = typeof cart[productKey] !== 'undefined';
            let quantityInCart = 0;

            if (isProductAlreadyInCart) {
                quantityInCart = cart[productKey].quantity;
            }

            //Si les conditions sont remplies
            if (testQuantity(product.quantity, quantityInCart, isProductAlreadyInCart) && testColor(product.color, kanap.colors)){
                //On ajout le produit au panier en fonction de :
                // Si on a un produit identique, on modifie seulement la quantité dans le panier
                if (isProductAlreadyInCart) {
                    cart[productKey].quantity += product.quantity; //ici on modifie la quantite du produit présent dans le panier
                // Sinon on ajoute le produit au panier
                } else { 
                    cart[productKey] = product; //ici on ajout le produit au panier
                }

                localStorage.setItem('cart', JSON.stringify(cart)); // ajout du produit dans le local storage

                //message de confirmation d'ajout au panier
                alert("vous avez ajouté " + product.quantity + " " + kanap.name + " de couleur " + product.color + " à votre panier");
                window.location.href = "index.html";
            }
        });
    })
    .catch(error => {
        alert('Serveur injoignable, veuillez réessayez ultérieurement');
    });

