const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET all products or search by name
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

// POST create a new product
app.post("/api/products", async (req, res) => {
  const { name, description, price, quantity, category } = req.body;
  console.log("Skapar produkt med:", req.body);

  if (!name || !description || !price || !quantity || !category) {
    return res.status(400).json({ error: "Alla fält måste fyllas i." });
  }

  try {
    await db.addproducts({
      name,
      description,
      price: parseInt(price),
      quantity,
      category,
    });
    res.status(201).json({ message: "Produkt skapad" });
  } catch (err) {
    console.error("Fel vid skapande:", err.message);
    res.status(500).json({ error: "Något gick fel vid skapande av produkt." });
  }
});

// GET product by id
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

// PUT update product by id
app.put("/api/products/:id", async (req, res) => {
  const id = req.params.id;
  const { name, description, price, quantity, category } = req.body;

  if (!name || !description || !price || !quantity || !category) {
    return res.status(400).json({ error: "Alla fält måste fyllas i." });
  }

  try {
    await db.updateProducts(id, {
      name,
      description,
      price: parseInt(price),
      quantity,
      category,
    });

    // Hämta och returnera den uppdaterade produkten
    const updatedProduct = await db.getproductsById(id);
    if (!updatedProduct) {
      return res.status(404).json({ error: "Produkten hittades inte efter uppdatering." });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Fel vid uppdatering:", err.message);
    res.status(500).json({ error: "Något gick fel vid uppdatering." });
  }
});

// DELETE product by id
app.delete("/api/products/:id", async (req, res) => {
  try {
    await db.deleteProducts(req.params.id);
    res.status(200).json({ message: "Produkten togs bort." });
  } catch (err) {
    console.error("Fel vid borttagning:", err.message);
    res.status(500).json({ error: "Kunde inte ta bort produkt." });
  }
});

// DELETE all products
app.delete("/api/products", async (req, res) => {
  try {
    await db.deleteAllProducts();
    res.status(200).json({ message: "Alla produkter togs bort." });
  } catch (err) {
    console.error("Fel vid borttagning:", err.message);
    res.status(500).json({ error: "Kunde inte ta bort produkterna." });
  }
});

if (require.main === module) {
  app.listen(5500, () => {
    console.log("Servern körs på http://localhost:5500");
  });
}

module.exports = app;

