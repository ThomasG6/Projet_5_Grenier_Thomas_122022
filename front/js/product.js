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

    //Sinon en déclanche une erreur
    throw new Error('Serveur injoignable, veuillez réessayez ultérieurement');
})