import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../contexts/AuthContext'; // import context

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext); // get the setter

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/api/auth/login', { email, password });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                setIsAuthenticated(true); // ✅ update global auth state
                navigate('/dashboard');
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error('Login failed', err);
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-input"
                />
                <button type="submit" disabled={loading} className='signup-button'>Login</button>
            </form>

            <p className="signup-redirect">
                Not registered? <Link to="/signup">Create an account</Link>
            </p>
        </div>
    );
};

export default Login;
