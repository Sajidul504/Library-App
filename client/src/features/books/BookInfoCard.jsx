import './BookInfoCard.css'
import { useState } from 'react'

function BookInfoCard({ onSubmit }) {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [year, setYear] = useState('')

    function handleSubmit(e) {
        e.preventDefault()

        onSubmit({
            title,
            authors: author.split(',').map((name) => name.trim()).filter(Boolean),
            year: year.trim() ? Number(year) : null,
        })
    }

    return (
        <div className="CardBody">
            <h2>Add a book</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="book-title">Title</label>
                <input id="book-title" name="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}  />
                <label htmlFor="book-author">Author</label>
                <input id="book-author" name="author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
                <label htmlFor="book-year">Year</label>
                <input id="book-year" name="year" type="number" value={year} onChange={(e) => setYear(e.target.value)}  />
                <button type="submit">Add</button>
            </form>
        </div>
    )
}

export default BookInfoCard