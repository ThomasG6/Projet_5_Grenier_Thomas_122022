//récuperer des données de l'api
fetch("http://localhost:3000/api/products")
    .then(response => {
        //traitement de la réponse
        //tester si on obtient la reponse attendu
        if (response.ok) {
            // on sait que tout va bien testant quand le code de reponse est >= 200 ou si response.ok
            return response.json();
        }

        //Sinon on vérifie que la liste des produits existe
        if (response.status === 404) {
            throw new Error("La page n'a pas été trouvé");
        }
        
        //Sinon en déclanche une erreur
        throw new Error("Serveur injoignable, veuillez réessayez ultérieurement");
    })
    .then(responseBody => {
        //traitement des données de la reponse 
        for (let kanap of responseBody ){

            //creation des balises
            const item = document.createElement("a");
            const article = document.createElement("article");
            const img = document.createElement("img");
            const title = document.createElement("h3");
            const description = document.createElement("p");

            //insertion des éléments
            item.href="./product.html?id=" + kanap._id; 
            img.src= kanap.imageUrl;
            img.alt= kanap.altTxt;
            title.classList.add("productName");
            title.textContent= kanap.name;
            description.classList.add("productDescription");
            description.textContent= kanap.description;

            //affichage des élements 
            article.appendChild(img);
            article.appendChild(title);
            article.appendChild(description);
            item.appendChild(article);
            document.querySelector("#items").appendChild(item);
        }
    })
    .catch(error => {
        //traitement en cas d'erreur
        alert(error.message);
    });