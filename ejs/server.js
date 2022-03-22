const express = require("express")

const routerProd = express.Router()
const PORT = 8080

const Products = require('./class/contenedor')
const storProd = new Products() 

let vista = Boolean(true)

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/productos', routerProd)

app.set('views', './views');
app.set('view engine', 'ejs');



app.get('/', (req, res) => {
    vista = true
    res.render('index', {vista});
})

routerProd
    .get('/', (req, res) => {
        const listProd = storProd.productsAll      
        vista = false
        res.render('index', {listProd, vista});
    }) 
 
    .post('/', (req, res) => {

        const newProd = storProd.saveProduct(req.body)
        vista = true
        res.redirect('/');
    })  

const server = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))
server.on('error', (err) => {throw new Error(err.message)})