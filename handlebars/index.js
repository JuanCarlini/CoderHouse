const express = require("express");
const handlebars = require("express-handlebars");
const router = express.Router()
const Productos = require("./class/contenedor")
const productos = new Productos()

const app = express()

app.engine("hbs", handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: "./views/layouts",
    // partialsDir: __dirname + "/views/partials"
}))

app.set("view engine", "hbs")
app.set("views", "./views")

app.use(express.urlencoded({extended: true}))
app.use("/productos", router)
// app.use(express.static("public"))

app.get("/", (req, res) =>{
    res.render("form")
})

router.get("/", (req, res) => {
    const prod = productos.productsAll
    res.render("table", { prod })
})

router.post("/", (req, res) => {
    productos.saveProduct(req.body)
    res.redirect("/")
})

const PORT = 8080
const server = app.listen(PORT, () => console.log(`hhtp://localhost:${PORT}/productos`))
server.on("error", (err) => {throw new Error(err.message)})