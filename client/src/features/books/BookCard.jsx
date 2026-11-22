import './BookCard.css'

function BookCard({ books, user, onDelete, onToggle }) {
    return (
        <div>
            {books.map((book) => (
                <BookItem key={book.id} book={book} user={user} onDelete={onDelete} onToggle={onToggle} />
            ))}
        </div>
    )
}

function BookItem({ book, user, onDelete, onToggle }) {
    const isCheckedOut = book.checked_out ?? false

    return (
        <div className="book-card">
            <div className="book-card-details">
                <h3>{book.title}</h3>
                <div className="book-card-meta">
                    <p>{book.authors.map((author) => (
                        <span key={author}>{author}, </span>
                    ))}</p>
                    <p>{book.year}</p>
                </div>
            </div>
            <div className="Status">
                <h4>{isCheckedOut ? 'Checked Out' : 'Available'}</h4>
            </div>
            <div className="book-card-actions">
                {user && (
                    <button onClick={() => onToggle(book.id, !isCheckedOut)}>
                        {isCheckedOut ? 'Return' : 'Check Out'}
                    </button>
                )}
                {user && book.userId === user.id && (
                    <button onClick={() => onDelete(book.id)}>Delete</button>
                )}
            </div>
        </div>
    )
}

export default BookCard