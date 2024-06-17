import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//change to database
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "...",
  password: "...",
  port: 4000,
});
db.connect();

var items = [];

app.get("/", async (req, res) => {
  const data = await db.query("SELECT * FROM items");
  items = [];
  data.rows.forEach((item) => items.push(item));
  res.render("index.ejs", {
    listTitle: "To-Do",
    listItems: items,
  })
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items(title) VALUES($1);", [item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const newTitle = req.body["updatedItemTitle"],
  itemID = req.body["updatedItemId"];
  await db.query("UPDATE items SET title = $1 WHERE id = $2", [newTitle, itemID]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const itemID = req.body["deleteItemId"];
  await db.query("DELETE FROM items WHERE id = $1", [itemID]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
