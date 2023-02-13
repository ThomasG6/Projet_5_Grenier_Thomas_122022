//verification si l'url contient un paramètre orderID
const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);
let submitId;

if (searchParams.has('orderId')){
    //récuperation de l'ID de la commande
    submitId = url.searchParams.get("orderId");
    //affichage du numero de commande
    const orderItems = document.querySelector("#orderId");
    orderItems.textContent = submitId;
} else {
    alert ("Erreur de commande");
    window.location.href = "index.html";
};