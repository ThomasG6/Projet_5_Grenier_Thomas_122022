// Données du panier
const getCart = () => {
    let storedCart = localStorage.getItem('cart');
    
    if (storedCart === null) {
        return {};
    }
    
    return JSON.parse(storedCart);
};