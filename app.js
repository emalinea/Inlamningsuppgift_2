const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();



app.use(express.urlencoded({ extended: true }));



app.get("api/Products", async (req, res) => {
  try {
    const users = await db.getAllProducts();
    response.status(200).json(data);
  } catch (err) {
    console.error("Fel vid hämtning av användare:", err.message);
    res.status(500).send("Fel vid hämtning av användare.");
  }
});


app.get("api/create", (req, res) => {
  res.render("create");
});


app.post("api/create", async (req, res) => {
  const {  name, descriptions, price, quantity , category } = req.body;
  console.log("Skapar product med:", req.body);
  if (!name || !description || !price || !quantity || !category) {
    return res.status(400).send("Alla fält måste fyllas i.");
  }

  try {
    await db.addproducts({ name, descriptions, price: parseInt(price), quantity , category });
    res.redirect("/");
  } catch (err) {
    console.error("Fel vid skapande:", err.message);
    res.status(500).send("Något gick fel vid skapande av användare.");
  }
});



app.get("api/products", async (req, res) => {
  try {
    const user = await db.getProductsById(req.query.id);
    if (!user) {
      return res.status(404).send("Produkten hittades inte.");
    }
    response.json(data);
  } catch (err) {
    console.error("Fel vid hämtning av användare:", err.message);
    res.status(500).send("Kunde inte hämta användare.");
  }
});


app.get("api/edit", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).send("ID saknas");

  try {
    const product = await db.getProductById(id);
    if (!product) return res.status(404).send("Produkten hittades inte");
    response.json(data);
  } catch (err) {
    console.error("Fel vid hämtning för redigering:", err.message);
    res.status(500).send("Fel vid hämtning av användare.");
  }
});


app.post("api/edit", async (req, res) => {
  const { id, name, description, price, quantity, category } = req.body;

  if (!id || !name || !description || !price || !quantity || !category) {
    return res.status(400).send("Alla fält måste fyllas i.");
  }

  try {
    await db.updateProducts(id, { name, description, price: parseInt(price), quantity, category });
    res.redirect("/");
  } catch (err) {
    console.error("Fel vid uppdatering:", err.message);
    res.status(500).send("Något gick fel vid uppdatering.");
  }
});


app.post("api/products/:id/delete", async (req, res) => {
  try {
    await db.deleteProducts(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error("Fel vid borttagning:", err.message);
    res.status(500).send("Kunde inte ta bort produkt.");
  }
});

app.get("api/products/:id/delete", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).send("ID saknas");

  try {
    const user = await db.deleteProductsById(id);
    if (!user) return res.status(404).send("Produkten hittades inte");
    response.status(200).json(data);
  } catch (err) {
    console.error("Fel vid hämtning för redigering:", err.message);
    res.status(500).send("Fel vid hämtning av användare.");
  }
});

if (require.main === module) {
  app.listen(5500, () => {
    console.log("Servern körs på http://localhost:5500");
  });
}

const server = app.listen();
module.exports = { app };