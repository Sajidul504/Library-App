import './LoginForm.css'
import { useState } from "react";

const API = "http://localhost:3000/api";

export default function LoginForm({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registering, setRegistering] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (registering) {
            const res = await fetch(`${API}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok) {
                setError((await res.json()).error);
                return;
            }
        }
        const res = await fetch(`${API}/login` , {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password}),
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error);
            return;
        }
        onLogin(data);
    } // logging in

    return (
        <form onSubmit={handleSubmit}>
            <input value={username} placeholder="Username"
                onChange={ (e) => setUsername(e.target.value)} />
            <input type="password" value={password} placeholder="Password"
                onChange={ (e) => setPassword(e.target.value)} />
            {error && <p className="error">{error}</p>}
            <button>{registering ? "Sign up" : "Log in"}</button>
            <button type="button" onClick={() => setRegistering(!registering)}>
            {registering ? "Have an account? Log in" : "New here? Sign up"}
            </button>   
        </form>
    ); // the form
}