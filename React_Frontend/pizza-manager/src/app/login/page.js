'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const devMode = false; //SET TO TRUE TO USE LOCALHOST, FALSE TO USE SERVER (THESE WOULD NORMALLY BE IN A .ENV FILE)
    const base_url = devMode ? 'http://localhost:5000' : 'http://3.149.249.254:5000'; //BASE URL FOR API (THESE WOULD NORMALLY BE IN A .ENV FILE)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${base_url}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ username: username, password: password }),
            });
            
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('userType', data.userType);
                router.push('./');
            } 
            else {
                setError(data.message || 'Login failed');
            }
        } 
        catch (err) {
            setError('An error occurred during login.');
        }
    };

    return (
        <div>
            <center>
            <div className='container' style={{ width: '50%', marginTop: '15%' }}>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button className='sml-btn' type="submit" style={{ width: '100px', cursor: 'pointer' }}>
                        Login
                    </button>
                </form>
            </div>
            </center>
        </div>
    );
};
