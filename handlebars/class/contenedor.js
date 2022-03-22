class Products{
    constructor(){
    this.products = [];
    this.id = 0;
    }  

    get productsAll() {
        try{
            return this.products;
        }catch(e){
            throw new Error(`Se produjo un error: ${e.message}`);
        }
    }

    saveProduct(product){
        try{
            this.id ++
            const newProduct = {
                title: product.title,
                price: product.price,
                thumbnail: product.url,
                id: this.id
            };
            this.products.push(newProduct)
            return newProduct;
        }catch(e){
            throw new Error(`Se producjo un error guardando el nuevo producto: ${e.message}`)
        }
    }

    getProductById(idProduct){
        try {
            return this.products.find(product => product.id == idProduct);
        }catch(e) {
            throw new Error(`Se produjo un error al buscar el producto`);
        }
    }

    deleteById(id) {
        try {
          const deleteIndex = this.products.findIndex((product) => product.id === id);
          console.log(deleteIndex)
          if (deleteIndex === -1 ){
              console.log("Id no encontrado");
          } else{
              const deleteData = this.products.splice(deleteIndex,1);
              console.log("id eliminado");
              console.log(deleteData);
          }
          } catch (error) {
          console.log("Error " + error);
        }
    }
}

module.exports = Products;