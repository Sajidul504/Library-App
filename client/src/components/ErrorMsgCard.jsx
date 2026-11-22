import './ErrorMsgCard.css'

function ErrorMsgCard({ message }) {
    return (
        <div className="error-card" role="alert">
            <h2>Error</h2>
            <p>{message}</p>
        </div>
    )
}

export default ErrorMsgCard