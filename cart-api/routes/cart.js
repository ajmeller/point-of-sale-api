const express = require("express");
const cart = express.Router();
const pool = require("../pg-connection-pool.js");

function getTable(req, res) {
  pool.query("select * from shopping_cart").then((result) => {
    return result.rows;
  });
}
function getMaxPriceCart(cart, param) {
  return cart.filter((o) => {
    return o.price <= parseFloat(param);
  });
}

function getPrefixCart(cart, param) {
  return cart.filter((o) => {
    return o.product.toUpperCase().startsWith(param.toUpperCase());
  });
}

function getPageSizeCart(cart, param) {
  return cart.slice(0, parseInt(param));
}

cart.get("/", (req, res) => {
  const maxPrice = req.query.maxPrice;
  const prefix = req.query.prefix;
  const pageSize = req.query.pageSize;

  if (maxPrice) {
    pool
      .query(
        `select * from shopping_cart where price <= ${parseFloat(maxPrice)}`
      )
      .then((result) => {
        res.send(result.rows);
      })
      .catch(() => console.log("error"));
  }
  if (prefix) {
    const prefixCap = prefix.charAt(0).toUpperCase() + prefix.slice(1);

    pool
      .query(`select * from shopping_cart where product like '${prefixCap}%'`)
      .then((result) => {
        res.send(result.rows);
      })
      .catch(() => console.log("error"));
  }
  if (pageSize) {
    pool
      .query(`select * from shopping_cart limit ${pageSize}`)
      .then((result) => {
        res.send(result.rows);
      })
      .catch(() => console.log("error"));
  } else {
    pool
      .query("select * from shopping_cart")
      .then((result) => {
        res.send(result.rows);
      })
      .catch(() => console.log("error"));
  }
});

cart.get("/:id", (req, res) => {
  const paramId = parseInt(req.params.id);

  pool
    .query(`select * from shopping_cart where id=${paramId}`)
    .then((result) => {
      if (result.rows.length > 0) {
        res.send(result.rows);
      } else {
        res.status(404).send("ID Not Found");
      }
    })
    .catch(() => console.log("error"));
});

cart.post("/", (req, res) => {
  const product = req.body.product;
  const price = req.body.price;
  const quantity = req.body.quantity;
  const id = cartData.length + 1;
  const newCartItem = {
    id: id,
    product: product,
    price: price,
    quantity: quantity,
  };
  cartData.push(newCartItem);
  res.status(201).send(newCartItem);
});

cart.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const i = cartData.findIndex((o) => o.id === id);
  cartData[i].product = req.body.product;
  cartData[i].price = req.body.price;
  cartData[i].quantity = req.body.quantity;
  res.status(200).send(cartData[i]);
});

cart.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const i = cartData.findIndex((o) => o.id === id);
  cartData.splice(i, 1);
  res.sendStatus(204);
});

module.exports = cart;
