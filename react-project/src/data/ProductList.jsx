import { Product } from "./Classes";

// Hardcoded list of products
const ProductList = [
    new Product("0", "Hefty Book", "/assets/book.jpg", "A book to decorate your shelf. Might contain text.", 19.95),
    new Product("1", "LED Candle", "/assets/candle.jpg", "In darkness see, combustion-free. Batteries not included.", 5.50),
    new Product("2", "Coin Jar", "/assets/coins.jpg", "A solid jar for storing loose change. Coins not included.", 3.30),
    new Product("3", "Rock Jar", "/assets/rocks.jpg", "A festive jar for displaying colourful rocks. Rocks not included.", 2.75),
    new Product("4", "Glasses case", "/assets/glasses.jpg", "Ensconce your glasses in a beautifully-patterned case. Glasses not included.", 12.99),
    new Product("5", "Music Box", "/assets/music-box.jpg", "Plays music, despite its unboxlike shape.", 18.50),
    new Product("6", "Cat Figurine", "/assets/cats.jpg", "Just a lovely trinket.", 5.00),
    new Product("7", "Paperclip (Used)", "/assets/paperclip.jpg", "Discovered unexpectedly in our product showcase area. A timeless memento of paperwork past.", 0.15)
];

export default ProductList;