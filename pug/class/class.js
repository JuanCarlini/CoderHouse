class ProductContainer {
    constructor() {
      this.product = [];
      this.productId = 0;
    }
    get productsAll(){
      try {
          return this.product
      } catch(error){
          throw new Error("Se produjo un error: " +  error.message)
      }
    }

  getById(idProduct){
    try {
        return this.product.find(product => product.id == parseInt(idProduct))
    } catch(error){
        throw new Error("Hubo un error al buscar " +  error.message)
    }
  }

  saveProduct(product){
    try{
        this.productId++
        const addNewProduct = {
            title: product.title,
            price: product.price,
            thumbnail: product.url,
            id: this.productId
        }
        this.product.push(addNewProduct)
        return addNewProduct

    } catch(error){
        throw new Error("Se produjo un error al guardar el producto : " +  error.message)
    }
  }

  updateProduct(idProduct, body){
    try{
    const updProduct = {
        title: body.title,
        price: body.price,
        thumbnail: 'https://aqui.direccion.imagen',
        id: idProduct
    }
      const findIndex = this.product.findIndex((prod) => prod.id === idProduct)
      this.product[findIndex] = updProduct
      return updProduct
    } catch(error){
         throw new Error("Se produjo un error al actualizar el producto : " +  error.message)
    }
  }

  deleteProduct(idProduct){
    try {
        this.product = this.product.filter(prod => prod.id != idProduct)
    } catch(error){
      throw new Error("Hubo un error al eliminar " +  error.message)
    }
  }
}
module.exports = ProductContainer 



