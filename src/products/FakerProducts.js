const {faker} = require('@faker-js/faker')


 function generateRandomProduct(num) {
   const listProd = []; 
    for (let i = 0; i < num; i++) {
        
        const prod = {
            id : i + 1 ,
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            thumbnail: faker.image.imageUrl()
        }
       
        listProd.push(prod)
        // console.log(listProd)
    }
    return listProd
}


module.exports = generateRandomProduct