// Login.js
import React, { useState } from "react";
import "./Login.css";

const Login = ({ onLogin }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = () => {
		// Add your login logic here (e.g., authentication with a backend API).
		// For this example, we'll simply pass the username to the parent component.
		onLogin(username);
	};

	return (
		<div className='login-container'>
			<h2>Login to your home</h2>
			<div className='login-form'>
				<input
					type='text'
					placeholder='Username'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type='password'
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button onClick={handleLogin}>Login</button>
			</div>
		</div>
	);
};

export default Login;
