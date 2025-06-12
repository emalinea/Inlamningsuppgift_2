const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/products", async (req, res) => {
  try {
    const name = req.query.name;
    let products;

    if (name) {
      products = await db.searchProductsByName(name); 
    } else {
      products = await db.getAllProducts(); 
    }

    res.status(200).json(products);
  } catch (err) {
    console.error("Fel vid hämtning av produkter:", err.message);
    res.status(500).send("Fel vid hämtning av produkter.");
  }
});

app.get("/api/create", (req, res) => {
  res.render("create");
});

app.post("/api/create", async (req, res) => {
  const { name, description, price, quantity, category } = req.body;
  console.log("Skapar produkt med:", req.body);

  if (!name || !description || !price || !quantity || !category) {
    return res.status(400).send("Alla fält måste fyllas i.");
  }

  try {
    await db.addproducts({ name, description, price: parseInt(price), quantity, category });
    res.redirect("/");
  } catch (err) {
    console.error("Fel vid skapande:", err.message);
    res.status(500).send("Något gick fel vid skapande av produkt.");
  }
});

app.get("/api/products/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send("ID saknas");

  try {
    const product = await db.getproductsById(id);
    if (!product) return res.status(404).send("Produkten hittades inte");
    res.json(product);
  } catch (err) {
    console.error("Fel vid hämtning för redigering:", err.message);
    res.status(500).send("Fel vid hämtning av produkt.");
  }
});

app.post("/api/edit", async (req, res) => {
  const { id, name, description, price, quantity, category } = req.body;

  if (!id || !name || !description || !price || !quantity || !category) {
    return res.status(400).send("Alla fält måste fyllas i.");
  }

  try {
    await db.updateProducts(id, {
      name,
      description,
      price: parseInt(price),
      quantity,
      category,
    });
    res.redirect("/");
  } catch (err) {
    console.error("Fel vid uppdatering:", err.message);
    res.status(500).send("Något gick fel vid uppdatering.");
  }
});

app.post("/api/products/:id/delete", async (req, res) => {
  try {
    await db.deleteProducts(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error("Fel vid borttagning:", err.message);
    res.status(500).send("Kunde inte ta bort produkt.");
  }
});

if (require.main === module) {
  app.listen(5500, () => {
    console.log("Servern körs på http://localhost:5500");
  });
}

module.exports = app; 
