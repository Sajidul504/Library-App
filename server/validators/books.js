export function validateBook(data) {
  if (typeof data?.title !== "string" || !data.title.trim()) {
    return "Title is required";
  }
  if (!Array.isArray(data.authors) || data.authors.length === 0) {
    return "At least one author is required";
  }
  if (data.year !== undefined && data.year !== null && typeof data.year !== "number") {
    return "Year must be a number";
  }
  return null;
}
