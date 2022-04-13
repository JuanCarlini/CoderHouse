const express = require('express');
const { get } = require('express/lib/response');
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const Products = require("./src/products/Products");
const { optionsMySQL } = require("./src/utils/optionsMySQL");
const { optionsSQLite } = require("./src/utils/optionsSQLite");

const tablaProductos = "products";
const tablaMensajes = "messages";

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const apiProductos = new Products(optionsMySQL, tablaProductos);
const apiMensajes = new Products(optionsSQLite, tablaMensajes);

app.get('/', (req, res) => {res.render('index');})

io.on("connection", async (socket) => {
    console.log(`Nuevo cliente conectado ${socket.id}`);
    socket.emit("products", await apiProductos.listAll());

    socket.on("newProduct", async (product) => {
      await apiProductos.save(product);

      io.sockets.emit("products", await apiProductos.listAll());
    });

    socket.emit("messages", await apiMensajes.listAll());

    socket.on("newMessage", async (msg) => {
      msg.date = new Date().toLocaleString();
      await apiMensajes.save(msg);

      io.sockets.emit("messages", await apiMensajes.listAll());
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./public/views");

const PORT = 8080;

const server = httpServer.listen(PORT, () => {
  console.log(`Servidor http escuchado en puerto ${server.address().port}`);
});

server.on("error", (error) => console.error(`Error en servidor ${error}`));