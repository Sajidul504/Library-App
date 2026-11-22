import "dotenv/config";
import express from "express";
import cors from "cors";
import { validateBook } from "./validators/books.js";
import { sequelize, User } from "./database/db.js";
import { Book } from "./database/db.js";
import { readFile } from "node:fs/promises";
import cookieParser from "cookie-parser";
import { requireAuth } from "./middleware/auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cookieParser()); 
await sequelize.sync();
if (await Book.count() === 0) {
  const text = await readFile("database/seed/books.json", "utf8");
  await Book.bulkCreate(JSON.parse(text));
}

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username });
});


app.get("/api/books", async (req, res) => {
  if (req.query.checked_out === "true") {
    return res.json(await Book.findAll({ where: { checked_out: true}}));
  }
  res.json(await Book.findAll());
});

app.get("/api/me", requireAuth, (req, res) => {
res.json({ id: req.user.id, username: req.user.username });
});

app.get("/api/books", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return res.status(404).json({ error : "Book not found" })
  }
  res.json(book);
});

app.post("/api/books", requireAuth, async (req, res) => {
  const error = validateBook(req.body);
  if (error) {
    return res.status(400).json({ error });
  }
  const book = await Book.create({
    title: req.body.title.trim(),
    authors: req.body.authors,
    year: req.body.year ?? null,
    checked_out: false,
    userId : req.user.id,
  });
  res.status(201).json(book);
});

app.put("/api/books/:id", requireAuth, async (req, res) => {
  if (typeof req.body.checked_out !== "boolean") {
    return res.status(400).json({ error: "checked_out must be true or false" });
  }
  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found "})
  }
  book.checked_out = req.body.checked_out;
  await book.save();
  res.json(book)
}); 

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body ?? {};
  if (typeof username !== "string" || username.trim() == "" ||
      typeof password !== "string" || password.length <8) {
    return res.status(400).json({ error: "Username and 8 + character password required" });
  }
  if (await User.findOne({ where: { username } })) {
    return res.status(409).json({ error: "That username is taken" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, passwordHash });
  res.status(201).json({ id: user.id, username: user.username });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body ?? {};
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Username and password required" });
  }
  const user = await User.findOne({ where: {username } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Wrong username or password" });
  }
  const token = jwt.sign({ id: user.id, username: user.username },
                          process.env.JWT_SECRET, {expiresIn: "1h"});
  res.cookie("token", token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 1000 });
  res.json({ id: user.id, username: user.username });
});

app.delete("/api/books/:id", requireAuth, async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return res.status(404).json({error: "Book not found" });
  }
  if (book.userId !== req.user.id) {
    return res.status(403).json({error: "You can only delete your own books" });
  }
  await book.destroy();
  res.json(book);
})

app.post("/api/logout", (req,res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

app.listen(3000, (err) => {
  if (err) {
    console.log("Could not start:", err.message);
    return;
  }
  console.log("Library API running at http://localhost:3000/api/books");
});