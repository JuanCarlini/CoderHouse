const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer} = require("socket.io");
const Productos = require("./api/producto");
const Historial = require("./api/historial");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const storeProd = new Productos();
const historial = new Historial();

const myRoutes = require("./api/routes");

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(myRoutes);

app.set("view engine", "ejs");
app.set("views", "./public/views");

io.on("connection", async(socket) => {
    const message = await historial.loadMessage();
    socket.emit("messages", message);

    socket.on("new-message", async data => {
        await historial.saveMessage(data);
        const msg2 = await historial.loadMessage();
        io.sockets.emit("messages", msg2);
    });

    socket.emit("products", storeProd.productsAll);
    
    socket.on("newProduct", dataProduct => {
        storeProd.saveProduct(dataProduct);
        io.sockets.emit("productos", storeProd.productsAll);
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))