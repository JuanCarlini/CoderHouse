const express = require("express");
const myRoutes = express.Router();

myRoutes.get("/", (req, res) => {
    res.render("index");
});

module.exports = myRoutes;