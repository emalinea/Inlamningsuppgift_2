const mysql = require("mysql2/promise");

async function connectDB() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Productsdb"
  });
  console.log("Ansluten till databasen (via database.js)");
  return connection;
}

async function getAllProducts() {
  const connection = await connectDB();
  const [rows] = await connection.query("SELECT * FROM products");
  await connection.end();
  return rows;
}

async function getproductsById(id) {
  const connection = await connectDB();
  const [rows] = await connection.query("SELECT * FROM products WHERE id = ?", [id]);
  await connection.end();
  return rows[0];  
}

async function addproducts({ name, description, price, quantity,category }) {
  const connection = await connectDB();
  const sql = "INSERT INTO products (Name, description, price, quantity, category) VALUES (?, ?, ?, ?, ?)";
  await connection.execute(sql, [name, description, price, quantity, category]);
  await connection.end();
}

async function deleteProducts(id) {
  const connection = await connectDB();
  await connection.execute("DELETE FROM Products WHERE id = ?", [id]);
  await connection.end();
}

async function updateProducts(id, { name, description, price, quantity, category }) {
  const connection = await connectDB();
  const sql = `
    UPDATE products
    SET Name = ?, Description = ?, price = ?, quality = ? , Ctegory = ?,
    WHERE id = ?
  `;
  await connection.execute(sql, [name, description, price, quantity, category, id]);
  await connection.end();
}


module.exports = {
  getAllProducts,
  getproductsById,
  addproducts,
  deleteProducts,
  updateProducts,
};