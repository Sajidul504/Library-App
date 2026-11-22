import { readFile, writeFile } from "node:fs/promises";

const FILE = "database/seed/books.json";

// These two are written for you.
/*export async function loadBooks() {
  try {
    const text = await readFile(FILE, "utf8");
    return JSON.parse(text);
  } catch (err) {
    console.log("Could not load:", err.message);
    return [];
  }
}

export async function saveBooks(books) {
  await writeFile(FILE, JSON.stringify(books, null, 2));
}*/

// TODO: write the four functions below.
export function validateBook(data) {
  if (typeof data?.title !== "string" || !data.title.trim()) {
    return "Whats the name of the book?";
  }
  if (!Array.isArray(data.authors) || data.authors.length === 0) {
    return "I dont see an author buddy";
  }
  if (data.year !== undefined && data.year !== null && typeof data.year !== "number") {
    return "Year must be a number";
  }
  return null;
}
/*export function addBook(books, data) {
  const ids = books.map((Book) => Book.id);
  const Book = {
    id: Math.max(0, ...ids) + 1,
    title: data.title.trim(),
    authors: data.authors,
    year: data.year ?? null,
    checked_out: false,
  };
  books.push(Book);
  return Book;
}*/

/*export function setCheckedOut(books, id, checkedOut) {
  const Book = books.find((item) => item.id === id);
  if (!Book) return null;
  Book.checked_out = checkedOut;
  return Book;
}*/

/*export function deleteBook(books, id) {
  const index = books.findIndex((Book) => Book.id === id);
  if (index === -1) return null;
  const [Book] = books.splice(index, 1);
  return Book;
}*/