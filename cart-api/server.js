const express = require("express");
const cart = require("./routes/cart");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
//app.use(express.static(__dirname + "/publicser"));
app.use("/cart-items", cart);

app.listen(3000);
