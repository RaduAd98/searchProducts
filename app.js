const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const checkForProduct = () => {
    rl.question(`Care este numele produsului?\n`, (name) => {
        fs.readFile('products.json', (error, data) => {
            const { products } = JSON.parse(data);
            const askedProduct = products.filter(product => name.toLowerCase() === product.name.toLowerCase());
            if (askedProduct[0]) {
                console.log(`\nNume: ${askedProduct[0].name}\n`);
                console.log(`Preţ: ${askedProduct[0].price}\n`);
                console.log(`Cantitate disponibila: ${askedProduct[0].quantity}\n`);
                checkForProduct();
            } else {
                askForAdd(name, products);
                checkForProduct();
            }
        })
    });
}

const askForAdd = (name, products) => {
    rl.question('\nNe pare rau, nu am gasit acest produs in magazin.\nDoriti sa il adaugam pe acesta?\n', (value) => {
        if (value.toLowerCase() === 'da') {
            getProductPrice(name, products);
        } else if (value.toLowerCase() === 'nu') {
            console.log('\nAcest produs nu va fi adaugat.\n');
            checkForProduct();
        } else {
            console.log('Raspuns invalid.\n');
            askForAdd();
        }
    });
}

const getProductPrice = (name, products) => {
    try {
        let price;
        rl.question(`\nIntrodu pretul produsului ${name}\n`, (value) => {
            price = parseFloat(value);
            if (isNaN(price)) {
                console.log('\nIntroduceti doar numere.\n');
                getProductPrice(name);
            }
            getProductQuantity(name, price, products);
        })
    } catch (err) { console.log('A intervenit o problema.'); }
}

const getProductQuantity = (name, price, products) => {
    try {
        let quantity;
        rl.question(`\nIntrodu cantitatea de produs ${name}\n`, (value) => {
            quantity = parseFloat(value);
            if (isNaN(quantity)) {
                console.log('\nIntroduceti doar numere.\n');
                getProductQuantity(name, price, products);
            } else {
                const newProduct = {
                    name,
                    price,
                    quantity
                }
                addProductToJson(newProduct, products);
            }
        })
    } catch (err) { console.log('A intervenit o problema.'); }
}

const addProductToJson = (product, allProducts) => {
    const products = [...allProducts];
    products.push(product);
    fs.writeFile('products.json', `{"products":${JSON.stringify(products)}}`, () => {
        console.log('Produs adaugat cu succes.\n');
        checkForProduct();
    });
}

const app = () => {
    checkForProduct();
};

app();