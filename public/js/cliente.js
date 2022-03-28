window.onload = () => {
    const socket = io();

    socket.on("messages", data => {
        loadMessages(data)
    });

    socket.on("products", listProducts => {
        loadProducts(listProducts);
    });

    async function loadProducts(listProducts){
        let htmlProducts = "";
        const tableList = await fetch("views/partials/table.ejs").then(res => res.text());

        if (listProducts.length === 0){
            htmlProducts = "No se encontraron productos";
        }else{
            htmlProducts = ejs.render(tableList, {listProducts});
        };
        document.getElementById("NuevaTabla").innerHTML = htmlProducts;
    };

    function loadMessages(data){
        const html = data.map((element) => (`<div class="direct-chat-info clearfix">
                        <span id="chatName" class="direct-chat-name pull-right">${element.email}</span> 
                        <span id= "chatDate" class="direct-chat-timestamp pull-left">${element.date}</span> 
                    </div>
                    <div id="chatText" class="direct-chat-text">${element.text}</div>`)).join(" ");
        document.getElementById("messages").innerHTML = html;
    };

    function addMessage(){
        const newMessage = {
            email: document.getElementById("email").value,
            text: document.getElementById("text").value
        };
        socket.emit("new-message", newMessage);
    };

    document.getElementById("frmPasion").addEventListener("submit", (e) => {
        e.preventDefault();
        addMessage();
    });
    
    document.getElementById("btn").addEventListener("click", () => {
        const newProduct = {
            title: document.getElementById("title").value,
            price: document.getElementById("price").value,
            url: document.getElementById("url").value
        };
        socket.emit("newProduct", newProduct);
    });
};