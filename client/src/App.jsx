import './styles/App.css'
import { useState, useEffect } from 'react'
import BookCard from './features/books/BookCard'
import BookInfoCard from './features/books/BookInfoCard'
import ErrorMsgCard from './components/ErrorMsgCard'
import LoginForm from './features/auth/LoginForm'

const API_BASE = 'http://localhost:3000/api'

function App() {
  const [books, setBooks] = useState([])
  const [error, setError] = useState('')
  const [user, setUser] = useState(null);

  async function loadBooks() {
    try {
      const response = await fetch(`${API_BASE}/books`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not load books')
      setBooks(data)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    async function loadUser() {
      const me = await fetch(`${API_BASE}/me`, { credentials: "include" });
      if (me.ok) {
        setUser(await me.json());
      }
    }
    loadBooks()
    loadUser()
  }, []);

  async function handleLogout() {
    await fetch (`${API_BASE}/logout`, {method: "POST", credentials: "include"});
    setUser(null);
  }
  async function handleDelete(id) {
    const res = await fetch (`${API_BASE}/books/${id}`, {method: "DELETE", credentials: "include"});
    if ( res.status === 401 ) {
      setUser(null);
      setError("Please log in again");
    } else if (res.ok) {
      setBooks(books.filter((book) => book.id !== id))
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not delete book");
    }
  }
  async function handleToggle(id, checkedOut) {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checked_out: checkedOut }),
    });
    if (res.status === 401) {
      setUser(null);
      setError("Please log in again");
    } else if (res.ok) {
      const updated = await res.json();
      setBooks((currentBooks) =>
        currentBooks.map((book) => (book.id === id ? updated : book))
      );
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not update book");
    }
  }

  async function submit(payload) {
    setError('')
    try {
      const response = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.status === 401) {
        setUser(null)
        setError('Please log in again')
        return
      }

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not add book')

      await loadBooks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add book')
    }
  }

  return (
    <>
      <h1>Library</h1>
      {user ? (
        <p>Hello, {user.username}! <button onClick={handleLogout}>Logout</button></p>
      ) : (
        <LoginForm onLogin={setUser} />
      )}
      {error && <ErrorMsgCard message={error} />}
      {user && <BookInfoCard onSubmit={submit} />}
      <BookCard books={books} user={user} onDelete={handleDelete} onToggle={handleToggle} />
    </>
  )
}

export default App
