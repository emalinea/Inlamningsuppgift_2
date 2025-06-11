const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();



app.use(express.urlencoded({ extended: true }));



app.get("/", async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.render("index", { users });
  } catch (err) {
    console.error("Fel vid hämtning av användare:", err.message);
    res.status(500).send("Fel vid hämtning av användare.");
  }
});


app.get("/create", (req, res) => {
  res.render("create");
});


app.post("/create", async (req, res) => {
  const { name, nickname, age, bio } = req.body;
  console.log("Skapar användare med:", req.body);
  if (!name || !nickname || !age || !bio) {
    return res.status(400).send("Alla fält måste fyllas i.");
  }

  try {
    await db.addUser({ name, nickname, age: parseInt(age), bio });
    res.redirect("/");
  } catch (err) {
    console.error("Fel vid skapande:", err.message);
    res.status(500).send("Något gick fel vid skapande av användare.");
  }
});



app.get("/user", async (req, res) => {
  try {
    const user = await db.getUserById(req.query.id);
    if (!user) {
      return res.status(404).send("Användare hittades inte.");
    }
    res.render("profile", { user });
  } catch (err) {
    console.error("Fel vid hämtning av användare:", err.message);
    res.status(500).send("Kunde inte hämta användare.");
  }
});


app.get("/edit", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).send("ID saknas");

  try {
    const user = await db.getUserById(id);
    if (!user) return res.status(404).send("Användare hittades inte");
    res.render("edit", { user });
  } catch (err) {
    console.error("Fel vid hämtning för redigering:", err.message);
    res.status(500).send("Fel vid hämtning av användare.");
  }
});


app.post("/edit", async (req, res) => {
  const { id, name, nickname, age, bio } = req.body;

  if (!id || !name || !nickname || !age || !bio) {
    return res.status(400).send("Alla fält måste fyllas i.");
  }

  try {
    await db.updateUser(id, { name, nickname, age: parseInt(age), bio });
    res.redirect("/");
  } catch (err) {
    console.error("Fel vid uppdatering:", err.message);
    res.status(500).send("Något gick fel vid uppdatering.");
  }
});


app.post("/users/:id/delete", async (req, res) => {
  try {
    await db.deleteUser(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error("Fel vid borttagning:", err.message);
    res.status(500).send("Kunde inte ta bort användare.");
  }
});

if (require.main === module) {
  app.listen(5500, () => {
    console.log("Servern körs på http://localhost:5500");
  });
}

const server = app.listen();
module.exports = { app };