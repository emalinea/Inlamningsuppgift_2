const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/products", async (req, res) => {
  try {
    const products = await db.getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    console.error("Fel vid hämtning av produkter:", err.message);
    res.status(500).send("Fel vid hämtning av produkter.");
  }
});



if (require.main === module) {
  app.listen(5500, () => {
    console.log("Servern körs på http://localhost:5500");
  });
}


module.exports = app;

